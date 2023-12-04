// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-cc7a2.firebaseapp.com",
  projectId: "real-estate-cc7a2",
  storageBucket: "real-estate-cc7a2.appspot.com",
  messagingSenderId: "350611372548",
  appId: "1:350611372548:web:7a9d9a7ae32f789bf65351",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
