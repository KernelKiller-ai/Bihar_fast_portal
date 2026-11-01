# BiharFast: Complete Technical Blueprint, File Inventory & AdSense Audit

**Audit snapshot:** 2026-11-01

**Audit scope:** Current working tree, including pre-existing local edits. No application source was changed during this audit.
**Evidence basis:** Repository source/configuration, a successful production frontend build, generated static HTML, focused Node tests, and local XML parsing. This is not a live production, Search Console, Lighthouse, or AdSense account inspection.

## 1. Executive Summary & Tech Stack Overview

BiharFast is a React single-page public-information portal for Bihar job notices, examination results/admit cards, public-service guides, practice quizzes, and student tools. Its actual implementation is a **Vite-built React frontend plus a Python FastAPI backend**, with Supabase for PostgreSQL, Auth, and Storage; Upstash Redis for backend caching/rate limits; and a small Vercel Node function for post-page metadata.

| Layer | Repository evidence | What it does |
|---|---|---|
| Frontend | React 19, React DOM, React Router 7, Vite 8, Tailwind CSS 4, Lucide React | Client-side route rendering, static build, app UI and interactive tools |
| Static SEO | `frontend/scripts/prerender.js`, `frontend/src/utils/seoConfig.js` | Generates 39 route HTML files after Vite builds; manually inserts root/legal text and metadata, not a React server render |
| Frontend hosting | `frontend/vercel.json` | Vercel headers, `www` redirect, post SEO rewrite, backend API rewrite, SPA fallback |
| SEO function | `frontend/api/post-seo.js` | Fetches a post from the backend and writes route-specific metadata into an HTML shell |
| Backend | FastAPI / Uvicorn, Python | Notice CRUD, public feeds, sitemap, subscription, quiz APIs and AI-assisted extraction |
| Database/Auth/Storage | Supabase Python and JavaScript clients | PostgreSQL tables, Google OAuth sessions, `profiles` role checks, banner settings and post image storage |
| Cache/rate limiting | Upstash Redis REST client | Feed, post and sitemap caching; distributed rate limiting when configured; process-local fallback |
| AI integration | Google GenAI SDK and PyPDF | Optional extraction of notification fields from uploaded PDFs or supplied text |
| Other integrations | Web3Forms, Google Tag Manager/Analytics, AdSense, OneSignal, Telegram | Contact submission, analytics, ads, push notifications, and publication alerts |
| PWA | `vite-plugin-pwa`, Workbox, web manifest, service worker | Installability, precaching, offline/cache fallback |

### Deployment topology inferred from source

```text
Browser
  ├─ Static React bundle / prerendered HTML -> Vercel
  ├─ /post/:slug -> Vercel Node function -> Render FastAPI /api/posts/:slug
  ├─ Browser API calls -> Render FastAPI (default hard-coded backend URL)
  ├─ Direct client Supabase access -> Supabase Auth/Postgres/Storage
  └─ GTM, GA4, AdSense, OneSignal, Web3Forms -> third parties

GitHub Actions scheduled request -> Render /api/notices
FastAPI -> Upstash Redis + Supabase + Google GenAI + Telegram
```

The repository supports the Vercel + Render + Supabase design, but only Vercel routing/build configuration is present. There is **no `render.yaml`, Cloudflare configuration, Cloudflare cache rule, Terraform, or production hosting proof** checked in. `README.md` advertises Cloudflare and performance/cache figures, but those claims cannot be validated from repository evidence. The Render URL is present in frontend defaults and the keep-alive workflow; actual Render service plan, cold-start measurements, and runtime environment are unknown.

### Build and runtime model

- The normal frontend build is `Set-Location frontend; npm run build`, which runs `vite build` followed by `node scripts/prerender.js`.
- The React app starts with `createRoot(...).render(...)`, not `hydrateRoot`. The prerendered HTML is therefore **not React-hydrated HTML**: it is a separate, manually generated initial document that React later replaces.
- React routes and most data are client-rendered. The homepage, hubs, category listings, tools, quiz, and legal pages can render richer React output only after JavaScript executes.
- The production build completed successfully: Vite transformed 2,134 modules; output included 127.72 KB CSS (18.54 KB gzip), 120.25 KB main app chunk (29.31 KB gzip), 284.38 KB React vendor chunk (90.81 KB gzip), 84.05 KB PostDetail chunk (23.43 KB gzip), 68.87 KB Admin chunk (15.84 KB gzip), and a 45-entry / 1,246.61 KiB Workbox precache.
- Page components are mostly lazy-loaded, but the root route imports several shared UI components and many Lucide named icons eagerly. Build output shows code splitting is working; no separate `vendor-icons` chunk appeared in the build report.
- `frontend/package.json` owns the actual app scripts/dependencies. Root `package.json` and root lockfile are not a monorepo build definition; the root manifest only lists `prop-types` and has no build/test/lint scripts.

## 2. Comprehensive File Inventory & Role Mapping

The project-controlled application inventory below covers the 141 tracked files plus the current untracked/deleted source and migration changes. Third-party `node_modules`, `.git`, generated `frontend/dist`, local `.vs` editor indexes, and `.playwright-mcp` browser snapshots/logs are workspace artifacts rather than application modules. `backend/.env` exists locally but was deliberately not read; secret values are not included here.

### Directory map

| Directory | Functional purpose | Main dependencies / consumers | Current status |
|---|---|---|---|
| `.github/workflows/` | Scheduled Render keep-alive workflow | Render `/api/notices` | Present; schedule alone does not establish service uptime |
| `backend/` | FastAPI application, Supabase adapters, quiz APIs, rate limits, tests | Render, Supabase, Upstash, Google GenAI | Active backend source |
| `backend/backups/` | Reserved backup directory | None found | Empty/no tracked application files observed |
| `backend/services/` | AI notification extraction service | FastAPI admin extraction endpoint | Active optional service |
| `docs/` | Product, design, schema, SEO, quiz and implementation documentation | Maintainers | Useful reference; distinguish current behavior from planned work |
| `frontend/` | Vite/React application, Vercel configuration, serverless API function | Browser, Vercel, backend | Active frontend |
| `frontend/api/` | Vercel Node function for post metadata | Render post API, Vercel | Active route integration |
| `frontend/public/` | Static crawler files, PWA assets, logos and APK | Browser, crawlers, Play Store/TWA association | Publicly served assets |
| `frontend/public/.well-known/` | Android app-site association file | Android Digital Asset Links | One JSON asset |
| `frontend/scripts/` | Post-build prerender and SEO test scripts | Vite build / Node | Active but prerender implementation is intentionally limited |
| `frontend/src/` | React app, pages, components, data, API and utilities | Browser runtime | Main application source |
| `frontend/src/api/` | Browser API/Supabase clients | Vite environment | Pages and shared components |
| `frontend/src/assets/` | Bundled assets | Vite asset pipeline | Current source files have no imports found |
| `frontend/src/components/` | Shared UI and functional components | React, Lucide, APIs | App shell and page components |
| `frontend/src/components/layouts/` | Notice category layouts | PostDetail | Dynamic notice route |
| `frontend/src/context/` | Auth context and hook | Supabase Auth | Provider and pages |
| `frontend/src/data/` | Legal, portal and district static data | App/page source | Static content only |
| `frontend/src/pages/` | Route page implementations | React Router and data/API modules | Public, admin and student routes |
| `frontend/src/utils/` | Slugs, SEO, sanitization and student persistence | Browser DOM/localStorage | Pages and components |
| `frontend/stitch-reference/` | Design reference files | Designers/developers | Reference only; not part of route runtime |
| `frontend/tests/` | Prerender regression tests | Node test runner | One tested expectation is stale/failing |
| `.playwright-mcp/` | Browser snapshots and console logs | Local/browser QA runs | Diagnostics only; not runtime |
| `.vs/`, `.vscode/` | Local IDE state/settings | Visual Studio / VS Code | Not application runtime |
| `supabase/` | Database migration source | Supabase PostgreSQL | Partial DB change history |
| `supabase/migrations/` | SQL migrations for concurrency/deduplication and banner settings/RLS | Supabase PostgreSQL | Only partial schema is represented |

### Root, automation, backend and documentation files

