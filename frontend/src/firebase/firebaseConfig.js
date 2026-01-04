// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtqWqS1mjKpQ3wiKNgNkY4SlUsFBRIW9I",
  authDomain: "wana-9705e.firebaseapp.com",
  projectId: "wana-9705e",
  storageBucket: "wana-9705e.firebasestorage.app",
  messagingSenderId: "873274374868",
  appId: "1:873274374868:web:d187289ed3652ecd979941",
  measurementId: "G-BS5B2J5X7J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Named exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Default export
export default firebaseConfig;
