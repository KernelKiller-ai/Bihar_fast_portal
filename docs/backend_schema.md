# BiharFast Database and Schema Reference

## 1. Important accuracy note

This repository does **not** contain the canonical Supabase DDL/catalog export for `public.notices` or the quiz tables. The only checked-in SQL migration modifies `ai_usage_ledger` and `scraped_inbox`. Therefore this document cannot truthfully enumerate all 28 `notices` columns or confirm exact SQL types, defaults, nullability, constraints, indexes, or JSONB layouts.

Do not use field names observed in application code as a substitute for the live database definition. In particular, `important_dates` and `application_fees` were not established by tracked SQL or the inspected notice/quiz data-access code. Obtain and version a sanitized schema-only export from the deployed Supabase project to complete that contract.

## 2. Tables observed in application/migration code

| Table | Evidence in repository | Observed purpose |
|---|---|---|
| `notices` | `backend/database.py`, `backend/main.py` | Published public notices and admin CRUD |
| `subscribers` | `backend/database.py` helper | Email upsert; route integration not found |
| `master_quizzes` | `backend/database.py`, `backend/quiz_router.py` | Quiz metadata and active/date selection |
| `master_questions` | `backend/quiz_router.py` | Quiz questions, options, answer key, explanation |
| `master_leaderboard` | Quiz submit/leaderboard code | Result/ranking records |
| `quiz_ip_rate_limits` | Quiz submit code | Per-IP-hash daily attempt count |
| `ai_usage_ledger` | Tracked migration | Daily LLM usage quota |
| `scraped_inbox` | Tracked migration | Content intake/deduplication footprint |

No profile table or persistent per-student attempt-history table access was identified. Student-specific history and district preference are held in browser localStorage.

## 3. `notices`: observed application contract

### Fields selected for the public feed

`backend/database.py` selects:

`id`, `slug`, `title`, `department`, `category`, `total_posts`, `last_date`, `eligibility`, `fees`, `apply_url`, `pdf_url`, `created_at`, and `status`.

The feed also filters `is_active = true`, `status = 'published'`, and one of `jobs`, `admit_card`, `results`, or `schemes`, sorts by `created_at` descending, and limits to 50.

### Additional fields read/written in code

| Field | Observed use |
|---|---|
| `short_desc` | Notice summaries and SEO fallback |
| `content` | Long-form article content |
| `meta_title`, `meta_desc` | SEO metadata |
| `faqs` | Admin create/update payload and detail rendering; app treats it as an array of `{q, a}` objects |
| `how_to_apply` | Admin create/update payload; application-step array |
| `selection_process` | Admin create/update payload; step array |
| `updated_at` | Set during update/upsert and selected for sitemap timestamps |
| `last_edited_by` | Set to `"admin"` by update helper |
| `is_active` | Public feed/detail visibility filter and create default |

The runtime upsert uses `on_conflict="slug"`, which implies the deployment is expected to support a slug conflict target, but the exact uniqueness constraint is not verifiable without DDL.

### Business behavior observed

- New notice rows are normalized to one of four category values by the create handler.
- New notices are written with `is_active = true` and `status = "published"`.
- Public feed/detail reads include only active published records.
- Admin list reads can optionally filter by status.
- `fees` is selected for the feed but is not part of the category-driven create form fields shown in the current UI.
- Admit-card and result form submissions hide `total_posts` but send fallback strings; these values are presentation-compatible text, not numbers.
- The edit handler's category normalization does not currently preserve `schemes`; it maps unrecognized categories to `jobs`.

### Unknown until schema export

Do not assume the requested total of 28 columns, SQL types (including whether arrays are `jsonb`), nullable/default behavior, check constraints, foreign keys, indexes, RLS policies, or generated values. Frontend aliases such as `totalPosts`, `lastDate`, `pdfUrl`, and `applyUrl` are client compatibility fields, not evidence of separate database columns.

## 4. Quiz data contract observed in queries

These are names used in Supabase selects/inserts and API models, **not a verified SQL dictionary**.

### `master_quizzes`

Observed fields: `id`, `title`, `subject`, `slot`, `quiz_date`, `total_questions`, `duration_minutes`, `is_active`, and `created_at`.

### `master_questions`

Observed fields: `id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, and `order_index`.

Public quiz responses select question text/options/order without `correct_option` or explanation; the submission endpoint loads the answer key server-side. The precise relationship constraint and deletion behavior are not in tracked DDL.

### `master_leaderboard`

The backend writes and reads leaderboard records for submitted non-demo quiz attempts. Field projections use student/quiz identity, name/district, score, question counts, accuracy, and creation/attempt timing. Exact persisted column set, type, uniqueness, retention, and ordering indexes require schema inspection.

### `quiz_ip_rate_limits`

The rate limiter reads/upserts `ip_hash`, `attempt_date`, `attempt_count`, and `updated_at`, using the pair `ip_hash,attempt_date` as an upsert conflict target. The implementation intends to allow six non-demo attempts per IP hash/date. Database-level uniqueness and race safety are not proven by the tracked migration.

## 5. Other database access

### `subscribers`

The database utility upserts `{"email": normalized_email}` with conflict target `email`. The inspected FastAPI route set contains no `/api/subscribe` handler, despite a frontend footer request to that path. Do not claim the public subscription flow is operational without resolving this.

### Migration-managed tables

`supabase/migrations/202609170001_phase2_concurrency.sql`:

- Adds a unique constraint to `ai_usage_ledger.usage_date`.
- Creates `increment_daily_llm_quota(date, max_limit)` to atomically increment `posts_generated` below the cap.
- Adds/backfills non-null `scraped_inbox.content_hash` and a unique index over it.

The migration does not define the full base tables, and migration presence alone does not prove it has been applied to production.

## 6. RLS, backups, and schema completion checklist

No `CREATE POLICY`/RLS migration was found in tracked SQL. Verify live RLS policies table by table. The backend's Supabase key resolver prefers secret/service-role keys; those credentials bypass ordinary RLS and must remain server-side.

To complete this reference safely:

1. Export schema-only DDL/catalog metadata from the correct Supabase project (exclude data and secrets).
2. Confirm environment/project identity and migration state.
3. Record every notices column with type, nullability, default, generated behavior, and constraints.
4. Document indexes and conflict targets used by upserts.
5. Document RLS policies, grants, and foreign-key/delete behavior.
6. Add the sanitized DDL or a reproducible migration to version control and update this document from it.
