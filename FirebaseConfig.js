// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKseAum7MtJNUALfQnUkW_L-NBdw3bhRA",
  authDomain: "meditracker-b5442.firebaseapp.com",
  projectId: "meditracker-b5442",
  storageBucket: "meditracker-b5442.firebasestorage.app",
  messagingSenderId: "338114771070",
  appId: "1:338114771070:web:5553617221beeaffb6c02f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);

export const db=getFirestore(app);