| File Path | Functional Purpose | Upstream Dependencies | Downstream Consumers | Current Status / Health |
|---|---|---|---|---|
| `.gitignore` | Excludes environment files, dependencies, build output and local files | Git | Local worktree hygiene | Prevents common secret/build files from being tracked; review exceptions before publishing |
| `package.json` | Root Node manifest | npm | Root command execution | No scripts; not the frontend package |
| `package-lock.json` | Root dependency lock | Root `package.json` | Root npm install | Minimal lock unrelated to the frontend's complete dependency graph |
| `README.md` | Project overview, claims, setup and admin environment notes | Repository | Contributors/users | Modified in the current worktree; several performance/CDN statements are not independently substantiated here |
| `document.md` | Operational snapshot, architecture and route/API overview | Current code and docs | Maintainers/NotebookLM | Reference document; check all statements against current implementation |
| `.github/workflows/keep-alive.yml` | Calls Render every 14 minutes on schedule or manually | GitHub Actions, `curl` | Render `/api/notices` | Helps keep a service warm if workflow and endpoint remain healthy; does not measure cold start |
| `backend/.gitignore` | Excludes backend environment, virtualenv and Python bytecode | Git | Backend developer worktree | Appropriate local exclusions |
| `backend/main.py` | FastAPI app, CORS/GZip, admin post APIs, public feed, caching, sitemap and subscription routes | `database.py`, `admin_auth.py`, `quiz_router.py`, Redis, Google GenAI | Vercel/browser clients, backend deployment | Main API; public list/detail caches and admin dependencies are present |
| `backend/admin_auth.py` | Supabase JWT verification, configured-email allowlist and `profiles.role` gate | Supabase Auth/DB, rate limiter, environment | Protected post and quiz admin APIs | Fails closed for missing dynamic auth config; configured legacy static token remains a bypass path |
| `backend/database.py` | Cached Supabase clients, notice/quiz/subscriber DB operations and URL helpers | Supabase Python client, environment | `main.py`, `quiz_router.py` | Central DB adapter; service client can fall back to `SUPABASE_KEY`, whose privilege level must be configured correctly |
| `backend/quiz_router.py` | Quiz read/submit, grading, leaderboard and protected quiz-admin endpoints | Supabase, `admin_auth.py`, `rate_limiter.py` | Student/admin quiz UI | Correct-answer columns are read through a service client; public question select omits answer keys |
| `backend/rate_limiter.py` | Upstash and process-local request throttling, client-IP selection | Upstash, FastAPI request | API route dependencies | Redis failure falls back locally; multi-worker limits then are not globally consistent |
| `backend/requirements.txt` | Pinned Python runtime dependencies | pip/virtual environment | FastAPI deployment and tests | Includes FastAPI, Supabase, Upstash, Google GenAI, PyPDF, `bleach`, `httpx`, and support libraries |
| `backend/services/__init__.py` | Marks backend services as a Python package | Python import system | AI extraction module | Package initializer |
| `backend/services/ai_extractor.py` | Extracts structured notice fields from text/PDF with Google GenAI | Google GenAI API key, PyPDF, Pydantic | Admin AI extract endpoint | Optional; requires server-side credentials and provider availability |
| `backend/test_admin_post_categories.py` | Tests accepted/normalized notice categories | Backend API/database test fixtures | CI/local test runner | Focused regression coverage |
| `backend/test_notice_url_validation.py` | Tests official/safe URL validation | `database.py` and backend helpers | CI/local test runner | Focused validation coverage |
| `backend/test_sitemap_validation.py` | Checks sitemap XML/route completeness and URL encoding | Static sitemap, route declarations | CI/local test runner | Source-based test; not run in this audit |
| `backend/test_slug_parity.py` | Checks backend/frontend slug agreement | Backend slug logic and frontend helper | CI/local test runner | Focused regression coverage |
| `backend/test_static_seo_prerender.py` | Checks static SEO/prerender properties | Frontend generated output/config | CI/local test runner | Regression coverage; not run in this audit |
| `backend/test_subscribe_api.py` | Checks subscription endpoint behavior | FastAPI app and DB mocks | CI/local test runner | Focused endpoint coverage |
| `backend/verification_30_urls_result.json` | Stored URL audit output | Verification scripts | Maintainers | Snapshot only; not a live status source |
| `backend/verify_30_urls_deep.py` | Deeply checks selected public URLs | Network/browser/test dependencies | Maintainers | Operational test utility; not part of request serving |
| `backend/verify_30_urls_full.py` | Checks a larger URL set | Network/browser/test dependencies | Maintainers | Operational test utility; not part of request serving |
| `docs/adsense_tech_audit.md` | Prior technical SEO/AdSense findings and proposals | Frontend source/build | Maintainers | Useful history; compare dates and findings with this audit |
| `docs/app_flow.md` | Visitor, quiz and admin user journeys | Frontend/backend | Product/engineering | Current and planned flows are labeled separately |
| `docs/backend_schema.md` | DB tables/fields observed in application code and migration notes | Supabase code/migrations | Engineering/DB planning | Schema reference, not a complete database dump |
| `docs/implementation_plan.md` | Roadmap including planned editorial/backend migration work | Product/engineering | Contributors | Contains future-state proposals; not evidence of deployed implementation |
| `docs/post_seo_audit.md` | Prior analysis of dynamic post HTML/metadata behavior | Vercel function and React post route | Maintainers | Relevant prior audit; revalidate after source edits |
| `docs/prd.md` | Product scope, stories and feature status | Product decisions | Product/engineering | Separates implemented and planned capabilities |
| `docs/quiz_audit.md` | Quiz flow, data, privacy and recommendations | Quiz UI/API | Maintainers | Detailed subsystem context |
| `docs/trd.md` | Technical requirements, API contracts and future architecture | Product/engineering | Contributors | Includes target architecture beyond current code |
| `docs/ui_ux_design_brief.md` | UI principles, tokens and QA guidance | Frontend design | Design/engineering | Reference; some design suggestions remain planned |

### Frontend configuration, serverless function, tests and static files

