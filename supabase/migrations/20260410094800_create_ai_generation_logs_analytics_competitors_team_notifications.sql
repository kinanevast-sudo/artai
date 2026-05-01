/*
  # Create ai_generation_logs, analytics_data, competitors, team_members, and notifications tables

  1. New Tables
    - `ai_generation_logs` - Log of all AI content generation requests
      - id, user_id, topic, platform, tone, audience, variations_count, tokens_used, success
    - `analytics_data` - Daily social media metrics per platform per account
      - id, user_id, connected_account_id, platform, date
      - followers_count, following_count, posts_count, total_likes/comments/shares/reach/impressions
      - engagement_rate, new_followers, profile_views, link_clicks
    - `competitors` - Competitor social accounts tracked by users
      - id, user_id, platform, username, display_name, avatar_url, profile_url
      - followers_count, following_count, posts_count, avg_likes, avg_comments
      - engagement_rate, last_synced_at
    - `team_members` - Team invitations and memberships
      - id, owner_user_id, member_user_id, invited_email, role, status
      - invited_at, accepted_at
    - `notifications` - In-app notification feed for users
      - id, user_id, type, title, message, action_url, is_read

  2. Security
    - RLS enabled on all tables
    - All access restricted to owning user
    - team_members: owner can manage, member can view their own invites
*/

CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT '',
  variations_count integer NOT NULL DEFAULT 3,
  tokens_used integer NOT NULL DEFAULT 0,
  success boolean NOT NULL DEFAULT true,
  error_message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI logs"
  ON ai_generation_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI logs"
  ON ai_generation_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS analytics_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connected_account_id uuid REFERENCES connected_accounts(id) ON DELETE SET NULL,
  platform text NOT NULL,
  date date NOT NULL,
  followers_count integer NOT NULL DEFAULT 0,
  following_count integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  total_likes integer NOT NULL DEFAULT 0,
  total_comments integer NOT NULL DEFAULT 0,
  total_shares integer NOT NULL DEFAULT 0,
  total_reach integer NOT NULL DEFAULT 0,
  total_impressions integer NOT NULL DEFAULT 0,
  engagement_rate numeric(6,4) NOT NULL DEFAULT 0,
  new_followers integer NOT NULL DEFAULT 0,
  profile_views integer NOT NULL DEFAULT 0,
  link_clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, connected_account_id, platform, date)
);

ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON analytics_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  username text NOT NULL DEFAULT '',
  display_name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  profile_url text NOT NULL DEFAULT '',
  followers_count integer NOT NULL DEFAULT 0,
  following_count integer NOT NULL DEFAULT 0,
  posts_count integer NOT NULL DEFAULT 0,
  avg_likes numeric(10,2) NOT NULL DEFAULT 0,
  avg_comments numeric(10,2) NOT NULL DEFAULT 0,
  engagement_rate numeric(6,4) NOT NULL DEFAULT 0,
  last_synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own competitors"
  ON competitors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitors"
  ON competitors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitors"
  ON competitors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitors"
  ON competitors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  invited_email text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'viewer',
  status text NOT NULL DEFAULT 'pending',
  invited_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id OR auth.uid() = member_user_id);

CREATE POLICY "Owners can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id OR auth.uid() = member_user_id)
  WITH CHECK (auth.uid() = owner_user_id OR auth.uid() = member_user_id);

CREATE POLICY "Owners can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  action_url text NOT NULL DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
