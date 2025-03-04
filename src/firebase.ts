// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqIElajqzQkG75ltJGFh05lzN0IbMZNmU",
  authDomain: "oldpals-2df94.firebaseapp.com",
  projectId: "oldpals-2df94",
  storageBucket: "oldpals-2df94.firebasestorage.app",
  messagingSenderId: "4471401354",
  appId: "1:4471401354:web:c5a824227108227012f673",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
