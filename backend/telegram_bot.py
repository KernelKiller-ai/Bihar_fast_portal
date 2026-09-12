import os
import time
import html
import requests
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
API_BASE_URL = os.getenv("VITE_API_BASE_URL")
FRONTEND_URL = "https://biharfast.in"

def send_telegram_alert(post: dict, base_url: str = FRONTEND_URL):
    """
    Alert notification dispatcher for BiharFast Telegram Channel.
    """
    if not BOT_TOKEN or not CHAT_ID:
        print("⚠️ Telegram credentials missing in .env")
        return False

    active_base_url = base_url.rstrip("/")

    # HTML Sanitization
    title = html.escape(str(post.get("title", "नई अधिसूचना")))
    dept = html.escape(str(post.get("department", "बिहार सरकार")))
    total_posts = html.escape(str(post.get("total_posts") or post.get("totalPosts") or "विभागीय सूचना देखें"))
    last_date = html.escape(str(post.get("last_date") or post.get("lastDate") or "सक्रिय सूचना"))
    slug = post.get("slug", "")

    detail_url = f"{active_base_url}/post/{slug}" if slug else active_base_url
    apply_url = post.get("apply_url") or post.get("applyUrl") or post.get("pdf_url") or post.get("pdfUrl") or detail_url

    message = (
        f"🚨 <b>नई सरकारी भर्ती / आधिकारिक सूचना जारी!</b>\n\n"
        f"🏢 <b>विभाग:</b> {dept}\n"
        f"📋 <b>पद / विषय:</b> {title}\n"
        f"👥 <b>कुल पद:</b> {total_posts}\n"
        f"⏳ <b>अंतिम तिथि:</b> {last_date}\n\n"
        f"🔗 <b>डायरेक्ट लिंक्स:</b>\n"
        f"👉 <a href='{detail_url}'>पूरी जानकारी और विवरण देखें</a>\n"
        f"📝 <a href='{apply_url}'>ऑफिशियल पोर्टल / पीडीएफ देखें</a>\n\n"
        f"🌐 <i>BiharFast.in — सही जानकारी, बेहतर बिहार</i>"
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
        data = res.json()
        if not data.get("ok"):
            print(f"❌ Telegram Error: {data.get('description')}")
            return False
        return True
    except Exception as e:
        print(f"❌ Dispatch failed: {e}")
        return False

def broadcast_oct_nov_notices():
    print("📡 Fetching notices from backend...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/notices", timeout=15)
        data = response.json()
        
        # Parse data array safely
        items = data.get("data", [])
        if isinstance(items, str):
            import json
            items = json.loads(items)
    except Exception as e:
        print(f"❌ Failed to fetch notices: {e}")
        return

    target_keywords = ["oct", "nov", "अक्टूबर", "नवंबर", "10/2026", "11/2026", "10-2026", "11-2026", "active", "सक्रिय"]
    
    valid_posts = []
    for item in items:
        last_date = str(item.get("last_date") or item.get("lastDate") or "").lower()
        if any(m in last_date for m in target_keywords):
            valid_posts.append(item)

    # Agar match kam ho toh top 10 circulars bhej dein
    if len(valid_posts) < 5:
        print("⚠️ Specific date notices kam mili, picking latest 10 circulars...")
        valid_posts = items[:10]

    print(f"🚀 Found {len(valid_posts)} notices to broadcast.\n")

    success_count = 0
    for idx, post in enumerate(valid_posts, 1):
        print(f"[{idx}/{len(valid_posts)}] Sending: {post.get('title')[:35]}...")
        if send_telegram_alert(post, base_url=FRONTEND_URL):
            success_count += 1
        time.sleep(3)  # Rate-limit safety delay

    print(f"\n🎉 Broadcast complete! Successfully posted {success_count}/{len(valid_posts)} updates to Telegram.")

if __name__ == "__main__":
    broadcast_oct_nov_notices()