import os
import html
import requests
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
DEFAULT_FRONTEND_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")

def send_telegram_alert(post: dict, base_url: str = None):
    """
    Automatic notification generator for BiharFast Telegram Channel with HTML sanitization
    """
    if not BOT_TOKEN or not CHAT_ID:
        print("⚠️ Telegram bot credentials missing in .env")
        return False

    active_base_url = base_url or DEFAULT_FRONTEND_URL

    # Sanitize user/scraped text to prevent Telegram HTML parse errors
    title = html.escape(str(post.get("title", "नई अधिसूचना")))
    dept = html.escape(str(post.get("department", "बिहार सरकार")))
    total_posts = html.escape(str(post.get("total_posts") or post.get("totalPosts") or "विभागीय सूचना देखें"))
    last_date = html.escape(str(post.get("last_date") or post.get("lastDate") or "सक्रिय सूचना"))
    slug = post.get("slug", "")

    detail_url = f"{active_base_url}/post/{slug}" if slug else active_base_url
    apply_url = post.get("apply_url") or post.get("pdf_url") or detail_url

    message = (
        f"🚨 <b>नई सरकारी भर्ती / आधिकारिक सूचना जारी!</b>\n\n"
        f"🏢 <b>विभाग:</b> {dept}\n"
        f"📋 <b>पद / विषय:</b> {title}\n"
        f"👥 <b>कुल पद:</b> {total_posts}\n"
        f"⏳ <b>अंतिम तिथि:</b> {last_date}\n\n"
        f"🔗 <b>डायरेक्ट लिंक्स:</b>\n"
        f"👉 <a href='{detail_url}'>पूरी जानकारी और सिलेबस देखें</a>\n"
        f"📝 <a href='{apply_url}'>ऑफिशियल पोर्टल / पीडीएफ डाउनलोड</a>\n\n"
        f"🌐 <i>BiharFast.com — सही जानकारी, बेहतर बिहार</i>"
    )

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    try:
        res = requests.post(url, json=payload, timeout=10)
        return res.json().get("ok", False)
    except Exception as e:
        print(f"❌ Telegram alert delivery failed: {e}")
        return False