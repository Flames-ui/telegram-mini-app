// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8DFd227dgvCh9TKZ3pe3I0tdDd9MIHp0",
  authDomain: "anointed-flames-tv.firebaseapp.com",
  databaseURL: "https://anointed-flames-tv-default-rtdb.firebaseio.com",
  projectId: "anointed-flames-tv",
  storageBucket: "anointed-flames-tv.firebasestorage.app",
  messagingSenderId: "814825501586",
  appId: "1:814825501586:web:3fb1feb13746bce2e1c74b",
  measurementId: "G-CZR5508L92"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.database();
const auth = firebase.auth();

// Export modules
export { app, db, auth, analytics }
