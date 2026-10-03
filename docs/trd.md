# BiharFast Technical Requirements Document

**Status:** As-built notes plus clearly identified recommendations. This document describes repository evidence, not a live environment audit.

## 1. Technology stack

| Layer | Observed implementation |
|---|---|
| Frontend | React 19, Vite, React Router DOM 7, Tailwind CSS 4, Lucide React |
| Client identity | Supabase JS Auth client; Google OAuth when configured |
| Backend | FastAPI, Pydantic 2, Uvicorn, Python Supabase client |
| Data | Supabase/Postgres accessed through Supabase APIs |
| Optional cache/rate limit | Upstash Redis REST client; in-process fallbacks exist |
| Hosting configuration | Vercel frontend rewrites/cache headers; backend URLs reference Render |
| Notifications | Optional Telegram Bot API background message after new notice |

## 2. Architecture and state flow

```text
React SPA / React Router
  ├─ App feed state, search, category filters
  ├─ Supabase AuthContext (session, modal, OAuth)
  ├─ Quiz-player state + localStorage history
  └─ HTTP JSON requests
       ▼
FastAPI
  ├─ Notice routes ──► database.py ──► Supabase notices
  ├─ Quiz router ────► Supabase quiz/leaderboard tables
  ├─ Optional Upstash cache and rate limiting
  └─ Optional Telegram background alert
```

`frontend/src/main.jsx` mounts `AuthProvider` around `BrowserRouter` and `App`. The application uses React component state for filters and interactions. Authentication state is restored and subscribed to through `AuthContext`. Quiz attempts in the student dashboard are stored in `localStorage`, not fetched from a profile/attempt table.

The frontend has no general React error boundary identified in the checked-in route tree. FastAPI logs unhandled exceptions and returns a JSON 500 response; individual route handlers also map selected failures to HTTP errors. Optional cache errors can fall back to database reads.

## 3. API inventory

### Notice API

| Method | Route | Contract |
|---|---|---|
| GET | `/` | Health/status response |
| GET | `/api/notices`, `/api/posts` | Active, published notice feed; rate limited; cached when Redis is available |
| GET | `/api/posts/{slug}` | Active, published notice detail; rate limited; cached when Redis is available |
| GET | `/api/admin/posts?status=...` | Admin list; bearer token required |
| POST | `/api/admin/posts` | Create/upsert notice and schedule cache invalidation/Telegram alert; bearer token required |
| PUT | `/api/admin/posts/{post_id}` | Update notice; bearer token required |
| POST | `/api/admin/posts/{post_id}/status` | Change status; bearer token required |
| GET | `/api/sitemap-posts.xml` | Published notice sitemap |

Admin notice creation accepts title, slug, department, category, total posts, last date, eligibility, apply/PDF URLs, short description, article content, SEO fields, FAQs, application steps, and selection process. Category identifiers are normalized to `jobs`, `admit_card`, `results`, or `schemes`. The update path currently maps unknown categories—including schemes—to `jobs`; correct/verify before depending on scheme-category edits.

The backend responds with JSON `success`/`data` envelopes on primary notice routes. HTTP status codes should be treated as authoritative. For detail data, the client expects `{success: true, data: ...}`.

### Quiz API

| Method | Route | Access |
|---|---|---|
| GET | `/api/quiz/available` | Public |
| GET | `/api/quiz/today?quiz_id=...&subject=...` | Public; selected quiz or active fallback |
| POST | `/api/quiz/submit` | Public submission, server evaluated |
| GET | `/api/quiz/leaderboard/{quiz_id}` | Public |
| GET | `/api/quiz/admin/all-quizzes` | Admin bearer |
| GET | `/api/quiz/admin/quiz-questions/{quiz_id}` | Admin bearer |
| POST | `/api/quiz/admin/create-quiz` | Admin bearer |
| POST | `/api/quiz/admin/toggle-status/{quiz_id}` | Admin bearer |
| DELETE | `/api/quiz/admin/question/{question_id}` | Admin bearer |
| DELETE | `/api/quiz/admin/quiz/{quiz_id}` | Admin bearer |
| POST | `/api/quiz/admin/add-questions` | Admin bearer |

Quiz read/submit routes apply rate limits. Non-demo submissions use an IP-derived daily limit (six attempts per date in the current implementation) and can be written to the leaderboard. Demo submissions skip that IP usage count and do not qualify for leaderboard persistence. The quiz system uses India Standard Time for date selection.

