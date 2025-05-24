import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdTokenResult();
    
    if (!token.claims.admin) {
      await signOut(auth);
      throw new Error("You don't have admin privileges");
    }
    
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  await signOut(auth);
};

export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
