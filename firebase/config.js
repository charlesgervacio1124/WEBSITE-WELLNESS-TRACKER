import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANlD4NcnxZjd8vSTf9DTdd1A837g3l0Ko",
  authDomain: "wellness-tracker-3a53e.firebaseapp.com",
  projectId: "wellness-tracker-3a53e",
  storageBucket: "wellness-tracker-3a53e.firebasestorage.app",
  messagingSenderId: "239807743484",
  appId: "1:239807743484:web:9066ddd844befb618c9e79",
  measurementId: "G-1BEK20PHFT"
};

// Initialize Firebase
console.log('Firebase: Initializing...');
const app = initializeApp(firebaseConfig);
console.log('Firebase: Initialized successfully');

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
