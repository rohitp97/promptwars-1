// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsNbIMfslfByckSnqO2Sc6E77jtlsVaRs",
  authDomain: "promptwars-1.firebaseapp.com",
  projectId: "promptwars-1",
  storageBucket: "promptwars-1.firebasestorage.app",
  messagingSenderId: "490865884907",
  appId: "1:490865884907:web:5095096ecba710dad388ae",
  measurementId: "G-PZ4JNNWWBP"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
// Initialize Analytics only on client side if needed
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
