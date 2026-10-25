# BiharFast Product Requirements Document

**Product:** BiharFast.in
**Document scope:** Current product behavior and the planned contributor/editorial capability
**Status:** Source-grounded product requirements; proposed capabilities are labeled as planned

## 1. Product vision

BiharFast is a fast, community-driven Bihar public-information portal for government jobs, admit cards, results, education opportunities, schemes, and citizen services. It brings timely updates and structured summaries together, then sends people to the relevant official application, result, or notification source.

The product promise is **fast discovery, clear information, and a direct official next step**. “Verified” means that a responsible editor checks the source and destination before publication; the current repository does not enforce an automated verification or contributor approval process.

## 2. Personas

| Persona | Need | Current experience | Planned experience |
|---|---|---|---|
| Job aspirant | Find urgent notices quickly on a phone and reach the official destination without misleading redirects | Browse/search the notice feed, choose a category, read a notice, and follow its action/PDF links | Receive an accurate, timely push alert for approved high-value updates |
| Student contributor | Turn a sourced update into a structured, attributable draft | No contributor submission account or draft workflow is implemented | Authenticate, submit a structured draft, and track editorial status |
| Chief editor / administrator | Maintain quality, correct errors, and control publication | Use the existing admin UI and FastAPI admin endpoints; access is based on Supabase JWT/profile roles (`admin` or `creator`) or the configured legacy token | Review pending drafts in Django Admin, validate sources/links, approve or reject with an audit trail |
| Student/test taker | Practice and review progress | Take available mock tests and see server-scored results; personal history is stored in browser localStorage | Continue using mock tests while content administration is migrated independently |

## 3. Core value proposition

1. **One-click official destinations:** show direct apply, admit-card, result, and PDF links with clear labels.
2. **Trust through editorial quality:** no spam, fabricated notices, or unreviewed contributor submissions should be published.
3. **Fast mobile discovery:** searchable category feeds, readable notice pages, and responsive topic hubs.
4. **Community content scale:** planned contributor drafts expand coverage while an editor remains the publication quality gate.
5. **Useful adjacent services:** mock tests, scorecards, education hubs, and citizen-service information complement notice discovery.

The product should not claim that every currently published notice has passed an automated link checker. Publication is currently an admin action; link validation and contributor review are planned workflow controls.

## 4. Scope and capability status

### Implemented in checked-in source

- Notice feed and client-side search/category filtering for `jobs`, `admit_card`, `results`, and `schemes`.
- Slug-based notice details with structured information and apply/PDF actions.
- Education and citizen-service hubs, including BSEB results, RTPS Bihar, KYP, Student Credit Card, Udyami Yojana, and CUET.
- Mock-test selection, server-side answer evaluation, scorecards, and leaderboard.
- Supabase Auth integration for student sessions when configured; browser-local student attempt history.
- Admin notice and quiz functions, with FastAPI endpoints and Supabase-backed data access.
- PWA assets/configuration, route metadata/prerendering, sitemap resources, and crawler-facing post metadata.
- GTM `GTM-MQVP93FK`, GA4 `G-2N03Q64SX9`, AdSense publisher `ca-pub-2133187047291443`, and OneSignal app `b7c92f29-666a-42e6-ba4b-5148849d773f` integrations in the frontend shell.

### Planned—not implemented

- Student contributor registration/login and structured draft submissions.
- `pending`/`approved`/`rejected` editorial workflow, editorial audit history, and Django Admin moderation.
- Automated plagiarism detection, official-link validation, approval webhook, and approval-triggered push dispatch.
- A canonical Django/DRF API and Django-managed contributor/admin identity.
- Verified ad-unit placements; the repository contains the AdSense account/library integration and `ads.txt`, but no in-source ad-slot markup was found.

## 5. User stories and acceptance criteria

### Notice discovery

