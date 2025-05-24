import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

export const paymentMethods = {
  PAYPAL: 'PayPal',
  CRYPTO: 'Crypto',
  BANK: 'Bank Transfer'
};

export const getPendingPayments = async () => {
  const q = query(collection(db, 'payments'), where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const approvePayment = async (paymentId) => {
  await updateDoc(doc(db, 'payments', paymentId), { 
    status: 'approved',
    approvedAt: new Date().toISOString() 
  });
};

export const rejectPayment = async (paymentId, reason) => {
  await updateDoc(doc(db, 'payments', paymentId), { 
    status: 'rejected',
    rejectionReason: reason,
    rejectedAt: new Date().toISOString()
  });
};

export const getUserEarnings = async (userId) => {
  const q = query(collection(db, 'earnings'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};
