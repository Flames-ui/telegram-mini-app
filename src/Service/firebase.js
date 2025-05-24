import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize admin user
export async function initializeAdmin() {
  try {
    const adminEmail = "anointedflames27@gmail.com";
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, process.env.REACT_APP_ADMIN_PASSWORD);
    await setCustomUserClaims(userCredential.user.uid, { 
      admin: true,
      roles: ["super-admin"]
    });
    console.log("Admin account initialized");
  } catch (error) {
    console.log("Admin already exists or error:", error);
  }
}