| File Path | Functional Purpose | Upstream Dependencies | Downstream Consumers | Current Status / Health |
|---|---|---|---|---|
| `frontend/.env.example` | Frontend environment-variable template | Vite | Local/deployment frontend | Includes `VITE_API_BASE_URL`, Supabase URL/key, and admin email |
| `frontend/.gitignore` | Frontend-specific exclusions | Git | Frontend worktree | Excludes environment/build output |
| `frontend/README.md` | Stock Vite starter guidance | Vite template | Contributors | Generic starter text; does not document BiharFast-specific architecture |
| `frontend/package.json` | Frontend scripts and runtime/build dependencies | npm | Vite build, lint, test scripts | Actual frontend manifest; `build`, `lint`, `dev`, `preview` scripts |
| `frontend/package-lock.json` | Frontend dependency lock | `frontend/package.json` | npm install/CI | Dependency graph for the actual app |
| `frontend/eslint.config.js` | ESLint rules for JS/JSX and React hooks | ESLint plugins | `npm run lint` | Lint passed in this audit |
| `frontend/vite.config.js` | Vite, Tailwind 4, PWA, asset chunks and Workbox options | Vite plugins | Build/dev server | Build works; navigations to API/XML/assets are denied to fallback; post routes are not explicitly denied |
| `frontend/vercel.json` | Cache headers, www redirect, route rewrites | Vercel | Static routes, `/post/:slug`, `/api/*` | Frontend routing config exists; no Render/Cloudflare config |
| `frontend/index.html` | Base document, GTM, root SEO, AdSense, OneSignal, GA4 and app boot | Browser / third parties | Every route's HTML shell | Root contains full default metadata; third-party scripts are deferred until after load/idle |
| `frontend/api/post-seo.js` | Vercel serverless post metadata endpoint | Render `/api/posts/:slug`, root `index.html` | Direct `/post/:slug` navigation | Metadata is server-generated, but article body is not; fallback errors may return indexable 200 |
| `frontend/api/post-seo.test.js` | Post metadata/fallback/404 HTML tests | Post SEO function | Node test runner | All seven tests passed in this audit |
| `frontend/scripts/prerender.js` | Writes generated HTML for each `STATIC_ROUTE_METADATA` entry | `index.html`, legal content, metadata map | Vercel static deployment | Produces static route files; non-home/non-legal bodies are title+description stubs, not rendered page components |
| `frontend/scripts/test-seo.js` | SEO smoke-test utility | Frontend test helpers/build output | Developer validation | Available; not run separately |
| `frontend/tests/prerender.test.js` | Tests static HTML length/content, aliases, metadata and JSON-LD | Built `frontend/dist` | Node test runner | 14/15 combined Node tests passed; one heading assertion is out of sync with current copy |
| `frontend/public/.well-known/assetlinks.json` | Android TWA Digital Asset Links association | Package name/signing fingerprint | Android app/browser | Present; production association should be verified against deployed signing identity |
| `frontend/public/OneSignalSDKWorker.js` | OneSignal service-worker import | OneSignal CDN | Push notification service | Thin loader |
| `frontend/public/ads.txt` | AdSense seller authorization | AdSense publisher account | AdSense/crawlers | Present; publisher ID matches the script and account meta tag |
| `frontend/public/biharfast.apk` | Android app package | Android build pipeline | App download | 2,949,693 bytes; not an image optimization concern, but validate version/signature/update process |
| `frontend/public/favicon.svg` | Browser favicon | Static hosting | Browser tabs | 9,522 bytes |
| `frontend/public/googlec22add85c1dba679.html` | Search Console file verification | Google Search Console | Search crawler | Present |
| `frontend/public/icons.svg` | SVG icon artwork/sprite | Static hosting | UI/browser | 5,031 bytes |
| `frontend/public/llms.txt` | Machine-readable site overview and links | Static hosting | AI/search clients | Present; static summary may drift from routes |
| `frontend/public/logo-192.png` | 192 px PWA/icon asset | Static hosting | Manifest, UI | 37,119 bytes |
| `frontend/public/logo-192.webp` | Compressed logo variant | Static hosting | Homepage preload/logo | 13,802 bytes; used for homepage hero |
| `frontend/public/logo-512.png` | Large PWA/social logo | Static hosting | Manifest, OG/Twitter image | 198,420 bytes |
| `frontend/public/logo.png` | General logo asset | Static hosting | Legacy references/build | 30,539 bytes |
| `frontend/public/robots.txt` | Allows crawling and declares both sitemap entry points | Static hosting | Search crawlers | Valid-looking directives; points to dynamic API sitemap |
| `frontend/public/site.webmanifest` | PWA identity, icons and shortcuts | Browser | Install prompt | Present; duplicates manifest settings in Vite config and can drift |
| `frontend/public/sitemap.xml` | Sitemap index | Static hosting | Search crawlers | XML parsed successfully; contains two sitemap locations |
| `frontend/public/sitemap-static.xml` | 30 static canonical URLs | Static hosting | Search crawlers | XML parsed successfully; 30 `<loc>` values |
| `frontend/public/sw.js` | Source service worker implementation | Browser Cache API | Offline navigation/resource behavior | Source is present; Vite PWA also generates `dist/sw.js`, so confirm the deployed worker is the generated version |
| `frontend/src/App.css` | App-specific styles | Vite CSS pipeline | React app | Active style source |
| `frontend/src/index.css` | Global/Tailwind 4 styling and tokens | Tailwind Vite plugin | All pages | Active global stylesheet |
| `frontend/src/main.jsx` | Creates React root, providers and browser router | React, AuthContext, App | Browser entry | Uses `createRoot`, confirming prerender HTML is replaced rather than hydrated |
| `frontend/src/assets/hero.png` | Dormant hero artwork | Vite asset pipeline | No source imports found | 13,057 bytes; likely not emitted in the production bundle |
| `frontend/src/assets/react.svg` | Vite starter asset | Vite template | No source imports found | 4,126 bytes; likely not emitted in the production bundle |
| `frontend/src/assets/vite.svg` | Vite starter asset | Vite template | No source imports found | 8,709 bytes; likely not emitted in the production bundle |

### Frontend API, context, data and reusable components

| File Path | Functional Purpose | Upstream Dependencies | Downstream Consumers | Current Status / Health |
|---|---|---|---|---|
| `frontend/src/api/config.js` | Central API base URL configuration | `VITE_API_BASE_URL`, Render backend fallback | App, Footer, admin, post, and quiz API callers | Trims configured values, removes trailing slashes, and defaults to the production Render endpoint |
| `frontend/src/api/supabase.js` | Creates browser Supabase client from Vite env | `@supabase/supabase-js` | Auth, banner and profile/storage components | Gracefully exposes unconfigured state; anon key is public by design and depends on RLS |
| `frontend/src/context/AuthContext.jsx` | Restores Supabase session and subscribes to auth changes | Supabase client, context module | Admin login and components | Modified in worktree; no global role decision, correctly leaving server-side role checks necessary |
| `frontend/src/context/authContext.js` | Defines `AuthContext` and `useAuth` hook | React | Auth provider and page consumers | Lowercase module paired with `AuthContext.jsx`; valid on case-sensitive filesystems |
| `frontend/src/data/districtJobsData.js` | District names and initial district recruitment records | Static JS | `DistrictRecruitment` | Hard-coded sample/current-looking announcements and dates need human verification/freshness checks |
| `frontend/src/data/legalPagesContent.js` | Shared rich text/legal content for about/contact/privacy/terms/disclaimer | SEO config | Legal React pages and prerenderer | Good single content source; tests expect one older heading string |
| `frontend/src/data/portalData.js` | Permanent citizen-service notice constants | Static JS | Search/import consumers | Check current imports before treating as feed fallback; homepage API failure path sets notices to empty |
| `frontend/src/components/AdminBannerControl.jsx` | Admin editing UI for global banner | Supabase `site_settings` | Admin page | Modified in worktree; direct browser update relies on the final role-check RLS migration |
| `frontend/src/components/AdminQuizManager.jsx` | Create/manage quizzes, questions and status | Backend quiz admin APIs, Supabase session token | Admin page | Backend API uses `get_current_admin`; failures are UI-visible |
| `frontend/src/components/AgeCalculator.jsx` | Client-side age/cutoff calculator | Browser inputs/date logic | Homepage and UsefulTools page | Interactive client-only utility |
| `frontend/src/components/Class10QuizPlayer.jsx` | Loads and submits quiz, timers, answer review | Backend quiz API, local progress helpers | MockTest page | Modified in worktree; API supports demo/anonymous mode so practice need not require student account |
| `frontend/src/components/DownloadAppBanner.jsx` | App download prompt/banner | Static APK route | Shared shell | Shared UI; may contribute repeated ad/UI weight |
| `frontend/src/components/Footer.jsx` | Site navigation, trust links and newsletter form | Backend `/api/subscribe`, static links | Shared shell | Uses centralized API configuration; network failures display an inline friendly error |
| `frontend/src/components/ImageResizer.jsx` | Browser canvas image resize/compression tool | Browser canvas/File APIs | Homepage and UsefulTools page | Client-side processing; image files need not leave browser |
| `frontend/src/components/JobCard.jsx` | Notice preview card | Notice props, slug helper | Listing/home UI | Lazy image loading is present |
| `frontend/src/components/Leaderboard.jsx` | Loads and displays leaderboard | Direct Supabase `master_leaderboard` query | Quiz UI | Public query relies on Supabase RLS; select only displayed public fields |
| `frontend/src/components/Logo.jsx` | Shared logo view | Static image | Navigation/shared UI | Small leaf component |
| `frontend/src/components/Navbar.jsx` | Global nav and responsive menu | React Router, Lucide | Shared shell | Modified in worktree; main navigation feeds discoverability |
| `frontend/src/components/NotificationCard.jsx` | Notice rendering and categories | Notice props, links | Home/archive listing | Data-driven; generated strings are not a substitute for editorial content |
| `frontend/src/components/RouteSEO.jsx` | Applies central metadata on client route changes | `seoConfig.js`, `seo.js`, React Router | App shell | Client-side only; does not fix initial HTML on its own |
| `frontend/src/components/ScrollToTop.jsx` | Scrolls to top on route changes | React Router | App shell | Small utility |
| `frontend/src/components/TopBanner.jsx` | Reads live `site_settings` banner | Supabase public select | Shared shell | Async banner can appear after first paint and cause layout shift |
| `frontend/src/components/layouts/AdmitCardLayout.jsx` | Notice detail layout for admit cards | Post fields | PostDetail | Dynamic content layout |
| `frontend/src/components/layouts/JobLayout.jsx` | Notice detail layout for jobs | Post fields | PostDetail | Dynamic content layout |
| `frontend/src/components/layouts/PostBanner.jsx` | Notice image/header layout | Post image and notice props | PostDetail/layouts | Lazy image; verify reserved dimensions to limit CLS |
| `frontend/src/components/layouts/ResultLayout.jsx` | Notice detail layout for results | Post fields | PostDetail | Dynamic content layout |
| `frontend/src/components/LoginModal.jsx` | Previously tracked login modal | Auth flow | No current consumer found | Deleted in current working tree; legacy tracked path only |

