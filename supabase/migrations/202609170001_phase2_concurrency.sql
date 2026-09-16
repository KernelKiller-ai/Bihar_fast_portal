-- Phase 2: database-level concurrency and deduplication guarantees.
-- Apply this migration in Supabase before deploying the Python changes.

ALTER TABLE ai_usage_ledger
  ADD CONSTRAINT ai_usage_ledger_usage_date_key UNIQUE (usage_date);

CREATE OR REPLACE FUNCTION increment_daily_llm_quota(
  p_usage_date date,
  p_max_limit integer DEFAULT 10
)
RETURNS boolean
LANGUAGE sql
VOLATILE
AS $$
  INSERT INTO ai_usage_ledger (usage_date, posts_generated)
  VALUES (p_usage_date, 1)
  ON CONFLICT (usage_date)
  DO UPDATE
    SET posts_generated = ai_usage_ledger.posts_generated + 1
    WHERE ai_usage_ledger.posts_generated < p_max_limit
  RETURNING true;
$$;

ALTER TABLE scraped_inbox
  ADD COLUMN IF NOT EXISTS content_hash text;

UPDATE scraped_inbox
SET content_hash = md5(
  lower(trim(coalesce(department, ''))) || ':' ||
  regexp_replace(lower(trim(coalesce(title, ''))), '\\s+', ' ', 'g') || ':' ||
  lower(trim(coalesce(pdf_url, ''))) || ':' ||
  lower(trim(coalesce(apply_url, '')))
)
WHERE content_hash IS NULL;

ALTER TABLE scraped_inbox
  ALTER COLUMN content_hash SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS scraped_inbox_content_hash_key
  ON scraped_inbox (content_hash);
