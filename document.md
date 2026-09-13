# BiharFast Project Documentation

## 1. Project Overview

BiharFast is a Bihar-focused government opportunity portal that aggregates and displays:

- Govt job notifications
- Results and admit cards
- Welfare schemes / Yojana
- Citizen services / RTPS services
- Other Bihar government notices and updates

The project is built as a full-stack web app:

- Frontend: React + Vite
- Backend/API: FastAPI
- Database: Supabase
- Cache: Upstash Redis
- Data collection: Python scrapers for official Bihar government portals

---

## 2. Project Structure

```text
bihar_fast/
├── backend/
│   ├── data/
│   ├── scrapers/
│   ├── .env
│   ├── main.py
│   ├── quick_feed_sync.py
│   ├── requirements.txt
│   ├── seed_latest_updates.py
│   ├── sync_engine.py
│   ├── telegram_bot.py
│   └── venv/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── package.json
├── document.md
└── .gitignore
```

### Main folders

#### backend/
Contains the API server and scrapers.

- `main.py`: FastAPI app and main endpoints
- `sync_engine.py`: sync logic for ingesting or updating posts
- `quick_feed_sync.py`: quick feed synchronization script
- `seed_latest_updates.py`: seeding script for latest updates
- `telegram_bot.py`: Telegram alert integration
- `scrapers/`: web scrapers for official portals like BPSC, CSBC, SSC, etc.
- `data/`: stored or curated data items

#### frontend/
Contains the website UI, pages, components, and routing.

- `src/App.jsx`: main app and home page logic
- `src/components/`: reusable UI components
- `src/pages/`: all page views
- `src/data/portalData.js`: static portal data and permanent service info
- `src/utils/slug.js`: slug generation logic

---

## 3. Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Lucide React icons
- CSS with custom styling

### Backend
- Python
- FastAPI
- Supabase Python client
- Upstash Redis
- Python-dotenv
- Requests, BeautifulSoup

### Integration
- Telegram notifications
- CORS-enabled API access
- Cache-based feed optimization
- Domain whitelist for official government websites

---

## 4. Main Features

### Home feed
The website fetches notices from the backend `/api/notices` or `/api/posts` endpoint, then groups them into categories:

- Jobs
- Results
- Admit Cards
- Schemes / Yojana
- Citizen Services

### Post detail pages
Each article/notification is mapped to a slug and can be viewed in detail using routes like:

- `/posts/:slug`
- detail is resolved by backend lookup across multiple tables

### Admin / sync support
There is an admin page and sync endpoint to allow posting or updating records using a secret header.

### Official domain filtering
The backend validates that PDF and application URLs belong to trusted official domains such as:

- bpsc.bihar.gov.in
- csbc.bihar.gov.in
- biharboardonline.bihar.gov.in
- serviceonline.bihar.gov.in
- biharbhumi.bihar.gov.in
- udyami.bihar.gov.in

### Newsletter subscription
Users can subscribe with email; data is stored in Supabase via `subscribers` table.

---

## 5. API Overview

Base URL is configured by frontend environment variable or defaults to:

```text
https://bihar-fast-portal.onrender.com
```

### Core endpoints

#### Fetch all notices
```http
GET /api/notices
GET /api/posts
```
Returns combined data from jobs, results, schemes, and services.

#### Category endpoints
```http
GET /api/jobs
GET /api/schemes
GET /api/services
GET /api/admissions
GET /api/results
```

#### Detail endpoint
```http
GET /api/posts/{slug}
```

#### Sync new post
```http
POST /api/posts/sync
Headers:
  x_sync_secret: <your-secret>
```
Used to insert or update a post in the correct table.

#### Subscribe
```http
POST /api/subscribe
```
Adds the email to the subscribers table.

---

## 6. Environment Variables

The backend uses `.env` values. Example variables include:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_key
# or
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

INTERNAL_SYNC_SECRET=your_internal_secret
ALLOWED_ORIGINS=http://localhost:5173,https://biharfast.in
```

Frontend environment variables may be used as well, for example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 7. Local Setup

### 7.1 Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite dev server, usually at:

```text
http://localhost:5173
```

### 7.2 Backend setup

From project root:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 8. Production Build

### Frontend build

```bash
cd frontend
npm run build
```

This project already includes a build script and is suitable for deployment to Vercel.

### Backend deployment
The API is designed for deployment on a Python-compatible hosting platform such as Render or a VPS. It expects:

- environment variables configured
- Supabase access available
- Redis configured
- secrets set for sync API access

---

## 9. Data Flow

1. Scrapers fetch notices from official Bihar government portals.
2. Data is normalized and stored into Supabase tables like:
   - `jobs`
   - `schemes`
   - `citizen_services`
   - `results_admit_cards`
   - `admissions`
3. Backend APIs read those tables and expose them to frontend.
4. Frontend uses the API to render live updates on the website.
5. Redis caches frequently requested feed data for faster response.

---

## 10. Important Notes for Maintainers

- Always validate external URLs before storing them.
- Keep official government domains in the whitelist.
- Use `INTERNAL_SYNC_SECRET` for any admin-like sync operations.
- Keep `Supabase` and `Upstash Redis` environment values secure.
- Update scrapers when government portal HTML structure changes.
- Prefer caching for high-traffic feed endpoints.

---

## 11. Summary

This app is a modern Bihar government information portal that combines:

- modern React frontend
- Python FastAPI backend
- live government notices
- data caching
- campaign and service pages
- subscription and sync support

It is designed to help users quickly access job updates, scheme information, and official government opportunities in one place.

---

## 12. Suggested Next Improvements

- Add automated tests for backend API endpoints
- Add admin dashboard for content moderation
- Add newsletter email sending integration
- Add dashboard analytics for traffic and notices
- Improve scraper resiliency and retry logic
- Add better SEO metadata for each page

If you want, I can also create a second version of this document in a more professional format for GitHub, including screenshots, architecture diagrams, and deployment instructions.