### Frontend pages and SEO utilities

| File Path | Functional Purpose | Upstream Dependencies | Downstream Consumers | Current Status / Health |
|---|---|---|---|---|
| `frontend/src/pages/Admin.jsx` | Notice editor, author identity and admin tabs | Supabase session/profile/storage, FastAPI admin APIs | `/admin`, `/admin-portal` | Modified in worktree; waits for auth/profile before admin UI and backend rechecks credentials |
| `frontend/src/pages/AdminLogin.jsx` | Google OAuth entry point for admin | Supabase OAuth, `VITE_ADMIN_EMAIL` | `/admin-login` | New untracked page in current worktree; confirm OAuth redirect URL/provider in deployed Supabase |
| `frontend/src/pages/BsebInter.jsx` | Bihar Board Class 12 information hub | Static content, client schema metadata | `/bseb-inter-12th` | Substantive post-JS guide; prerendered initial output is only 57 words |
| `frontend/src/pages/BsebMatric.jsx` | Bihar Board Class 10 hub | Static content, client schema metadata | `/bseb-matric-10th` | Substantive post-JS guide; prerendered initial output is 51 words; contains visible ad-slot placeholder |
| `frontend/src/pages/CategoryPage.jsx` | Dynamic category listing and empty state | Shared notices, category config | `/category/:slug` | Empty category shows only brief copy/CTA; initial static HTML is 17–20 words |
| `frontend/src/pages/CuetUgAdmission.jsx` | CUET UG admission guide | Static content, client schema metadata | `/cuet-ug-admission` | Initial static output 47 words; visible ad-slot placeholder |
| `frontend/src/pages/DistrictRecruitment.jsx` | District-wise recruitment cards | `districtJobsData.js` | `/bihar-district-wise-recruitment` | Static records; freshness and accuracy are high-priority editorial risks |
| `frontend/src/pages/DownloadApp.jsx` | APK download and app details | Static APK/manifest assets | `/download` | Initial static output 50 words; confirm APK version/signing details |
| `frontend/src/pages/KushalYuvaProgram.jsx` | Kushal Yuva Program guide | Static content, client schema metadata | `/kyp-bihar` | Guide rendered by React; initial static output 67 words |
| `frontend/src/pages/MockTestPage.jsx` | Quiz selection and player routing | Backend quiz list, Class10QuizPlayer | `/mock-test*`, `/practice`, `/class-10-quiz` | Modified in worktree; API-driven question availability, initial output 58 words |
| `frontend/src/pages/NotFound.jsx` | Client-side 404 experience and noindex mutation | React Router | `*` | Sets noindex only after JavaScript; Vercel SPA fallback can still serve HTTP 200 |
| `frontend/src/pages/PostDetail.jsx` | Fetches full notice content and renders category-specific layout | Backend `/api/posts/:slug`, SEO/slug helpers | `/post/:slug` | Client adds dynamic metadata/schema after fetch; server function emits metadata but not article body |
| `frontend/src/pages/RtpsBihar.jsx` | RTPS certificate/services guide | Static content, client schema metadata | `/rtps-bihar` | Initial static output 65 words |
| `frontend/src/pages/SiteMapPage.jsx` | HTML archive/listing grouped by notice category | Shared `portalItems` | `/sitemap`, `/all-updates`, `/jobs`, `/admit-card`, `/results` | API-dependent; zero rows display minimal empty panels |
| `frontend/src/pages/StudentCreditCard.jsx` | Student Credit Card scheme guide | Static content, client schema metadata | `/student-credit-card` | Initial static output 79 words |
| `frontend/src/pages/StudentDashboard.jsx` | Local practice history, district and stats | `studentHistory.js` / localStorage | `/dashboard` | Modified in worktree; device-local data, no authenticated cloud student account |
| `frontend/src/pages/UdyamiYojana.jsx` | Udyami Yojana guide | Static content, client schema metadata | `/udyami-yojana` | Initial static output 68 words |
| `frontend/src/pages/UsefulToolsPage.jsx` | Dedicated calculator and image-resizer route | AgeCalculator, ImageResizer | `/useful-tools` | Interactive page; initial static output 60 words |
| `frontend/src/pages/about.jsx` | About page view from shared legal content | `legalPagesContent.js` | `/about`, `/about-us` | Rich content; 437 prerendered words; factual registration/editorial claims merit evidence |
| `frontend/src/pages/contact.jsx` | Contact, grievance information and contact form | Shared legal data, Web3Forms | `/contact`, `/contact-us` | 484 prerendered words; browser bundle contains a public Web3Forms access key, not a server secret |
| `frontend/src/pages/disclaimer.jsx` | Independence/official-source disclaimer | Shared legal content | `/disclaimer` | 421 prerendered words; useful trust signal |
| `frontend/src/pages/privacyPolicy.jsx` | Privacy/cookie/ads disclosure | Shared legal content | `/privacy-policy`, `/privacy` | 953 prerendered words; includes AdSense/DART wording; no consent-management UI found |
| `frontend/src/pages/terms.jsx` | Terms and conditions | Shared legal content | `/terms` and aliases | 586 prerendered words |
| `frontend/src/pages/upcoming.jsx` | Static upcoming recruitment/exam page | Static content | `/upcoming-2026` | Initial static output 54 words; time-bound page needs scheduled review |
| `frontend/src/utils/sanitizeHtml.js` | Sanitizes supported HTML before rendering | DOMPurify/DOM APIs | Notice display | Client-side sanitization; server also has its own sanitizer |
| `frontend/src/utils/seo.js` | Upserts title/meta/canonical/social tags/JSON-LD in DOM | Browser DOM | RouteSEO and dynamic pages | Client-side only; initial crawl response requires prerender/server metadata |
| `frontend/src/utils/seoConfig.js` | Single static route metadata/canonical map | Route definitions, legal pages, prerender | RouteSEO/prerender/tests | 39 route entries; static sitemap contains the 30 canonical entries, excluding aliases |
| `frontend/src/utils/slug.js` | Frontend slug generation | Notice title/department | Cards, routes and tests | Shared helper; slug tests passed |
| `frontend/src/utils/slug.test.js` | Slug parity/Unicode regression checks | `slug.js` | Node test runner | Seven tests passed |
| `frontend/src/utils/studentHistory.js` | Persists attempts, progress and district to localStorage | Browser storage | Quiz player/dashboard | Modified in worktree; caps history at 50; storage failures have fallback behavior |
| `frontend/stitch-reference/DESIGN.md` | Design notes | Figma/Stitch export | Designers | Reference, not runtime |
| `frontend/stitch-reference/code.html` | Exported design sample | Design reference | Designers | Reference, not runtime |
| `frontend/stitch-reference/screen.png` | Design screenshot | Design reference | Designers | Reference asset |
| `supabase/migrations/202609170001_phase2_concurrency.sql` | Adds daily quota uniqueness/RPC and deduplication hash | Existing `ai_usage_ledger`, `scraped_inbox` tables | AI ingestion backend | Requires pre-existing tables; not a full schema migration |
| `supabase/migrations/202610290001_site_settings_banner.sql` | Creates banner settings, trigger and initial RLS policies | Supabase PostgreSQL | TopBanner/AdminBannerControl | Its first policy permits any authenticated update; apply the next migration to tighten it |
| `supabase/migrations/202610290002_lock_site_settings_to_admin.sql` | Replaces banner update policy with `profiles.role=admin` check | `profiles` table | Supabase direct client | New untracked migration in worktree; ensure applied in every environment |

### Other current workspace files

The following tracked and untracked workspace files are QA/editor artifacts rather than runtime modules. Their contents were not needed to determine architecture and were not reproduced:

