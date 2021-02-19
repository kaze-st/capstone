import firebase from 'firebase/app';

export default interface UserContext {
	firebaseUser: firebase.User | null | undefined;
	idToken: any;
}
