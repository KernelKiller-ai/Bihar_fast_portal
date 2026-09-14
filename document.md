# BiharFast — Project Documentation

## 1. Overview

BiharFast is a Bihar-focused public information and recruitment platform built to simplify access to government updates, job notifications, admit cards, scheme information, and citizen services in one place.

The platform is designed for users who want fast, clean, and trustworthy government-related information without navigating multiple official portals manually.

This project combines:

- a modern React frontend for public-facing information
- a FastAPI backend for data delivery and API orchestration
- Supabase as the main structured data layer
- Upstash Redis for faster caching and feed speed
- Python scrapers to collect updates from official government and board portals

---

## 2. What this project does

BiharFast helps users find and track:

- Government job updates
- BPSC / CSBC / BPSSC / BCECEB / BTSC / BSSC-related notices
- Results and admit cards
- Welfare schemes and Yojana announcements
- RTPS and local citizen service portals
- Educational and student opportunity updates
- Important Bihar government public notices

The site is organized around a real-time notification feed and dedicated hub pages for major Bihar information categories.

---

## 3. Why this project matters

The project solves a common problem: important public information is spread across many websites, sometimes with slow access, inconsistent UI, and cluttered layouts.

BiharFast reduces that friction by delivering a cleaner experience with:

- centralized updates
- direct official links
- better category organization
- dedicated landing pages for high-value services
- responsive mobile-first UI
- quick access to trending opportunities

---

## 4. High-level architecture

```text
User Browser
    │
    ▼
React Frontend (Vite + React Router)
    │
    ├── Home feed / search / category pages
    ├── Post detail pages
    ├── Hub pages (RTPS, Yojana, BSEB, etc.)
    └── Tool pages (resizer, age calculator, etc.)
    │
    ▼
FastAPI Backend
    │
    ├── Supabase data fetching
    ├── Redis cache layer
    ├── article detail API
    ├── sync API for inserts/updates
    └── newsletter subscribe endpoint
    │
    ▼
Supabase Database
    │
    ├── jobs
    ├── schemes
    ├── citizen_services
    ├── results_admit_cards
    └── subscribers
```

---

## 5. Project structure

```text
bihar_fast/
├── backend/
│   ├── .env
│   ├── main.py
│   ├── requirements.txt
│   ├── quick_feed_sync.py
│   ├── seed_latest_updates.py
│   ├── sync_engine.py
│   ├── telegram_bot.py
│   ├── data/
│   ├── scrapers/
│   └── venv/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   └── eslint.config.js
│
├── package.json
├── document.md
├── .gitignore
└── README.md (if added later)
```

### Backend responsibilities

- `main.py` contains the main FastAPI app, routes, API logic, CORS config, and database access
- `sync_engine.py` handles sync logic and data ingestion operations
- `quick_feed_sync.py` helps with rapid feed refreshes
- `seed_latest_updates.py` populates or refreshes latest notices
- `telegram_bot.py` sends alerts and notifications to Telegram
- `scrapers/` contains portal-specific scraping logic for government boards and services
- `data/` stores curated or processed information

### Frontend responsibilities

- `src/App.jsx` contains the core home page, feed logic, filters, and hub navigation
- `src/pages/` contains specific landing pages and detail pages
- `src/components/` contains reusable UI blocks like Navbar, Footer, NotificationCard, etc.
- `src/data/portalData.js` holds static government portal info and permanent services data
- `src/utils/slug.js` provides slug generation for URLs and post linking

---

## 6. Tech stack

### Frontend

- React 19
- Vite
- React Router DOM
- Lucide React icons
- CSS and custom design system
- Service worker/PWA support for app-like behavior

### Backend

- Python
- FastAPI
- Supabase Python Client
- Upstash Redis
- Python dotenv
- Requests and BeautifulSoup for scraping

### Data and integrations

- Supabase for structured storage
- Redis for caching homepage and post data
- Telegram alerts for sync/notice updates
- Domain whitelist for trusted government URLs

---

## 7. Core features

### 7.1 Live notice feed
The home page fetches notices from the backend and groups them under categories such as:

- jobs
- results
- admit cards
- schemes
- citizen services

This gives users a quick overview of current opportunities and official updates.

### 7.2 Detail pages with SEO-friendly URLs
Every notice can be opened as a dedicated detail page using slug-based routing.

This improves:

- readability
- direct sharing
- indexed URL structure
- better public discoverability

