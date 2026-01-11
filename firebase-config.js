// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get these from Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
  apiKey: "AIzaSyCKd6atbz4x9n-fC0WvMPXjjeNaQMzPuYI",
  authDomain: "klarna-deals-website.firebaseapp.com",
  projectId: "klarna-deals-website",
  storageBucket: "klarna-deals-website.firebasestorage.app",
  messagingSenderId: "123012938936",
  appId: "1:123012938936:web:1dc3c3b52487d67df8884d",
  measurementId: "G-55LM89JNX8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();
