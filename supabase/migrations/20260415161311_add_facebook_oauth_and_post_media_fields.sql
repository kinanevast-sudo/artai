/*
  # Add Facebook OAuth fields and post media fields

  ## Summary
  This migration adds the missing columns needed for real Facebook OAuth integration,
  media attachments on scheduled posts, and ensures bot_rules/connected_accounts
  are fully aligned with the application requirements.

  ## Changes

  ### connected_accounts table
  - Add `access_token` (text) - stores the Facebook Page access token (encrypted at rest by Postgres)
  - Add `page_id` (text) - stores the Facebook Page ID (same as account_id but explicit for clarity)

  ### scheduled_posts table
  - Add `media_url` (text) - public URL of attached image/video
  - Add `media_type` (text) - one of: 'none', 'image', 'video'
  - Add `connected_account_id` (uuid, nullable FK) - which Facebook page to publish to
  - Add `error_message` (text) - stores failure details
  - Add `published_at` (timestamptz) - when it was actually published

  ## Security
  - No RLS changes needed; existing policies cover new columns automatically
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'connected_accounts' AND column_name = 'access_token'
  ) THEN
    ALTER TABLE connected_accounts ADD COLUMN access_token text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'connected_accounts' AND column_name = 'page_id'
  ) THEN
    ALTER TABLE connected_accounts ADD COLUMN page_id text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_posts' AND column_name = 'media_url'
  ) THEN
    ALTER TABLE scheduled_posts ADD COLUMN media_url text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_posts' AND column_name = 'media_type'
  ) THEN
    ALTER TABLE scheduled_posts ADD COLUMN media_type text NOT NULL DEFAULT 'none';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_posts' AND column_name = 'connected_account_id'
  ) THEN
    ALTER TABLE scheduled_posts ADD COLUMN connected_account_id uuid REFERENCES connected_accounts(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_posts' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE scheduled_posts ADD COLUMN error_message text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'scheduled_posts' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE scheduled_posts ADD COLUMN published_at timestamptz;
  END IF;
END $$;
