const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Word lists
const FLAG_WORDS = ['porn', 'sex', 'violence', 'hate', 'drugs', 'profanity'];
const GOSPEL_WORDS = ['jesus', 'christ', 'god', 'bible', 'gospel', 'pray', 'amen', 'holy'];

/**
 * Auto moderation for new content in any collection (e.g., posts, videos)
 */
exports.contentModerator = functions.database
  .ref('/{collection}/{postId}')
  .onCreate(async (snapshot, context) => {
    const { collection, postId } = context.params;
    const post = snapshot.val();

    // Skip if already processed
    if (post.contentStatus) return null;

    const content = (post.content || '').toLowerCase();

    // Check for flagged content
    const hasFlagged = FLAG_WORDS.some(word => content.includes(word));
    if (hasFlagged) {
      await snapshot.ref.remove();
      console.log(`❌ Removed flagged content in ${collection}/${postId}`);
      return null;
    }

    // Check for gospel content
    const isGospel = GOSPEL_WORDS.some(word => content.includes(word));

    // Update post with analysis
    await snapshot.ref.update({
      contentStatus: isGospel ? 'gospel' : 'neutral',
      gospelContent: isGospel,
      lastChecked: admin.database.ServerValue.TIMESTAMP
    });

    console.log(`✅ Checked content in ${collection}/${postId} - Status: ${isGospel ? 'Gospel' : 'Neutral'}`);
    return null;
  });

/**
 * Scheduled function to re-check older posts daily
 */
exports.scheduledContentCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const db = admin.database();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    const snapshot = await db.ref('posts')
      .orderByChild('lastChecked')
      .endAt(cutoff)
      .limitToLast(100)
      .once('value');

    const updates = [];

    snapshot.forEach(child => {
      const content = (child.val().content || '').toLowerCase();
      const isGospel = GOSPEL_WORDS.some(word => content.includes(word));
      updates.push(
        child.ref.update({
          contentStatus: isGospel ? 'gospel' : 'neutral',
          gospelContent: isGospel,
          lastChecked: admin.database.ServerValue.TIMESTAMP
        })
      );
    });

    await Promise.all(updates);
    console.log(`🔁 Re-checked ${updates.length} old posts`);
    return null;
  });