| File Path | Functional Purpose | Upstream Dependencies | Downstream Consumers | Current Status / Health |
|---|---|---|---|---|
| `.playwright-mcp/console-2026-10-10T18-21-30-658Z.log` | Historical browser console output | Playwright | QA investigation | Tracked diagnostic log |
| `.playwright-mcp/page-2026-10-03T16-08-28-327Z.yml` | Historical page snapshot | Playwright | QA investigation | Tracked diagnostic snapshot |
| `.playwright-mcp/console-2026-10-29T14-23-37-764Z.log` | Browser console output | Playwright | QA investigation | Untracked diagnostic log |
| `.playwright-mcp/console-2026-10-29T14-24-13-515Z.log` | Browser console output | Playwright | QA investigation | Untracked diagnostic log |
| `.playwright-mcp/console-2026-10-29T14-24-26-403Z.log` | Browser console output | Playwright | QA investigation | Untracked diagnostic log |
| `.playwright-mcp/page-2026-10-29T14-23-42-969Z.yml` | Browser page snapshot | Playwright | QA investigation | Untracked diagnostic snapshot |
| `.playwright-mcp/page-2026-10-29T14-24-14-420Z.yml` | Browser page snapshot | Playwright | QA investigation | Untracked diagnostic snapshot |
| `.playwright-mcp/page-2026-10-29T14-24-27-207Z.yml` | Browser page snapshot | Playwright | QA investigation | Untracked diagnostic snapshot |
| `.vs/ProjectSettings.json` | Visual Studio project state | Visual Studio | Local IDE | Machine-local metadata |
| `.vs/VSWorkspaceState.json` | Visual Studio workspace state | Visual Studio | Local IDE | Machine-local metadata |
| `.vs/bihar_fast.slnx/FileContentIndex/0b237e0f-87bc-4a92-8ba4-b4fdfd07d125.vsidx` | Visual Studio file-content index | Visual Studio | Local IDE | Generated binary index |
| `.vs/bihar_fast.slnx/v18/.wsuo` | Visual Studio user options | Visual Studio | Local IDE | Generated user state |
| `.vs/bihar_fast.slnx/v18/DocumentLayout.json` | Visual Studio open-document layout | Visual Studio | Local IDE | Machine-local metadata |
| `.vs/bihar_fast/CopilotIndices/18.9.1311.36310/SemanticSymbols.db` | Visual Studio/Copilot symbol index | Visual Studio | Local IDE | Generated database |
| `.vs/slnx.sqlite` | Visual Studio solution index | Visual Studio | Local IDE | Generated database |
| `.vscode/settings.json` | Workspace editor settings | VS Code | Local IDE | Local editor configuration |
| `backend/.env` | Local backend environment configuration | Backend deployment/local setup | Backend process | Exists locally; values deliberately not read or reproduced |
| `frontend/dist/` | Production build output created during this audit | Vite, prerender script, Workbox | Deployment/preview | Ignored generated output; 39 static route documents, not source |

Current source worktree includes edits to `README.md`, `backend/admin_auth.py`, `backend/quiz_router.py`, `frontend/.env.example`, `frontend/src/App.jsx`, `AdminBannerControl.jsx`, `Class10QuizPlayer.jsx`, `Navbar.jsx`, `AuthContext.jsx`, `Admin.jsx`, `MockTestPage.jsx`, `StudentDashboard.jsx`, and `studentHistory.js`; `LoginModal.jsx` is deleted, while `AdminLogin.jsx` and the final site-settings migration are untracked. Findings below describe these **current working-tree** versions.

No `LICENSE` file, `tailwind.config.js`, `render.yaml`, Cloudflare config, `supabase/config.toml`, or complete Supabase schema migration is present in the inspected project inventory. The README's MIT license badge points to a file not present in the inventory; verify/add the intended license file separately.

### Configuration and environment variables

| Variable | Consumer | Purpose / operational note |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Browser | Public Supabase endpoint/key; enforce all authorization through RLS/server checks |
| `VITE_ADMIN_EMAIL` | Admin UI | Hides/disables frontend admin login unless configured; not a security boundary by itself |
| `VITE_API_BASE_URL` | Frontend API call sites | Overrides the centralized API URL; defaults to `https://bihar-fast-portal.onrender.com` |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_KEY` | Backend | Supabase connection and privileged client; ensure the fallback key has intended privileges |
| `ADMIN_EMAIL`, `ADMIN_API_TOKEN` | Backend | Admin allowlist and legacy static bearer-token compatibility |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Backend / rate limiter | Distributed cache and rate limiting; separate Redis clients are initialized in two modules |
| `TRUST_PROXY_HEADERS` | Rate limiter | Opts into proxy-derived IP headers; set only when the trusted proxy path is controlled/configured |
| `INTERNAL_SYNC_SECRET` | Quiz backend | Salt/secret input for IP-hash behavior |
| `GEMINI_API_KEY`, `GOOGLE_API_KEY` | AI extractor | Provider key for server-side AI extraction |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID` / `TELEGRAM_CHAT_ID` | Backend | Optional publication alert integration |

Do not place backend secrets in `VITE_*` variables: Vite exposes those in browser bundles. No values from the local `.env` were inspected or copied into this document.

## 3. Route-by-Route Deep Dive

### Important measurement definition

The route word estimates below are **measured from the initial generated HTML inside `#root`**, after running the production build and prerender script. The script stripped tags and counted Unicode letter/number tokens. These counts do not include content rendered after React starts, do not predict Google's rendered-DOM result, and are not an AdSense minimum-word rule. Google does not publish a universal “250 words per page” approval threshold; the 250-word line is only a screening heuristic requested for this audit.

The prerenderer generated **39 route files** from metadata. Ten legal/about/contact route paths have 421–953 initial words. The remaining 29 generated paths are below 250, typically because the renderer inserts only `<h1>` plus metadata description. The React app uses `createRoot` and replaces that initial HTML after JavaScript loads.

### Public routes