### 7.3 Dedicated hub pages
The platform includes dedicated sections for high-traffic topics such as:

- BSEB 10th / 12th result pages
- RTPS Bihar service hub
- Udyami Yojana page
- Student Credit Card page
- Kushal Yuva Program page
- CUET UG admission page

These pages help users go directly to the most relevant service instead of searching widely.

### 7.4 Official domain validation
The backend enforces safe URL handling by validating links against trusted official Bihar government domains.

This protects the system from unsafe or unofficial donation or spam-style URLs.

### 7.5 Subscription and sync support
The backend exposes:

- a subscription endpoint for newsletter signups
- a protected sync endpoint to insert or update notices
- Telegram integration for updates and alert broadcasting

### 7.6 Admin-ready structure
The project includes admin-related views and internal sync functionality so content updates can be managed without manually editing the frontend.

---

## 8. API overview

The frontend connects to a backend API with a base URL configured as follows:

```text
VITE_API_BASE_URL or default: https://bihar-fast-portal.onrender.com
```

### Main endpoints

#### Home feed
```http
GET /api/notices
GET /api/posts
```
Returns the latest merged feed across jobs, schemes, results, and services.

#### Category-based endpoints
```http
GET /api/jobs
GET /api/schemes
GET /api/services
GET /api/admissions
GET /api/results
```

#### Post detail
```http
GET /api/posts/{slug}
```

#### Sync post
```http
POST /api/posts/sync
Headers:
  x_sync_secret: <secret>
```
Used for admin/internal insert or update flows.

#### Subscription
```http
POST /api/subscribe
```
Used to add a user email to the subscribers list.

---

## 9. Environment configuration

Backend environment variables are usually stored in `.env` under the `backend/` folder.

Example:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

INTERNAL_SYNC_SECRET=your_secret_key
ALLOWED_ORIGINS=http://localhost:5173,https://biharfast.in
```

Frontend example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 10. Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Usually runs at:

```text
http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 11. Production build and deployment

### Frontend build

```bash
cd frontend
npm run build
```

This is used for production deployment and supports Vercel-style hosting.

### Backend deployment
The backend is designed for deployment on hosting platforms such as:

- Render
- VPS / Ubuntu server
- Dockerized deployment environment

It expects:

- valid environment variables
- Supabase connection
- Redis connection
- secure internal sync secret
- working CORS origins

---

## 12. Data flow

The real system flow is simple but effective:

1. The scraper fetches data from official government portals.
2. Data is normalized and stored in Supabase tables.
3. The FastAPI app reads and aggregates those records.
4. Redis caches the most requested feed data for faster responses.
5. The frontend displays updated notices and category pages.
6. Users click through to official PDFs or application portals.

---

## 13. Current project strengths

BiharFast already has several strong foundations:

- live data-driven notice feed
- direct official portal access
- category-based browsing
- dedicated hubs for major Bihar schemes and result pages
- good frontend UX for mobile and desktop
- strong admin/internal sync capability
- caching design for better speed
- service-worker/PWA readiness

This gives the project a real product feel rather than a simple static website.

---

## 14. Maintenance notes

A few important practices for long-term reliability:

- keep official domain whitelist updated regularly
- validate scraped URLs before publishing
- update scraper logic when government portals change layouts
- monitor Redis hit rate and API latency
- keep Supabase credentials and sync secret secure
- make sure homepage feed remains concise and fast

---

## 15. Suggested next improvements

To move from a solid startup product to a strong public portal, these improvements are recommended:

- add automated API testing
- add admin content moderation dashboard
- add notification email system
- improve scraper retry and fallback logic
- add analytics dashboard for most visited categories
- improve SEO metadata and structured data
- create a content publishing workflow for updates
- add sitemap and RSS feed support

---

## 16. Summary

BiharFast is not just a basic frontend page set; it is a working public information platform that brings together government opportunities, official notices, and citizen services in one place.

It is built with a practical architecture, strong integration patterns, and a public-facing design that can scale as more categories and services are added.

This project already demonstrates a real-world product mindset: it is useful for end users, easier to maintain, and suitable for expansion into a larger Bihar public services ecosystem.

---

## 17. Final statement

The project has moved beyond a prototype and is now shaped like a real digital public service product. It combines government data, user experience, direct links, category organization, and fast content delivery in a way that gives it genuine value for Bihar citizens and aspirants.

If needed, the next phase can focus on scaling reliability, adding analytics, improving backend speed, and expanding the content ecosystem further.