- As an aspirant, I can browse the latest active published notices, search, and filter by category.
- As an aspirant, I can open a stable notice URL and identify the official next action.
- As a mobile visitor, I can use the main flows without horizontal overflow.
- **Acceptance:** public APIs expose only active, published notices; category values remain consistent across API, database, and UI; errors are visible and do not masquerade as successful results.

### Contributor submission (planned)

- As a signed-in student contributor, I can create a structured draft containing a title, category, source, official destination, and useful summary/content.
- As a contributor, I can submit the draft for editorial review and see its status without publishing it myself.
- **Acceptance:** submission is authenticated and validated server-side; new submissions cannot appear in public feeds before editor approval; contributor ownership and status changes are auditable.

### Editorial review (planned)

- As an editor, I can filter pending submissions, inspect source and action links, edit content, and approve or reject with a reason.
- As an editor, I can publish only after required checks pass.
- **Acceptance:** approval is a permission-checked server-side state transition; the public feed and sitemap include only approved/published records; notification dispatch occurs after commit and is retryable.

### Quiz participation

- As a student, I can take an available timed quiz, submit answers, review a server-evaluated score, and view the leaderboard.
- **Acceptance:** answer keys remain server-side before submission; demo attempts are not treated as persisted leaderboard results; user attempt history is clearly identified as browser-local.

## 6. Monetization, engagement, and growth

| Capability | Current integration | Product requirement / caveat |
|---|---|---|
| Google AdSense | Publisher `ca-pub-2133187047291443`, loader in `frontend/index.html`, seller declaration in `frontend/public/ads.txt` | Test and document actual ad units, consent/privacy obligations, and page-speed impact before claiming monetized placements |
| Analytics | GTM `GTM-MQVP93FK` and GA4 `G-2N03Q64SX9` load from the frontend shell | Define consent-aware events for feed impressions, detail opens, official-link clicks, and search; IDs alone do not establish KPI instrumentation |
| Web Push | OneSignal Web SDK v16 with app ID `b7c92f29-666a-42e6-ba4b-5148849d773f`; production-domain-only loader and worker | Subscription is permission-based; approval-triggered notification dispatch is planned and not currently wired to a Django approval event |
| SEO | Static shell metadata, route metadata/prerendering, sitemaps, and JSON-LD for the homepage | Validate dynamic post/category coverage, crawler output, and Search Console performance; do not equate installed schema with rich-result eligibility |

## 7. Success metrics

These are product targets to instrument and baseline, not measurements established by this repository.

| Metric | Definition | Target / reporting |
|---|---|---|
| Mobile page speed | Field-measured mobile LCP for representative landing and detail pages | Target p75 under 1.5 seconds; report Core Web Vitals separately |
| Approval turnaround | Time from contributor submission to editorial decision | Median and p90 by week/category; set an SLA after baseline |
| Organic discovery | Search Console clicks and impressions for indexed pages | Track weekly/monthly growth by landing page and query |
| Official-link CTR | Unique official-destination clicks divided by eligible notice-detail views | Segment by category and destination type |
| Content quality | Broken/invalid official links and post-approval corrections | Track rate, detection source, and time to correction |
| Reliability | API availability, error rate, latency, and feed freshness | Establish measured baselines before setting SLOs |

## 8. Product constraints and risks

- Checked-in production-like architecture is React/Vite, FastAPI, and Supabase; Django/DRF is a proposed transition, not the running API.
- Supabase canonical DDL and RLS policies are not fully tracked in this repository. Do not infer Django field definitions or modify existing tables until the deployed catalog is exported and reconciled.
- Supabase student Auth and the current profile-based admin checks must be deliberately reconciled with any Django contributor identity; do not silently create duplicate identities.
- The current footer calls `/api/subscribe`, but no corresponding FastAPI route was identified.
- Scheme creation supports `schemes`; the existing update handler's category normalization does not preserve that value.
- Search Console growth, page-speed targets, approval time, and CTR require production measurement and event definitions.
