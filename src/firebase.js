// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL0XQ__njyrqEovvOYvABQqj8funKyqnQ",
  authDomain: "chat-puls.firebaseapp.com",
  projectId: "chat-puls",
  storageBucket: "chat-puls.appspot.com",
  messagingSenderId: "862986308712",
  appId: "1:862986308712:web:ea1e4f9501ba3032667fdd",
  measurementId: "G-WB2PESZ4NY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
