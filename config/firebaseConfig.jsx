// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs7kf1ujX7ckSvLlLD4XZLVqoHPkaVT7k",
  authDomain: "tractit-663e5.firebaseapp.com",
  projectId: "tractit-663e5",
  storageBucket: "tractit-663e5.appspot.com",
  messagingSenderId: "207416948257",
  appId: "1:207416948257:web:44d22a7cf6208c73ec5560"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)