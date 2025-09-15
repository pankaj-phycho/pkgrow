// Firebase Configuration for PK Grow
// Replace with your actual Firebase project configuration

// Import Firebase SDK (ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// Firebase configuration object - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBxBq8XupzUt16PUBhAkC3Qb6tYDipFJkM",
  authDomain: "pkgrowweb.firebaseapp.com",
  databaseURL: "https://pkgrowweb-default-rtdb.firebaseio.com",
  projectId: "pkgrowweb",
  storageBucket: "pkgrowweb.firebasestorage.app",
  messagingSenderId: "778336876321",
  appId: "1:778336876321:web:96a04eab6f60e2c7c5b060"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Export Firebase services for use in other modules
export { db, storage };