| Route | Component / behavior | Data fetching, caching and initial content | AdSense readiness |
|---|---|---|---|
| `/` | Inline home page in `App.jsx` | Browser fetches `GET /api/notices`; backend selects up to 50 active, published `notices` fields and caches feed (Redis 300 s; response `max-age=60, s-maxage=300`). Fetch failure explicitly sets `portalItems=[]`. Initial HTML: **70 words**. | **Needs Text Enrichment** — dynamic feed/tools provide user value after JS, but the no-JS document is a short pitch and offers no static notice excerpts. |
| `/jobs` | `SiteMapPage` with `category="jobs"` | Reuses the same home feed; no page-specific query. Initial HTML: **51 words**. Empty feed shows “No active updates” in the React UI. | **Needs Text Enrichment** — listing content is API-dependent and absent from the prerender. |
| `/admit-card` | `SiteMapPage` with `category="admit_card"` | Reuses home feed filtered client-side. Initial HTML: **54 words**. | **Needs Text Enrichment** — rendered page needs a useful editorial intro and static listing/empty-state strategy. |
| `/results` | `SiteMapPage` with `category="results"` | Reuses home feed filtered client-side. Initial HTML: **55 words**. | **Needs Text Enrichment**. |
| `/sitemap` | `SiteMapPage` archive | Reuses home feed, then groups jobs/admit cards/results/services. Initial HTML: **50 words**; empty groups are brief. | **Needs Text Enrichment** — sitemap-like directory is not the XML sitemap and depends on live data. |
| `/all-updates` | Same archive as `/sitemap` | Same feed; canonical points to `/sitemap`. Initial HTML: **50 words**. | **Needs Text Enrichment**; alias is correctly kept out of the XML canonical inventory. |
| `/category/:slug` | `CategoryPage` with a predefined category dictionary and keyword matching | Reuses notices fetched by App. Filters title/department/category/type/descriptions/tags/keywords on the client; no DB category query. Nine sitemap categories each initially render only **17–20 words**. Empty state has short copy and WhatsApp CTA. | **High Risk** — multiple pages can be empty, text is thin, and initial static output contains no notices. Avoid treating empty programmatic categories as content pages. |
| `/post/:slug` | `PostDetail`; Vercel rewrite to `frontend/api/post-seo.js`, then React detail page | Function fetches `/api/posts/{slug}` from Render (6 s timeout), adds title/description/canonical/OG/Twitter tags, but preserves the homepage's `#root` body; React then fetches the post and renders content/NewsArticle JSON-LD. Backend detail cache: Redis 1,800 s and response `max-age=300, s-maxage=1800`. | **High Risk until article body is in initial HTML** — metadata alone does not make the article visible to a non-JS crawler. Backend timeout/error can yield a 200 shell with generic slug metadata. |
| `/useful-tools` | `UsefulToolsPage` with `AgeCalculator` and `ImageResizer` | Browser-only calculators/canvas tool; no data API. Initial HTML: **60 words**. | **Needs Text Enrichment** — utility itself has value, but initial HTML needs explanatory/eligibility/privacy instructions and example outputs. |
| `/bihar-district-wise-recruitment` | `DistrictRecruitment` | Uses `INITIAL_DISTRICT_JOBS` static data; 38 district labels but only a small initial set of district entries. Initial HTML: **58 words**. | **High Risk** — static recruitment claims/deadlines/“active” states need verified dates, source links, explicit update times and expiry handling. |
| `/bseb-matric-10th` | `BsebMatric` | Mostly static guide/link data; schema is injected client-side. Initial HTML: **51 words**. UI includes a literal visible `[ Clean In-Article Responsive Ad Slot - Google AdSense ]` placeholder. | **Needs Text Enrichment** — post-JS page is more substantial, but initial HTML is a stub and placeholder ad text should not be mistaken for an ad unit. |
| `/bseb-inter-12th` | `BsebInter` | Static guide/link data; client schema. Initial HTML: **57 words**. Includes visible ad-slot placeholder text. | **Needs Text Enrichment**. |
| `/cuet-ug-admission` | `CuetUgAdmission` | Static guide/link data; client schema. Initial HTML: **47 words**. Includes visible ad-slot placeholder text. | **Needs Text Enrichment**. |
| `/rtps-bihar` | `RtpsBihar` | Static guide and official-service links; client schema. Initial HTML: **65 words**. | **Needs Text Enrichment** — retain direct official links, add substantive steps, caveats, update date and sources to initial HTML. |
| `/udyami-yojana` | `UdyamiYojana` | Static guide; client schema. Initial HTML: **68 words**. | **Needs Text Enrichment** — time-sensitive scheme amounts/status require current official citations. |
| `/kyp-bihar` | `KushalYuvaProgram` | Static guide; client schema. Initial HTML: **67 words**. | **Needs Text Enrichment**. |
| `/student-credit-card` | `StudentCreditCard` | Static guide; client schema. Initial HTML: **79 words**. | **Needs Text Enrichment** — make eligibility, costs, repayment/terms and official source links prominent in generated HTML. |
| `/upcoming-2026` | `upcoming.jsx` | Static upcoming recruitment/exam claims. Initial HTML: **54 words**. | **High Risk** — inherently time-sensitive projections need clear “expected, not official” labels, primary sources, timestamps and expiration. |
| `/download` | `DownloadApp` | Static APK and app information. Initial HTML: **50 words**. | **Needs Text Enrichment** — disclose app version, permissions, source/signature, update date and support route. |
| `/mock-test`, `/mock-test/class-10`, `/mock-test/:id`, `/practice`, `/class-10-quiz` | `MockTestPage` and `Class10QuizPlayer` | Available quiz selection from FastAPI; question list from `master_quizzes`/`master_questions`. Public questions omit answer keys; submissions are graded server-side. UI supports demo/anonymous usage. Initial static pages: **58 words** for generated routes; parameterized `/mock-test/:id` and `/practice` use SPA fallback. | **Needs Text Enrichment** — interactive utility is valuable, but give crawlers a stable syllabus, sample question, rules, explanations and coverage summary. |
| `/about` | `About` | Shared authored legal/about content prerendered from `legalPagesContent.js`. Initial HTML: **437 words**. | **Ready (technical content baseline)** — clear independence and editorial-process statements; substantiate claims such as registration and manual verification. Not an approval guarantee. |
| `/about-us` | Same About page | Alias canonicalizes to `/about`. Initial HTML: **437 words**. | **Ready (canonical alias)** — avoid splitting signals; sitemap uses canonical route. |
| `/contact` | `Contact` | Static grievance/contact details, with browser POST to Web3Forms when submitted. Initial HTML: **484 words**. | **Ready (technical content baseline)** — verify form deliverability, privacy disclosures and public access-key abuse controls. |
| `/contact-us` | Same Contact page | Alias canonicalizes to `/contact`. Initial HTML: **484 words**. | **Ready (canonical alias)**. |
| `/disclaimer` | `Disclaimer` | Authored shared legal content. Initial HTML: **421 words**. | **Ready (technical content baseline)** — keep independent/non-government status clear and aligned with actual service. |
| `/privacy-policy` | `PrivacyPolicy` | Shared authored privacy and cookie content. Initial HTML: **953 words**; includes Google AdSense, third-party vendor, DART and opt-out disclosures. | **Ready (content present), consent gap to assess** — no consent-management UI was found. Implement a Google-certified CMP if required for served geographies/ads configuration; legal wording alone is not consent tooling. |
| `/privacy` | Same Privacy page | Alias canonicalizes to `/privacy-policy`. Initial HTML: **953 words**. | **Ready (canonical alias)**. |
| `/terms` | `Terms` | Authored shared terms content. Initial HTML: **586 words**. | **Ready (technical content baseline)** — review against real product/data practices. |
| `/terms-conditions`, `/terms-and-conditions` | Same Terms page | Both aliases canonicalize to `/terms`. Initial HTML: **586 words** each. | **Ready (canonical aliases)**. |
| `/` aliases and other metadata aliases | Canonicalized by `seoConfig.js` | Metadata map includes 39 routes; static sitemap contains 30 canonical locations. | Keep redirects/canonicals and sitemap membership aligned. |

### Internal/student routes

| Route | Component / access behavior | Data/persistence | Indexing/AdSense assessment |
|---|---|---|---|
| `/admin-login` | `AdminLogin`; Google OAuth through Supabase; requires configured frontend allowlist to start | Supabase session; server rechecks protected API calls | Internal access route; mark `noindex` in initial HTML and do not monetize |
| `/admin` | `Admin`; auth/profile check in component before showing editor | `profiles` query, server API with Supabase bearer, Storage bucket `post-images` | Client gate exists, but no server-rendered noindex. Protecting API is essential; mark route noindex |
| `/admin-portal` | Alias to Admin | Same as `/admin` | Same internal/noindex recommendation |
| `/dashboard` | `StudentDashboard` | Device-local `localStorage` history/district; history helper caps at 50 records | Not a private server account; noindex to avoid thin route indexing and avoid implying cloud identity |
| `/` and public quiz route | Student practice is available without an account in demo/anonymous mode; full authenticated submissions can be associated with verified user | Server-side question retrieval/grading; local attempt persistence | Friction-free practice is supported; leaderboard persistence depends on authenticated submission |
| `/tools/*` | **No `/tools/*` route is declared** | Calculator/image resizer are embedded in home and `/useful-tools` | Do not advertise nonexistent path structure |
| `*` (unknown URL) | `NotFound` component | Client-only | Sets `noindex` after JS, but Vercel SPA fallback likely returns the index HTML with HTTP 200; crawler may initially see root metadata |

### Data/API contracts at a glance

| Surface | Tables / requested fields | Caching / access |
|---|---|---|
| Home feed `GET /api/notices` and `/api/posts` | `notices`: `id, slug, title, department, category, total_posts, last_date, eligibility, fees, apply_url, pdf_url, created_at, status`; only `is_active=true`, `status=published`, accepted categories; newest 50 | Redis 300 s; HTTP `max-age=60, s-maxage=300`; rate limit 60/min |
| Post `GET /api/posts/{slug}` | `notices.select("*")`, then published/active filter unless admin option used | Redis 1,800 s; HTTP `max-age=300, s-maxage=1800`; 60/min |
| Dynamic sitemap `/api/sitemap-posts.xml` | `notices`: `slug, updated_at, created_at`, published and active | Redis 300 s; HTTP `max-age=60, s-maxage=60`; 30/min; no pagination is visible in adapter |
| Admin notice API | `notices.select("*")`; writes/upserts include content, meta fields, FAQ, apply/selection steps, author/status | Supabase JWT + configured email + `profiles.role=admin`; 30/min |
| Banner | `site_settings`: `banner_active, banner_text, banner_link, banner_bg, updated_at`; row `id=top_banner` | Browser anon/auth client; read policy public; update policy role-gated only after migration `202610290002...` |
| Quiz list | `master_quizzes`: `id,title,subject,slot,quiz_date,total_questions,duration_minutes` | Public active rows; rate-limited |
| Student quiz questions | `master_questions`: `id,question_text,option_a..option_d,order_index` | Answer/explanation fields are not selected in public question response |
| Quiz grading | Public question ids/text and privileged `master_answer_keys`: `question_id,correct_option,explanation` | Server grades; answer keys use service DB client; authenticated user id is verified rather than trusting client-supplied user id |
| Leaderboard | `master_leaderboard`: user/name/district/category/score/accuracy/time/date fields | Frontend direct Supabase read; RLS must constrain personal data |
| Subscription | `subscribers.email` | Upsert by normalized email; 5/min; no source evidence of CAPTCHA |
| Admin identity | `profiles.id, role, full_name` | Supabase Auth user verification plus configured email and exact admin role; banner RLS checks role |

