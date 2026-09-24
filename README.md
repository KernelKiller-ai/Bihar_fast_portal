# ⚡ BiharFast Portal (biharfast.in)

> **बिहार एवं केंद्र सरकार की सभी भर्तियों, रिजल्ट, एडमिट कार्ड व जन-सेवाओं का सबसे तेज व सटीक पोर्टल।**

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fbiharfast.in&label=biharfast.in&style=for-the-badge&logo=google-chrome)](https://biharfast.in)
[![Cloudflare CDN](https://img.shields.io/badge/Cloudflare-Cached_90%25-orange?style=for-the-badge&logo=cloudflare)](https://cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🎯 Project Overview

**BiharFast** is an ultra-fast, mobile-first, and SEO-optimized public information portal designed specifically for government job aspirants and citizens in Bihar. It eliminates ad-clutter, slow loading times, and broken redirects by aggregating official government circulars into 1-click verified official links.

🔗 **Live Portal:** [https://biharfast.in](https://biharfast.in)  
📲 **WhatsApp Channel:** [BiharFast Official](https://whatsapp.com/channel/0029VbDwc7KLNSa91goX3m1B)

---

## 🚀 Key Features

* **⚡ Ultra-Fast Performance:** Single Page Architecture with zero layout shifts (CLS 0.00), responsive image optimization, and sub-second load times.
* **🛡️ 100% Verified Links:** Direct links to official boards (BPSC, CSBC, BPSSC, BCECEB, BTSC, BSSC) without middleman clickbaits.
* **🧠 Real-Time Mock Test Engine:** Interactive daily quiz platform for BSEB Class 10th aspirants featuring dynamic scores, timer, and state leaderboard.
* **🛠️ Smart Cyber Utilities:**
  * **Photo & Signature Resizer:** Client-side canvas compressor (down to 20–50 KB) with zero privacy risks.
  * **Age Eligibility Calculator:** Instant cutoff date calculation with category-based age relaxation.
* **🌐 Edge-Cached Architecture:** Powered by Cloudflare CDN with over 90% edge cache efficiency to withstand traffic spikes on major result days.
* **🔍 Dynamic SEO & Indexing:** Programmatic dynamic XML sitemaps, Open Graph card generation, and JSON-LD structured schema for instant search engine ranking.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js / Vite
* **Styling:** Tailwind CSS (Modern Canonical Utility Classes)
* **Routing:** React Router DOM (Lazy loaded route chunks)
* **Icons:** Lucide React

### **Backend & Storage**
* **Server:** Python / Node.js API hosted on Render
* **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
* **Automation:** Cron-triggered scraper workers & GitHub Actions Keep-Alive daemon
* **CDN & Edge Security:** Cloudflare DNS, Global Edge Cache & SSL

---

## 📂 Project Structure

```text
Bihar_fast_portal/
├── .github/              # Automation workflows & keep-alive cron
├── backend/              # Server APIs & notification scrapers
├── frontend/             # React application source code
│   ├── public/           # Static assets, manifests, and icons
│   └── src/
│       ├── components/   # Navbar, NotificationCard, CyberTools
│       ├── pages/        # PostDetail, MockTest, Hubs
│       └── utils/        # Slug generators & formatting helpers
├── supabase/             # Database schemas & migrations
└── README.md             # Project documentation
💻 Local Development Setup
1. Clone the repository
Bash
git clone [https://github.com/KernelKiller-ai/Bihar_fast_portal.git](https://github.com/KernelKiller-ai/Bihar_fast_portal.git)
cd Bihar_fast_portal
2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
3. Backend Setup
Bash
cd ../backend
# Install dependencies and start local server
npm install # or pip install -r requirements.txt
npm run dev # or uvicorn main:app --reload
📈 Performance & Core Web Vitals
Lighthouse Performance Score: 95+

Cumulative Layout Shift (CLS): 0.00

Edge Cache Hit Ratio: ~90.4%

👤 Author & Maintainer
Developer: Anurag Kumar (@KernelKiller-ai)

Email: contact@biharfast.in

Location: Bihar, India

📄 License
This project is licensed under the MIT License - feel free to use it for personal and educational purposes.
