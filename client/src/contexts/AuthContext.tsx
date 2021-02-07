import React, { useContext, useState, useEffect } from 'react';
import {auth} from '../firebase';
import firebase from 'firebase/app';


interface IAuthContext {
    currentUser: firebase.User | null | undefined,
    login: ((email: string, password: string) => Promise<firebase.auth.UserCredential>) | null,
    signUp: ((email: string, password: string) => Promise<firebase.auth.UserCredential>) | null,
}

// initializing these shit as null because idk how to initialize them
const AuthContext = React.createContext<IAuthContext>({
    currentUser: null,
    login: null,
    signUp: null
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}: any) {

    // not sure how to decouple firebase from this useState
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [loading, setLoading] = useState(true);

    function signUp(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut();
    }

    useEffect(() => {
        // make sure to usub whenever we unmount
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const contextValue = {
        currentUser,
        login,
        signUp
    }

    return(
        <AuthContext.Provider value = {contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
}