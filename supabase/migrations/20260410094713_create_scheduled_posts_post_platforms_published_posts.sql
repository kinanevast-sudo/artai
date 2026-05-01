/*
  # Create scheduled_posts, post_platforms, and published_posts tables

  1. New Tables
    - `scheduled_posts` - Posts created by users for scheduling
      - id, user_id, title, content, media_ids, hashtags
      - scheduled_at, status, ai_generated, ai_prompt, failure_reason, publish_now
    - `post_platforms` - Per-platform entry for each scheduled post
      - id, post_id, user_id, platform, connected_account_id
      - custom_content, status, external_post_id, failure_reason, published_at
    - `published_posts` - Log of successfully published posts
      - id, post_id, user_id, platform, external_post_id, published_at

  2. Security
    - RLS enabled on all three tables
    - All access restricted to owning user
*/

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  media_ids uuid[] NOT NULL DEFAULT '{}',
  hashtags text[] NOT NULL DEFAULT '{}',
  scheduled_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  ai_generated boolean NOT NULL DEFAULT false,
  ai_prompt text NOT NULL DEFAULT '',
  failure_reason text NOT NULL DEFAULT '',
  publish_now boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON scheduled_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON scheduled_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON scheduled_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON scheduled_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS post_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  connected_account_id uuid REFERENCES connected_accounts(id) ON DELETE SET NULL,
  custom_content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  external_post_id text NOT NULL DEFAULT '',
  failure_reason text NOT NULL DEFAULT '',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post platforms"
  ON post_platforms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own post platforms"
  ON post_platforms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own post platforms"
  ON post_platforms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own post platforms"
  ON post_platforms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS published_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  external_post_id text NOT NULL DEFAULT '',
  published_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE published_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own published posts"
  ON published_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own published posts"
  ON published_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
