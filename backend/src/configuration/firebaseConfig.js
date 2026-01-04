// Import the Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtqWqS1mjKpQ3wiKNgNkY4SlUsFBRIW9I",
  authDomain: "wana-9705e.firebaseapp.com",
  projectId: "wana-9705e",
  storageBucket: "wana-9705e.firebasestorage.app",
  messagingSenderId: "873274374868",
  appId: "1:873274374868:web:d187289ed3652ecd979941",
  measurementId: "G-BS5B2J5X7J"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };
