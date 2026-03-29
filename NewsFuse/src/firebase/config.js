import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiE2cXkXqjzw_16PEOvUSddZ9AvnExMzQ",
  authDomain: "newsfuse-c31c8.firebaseapp.com",
  projectId: "newsfuse-c31c8",
  storageBucket: "newsfuse-c31c8.firebasestorage.app",
  messagingSenderId: "791615679574",
  appId: "1:791615679574:web:77e90109643ce902b19ff7",
  measurementId: "G-ZLL507V0LX",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
