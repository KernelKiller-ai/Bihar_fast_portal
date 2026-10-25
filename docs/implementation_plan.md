# BiharFast Implementation Plan

**Status convention:** “Implemented” means present in checked-in source/configuration, not proof of production deployment, live uptime, or acceptance against an external service. “Active” identifies the next planned delivery stream; Django implementation itself is not yet present.

## Phase 1 — Public portal foundation (implemented in source)

- [x] React 19/Vite frontend, routed notice and information pages, category search/filter, and responsive layouts.
- [x] Tailwind CSS 4, Lucide React, Supabase Auth client integration, and browser-local student history.
- [x] FastAPI notice, admin, sitemap, and quiz APIs backed by Supabase client access.
- [x] Quiz selection/player, server-side scoring, answer review, leaderboard, and attempt limiting paths.
- [x] PWA manifest/icons and Vite PWA/Workbox configuration, plus a separately registered public service worker; deployed worker interaction still requires validation.
- [x] SEO shell metadata, homepage WebSite/SearchAction JSON-LD, route metadata/prerender scripts, static sitemaps, robots file, and Vercel post SEO function.
- [x] GTM `GTM-MQVP93FK`, GA4 `G-2N03Q64SX9`, AdSense publisher `ca-pub-2133187047291443` and matching `ads.txt`, and OneSignal app `b7c92f29-666a-42e6-ba4b-5148849d773f`.
- [x] Optional Upstash Redis caching/rate-limiting paths and optional Telegram alert integration.

**Not implied by completion:** production Search Console verification, rich-result eligibility, measured mobile speed under 1.5s, ad-slot placement/monetization, fully covered per-post schema, stable OneSignal dispatch after editorial approval, or a capacity guarantee.

## Phase 2 — Django editorial foundation (active planning; code migration not started)

### 2.1 Establish the database and identity contract

- [ ] Export schema-only DDL/catalog and migration history for the intended Supabase project; verify RLS, grants, policies, types, constraints, and indexes.
- [ ] Decide whether Django connects through a Supabase pooler or direct PostgreSQL URI; verify SSL, connection limits, and least-privilege credentials.
- [ ] Assign schema ownership: retain legacy tables as unmanaged Django mappings until deliberate migration ownership transfer.
- [ ] Define the identity bridge from Supabase Auth/profile roles to Django contributors/editors/admins, including account linking, session/JWT, recovery, and legacy token retirement.
- [ ] Decide where workflow/audit data lives and how current `status='published'` rows map to target `approved`.

### 2.2 Build Django API and administration

- [ ] Add a compatible Django 6/DRF runtime only after Python/runtime and deployment compatibility are validated.
- [ ] Establish Django settings, secure environment configuration, database health checks, and migrations for Django-owned auth/editorial additions.
- [ ] Implement reviewed legacy-table mappings only after schema export; do not use blind `inspectdb` output to create production migrations.
- [ ] Configure Django Admin with contributor/staff/editor/admin permissions and auditable review actions.
- [ ] Implement validated contributor draft/list/submit and editor queue/approve/reject endpoints while preserving current public `GET /api/posts` behavior.
- [ ] Enforce author ownership and state transitions server-side; ensure only approved public records enter APIs and sitemaps.
- [ ] Add API compatibility tests and a rollback/cutover plan before shifting traffic from FastAPI.

### 2.3 Close current reliability and correctness gaps

- [ ] Fix and test scheme-category updates so `schemes` remains `schemes`.
- [ ] Implement a protected, rate-limited `/api/subscribe` service or remove/replace the footer integration.
- [ ] Add server-side official URL policy enforcement to actual notice writes.
- [ ] Verify `increment_quiz_attempts` RPC definition and the actual daily quota migration state in Supabase.
- [ ] Add API tests for feed visibility, admin authorization, quiz answer masking, errors, cache invalidation, and notification failures.

## Phase 3 — Contributor submission and approval delivery

- [ ] Build accessible contributor form for title, category, source/official link, eligibility, dates, and structured content.
- [ ] Provide draft, submit, pending, rejection reason, and resubmission states with clear ownership.
- [ ] Provide editorial queue with source/link review and duplicate/plagiarism checks. Automated plagiarism checking is optional until a trustworthy service and policy are selected.
- [ ] Make approve/reject operations audited, permission-checked, idempotent, and transactionally consistent.
- [ ] After approval commit, dispatch a retryable, deduplicated OneSignal notification to opted-in subscribers; push failure must not undo publication.
- [ ] Test end-to-end behavior for concurrent submissions, duplicate notices, bad links, rejected drafts, retries, and public sitemap/feed visibility.

## Phase 4 — Performance, monetization, and growth

- [ ] Establish a mobile performance baseline and work toward the product target of under 1.5s page speed using a defined metric; report LCP/INP/CLS and p75 field data separately.
- [ ] Instrument and baseline approval turnaround, organic Search Console clicks/impressions, and official-link CTR.
- [ ] Implement and test AdSense units (`ca-pub-2133187047291443`) only after placement, policy, consent, and Core Web Vitals review; the current source has no identified ad-slot markup.
- [ ] Configure GA4/GTM events for feed impressions, detail views, search, and official-link clicks with privacy/consent rules.
- [ ] Evaluate edge CDN caching on Vercel/Cloudflare and Upstash Redis cache TTLs/invalidation based on observed traffic and stale-content requirements.
- [ ] Load-test the approved database pool and feed/quiz endpoints before increasing concurrency targets.
- [ ] Add operational dashboards/alerts for API health, database/cache failures, stale feed, moderation queue age, and push delivery.

## Release gates

- Django dependencies, runtime version, security settings, and deployment path are verified before production rollout.
- The target Supabase project identity, schema, RLS, migration state, and DB permissions are documented from live catalog evidence.
- No service-role key or database credential is shipped in frontend assets.
- Public feed/detail, sitemap, and cache expose only approved/published content; admin/editor actions enforce server-side permissions.
- Contributor/admin identity reconciliation, audit history, rollback, and FastAPI cutover/rollback are tested.
- Current route and API compatibility is retained or migrated with a verified client rollout.
- Mobile accessibility, SEO crawler output, PWA worker behavior, and third-party consent/performance are tested on a production-like build.
- Performance, Search Console growth, CTR, and approval-time claims are reported only from measured data.
