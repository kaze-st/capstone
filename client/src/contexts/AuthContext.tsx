import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../types/UserContext';
import INewUser from '../types/INewUser';
import { auth } from '../firebase-config';
import axios from 'axios';
import dotenv from 'dotenv';
import firebase from 'firebase/app';

dotenv.config();

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

interface IAuthContext {
	userContext: UserContext | null | undefined;
	login:
		| ((
				email: string,
				password: string,
				persistence?: firebase.auth.Auth.Persistence
		  ) => Promise<firebase.auth.UserCredential>)
		| null;
	signUp: ((newUser: INewUser) => Promise<firebase.auth.UserCredential>) | null;
	logout: (() => Promise<void>) | null;
}

type Props = {
	children: React.ReactNode;
};

// initializing these shit as null because idk how to initialize them
const AuthContext = React.createContext<IAuthContext>({
	userContext: undefined,
	login: null,
	signUp: null,
	logout: null
});

export function useAuth(): IAuthContext {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: Props): JSX.Element {
	// not sure how to decouple firebase from this useState
	const [userContext, setUserContext] = useState<UserContext | null>(null);
	const [loading, setLoading] = useState(true);
	const [newUser, setNewUser] = useState<INewUser | null>(null);

	const signUp = (nu: INewUser): Promise<firebase.auth.UserCredential> => {
		setNewUser(nu);
		const result = auth.createUserWithEmailAndPassword(nu.email, nu.password);
		return result;
	};

	const login = async (
		email: string,
		password: string,
		persistence: firebase.auth.Auth.Persistence = firebase.auth.Auth.Persistence
			.LOCAL
	): Promise<firebase.auth.UserCredential> => {
		await firebase.auth().setPersistence(persistence);
		return auth.signInWithEmailAndPassword(email, password);
	};

	const logout = (): Promise<void> => {
		return auth.signOut();
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user === null) {
				setUserContext(null);
				setLoading(false);
				return;
			}
			user.getIdToken(true).then(async (idToken) => {
				axios.interceptors.request.use((config) => {
					config.headers.Authorization = idToken;
					return config;
				});

				const response = await axios.get(
					`${url}/api/v1/user/get-user?uid=${user.uid}`
				);

				if (newUser !== null && response.data.user === null) {
					await axios.post(`${url}/api/v1/user/create-user`, {
						uid: user.uid,
						email: user.email,
						name: newUser == null ? '' : newUser.firstName,
						lastName: newUser == null ? '' : newUser.lastName
					});
				}

				const tempUserContext: UserContext = {
					firebaseUser: user,
					idToken
				};
				setUserContext(tempUserContext);

				setLoading(false);
			});
		});

		// make sure to unsub whenever we unmount
		return unsubscribe;
	}, [newUser]);

	const contextValue: IAuthContext = {
		userContext,
		login,
		signUp,
		logout
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
