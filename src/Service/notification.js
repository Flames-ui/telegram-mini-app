import { db } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const sendNotification = async ({ title, message, userIds = [] }) => {
  if (userIds.length === 0) {
    // Send to all users
    await addDoc(collection(db, 'notifications'), {
      title,
      message,
      isGlobal: true,
      createdAt: new Date().toISOString()
    });
  } else {
    // Send to specific users
    const batch = userIds.map(userId => 
      addDoc(collection(db, 'notifications'), {
        title,
        message,
        userId,
        isGlobal: false,
        createdAt: new Date().toISOString()
      })
    );
    await Promise.all(batch);
  }
};

export const getRecentNotifications = async (limit = 10) => {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(limit));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
