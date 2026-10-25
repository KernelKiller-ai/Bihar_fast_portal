# BiharFast Database Architecture and Schema Reference

**Status:** Repository-evidenced table/field usage plus a proposed Django moderation model. This is not a live Supabase catalog export.

## 1. Source of truth and safety boundary

The repository contains no complete canonical DDL for `public.notices`, quiz tables, `profiles`, or base tables used by the tracked migration. The only checked-in SQL is [202609170001_phase2_concurrency.sql](../supabase/migrations/202609170001_phase2_concurrency.sql). It changes existing tables and creates one function; it does not create those base tables. Its presence does not prove it has been applied to the deployed project.

Consequently, exact SQL types, nullability, defaults, primary/foreign keys, RLS policies, grants, and all deployed indexes cannot be asserted. Field names below are observed application references, not a substitute for catalog metadata. **Do not create Django models or run migrations against the existing Supabase schema based only on this document.**

## 2. Observed tables and application use

| Table | Observed use | Evidence boundary |
|---|---|---|
| `notices` | Public notice feed/detail and admin CRUD | Runtime code reads/writes it; no complete table DDL |
| `profiles` | Backend admin authorization checks `role`; frontend admin checks user role | Application references only; exact columns/constraints/RLS unverified |
| `subscribers` | Email upsert helper | Frontend requests `/api/subscribe`, but no matching FastAPI route was found |
| `master_quizzes` | Quiz metadata, active/date selection, admin edits | Runtime query fields only |
| `master_questions` | Quiz questions/options and server-side answer key | Runtime query fields only |
| `master_answer_keys` | Server-side quiz answer data is referenced in quiz logic | Runtime/code comments; schema/policy not verified |
| `master_leaderboard` | Persisted quiz rankings/results | Runtime query/insert fields only |
| `quiz_ip_rate_limits` | Daily IP-hash quiz-attempt limiting | Runtime upsert conflict target; database constraint not in tracked migration |
| `ai_usage_ledger` | Daily AI-generation quota counter | Existing base table presumed by tracked migration; full DDL absent |
| `scraped_inbox` | Scraped-content intake/deduplication footprint | Existing base table presumed by tracked migration; full DDL absent |

No `articles` table DDL or access was identified; `notices` is the observed content table. No persistent student-attempt-history table access was found. Student history is stored in browser localStorage.

## 3. `notices`: observed fields and behavior

### Fields referenced by code

The public feed selects `id`, `slug`, `title`, `department`, `category`, `total_posts`, `last_date`, `eligibility`, `fees`, `apply_url`, `pdf_url`, `created_at`, and `status`. Other read/write references include `short_desc`, `content`, `meta_title`, `meta_desc`, `faqs`, `how_to_apply`, `selection_process`, `updated_at`, `last_edited_by`, and `is_active`.

The app treats `faqs` as an array of `{q, a}` objects and application/selection steps as list-like content; this does not establish their database storage types. Admin upsert uses `slug` as a conflict target, which requires a matching database constraint/index but does not prove its exact definition.

### Current read/write semantics

- Public reads filter `is_active = true`, `status = 'published'`, and category in `jobs`, `admit_card`, `results`, `schemes`; feed is ordered newest-first and limited to 50.
- Create writes an active/published notice and normalizes category to the four supported values.
- The current update category normalization does not preserve `schemes`.
- Admit-card and result forms submit text fallback values for hidden `total_posts`; this field must not be assumed numeric.
- `official_link`, `author_id`, a unique slug constraint, or any requested 28-column structure are not verified schema facts. The code uses `apply_url` and `pdf_url` for action destinations.

## 4. Quiz query fields

These names are query/insert projections, not a verified data dictionary.

| Table | Observed fields |
|---|---|
| `master_quizzes` | `id`, `title`, `subject`, `slot`, `quiz_date`, `total_questions`, `duration_minutes`, `is_active`, `created_at` |
| `master_questions` | `id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`, `order_index` |
| `master_leaderboard` | Student/quiz identifiers, name/district, score, question counts, accuracy, and attempt/creation timing are used; exact complete projection must be checked in code/schema |
| `quiz_ip_rate_limits` | `ip_hash`, `attempt_date`, `attempt_count`, `updated_at`; code upserts using `ip_hash,attempt_date` |

