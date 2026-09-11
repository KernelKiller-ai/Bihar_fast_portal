import os
import requests
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_test_alert():
    if not BOT_TOKEN or not CHAT_ID:
        print("❌ Error: .env file me TELEGRAM_BOT_TOKEN ya TELEGRAM_CHAT_ID nahi mila!")
        return

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    message = (
        "🚀 <b>BiharFast Telegram Alert System Connected!</b>\n\n"
        "✅ बिहार सरकार की नई सरकारी नौकरियों, एडमिट कार्ड, और रिजल्ट की सूचना अब इस चैनल पर स्वचालित (Automatic) रूप से आएगी।\n\n"
        "🌐 <b>Website:</b> https://biharfast.in\n"
        "✨ <i>सही जानकारी, बेहतर बिहार</i>"
    )

    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }

    print(f"Connecting to Telegram for channel: {CHAT_ID}...")
    try:
        response = requests.post(url, json=payload, timeout=10)
        res_json = response.json()

        if res_json.get("ok"):
            print("✅ Success! Telegram channel par test message pahunch gaya hai!")
        else:
            print(f"❌ Telegram Error: {res_json.get('description')}")
    except Exception as e:
        print(f"❌ Request Failed: {e}")

if __name__ == "__main__":
    send_test_alert()