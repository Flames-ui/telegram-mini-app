const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Configure these word lists
const FLAG_WORDS = ['porn', 'sex', 'violence', 'hate', 'drugs', 'profanity'];
const GOSPEL_WORDS = ['jesus', 'christ', 'god', 'bible', 'gospel', 'pray', 'amen', 'holy'];

exports.contentModerator = functions.database
  .ref('/{collection}/{postId}')
  .onCreate(async (snapshot, context) => {
    const { collection } = context.params; // 'posts' or 'videos'
    const post = snapshot.val();
    
    // Skip if already processed
    if (post.contentStatus) return null;

    const content = (post.content || '').toLowerCase();
    
    // 1. Check for flagged content
    const hasFlagged = FLAG_WORDS.some(word => content.includes(word));
    if (hasFlagged) {
      await snapshot.ref.remove();
      return console.log('Removed flagged content:', postId);
    }

    // 2. Check for gospel content
    const isGospel = GOSPEL_WORDS.some(word => content.includes(word));
    
    // 3. Update post with analysis results
    return snapshot.ref.update({
      contentStatus: isGospel ? 'gospel' : 'neutral',
      gospelContent: isGospel,
      lastChecked: admin.database.ServerValue.TIMESTAMP
    });
  });

// Optional: Add scheduled check for older posts
exports.scheduledContentCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const db = admin.database();
    
    // Check posts older than 1 day
    const postsSnapshot = await db.ref('posts')
      .orderByChild('lastChecked')
      .endAt(Date.now() - 86400000) // 24 hours ago
      .limitToLast(100)
      .once('value');
    
    // Similar check for videos
    // Process each post...
  });
