/*
  # Create connected_accounts and media_library tables

  1. New Tables
    - `connected_accounts` - Social media accounts linked by users
      - id, user_id, platform, account_id, account_name, account_username
      - avatar_url, is_active, followers_count, following_count, posts_count
      - token_expires_at
    - `media_library` - Cloud media items uploaded by users
      - id, user_id, file_name, file_type, mime_type, file_size_bytes
      - url, thumbnail_url, width, height, duration_seconds, alt_text, tags

  2. Security
    - RLS enabled on both tables
    - All operations restricted to authenticated users who own the records
*/

CREATE TABLE IF NOT EXISTS connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  account_id text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  account_username text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  followers_count integer NOT NULL DEFAULT 0,
  following_count integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connected accounts"
  ON connected_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own connected accounts"
  ON connected_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own connected accounts"
  ON connected_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own connected accounts"
  ON connected_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL DEFAULT '',
  file_type text NOT NULL DEFAULT 'image',
  mime_type text NOT NULL DEFAULT '',
  file_size_bytes bigint NOT NULL DEFAULT 0,
  url text NOT NULL DEFAULT '',
  thumbnail_url text NOT NULL DEFAULT '',
  width integer NOT NULL DEFAULT 0,
  height integer NOT NULL DEFAULT 0,
  duration_seconds numeric NOT NULL DEFAULT 0,
  alt_text text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media"
  ON media_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own media"
  ON media_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