**Schema limitation:** The migrations in this repository do not create the primary `notices`, `profiles`, quiz, `subscribers`, answer-key, or storage schemas. They assume those resources already exist. Use `docs/backend_schema.md` as code-observed field documentation, not as a complete authoritative migration set.

## 4. Google AdSense & Search Crawler Audit

### What is already in place

- `index.html` has the publisher ownership meta tag and loads the AdSense script with publisher ID `ca-pub-2133187047291443`; `ads.txt` lists the same publisher as a direct seller.
- Search Console verification meta and the matching static verification file exist.
- Static `robots.txt` allows crawling and lists `sitemap.xml` and `/api/sitemap-posts.xml`.
- The FastAPI backend separately exposes `/robots.txt` with `Disallow: /`. The frontend static robots file is the intended public-site file; verify that the Render hostname is not independently presented as a crawlable canonical site.
- `sitemap.xml` is a valid sitemap index with static and dynamic sitemap children. Both checked-in sitemap XML documents parsed locally; `sitemap-static.xml` has 30 locations.
- Static route metadata covers 39 paths, including aliases. Canonicals for alias pages point at their primary route; XML sitemap stays on the 30 primary URLs.
- The authored about/contact/disclaimer/privacy/terms pages are materially more complete in the initial document than the transactional hubs.
- Several service/exam pages inject Schema.org JSON-LD after JavaScript runs; post detail injects a minimal `NewsArticle` schema in the client.
- The site identifies itself as independent rather than a government site in public-facing documentation and legal content.

### High-impact low-value/crawler findings

1. **Prerendered application content is mostly a metadata stub.** `prerender.js` uses a handwritten renderer: legal routes get their shared authored legal copy, `/` gets one heading plus a short description, and almost every other route gets only `<h1>` plus metadata description. This is the reason 29 of 39 generated route bodies are under the requested 250-word heuristic. The actual component content is not rendered into the HTML by the build.
2. **The homepage has only 70 initial root words.** Its live feed is fetched in `useEffect`, so no initial notice summaries exist in static HTML. On API error the code explicitly shows an empty feed; it does not use a static notice fallback.
3. **Category pages are especially vulnerable to empty-content outcomes.** Category filtering runs client-side against the feed; absent/mismatched keyword terms or unavailable feed leave a short empty state. A category's SEO title/description do not prove that the page has any active inventory.
4. **Post server HTML has metadata but not post text.** The Vercel function fetches the post for metadata and then fetches the SPA shell; it never replaces the shell body with the post title/content. React fetches the full content later. This leaves crawlers without the unique article body unless they successfully execute/render the client app.
5. **Unavailable post API can produce an indexable thin 200.** The function distinguishes an actual backend 404 (returns 404/noindex), but timeout, upstream 5xx, or invalid payload falls back to generic slug metadata and may return 200 if it can fetch the shell. That can expose error shells as indexable pages.
6. **SPA fallback creates weak unknown-route semantics.** `NotFound` changes robots to noindex only in a React effect; the Vercel rewrite serves the SPA shell for unmatched routes. Validate production status codes, initial robots directives and canonical behavior for unknown paths.
7. **Initial social metadata is not fully route-specific.** The static prerenderer changes title, description, canonical and selected Open Graph fields, but does not update Twitter tags or route-specific schema. The base document's WebSite schema and homepage Twitter fields can therefore appear on other static pages before JS.
8. **Internal routes are missing from the static SEO policy map.** `/admin`, `/admin-login`, `/dashboard`, `/practice`, and unknown parameterized routes have no static route metadata/noindex entry. Admin APIs are protected, but initial shell metadata can still look indexable.
9. **Visible ad-slot placeholder copy is present.** BSEB Matric, BSEB Inter and CUET pages render `[ Clean In-Article Responsive Ad Slot - Google AdSense ]` as UI text. These are not ad units and should not be left as visible placeholders on public pages.
10. **The archive is data-dependent and can be near-empty.** `/jobs`, `/admit-card`, `/results` and `/sitemap` are all views over the same newest-50 feed. They have no independent editorial content or pagination in the frontend.
11. **Content freshness is an editorial risk.** District jobs and scheme/exam hubs include static dates, “active/upcoming” claims and official-link assertions. They need clear “last verified” dates, automated expiry/review, and human checks against primary notices. README claims about 100% verified links and CLS 0 cannot be proven from source alone.

### Metadata, JSON-LD and policy readiness details

- Base HTML includes `<title>`, description, keywords, author, robots, canonical, Open Graph, Twitter Cards, WebSite JSON-LD, theme/PWA tags, and `lang="hi"`.
- Client `RouteSEO` updates static metadata after React boot. `PostDetail` changes title/description/canonical/Open Graph/Twitter and injects `NewsArticle`; several static guide pages inject JSON-LD similarly. These client effects are too late to substitute for complete initial route HTML.
- The `NewsArticle` payload is minimal (headline, description, URL and publisher). Improve it with only verifiable fields (author, dates, image, main entity) and ensure the visible article supports the structured data.
- The privacy text includes AdSense/cookie/vendor disclosures and opt-out links. A textual disclosure is not a consent banner/CMP; no consent-management integration was found. Confirm the publisher's geographic targeting and current Google consent requirements, then deploy a Google-certified CMP where required.
- A fixed word count is not an official AdSense approval criterion. Approval depends on original value, navigation, policy compliance, content quality, usability, and account review. Use the measured count as an HTML/crawler diagnostic, not as a guarantee or automatic copy-writing target.

### Sitemap status

| Item | Observed result |
|---|---|
| `frontend/public/sitemap.xml` | XML valid; root is `sitemapindex`; 2 child `<loc>` entries |
| `frontend/public/sitemap-static.xml` | XML valid; root is `urlset`; 30 `<loc>` entries |
| Static path coverage | 30 canonical static URLs; aliases are omitted and point canonical to primary routes |
| Dynamic sitemap | Backend emits active/published notice slug URLs with `lastmod`, `changefreq`, `priority`; DB error degrades to a valid empty sitemap response |
| Sitemap caching | Redis TTL 300 seconds; HTTP cache headers 60 seconds |
| Scale consideration | Adapter does not paginate `fetch_all_slugs_for_sitemap`; verify Supabase row-limit behavior and sitemap 50,000-URL/size limits as catalog grows |

## 5. Performance, Cold Start & Caching Breakdown

### Cache behavior

| Surface | Repository behavior |
|---|---|
| Vercel `/index.html` | `Cache-Control: public, max-age=0, must-revalidate` |
| Vercel `/assets/*` | `public, max-age=31536000, immutable` |
| API notice feed | `max-age=60, s-maxage=300`; Redis TTL 300 s |
| API post detail | `max-age=300, s-maxage=1800`; Redis TTL 1,800 s |
| Dynamic sitemap | `max-age=60, s-maxage=60`; Redis TTL 300 s |
| Vercel post HTML | For cached successful post metadata: `s-maxage=300, stale-while-revalidate=600`; fallback/error responses are no-store |
| Cloudflare | No Cloudflare rules, worker, headers, or cache configuration exists in the checked-in repository; `cf-cache-status`, edge TTL and hit ratio cannot be established here |

Backend post create/update/delete schedules Redis invalidation for feed/post caches; update handles old and new slug keys. Confirm invalidation also clears the dynamic sitemap key and verify externally cached copies. Rate limits use Upstash if configured; Redis errors fall back to process-local windows and preserve public API availability, but a multi-instance deployment then has per-process limits.

### Latency and cold-start evidence

- Frontend page content calls Render directly by default (`https://bihar-fast-portal.onrender.com`) rather than consistently using the same-origin Vercel API rewrite.
- The keep-alive workflow pings `/api/notices` every 14 minutes. This is an uptime/cold-start mitigation attempt, not a latency measurement or guarantee.
- FastAPI enables gzip for responses of at least 1,000 bytes. Supabase clients are module-level cached clients.
- No production timings, Render plan, browser network trace, `Server-Timing`, Cloudflare response headers, or cold-start benchmark were available. Do not state numerical latency/cache ratios as measured audit facts.

### Core Web Vitals and asset notes

