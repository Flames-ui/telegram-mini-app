import os
import logging
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import (
    ApplicationBuilder,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes
)
import firebase_admin
from firebase_admin import credentials, db

# Configuration
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Authorized moderators
MODERATORS = {
    "7190977452",  # First moderator
    "7174950841"   # Second moderator
}

# Firebase setup
cred = credentials.Certificate("firebase-creds.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://anointed-flames-tv-default-rtdb.firebaseio.com'
})

# Security check
def is_moderator(chat_id: str) -> bool:
    return str(chat_id) in MODERATORS

# Handle approvals
async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_moderator(update.effective_chat.id):
        await update.callback_query.answer("⛔ Unauthorized!")
        return

    query = update.callback_query
    data = query.data

    try:
        if "_post_" in data:
            post_id = data.split("_")[-1]
            ref = db.reference(f'posts/{post_id}')
            ref.update({'status': 'approved' if "approve" in data else 'rejected'})
            await query.answer("✅ Approved" if "approve" in data else "❌ Rejected")

        elif "_wd_" in data:
            wd_id = data.split("_")[-1]
            ref = db.reference(f'withdrawals/{wd_id}')
            if "approve" in data:
                withdrawal = ref.get()
                user_ref = db.reference(f'users/{withdrawal["userId"]}')
                user_ref.update({'balance': firebase_admin.db.ServerValue.increment(-withdrawal["amount"])})
            ref.update({
                'status': 'approved' if "approve" in data else 'rejected',
                'moderator': update.effective_user.username
            })
            await query.answer("💰 Processed" if "approve" in data else "🚫 Rejected")

    except Exception as e:
        logger.error(f"Error: {e}")
        await query.answer("⚠️ Failed")

    await query.delete_message()

# Start bot
def main():
    app = ApplicationBuilder().token(os.getenv("TELEGRAM_TOKEN")).build()
    app.add_handler(CallbackQueryHandler(handle_callback))
    app.run_polling()

if __name__ == '__main__':
    main()
