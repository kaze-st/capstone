import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../types/UserContext';
import { auth } from '../firebase-config';
import firebase from 'firebase/app';

interface IAuthContext {
	userContext: UserContext | null;
	login:
		| ((
				email: string,
				password: string,
				persistence?: firebase.auth.Auth.Persistence
		  ) => Promise<firebase.auth.UserCredential>)
		| null;
	signUp:
		| ((
				email: string,
				password: string
		  ) => Promise<firebase.auth.UserCredential>)
		| null;
	logout: (() => Promise<void>) | null;
}

type Props = {
	children: React.ReactNode;
};

// initializing these shit as null because idk how to initialize them
const AuthContext = React.createContext<IAuthContext>({
	userContext: null,
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

	const signUp = (
		email: string,
		password: string
	): Promise<firebase.auth.UserCredential> => {
		return auth.createUserWithEmailAndPassword(email, password);
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
			}
			firebase
				.auth()
				.currentUser?.getIdToken(true)
				.then((idToken) => {
					const tempUserContext: UserContext = {
						firebaseUser: user,
						idToken
					};
					setUserContext(tempUserContext);
				});
			setLoading(false);
		});

		// make sure to unsub whenever we unmount
		return unsubscribe;
	}, []);

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
