// firebase.ts — initializes Firebase for The Vinyl Concierge.
// NOTE: this config is NOT secret. Firebase web keys are public by design;
// your data is protected by Firestore security rules + Auth, not by hiding this.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByyfGeweUA_oM9TNqCRMf5gVeHWprDfMk",
  authDomain: "vinyl-concierge.firebaseapp.com",
  projectId: "vinyl-concierge",
  storageBucket: "vinyl-concierge.firebasestorage.app",
  messagingSenderId: "265539218100",
  appId: "1:265539218100:web:f8fea8e8a0f25a317185e1",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
