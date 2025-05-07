// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Importeer Firebase Authentication

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyCQrSXifVDG7YUa0vlHJlsqfNYVyh8UxtQ",
  authDomain: "frontedge2-343cf.firebaseapp.com",
  projectId: "frontedge2-343cf",
  storageBucket: "frontedge2-343cf.firebasestorage.app",
  messagingSenderId: "210277965861",
  appId: "1:210277965861:web:d90d699bce0ea23c13dfcc",
  measurementId: "G-PPJQJW1R9J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app); // ✅ Initialiseer Firebase Authentication

// ✅ Exporteer auth zodat het gebruikt kan worden in andere bestanden
export { db, auth, analytics };
