import 'firebase/auth';

import firebase from 'firebase/app'

// const app = firebase.initializeApp({
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
// });


const firebaseConfig = {
    apiKey: "AIzaSyBUjZ0XUgMmkg8NA5pKeKiN4DTxyuTt8SM",
    authDomain: "capstone-7cb71.firebaseapp.com",
    projectId: "capstone-7cb71",
    storageBucket: "capstone-7cb71.appspot.com",
    messagingSenderId: "310143851203",
    appId: "1:310143851203:web:7844e47087572c220de076",
    measurementId: "G-6KJWE41TDG"
  };;

const app = firebase.initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.measurementId,
    appId: firebaseConfig.appId,
    measurementId: firebaseConfig.measurementId
})

export const auth = app.auth();
export default app;