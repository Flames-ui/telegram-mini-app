import { db, auth } from './firebase-init.js';

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return alert("Please login first");
    
    const postContent = document.getElementById('postContent').value;
    const postData = {
        content: postContent,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        status: "pending",
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    try {
        await db.ref('posts').push(postData);
        alert("Post submitted for approval!");
        document.getElementById('postContent').value = "";
    } catch (error) {
        console.error("Error:", error);
        alert("Submission failed");
    }
});