### Deployment proxy and SEO

`frontend/vercel.json` rewrites `/api/*` to the Render backend and `/post/:slug` to `frontend/api/post-seo.js`; it also serves the SPA for other application paths and applies immutable caching to `/assets/*`. Some frontend components also use an API base URL directly, so confirm environment settings and actual deployment routing together.

The footer issues `POST /api/subscribe`; although a `subscribers` upsert helper exists, no matching FastAPI route was found. Treat newsletter subscription as unverified.

## 4. Configuration

### Backend variables observed in code

- `SUPABASE_URL`
- One of `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `SUPABASE_KEY` (server client selection order)
- `ADMIN_API_TOKEN`
- Optional `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Optional `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID` or `TELEGRAM_CHAT_ID`

`ALLOWED_ORIGINS` appears in older documentation but the inspected FastAPI CORS configuration uses a source-defined origin list and regex; confirm actual deployment configuration rather than assuming that environment variable is consumed.

### Frontend variables observed in code

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` where API-consuming components use it

Vite variables are bundled into browser code. Never place an admin token, Supabase service/secret key, or other privileged secret in a `VITE_*` variable.

## 5. Security and RBAC

### Implemented controls observed

- Student identity is Supabase Auth; Google OAuth is initiated from the global auth context.
- Admin notice and quiz endpoints use HTTP Bearer credentials checked against `ADMIN_API_TOKEN` with constant-time comparison.
- Admin API rate-limiting/failed-token lockout logic exists; some lockout state uses Redis if configured and otherwise process memory.
- CORS middleware defines allowed origins and a localhost/BiharFast regex.
- Public request rate limits are configured for feed, post details, sitemap, and quiz routes.
- Notice HTML is sanitized in the result/detail presentation path using DOMPurify.
- Quiz public responses omit answer-key fields; scoring queries answers server-side.

### Verify before production authorization claims

- No Supabase RLS policy definitions are included in the repository. Inspect the live project and ensure tables accessed by the browser use least-privilege policies. Backend use of a secret/service key bypasses RLS protections; keep it server-only.
- The official HTTPS URL helper in `backend/database.py` has no call site in the inspected notice publication route. It does not currently prove that writes are restricted to official links.
- A shared admin bearer token is a limited internal-admin mechanism, not role-based multi-user admin identity. Consider migration to individual authenticated admin identities and auditable roles.
- Forwarded client-IP headers should only be trusted behind a known proxy that overwrites them.
- Avoid returning internal exception details to public clients; current global handler includes exception text in the 500 JSON body.
- Keep CORS origins exact and environment-aware; do not allow a broad domain regex in production without a clear need.

## 6. Reliability and error handling

- FastAPI health endpoint: `GET /`.
- GZip middleware compresses responses above its configured threshold.
- Notice feed/detail can use Redis and Cache-Control directives; write/status updates schedule cache invalidation.
- Redis access failures in cache paths fall back to uncached operations; monitor logs and database load during outages.
- API handlers include HTTP error responses; the frontend has route-level loading/error handling. No application-wide React error boundary was located.
- Telegram alert delivery is best-effort background work; notice persistence and Telegram delivery are separate outcomes.

## 7. Performance and scale requirements

### Current foundations

- Vercel serves built static assets with one-year immutable caching and SPA routing.
- FastAPI enables gzip and uses optional Redis for feed/detail/sitemap data.
- Notice feed query selects a compact set of columns, filters active/published categories, orders by creation time, and limits results to 50.
- Frontend design work includes narrow-screen constraints and responsive navbar/search behavior.

### Recommended requirements (not measured guarantees)

- Establish p50/p95 API latency, cache hit ratio, error rate, and freshness monitoring before capacity claims.
- Keep static assets compressed and appropriately sized; use CDN delivery for frontend media and assets.
- Use Supabase connection pooling/transaction-pooler settings appropriate to the hosting runtime; the code uses Supabase client APIs and does not establish a custom SQL connection-pool setting.
- Add load tests for the feed, post details, quiz submissions, and leaderboard writes, with realistic cache-cold and cache-warm scenarios.
- To plan for one million users, model concurrent traffic and database reads/writes; CDN caching alone does not ensure application/database capacity.
- Consider Cloudflare/edge caching and asynchronous leaderboard aggregation only after correctness, invalidation, privacy, and consistency requirements are specified.
- Responsive QA should include 320px/360px, 390px, tablet, and desktop viewport sizes, including long Hindi/English content.