Public question responses exclude answer keys; FastAPI retrieves the key for server-side scoring. The backend calls `increment_quiz_attempts` for atomic attempt counting, but no definition for that RPC is in the tracked migration. Its live existence and implementation are unverified.

## 5. Tracked migration effects

The migration `202609170001_phase2_concurrency.sql`:

1. Adds unique constraint `ai_usage_ledger_usage_date_key` on `ai_usage_ledger.usage_date`.
2. Defines `increment_daily_llm_quota(p_usage_date date, p_max_limit integer DEFAULT 10) RETURNS boolean`. It inserts one usage count or atomically increments the date row only while `posts_generated < p_max_limit`; a missing return indicates the quota was not incremented.
3. Adds `scraped_inbox.content_hash`, backfills it from normalized department/title/PDF/apply URL values using MD5, makes it non-null, and creates unique index `scraped_inbox_content_hash_key`.

It does not create the base tables or define the quiz RPC. Migration application status must be checked against the intended Supabase project.

## 6. Roles, RLS, and authorization

- Runtime admin code checks `profiles.role` values `admin` and `creator`; the frontend also contains role-oriented admin checks.
- These strings are application-level role values, not evidence of PostgreSQL roles or a complete role table.
- No tracked SQL defines `CREATE POLICY`, RLS enablement, grants, or database roles. This absence does not establish the live project's policy state.
- Backend Supabase access uses a server-side key resolver that may select a secret/service-role credential; such credentials must never be exposed in the frontend.
- Confirm policy behavior separately for anon, authenticated, and server-side roles before the Django service connects.

## 7. Proposed editorial data lifecycle

The planned contributor workflow requires these logical states:

```text
draft -> pending -> approved
                   \-> rejected
rejected -> draft (resubmission after edits)
```

`approved` is the target public state. The current application uses active records with `status = 'published'`; a migration must explicitly map legacy public rows to the target approved state (or retain a compatibility translation at the API boundary). Never expose `draft`, `pending`, or `rejected` records through public API, sitemap, or cached feed.

Logical audit requirements for the target include the author, reviewer, created/submitted/decision timestamps, rejection reason, and state transition history. Whether those attributes belong on `notices`, a review-history table, or both must be decided from the verified deployed schema and migration strategy.

## 8. Django ORM mapping plan (not generated models)

No Django application or ORM model exists in this repository. Exact model definitions corresponding to Supabase cannot be truthfully authored without canonical DDL. The safe mapping sequence is:

1. Export schema-only catalog metadata and migration history from the correct Supabase project; exclude rows and secrets.
2. Reconcile every referenced table, type, default, constraint, index, relation, and RLS rule with application code.
3. Run Django `inspectdb` against a read-only/staging connection and review generated types, primary keys, naming, and unmanaged-table behavior.
4. Use reviewed unmanaged mappings (`managed = False`) for legacy tables until ownership of schema changes is explicitly transferred to Django migrations.
5. Keep Django auth tables and editorial additions in a documented, migration-owned schema; choose a custom user model before the first migration if required.
6. Test least-privilege DB access, public/API compatibility, rollback, and content visibility before production cutover.

Do not allow `inspectdb` output or Django Admin to imply that existing tables are safe to mutate. The planned Django roles are contributor, staff/editor, and administrator; they should use Django groups/permissions and server-side policy checks. Reconcile these with current Supabase Auth/profile identities before allowing writes.

## 9. Indexing and performance

The public feed filters status/category/active and orders by `created_at`; detail lookup uses slug; admin filtering may use status. Candidate indexes for evaluation include combinations supporting public visibility and recency plus a unique slug index, but **none should be described as existing or added without query-plan and DDL verification**. The only indexes/constraint defined in checked-in SQL are the AI usage date uniqueness and scraped inbox hash uniqueness above.

Validate index selectivity, query plans, pooler behavior, cache TTL, and invalidation with representative data. “Sub-millisecond” execution is not a repository-verified guarantee or requirement.
