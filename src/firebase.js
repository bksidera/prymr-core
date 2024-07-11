// Initialize Firebase

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'; // Import Firebase Storage


const firebaseConfig = {
  apiKey: "AIzaSyAjU4Z_unQHMHOiCHYdyfIK-cbWBO9rQ3I",
  authDomain: "prymrtest-d7342.firebaseapp.com",
  projectId: "prymrtest-d7342",
  storageBucket: "prymrtest-d7342.appspot.com",
  messagingSenderId: "563104878426",
  appId: "1:563104878426:web:b8830562c67bedf1fc2d63",
  measurementId: "G-HD6W3X0M1H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage


export { auth, db, storage };