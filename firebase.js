import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import {initializeApp} from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBp1O5hSSbGfRFFYl-dh-AShWOYH8BTcjE",
    authDomain: "whatsapp-f2d05.firebaseapp.com",
    projectId: "whatsapp-f2d05",
    storageBucket: "whatsapp-f2d05.appspot.com",
    messagingSenderId: "993987465254",
    appId: "1:993987465254:web:aade099a43ae0c861cd6e7"
  };

// since we are doing server side rendering, so if a firebase app is already initialized
// then we will use that one else initialize new one with the above config 

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : 
    firebase.app();

// below steps are to get access to db, auth and provider      
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};