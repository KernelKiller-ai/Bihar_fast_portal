# BiharFast Project Documentation

## Current operational snapshot

BiharFast is a Bihar-focused public information portal for government notices, jobs, admit cards, results, schemes, education resources, and citizen-service hubs. This snapshot describes the checked-in application and deployment configuration; it is not a live uptime, data-freshness, or production-capacity check.

The current repository contains:

- A React 19 / Vite frontend using React Router, Tailwind CSS 4, Lucide icons, and optional Supabase Auth.
- A FastAPI backend that serves notice and quiz APIs and accesses Supabase through the Python client.
- Optional Upstash Redis caching and rate-limit support, plus a Telegram channel alert integration.
- Vercel frontend routing/cache configuration and a Vercel function for crawler-facing post metadata.
- A Supabase migration for `ai_usage_ledger` and `scraped_inbox`; no canonical `notices` or quiz-table DDL is checked in.

Current UI work includes the category-driven admin notice form, mobile layout constraints for small viewports, and an `AuthProvider` at the application root. The authenticated user flow uses Google OAuth through Supabase when configured. Student quiz history is stored in browser `localStorage`; non-demo quiz results are also submitted to the backend leaderboard.

The production domains and backend URL appear in source/configuration. Their current availability and the live Supabase schema were not independently queried for this documentation pass.

## Product overview

The site centralizes access to public notices and direct action links for Bihar students, job aspirants, and public-service seekers. Main public capabilities include:

- A notice feed with client-side category filtering and text search.
- Slug-based notice detail pages, including direct apply/download links.
- Dedicated results/admit-card/job aggregations and topic hubs such as RTPS Bihar, Udyami Yojana, BSEB results, KYP, Student Credit Card, and CUET.
- Class 10 and other configured mock-test experiences, scorecards, answer explanations, and a leaderboard.
- A student dashboard backed by local browser history and Supabase Auth identity.
- An admin portal for notice publishing and quiz management.

The site presents verified-information messaging, but this repository does not establish an automated source-verification workflow for every submitted URL. Admin notice publishing is a manual bearer-token-protected API flow.

## Recent implementation updates

1. **Category-driven admin form:** category values are `jobs`, `admit_card`, `results`, and `schemes`; field labels and placeholders adapt to the selected category. The total-posts field is hidden for admit cards and results, and the submit payload includes the configured fallback value.
2. **Mobile overflow work:** root and major layout widths are constrained, and the navbar/search layout has compact mobile behavior intended for narrow viewports including 360px. This is an implementation target verified in the previous development pass, not a claim that every route has been exhaustively tested at every device size.
3. **Global auth context:** `AuthProvider` wraps the routed application in `frontend/src/main.jsx`; `App` and the global UI therefore render inside the provider.

## Architecture and request flow

```text
Browser (React SPA)
  ├─ React Router pages, feed filters, quiz state, auth context
  ├─ Supabase Auth client (public anon key, when configured)
  └─ HTTP requests
       └─ FastAPI (public/admin/quiz APIs)
            ├─ Supabase Postgres via server-side Python client
            ├─ Optional Upstash Redis cache/rate limiter
            └─ Optional Telegram notification on new notice
```

The frontend's main feed requests `GET /api/notices` (with `/api/posts` as a backend alias). A notice detail page fetches `GET /api/posts/{slug}`. The frontend also contains `frontend/api/post-seo.js`, which returns crawler-facing HTML metadata for `/post/:slug`; Vercel routes matching post pages to this function. The FastAPI sitemap endpoint supplies published post slugs.

FastAPI uses CORS allowlists, gzip middleware, rate limits, and a global exception handler. Public feed/detail data can be cached in Upstash Redis when configured, and response headers include browser/CDN cache directives. Redis errors generally fall back to uncached operation. No React error-boundary component was identified in the inspected application.

## Routes and APIs

### Frontend routes

The checked-in route map includes `/`, `/post/:slug`, `/sitemap`, `/all-updates`, `/jobs`, `/admit-card`, and `/results`; about/contact/legal pages; `/admin` and `/admin-portal`; education/service hubs; `/class-10-quiz`, `/mock-test/class-10`, `/mock-test`, `/upcoming-2026`, `/download`, and `/dashboard`.

Schemes are part of the backend notice category set and home aggregation; no dedicated `/schemes` route was identified in the current route map.

### FastAPI routes

