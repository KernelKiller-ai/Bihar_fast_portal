# BiharFast Product Requirements Document

**Status:** Source-informed product brief; proposed goals are labeled as such.  
**Product:** BiharFast.in

## 1. Vision

Help people in Bihar find timely, understandable public opportunities and services without searching across many disconnected portals. BiharFast should make it easy to discover an update, understand what it means, and continue to the responsible official portal.

## 2. Target audience

- **Bihar students:** learners preparing for Class 10 and competitive examinations.
- **Job aspirants:** candidates tracking recruitment notices, admit cards, answer keys, and results.
- **Public-service seekers:** residents exploring welfare schemes, certificates, education assistance, and related services.
- **Content administrators:** authorized staff who publish and maintain notices and mock tests.

## 3. User problems and value proposition

| User problem | Product value |
|---|---|
| Relevant notices are spread across multiple official sites | One searchable, category-oriented feed and topic hubs |
| Users have difficulty separating important details from long notices | Structured dates, eligibility, benefit/vacancy summary, and FAQs |
| Users need a trusted next step | Direct links to the official application, scorecard, admit-card, or PDF destination |
| Exam practice is disconnected from progress tracking | Timed quizzes, answer explanations, scorecards, and a leaderboard |
| Mobile government pages are hard to use | Lightweight, responsive discovery pages designed for narrow screens |

“Verified” should mean the administrator has checked the source and action links. The current repository supports manual publication and displays verified-information messaging; it does not prove that every link is automatically audited or that an editorial review workflow is enforced.

## 4. Product scope

### Implemented in the checked-in application

1. **Live notices and category aggregation:** backend feed categories are `jobs`, `admit_card`, `results`, and `schemes`; the frontend provides feed filtering and search.
2. **Notice details:** slug-addressable article pages display structured notice information and links; crawler-facing metadata is generated for post routes.
3. **Topic/service hubs:** BSEB matric/inter, RTPS, Udyami Yojana, KYP, Student Credit Card, CUET, and related landing pages.
4. **Mock tests:** quiz selection, timed test, server-side evaluation, result/answer review, scorecard, and leaderboard. The backend quiz engine is generic, while the frontend includes Class 10 routes and additional exam identifiers.
5. **Student dashboard:** Supabase Auth identity with browser-local test history and district preference.
6. **Admin portal:** bearer-token access for notice publishing/edit/status operations and quiz administration. Notice form labels and visible fields adapt to the category.

### Not confirmed as implemented

- Persistent student profile or attempt-history tables.
- A working newsletter subscription API route (the footer calls `/api/subscribe`, but no corresponding FastAPI route was located).
- Automated notice collection/scraping pipeline or an enforced official-domain allowlist on admin writes.
- Analytics instrumentation for the KPIs below.

## 5. User stories and acceptance criteria

### Notice discovery

- As a visitor, I can browse the newest active published notices and filter/search without leaving the feed.
- As a visitor, I can open a notice at a stable slug route and follow its action links.
- As a mobile visitor, I can browse without horizontal page scrolling on narrow screens.
- Acceptance: feed data is limited to active, published rows and the four supported persisted categories; detail routes handle missing/failed records with an error state.

### Quiz participation

- As a student, I can choose an available quiz, enter requested registration details, complete a timed test, submit it, and review my score and explanations.
- As a student, I can share the scorecard and see the quiz leaderboard.
- As an authenticated student, I can see browser-saved attempt history on the dashboard.
- Acceptance: answers are scored by the backend; quiz answer keys are not included in the public question response; non-demo results are eligible for leaderboard persistence.

### Notice administration

- As an authorized administrator, I can authenticate with the configured admin bearer token, choose one of the supported categories, and publish structured notice content.
- Acceptance: category-specific labels/placeholders change with selection; admit-card/result creation hides total-posts and sends a non-empty fallback; stored category identifiers match the supported values.

## 6. Proposed success metrics

No first-party analytics event implementation or baseline values were confirmed during the repository scan. Instrument and baseline these before setting numeric targets.

| KPI | Suggested measurement |
|---|---|
| Notice click-through rate (CTR) | Notice detail opens divided by eligible feed impressions |
| Average search position | Search Console average position for BiharFast indexed URLs, segmented by query/page |
| Daily active users (DAU) | Unique consented/appropriately measured users with a meaningful activity per day |
| Retention | Cohort return rate at agreed intervals (e.g., day 7/day 30) |
| Task completion | Apply/download link clicks per notice-detail view; quiz completion per quiz start |
| Reliability | API availability, error rate, p95 latency, and stale-feed duration |

Use privacy-aware analytics, document consent/retention policy, and do not equate third-party search ranking with an in-product metric.

## 7. Non-functional requirements

- Mobile-first responsive UI; zero horizontal overflow is a design/QA requirement at 360px and should also be checked at 320px and tablet/desktop widths.
- Public information pages should remain usable if optional Redis is unavailable.
- Do not expose admin or service-role secrets in frontend bundles.
- Keep question answers server-side until submission.
- Show useful loading, empty, and error states rather than implying success when APIs fail.
- Protect official action links and content against unsafe HTML; validate link policies at the publication boundary in a future hardening pass.

## 8. Dependencies and risks

- Correctness depends on timely and accurate human-curated content.
- Supabase table DDL and RLS policies are not versioned in this repository and must be verified against the deployed project.
- LocalStorage history is browser/device-specific and can be cleared; it is not a cross-device student record.
- Existing UI references and server capabilities differ in a few places (notably subscription endpoint and scheme category edit normalization); resolve before promising those workflows.
- Hosting references identify Vercel and Render endpoints, but live service health and projected one-million-user capacity are not measured here.
