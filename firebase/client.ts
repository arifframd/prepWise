// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWMF3XSuo71s8nTeN91KlsCYfuZid_0Ew",
  authDomain: "prepwise-eddd1.firebaseapp.com",
  projectId: "prepwise-eddd1",
  storageBucket: "prepwise-eddd1.firebasestorage.app",
  messagingSenderId: "821005855107",
  appId: "1:821005855107:web:cd39acb47907b748e12eb6",
  measurementId: "G-RCRC048TPB",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
