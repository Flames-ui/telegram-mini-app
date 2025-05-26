import { db, auth } from './firebase-init.js';

document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return alert("Please login first");
    
    const amount = parseFloat(document.getElementById('amount').value);
    const wallet = document.getElementById('wallet').value;

    try {
        // Verify balance
        const userRef = db.ref(`users/${user.uid}`);
        const snapshot = await userRef.once('value');
        const currentBalance = snapshot.val().balance || 0;
        
        if (amount > currentBalance) {
            return alert("Insufficient balance");
        }

        await db.ref('withdrawals').push({
            userId: user.uid,
            userName: user.displayName || "Anonymous",
            amount: amount,
            walletAddress: wallet,
            status: "pending",
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        alert("Withdrawal request submitted!");
        document.getElementById('withdrawForm').reset();
    } catch (error) {
        console.error("Error:", error);
        alert("Request failed");
    }
});
