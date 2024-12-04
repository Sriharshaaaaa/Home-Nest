// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "homenest-15fe6.firebaseapp.com",
  projectId: "homenest-15fe6",
  storageBucket: "homenest-15fe6.appspot.com",
  messagingSenderId: "5150338433",
  appId: "1:5150338433:web:1bf6d8fdc531a9ea008c80",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