| Method | Path | Purpose / access |
|---|---|---|
| GET | `/` | Health response |
| GET | `/api/notices`, `/api/posts` | Published active notice feed |
| GET | `/api/posts/{slug}` | Published active notice detail |
| GET | `/api/admin/posts` | Admin notice list; bearer token |
| POST | `/api/admin/posts` | Create/publish notice; bearer token |
| PUT | `/api/admin/posts/{post_id}` | Update notice; bearer token |
| POST | `/api/admin/posts/{post_id}/status` | Update notice status; bearer token |
| GET | `/api/sitemap-posts.xml` | Dynamic sitemap for published notices |
| GET | `/api/quiz/available`, `/api/quiz/today` | Public quiz selection/questions |
| POST | `/api/quiz/submit` | Evaluate answers and optionally persist leaderboard entry |
| GET | `/api/quiz/leaderboard/{quiz_id}` | Public leaderboard |
| GET/POST/DELETE | `/api/quiz/admin/...` | Admin quiz, question, and status management; bearer token |

See [docs/trd.md](./docs/trd.md) for the fuller endpoint inventory and operational notes.

The frontend footer calls `POST /api/subscribe`, and a database helper can upsert an email to `subscribers`, but no matching FastAPI route was found in the current tracked `backend/main.py`. Treat this as an integration discrepancy, not a confirmed working subscription feature.

## Authentication and state

- `AuthProvider` restores the Supabase session and listens for auth-state changes.
- Google OAuth redirects to `/dashboard`. Authentication may be unavailable if the frontend Supabase URL/anon key is not configured.
- The admin portal uses a separate shared bearer token entered in the admin UI; it is not the student Supabase session.
- Feed, filter, quiz-player, and modal state is client-side React state.
- Up to 50 student test attempts per user are kept in `localStorage`, keyed by Supabase user ID. A pending demo result may be attached after sign-in.
- Quiz submissions are evaluated server-side. Non-demo results are persisted for the leaderboard; demo submissions do not consume the daily IP allowance or enter the leaderboard.

## Database and schema caveat

Observed Supabase table names include `notices`, `subscribers`, `master_quizzes`, `master_questions`, `master_leaderboard`, and `quiz_ip_rate_limits`. A tracked migration additionally modifies `ai_usage_ledger` and `scraped_inbox`.

The checked-in source does not include the canonical `public.notices` DDL or a catalog export. The requested count of 28 columns, exact types/defaults/nullability, indexes, constraints, user-profile schema, and JSONB definitions (including `important_dates` and `application_fees`) therefore cannot be verified here. [docs/backend_schema.md](./docs/backend_schema.md) lists only observed field usage and explicitly marks unknowns rather than inferring a database contract.

## Hosting and configuration

- Frontend: Vercel-style `frontend/vercel.json` rewrites `/api/*` to `https://bihar-fast-portal.onrender.com`, maps `/post/:slug` to the SEO function, and applies immutable one-year caching to `/assets/*`.
- Backend: source defaults and deployment URLs reference `https://bihar-fast-portal.onrender.com`; local FastAPI development is configured in project docs/requirements, not proven by a checked-in deployment manifest.
- Backend configuration uses Supabase URL/key, optional Upstash REST credentials, `ADMIN_API_TOKEN`, and optional Telegram credentials. The actual Supabase server key resolver accepts `SUPABASE_SECRET_KEY`, then `SUPABASE_SERVICE_ROLE_KEY`, then `SUPABASE_KEY`.
- Frontend auth uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; API requests use `VITE_API_BASE_URL` where the source supports it.
- A GitHub Actions workflow pings the backend keep-alive URL on a schedule. This is not a capacity guarantee.

Never commit real credentials. Configure secrets through the relevant hosting environment.

## Source-grounded limitations and follow-up

- No full notices/quiz-table schema migrations or Supabase RLS policy definitions are checked in. Verify RLS and exact schema against the Supabase project before operational changes.
- No persisted profile or quiz-attempt-history table access was found; the student history view uses local storage, while leaderboard entries are server-backed.
- The `is_official_https_url` helper exists in backend database utilities, but no call from the notice creation/update handlers was found. Do not interpret the helper as enforced validation.
- The create handler normalizes its category to the four supported values. The update handler's current category normalization handles results/admit cards and otherwise maps to jobs; confirm/fix that behavior before relying on editing a scheme category.
- SEO crawler HTML is implemented for post routes; analytics instrumentation for CTR, search position, DAU, and retention was not established by this scan.

## Documentation index

- [Product requirements](./docs/prd.md)
- [Technical requirements and architecture](./docs/trd.md)
- [Application and user flows](./docs/app_flow.md)
- [UI/UX design brief](./docs/ui_ux_design_brief.md)
- [Database/schema reference](./docs/backend_schema.md)
- [Implementation roadmap](./docs/implementation_plan.md)