- Layout stability is not measured. The homepage requests feed data after mount, the shared banner may appear after a Supabase query, and route-level lazy loading shows a placeholder; these can change layout after first paint.
- The homepage logo declares width/height and is preloaded as a 13.8 KB WebP; job/post cards use lazy images. Check all remote post image dimensions and reserve aspect-ratio space.
- The generated CSS and React vendor are the largest shared build outputs noted above. Detail/admin/quiz chunks are lazy-loaded, reducing first-load route JS.
- Named Lucide imports are used; there is no evidence of importing the whole icon package as a runtime object. The configured manual icon chunk did not appear in the build output; inspect generated chunk graphs if icon cost matters.
- `biharfast.apk` is about 2.95 MB. It is not in the PWA `globPatterns`, which target JS/CSS/HTML/icons/images; the worker precache measured about 1.22 MiB.
- PWA behavior has two sources: a checked-in `public/sw.js` and a generated Workbox worker at `dist/sw.js`. The HTML registers `/sw.js` manually while `injectRegister` is disabled. Verify which worker is deployed and exercise update/offline behavior. Since prerender runs after `vite build`, confirm that Workbox precache revisioning and generated route HTML stay synchronized.
- No measured Lighthouse score, field Core Web Vitals, image decode profile or CLS value was collected. The README's “CLS 0.00” and “95+” claims should be backed by reproducible reports before treating them as current.

## 6. Step-by-Step Optimization Roadmap

### Priority 0 — Search/indexing correctness

1. Replace the metadata-only prerender body with output from the actual route component tree (SSR/static rendering or a route-aware prerender process). Include visible, unique guide copy and notices in generated HTML; make the page usable when API calls fail.
2. Render actual notice body, FAQs, application steps and source links in the initial `/post/:slug` response. Keep metadata/body/schema generated from the same validated post record.
3. Make `/post/:slug` status semantics explicit: actual missing post = 404/noindex; backend timeout/unavailable = 503 or another non-indexable response, not a success-shaped indexable shell.
4. Add initial `noindex` metadata for `/admin`, `/admin-login`, `/admin-portal`, `/dashboard`, and any intentionally private/practice routes. Ensure unknown URLs return a true 404 and noindex before JavaScript.
5. Generate route-specific canonical, description, Open Graph, Twitter, robots and JSON-LD as part of prerendering. Avoid homepage social metadata/schema leaking into other initial documents.
6. Add tests measuring generated route HTML body content and status/robots/canonical output, not merely metadata-map completeness. Fix the current privacy-heading test to match authored text or update source heading only if the editorial decision is intentional.
7. Verify category routes have meaningful matching inventory; suppress/redirect/noindex empty categories rather than publishing identical empty programmatic pages.
8. Keep the 30 canonical sitemap URLs synchronized with metadata routes. Add dynamic sitemap pagination and tests for maximum sitemap size, bad/empty DB responses and XML escaping.

### Priority 0 — Admin and data protections

1. Keep the server-side Supabase JWT + configured email + `profiles.role=admin` gate on every admin write/read endpoint. Frontend email checks are UX only.
2. Decide whether to remove `ADMIN_API_TOKEN` compatibility. If retained temporarily, store/rotate it server-side, ensure it is high entropy, audit usage and remove it after legacy clients migrate.
3. Ensure migration order applies `202610290001_site_settings_banner.sql` followed by `202610290002_lock_site_settings_to_admin.sql` in all Supabase environments. Verify RLS with anon, authenticated non-admin, admin-role-but-not-allowlisted, and configured allowlisted admin accounts.
4. Verify least-privilege separation for anon and service-role keys, especially `master_answer_keys`, `master_leaderboard`, `profiles`, and image Storage. Never expose a service-role key through a Vite variable.
5. Confirm `TRUST_PROXY_HEADERS` is enabled only behind trusted proxies and that the actual request IP reaches rate limiting. Test Upstash outage behavior and multi-worker local fallback.
6. Validate rate limits and abuse protection for contact form, subscription and anonymous quiz submissions; avoid relying on browser-side restrictions.

### Priority 1 — AdSense and editorial trust

1. Remove visible fake ad-slot placeholder strings; only render actual approved ad units at intentional locations after content is ready.
2. Ensure each public guide has original, route-specific explanations, steps, eligibility caveats, official source links, update/verification date and clear corrections/grievance path in initial HTML.
3. Add expiry/review workflows for district job records, schemes, upcoming dates, and year-specific BSEB/CUET content. Retire stale route content and remove expired items from sitemap.
4. Reconcile all factual claims (including “registered,” “manually verified,” benefits/amounts and deadlines) with documentary evidence and ensure summaries say the issuing authority is authoritative.
5. Review privacy language and implement an appropriate Google-certified CMP for applicable regions/configuration. Document analytics, push, form and quiz data retention consistently with actual behavior.
6. Keep author/editor identity and correction provenance visible on notice pages; use only structured-data fields supported by visible, verified content.

### Priority 1 — Reliability and runtime configuration

1. **Completed:** Centralized frontend API callers on `VITE_API_BASE_URL` with a production Render fallback and documented the setting in `.env.example`.
2. Decide whether same-origin Vercel proxying or direct Render calls are preferred. If using the proxy, verify rewrite ordering, CORS, cache headers and Vercel function limits; if direct, document CORS and backend hostname behavior.
3. Validate current sitemap/feed/post cache invalidation and monitor Redis hit/miss, API response time, Render cold starts, Vercel status and Supabase query latency.
4. Confirm service-worker deployment and cache behavior against the post-build prerender output; prevent stale navigation shell content and ensure post route metadata isn't replaced by an offline fallback.
5. Add production smoke tests for static route response codes, `robots.txt`, all sitemap URLs, AdSense ownership files, canonical tags, `ads.txt`, and end-to-end post render.

### Priority 2 — Performance and UX measurement

1. Capture repeatable Lighthouse mobile reports and field Core Web Vitals (LCP/INP/CLS), with build hash/date/device/network metadata. Do not use synthetic scores as substitutes for field data.
2. Reserve space for async banner, notice cards and post images; check font/image loading, route suspense fallback and API list behavior to reduce CLS.
3. Track bundle/chunk size budgets and inspect analyzer output before changing Lucide import strategy; current build already lazy-splits large page chunks.
4. Test cold-cache, warm-cache, Redis-down, Supabase-down and Render-sleep scenarios. Record actual response and `cf-cache-status` only after observing production headers.

### Approval checklist (not a guarantee)

- [ ] Initial HTML includes meaningful route-specific content, not only title/description.
- [ ] Dynamic post pages include article copy before client execution; missing/unavailable states do not become indexable 200 shells.
- [ ] No empty category/programmatic pages are indexed or monetized.
- [ ] Every public information page includes credible source links, update dates and corrections/contact information.
- [ ] Privacy, terms and disclaimer match actual tracking, storage, ads, forms and account behavior.
- [ ] Consent handling is appropriate for the account's audience and current Google requirements.
- [ ] Admin/student/internal pages have initial noindex policy; API writes remain server-protected.
- [ ] `ads.txt`, AdSense publisher identity, Search Console verification, robots and both sitemap routes are accessible in production.
- [ ] No visible test text, fake ad placeholders, broken routes, or stale recruitment data remains.
- [ ] Approval is assessed in AdSense and Search Console after technical fixes; repository tests alone cannot establish approval.

## Validation Performed and Known Limitations

| Check | Result |
|---|---|
| `Set-Location frontend; npm run build` | Passed; generated 39 prerendered route documents |
| `Set-Location frontend; npm run lint` | Passed |
| `node --test tests/prerender.test.js api/post-seo.test.js src/utils/slug.test.js` from `frontend/` | 14 passed, 1 failed. Failure: `frontend/tests/prerender.test.js` expects heading `3. Cookies, Google AdSense and DoubleClick DART`, while current legal content contains `3. Cookies, Google AdSense, and Third-Party Advertising Compliance` (punctuation/wording mismatch). This appears to be a stale assertion, not a build failure. |
| XML parse of `sitemap.xml` and `sitemap-static.xml` | Both parsed; sitemap index has 2 locations, static URL set has 30 |
| Live production requests / Google tools / Cloudflare headers / Lighthouse | Not performed; findings are source/build-based |
| Python backend suite | Not run in this audit; no Python runtime/dependency environment validation was performed |

**Bottom line:** Application architecture and the admin/student split are recognizable and the static/legal assets are present, but AdSense/Search readiness is primarily constrained by incomplete initial HTML, empty/data-dependent routes, and freshness/content-proof concerns—not by missing title tags. Fix server/static content generation and route status/indexing first, then confirm production cache, consent, RLS and field performance behavior.
