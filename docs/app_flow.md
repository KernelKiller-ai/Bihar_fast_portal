# BiharFast Application and User Flow

## 1. Route map at a glance

| User intent | Routes |
|---|---|
| Browse and search notices | `/`, `/jobs`, `/admit-card`, `/results`, `/sitemap`, `/all-updates` |
| Read an individual notice | `/post/:slug` |
| Explore service or education hubs | `/rtps-bihar`, `/udyami-yojana`, `/bseb-matric-10th`, `/bseb-inter-12th`, `/kyp-bihar`, `/student-credit-card`, `/cuet-ug-admission` |
| Take a mock test | `/class-10-quiz`, `/mock-test/class-10`, `/mock-test` |
| Manage student session/history | `/dashboard` |
| Administer content/quizzes | `/admin`, `/admin-portal` |
| Learn about the service | `/about`, `/about-us`, `/contact`, `/contact-us`, `/disclaimer`, `/privacy-policy`, `/privacy`, `/terms`, `/terms-and-conditions` |

The current route map has no dedicated `/schemes` path; schemes are a supported backend category and can appear in the feed and all-updates grouping.

## 2. Visitor: find and act on a notice

1. Browser loads the SPA at `/`. `AuthProvider` is initialized above the router; the app requests `GET /api/notices`.
2. Backend filters active, published notices and returns up to 50 records. The frontend normalizes display fields and categories.
3. Visitor chooses a category tab and/or enters a search query. Filtering is performed in client state against the loaded records.
4. Visitor opens a notice, navigating to `/post/:slug`.
5. The detail page requests `GET /api/posts/{slug}` for the full article and metadata. During rendering, post presentation selects a category-oriented layout (jobs/admit-card/results) and exposes apply/PDF actions.
6. Visitor follows the destination link, normally opening the official portal or document in a new browser context.

Failure/empty handoffs: feed failures show a fallback/empty feed state; missing or failed post detail shows an error state. Search/filter state is local and is not persisted by the route.

## 3. Student: take a quiz and view a scorecard

1. Student opens a mock-test route. The selection UI fetches available quizzes from `GET /api/quiz/available` and/or active quiz/question data from `GET /api/quiz/today` (optionally with `quiz_id` or `subject`).
2. Backend chooses the selected active quiz or an active fallback and returns question text/options without the answer key.
3. Student provides the requested name, district, and optional registration data, starts the timed attempt, and answers in client component state.
4. Student submits to `POST /api/quiz/submit`. Backend loads the answer key, evaluates responses, applies the current daily non-demo IP limit, and persists eligible results to the leaderboard.
5. Result screen shows the score, accuracy, attempt date, badge, and per-question answer/explanation details. The scorecard can be shared via WhatsApp or Telegram.
6. The UI requests `GET /api/quiz/leaderboard/{quiz_id}` for rankings.
7. For a non-demo attempt, user-specific history is stored in browser `localStorage`. Demo results can be kept as a pending result and attached to the local history after Supabase login.
8. On `/dashboard`, the authenticated user sees locally saved performance history; it is not a server-synchronized attempt history.

Handoff distinction: leaderboard persistence is backend-backed; student attempt history is browser-local. A demo result pending before login is a localStorage handoff, not a server account transaction.

## 4. Admin: publish a notice

1. Administrator opens `/admin` or `/admin-portal`.
2. Admin enters the configured API bearer token. The UI checks it by requesting `GET /api/admin/posts`.
3. After a successful response, admin chooses the new-notice tab and selects one of `jobs`, `admit_card`, `results`, or `schemes`.
4. Category state controls labels, example placeholders, and whether total-posts is visible. Changing category updates the form presentation; existing form values are still form state until reset/submission.
5. Submit sanitizes/normalizes fields in the client (including slug, SEO metadata, non-empty FAQs/steps, and the hidden total-posts fallback) and sends `POST /api/admin/posts` with bearer auth.
6. Backend normalizes category, writes/upserts the notice, marks it active/published, invalidates cache in a background task, and queues an optional Telegram alert.
7. UI reports success/error and refreshes the admin list.

Admin edit/status paths call `PUT /api/admin/posts/{post_id}` and `POST /api/admin/posts/{post_id}/status`. The update handler's category normalization currently differs from the create handler for schemes; verify before treating scheme editing as reliable.

## 5. Admin: manage mock tests

1. Admin switches to the quiz control hub inside the admin portal.
2. Quiz manager requests the admin quiz list, creates a quiz slot, toggles active status, reviews uploaded questions, or adds a question batch.
3. Requests under `/api/quiz/admin/...` use the same configured bearer-token mechanism.
4. Public quiz routes can then discover active quizzes and serve their questions.

## 6. Authentication flow

1. `AuthProvider` calls Supabase `getSession()` on mount and subscribes to auth state changes.
2. If configured, Google OAuth starts through Supabase and uses `${window.location.origin}/dashboard` as redirect target.
3. The restored/updated session exposes `user`, `session`, loading state, and global login-modal controls to descendants.
4. Pending local demo history is attached to localStorage for the authenticated user after session acquisition.
5. Sign-out calls Supabase Auth and clears the in-memory session on success.

Student Supabase Auth is separate from admin bearer-token authentication. No admin role table or user profile table access is established in the checked-in code.

## 7. State and persistence handoff summary

| State/data | Owner | Persistence |
|---|---|---|
| Feed records and filter query | `App` | In-memory React state; feed refetched on page load |
| Login/session state | `AuthProvider` | Supabase Auth |
| Admin token | Admin page | Component state during current page session |
| Quiz answers/timer/current step | Quiz player | In-memory React state |
| Student attempt history/district | Student history utility | Browser `localStorage`, up to 50 attempts per user |
| Published notices and quiz data | FastAPI/database layer | Supabase tables |
| Leaderboard entries | Quiz backend | `master_leaderboard` |
| Feed/detail cache | Backend | Optional Upstash Redis with configured TTLs |
