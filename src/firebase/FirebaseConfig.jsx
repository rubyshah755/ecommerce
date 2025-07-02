// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuwDIvfoVgHJrSC6WBuK0PTauL0EXaMJ0",
  authDomain: "myfirstapp-926b7.firebaseapp.com",
  projectId: "myfirstapp-926b7",
  storageBucket: "myfirstapp-926b7.firebasestorage.app",
  messagingSenderId: "95535199331",
  appId: "1:95535199331:web:b5a8193e9900968e5d3456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);
export {fireDB, auth}