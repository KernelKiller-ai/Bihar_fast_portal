# BiharFast Implementation Plan

**Status convention:** “Completed” means implemented in the checked-in source/config reviewed for this document; it is not a statement of production uptime or independent acceptance testing.

## Phase 1 — Core portal and reliability baseline (completed in source)

- [x] Public notice feed, client-side category filters/search, slug detail pages, and category-oriented layouts.
- [x] FastAPI public notice, admin notice, sitemap, and quiz routes.
- [x] Category-driven admin notice fields for `jobs`, `admit_card`, `results`, and `schemes`, with hidden total-posts fallbacks for admit cards/results.
- [x] Student Supabase Auth context mounted at the application root.
- [x] Responsive root/navbar/search changes intended to prevent overflow on 360px mobile layouts.
- [x] Mock-test player, server-side scoring, result/answer review, leaderboard, and browser-local student history.
- [x] Vercel SPA/API/SEO rewrites, immutable static-asset caching, gzip, optional Redis caching/rate limiting, and optional Telegram alert integration.

**Acceptance follow-up:** run viewport regression coverage across all major routes; verify live Supabase DDL/RLS; verify category edit behavior for schemes; resolve the footer `/api/subscribe` route discrepancy; exercise production OAuth redirect and API settings.

## Phase 2 — Immediate next

### 2.1 SEO quality and indexing operations

- [ ] Verify crawler responses from the deployed `/post/:slug` SEO function and canonical URLs.
- [ ] Validate dynamic sitemap status/content, robots directives, structured data, metadata quality, and actual Search Console indexing.
- [ ] Add repeatable SEO checks and measure impressions/clicks/average position. A crawler-facing SEO function already exists; the remaining work is validation, coverage, and measurement rather than creating the feature from zero.

### 2.2 Safe, auditable content intake

- [ ] Decide source inventory and human review requirements before implementing ingestion.
- [ ] If using Telegram/webhook parsing, ingest into a review queue/deduplication stage; do not publish unverified messages directly.
- [ ] Apply URL/source validation at the actual write boundary and audit failures. The current official-URL helper has no identified publication call site.
- [ ] Establish ownership, retry/dead-letter behavior, idempotency, monitoring, and rollback.
- [ ] Treat the existing `scraped_inbox` migration footprint as a possible foundation only; a complete running pipeline was not established by this source scan.

### 2.3 Mock-test content and persistence

- [ ] Expand and review question sets by exam, subject, and difficulty.
- [ ] Add automated scoring, answer-key masking, date fallback, rate-limit, and leaderboard tests.
- [ ] Decide whether student history must sync across devices. If yes, define authorization/retention and versioned schema migrations before replacing localStorage.

### 2.4 Data contract and product correctness

- [ ] Export and version actual Supabase schema/RLS definitions; finish the incomplete schema reference from deployment evidence.
- [ ] Fix/verify scheme-category edit normalization.
- [ ] Either implement an authenticated/rate-limited `/api/subscribe` endpoint or remove/replace the UI integration.
- [ ] Add integration tests for publication, update, cache invalidation, and Telegram best-effort behavior.

## Phase 3 — Scale and high traffic (proposed; not capacity-certified)

- [ ] Establish traffic, latency, data-growth, and availability targets; conduct load tests before sizing infrastructure.
- [ ] Evaluate Cloudflare/edge CDN caching for public pages/assets with safe invalidation and personalized-response bypass rules.
- [ ] Tune Supabase connection pooling and query/index strategy based on observed plans/metrics.
- [ ] Consider asynchronous leaderboard writes or aggregation if measured write contention justifies the added consistency model.
- [ ] Add monitoring/alerting for backend availability, database failures, cache hit rate, stale content, rate-limit events, and queue/Telegram delivery.
- [ ] Complete a threat model and verify CORS, RLS, secrets management, rate limits, backup/restore, and incident response.
- [ ] Validate projected capacity (including any one-million-user goal) with representative load tests; CDN presence alone is not a scale guarantee.

## Release gates

- Automated build/lint and targeted API/frontend tests pass.
- Tested mobile widths include 320px, 360px, 390px, and desktop with no horizontal overflow.
- Admin category behavior and database payloads match exact persisted enum/value constraints.
- Supabase DDL/RLS is documented from the correct project.
- Public and admin route error cases are verified; no privileged key is shipped in frontend assets.
- SEO, analytics, and performance claims are supported by production measurements.
