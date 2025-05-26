import os
import logging
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import (
    ApplicationBuilder,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters
)
import firebase_admin
from firebase_admin import credentials, db

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Authorized chat IDs
AUTHORIZED_CHAT_IDS = {
    "7190977452",  # First moderator
    "7174950841"   # Second moderator
}

# Security check
def is_authorized(chat_id: str) -> bool:
    return str(chat_id) in AUTHORIZED_CHAT_IDS

# Initialize Firebase
cred = credentials.Certificate("firebase-creds.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-project.firebaseio.com'
})

# Button handlers
async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_chat.id):
        await update.callback_query.answer("⛔ Unauthorized!")
        return

    query = update.callback_query
    data = query.data

    try:
        if data.startswith("approve_post_"):
            post_id = data.split("_")[2]
            db.reference(f'posts/{post_id}').update({'status': 'approved'})
            await query.answer("✅ Post approved")
            
        elif data.startswith("reject_post_"):
            post_id = data.split("_")[2]
            db.reference(f'posts/{post_id}').update({'status': 'rejected'})
            await query.answer("❌ Post rejected")

        elif data.startswith("approve_wd_"):
            wd_id = data.split("_")[2]
            withdrawal = db.reference(f'withdrawals/{wd_id}').get()
            user_ref = db.reference(f'users/{withdrawal["userId"]}')
            
            if user_ref.get()['balance'] >= withdrawal['amount']:
                user_ref.update({'balance': firebase_admin.db.ServerValue.increment(-withdrawal['amount'])})
                db.reference(f'withdrawals/{wd_id}').update({
                    'status': 'approved',
                    'moderator': update.effective_user.username
                })
                await query.answer("💰 Payment processed")
            else:
                await query.answer("❌ Insufficient balance")

        elif data.startswith("reject_wd_"):
            wd_id = data.split("_")[2]
            db.reference(f'withdrawals/{wd_id}').update({
                'status': 'rejected',
                'moderator': update.effective_user.username
            })
            await query.answer("🚫 Withdrawal rejected")

    except Exception as e:
        logger.error(f"Error: {e}")
        await query.answer("⚠️ Processing failed")

    await query.delete_message()

# Notification function
async def notify_moderators(text: str, buttons: list):
    for chat_id in AUTHORIZED_CHAT_IDS:
        try:
            await context.bot.send_message(
                chat_id=chat_id,
                text=text,
                reply_markup=InlineKeyboardMarkup(buttons)
            )
        except Exception as e:
            logger.error(f"Failed to notify {chat_id}: {e}")

# Start command
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_authorized(update.effective_chat.id):
        await update.message.reply_text("⛔ Access denied")
        return
    
    await update.message.reply_text(
        "🛡️ Anointed Flames Moderation\n\n"
        "You will receive:\n"
        "- Post approval requests\n"
        "- Withdrawal approvals"
    )

def main():
    app = ApplicationBuilder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
    
    # Handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_callback))
    
    # Error handling
    app.add_error_handler(lambda u, c: logger.error(f"Update {u} caused error {c.error}"))
    
    # Start bot
    app.run_polling()

if __name__ == '__main__':
    main()
