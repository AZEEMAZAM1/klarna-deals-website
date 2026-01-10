// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get these from Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseAnalytics = analytics;

console.log('Firebase initialized successfully!');

// Setup instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Enable Authentication (Email/Password)
// 4. Enable Firestore Database
// 5. Enable Analytics (optional)
// 6. Go to Project Settings > Your apps
// 7. Register a web app and copy the config values above
