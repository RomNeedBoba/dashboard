import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

// a week before pre-deploy please delete current firebase auth, and create new one with API security
const firebaseConfig = {
  apiKey: "AIzaSyD5IEq63jmhZZgnYoeMpCFFHLbbBWhUn3Q",
  authDomain: "jomnam-userauth.firebaseapp.com",
  projectId: "jomnam-userauth",
  storageBucket: "jomnam-userauth.firebasestorage.app",
  messagingSenderId: "875853823801",
  appId: "1:875853823801:web:1d4c53df8eb5e8bb2db2e8",
  measurementId: "G-4ZYWLYGQ7M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
};
