/*
  # Fix RLS policy performance - use (select auth.uid()) pattern

  ## Summary
  Replaces all direct `auth.uid()` calls in RLS policies with `(select auth.uid())`
  to prevent re-evaluation on every row. This significantly improves query performance
  at scale by evaluating the auth function once per query instead of once per row.

  ## Tables Updated
  - public.users (3 policies)
  - public.subscriptions (3 policies)
  - public.connected_accounts (4 policies)
  - public.media_library (4 policies)
  - public.scheduled_posts (4 policies)
  - public.post_platforms (4 policies)
  - public.published_posts (2 policies)
  - public.bot_settings (3 policies)
  - public.bot_rules (4 policies)
  - public.bot_replies_log (2 policies)
  - public.analytics_data (3 policies)
  - public.competitors (4 policies)
  - public.team_members (4 policies)
  - public.notifications (4 policies)
*/

-- users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- connected_accounts
DROP POLICY IF EXISTS "Users can view own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can insert own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can update own connected accounts" ON public.connected_accounts;
DROP POLICY IF EXISTS "Users can delete own connected accounts" ON public.connected_accounts;

CREATE POLICY "Users can view own connected accounts"
  ON public.connected_accounts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own connected accounts"
  ON public.connected_accounts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own connected accounts"
  ON public.connected_accounts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own connected accounts"
  ON public.connected_accounts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- media_library
DROP POLICY IF EXISTS "Users can view own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can insert own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can update own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can delete own media" ON public.media_library;

CREATE POLICY "Users can view own media"
  ON public.media_library FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own media"
  ON public.media_library FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own media"
  ON public.media_library FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own media"
  ON public.media_library FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- scheduled_posts
DROP POLICY IF EXISTS "Users can view own posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.scheduled_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.scheduled_posts;

CREATE POLICY "Users can view own posts"
  ON public.scheduled_posts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own posts"
  ON public.scheduled_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own posts"
  ON public.scheduled_posts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own posts"
  ON public.scheduled_posts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- post_platforms
DROP POLICY IF EXISTS "Users can view own post platforms" ON public.post_platforms;
DROP POLICY IF EXISTS "Users can insert own post platforms" ON public.post_platforms;
DROP POLICY IF EXISTS "Users can update own post platforms" ON public.post_platforms;
DROP POLICY IF EXISTS "Users can delete own post platforms" ON public.post_platforms;

CREATE POLICY "Users can view own post platforms"
  ON public.post_platforms FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own post platforms"
  ON public.post_platforms FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own post platforms"
  ON public.post_platforms FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own post platforms"
  ON public.post_platforms FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- published_posts
DROP POLICY IF EXISTS "Users can view own published posts" ON public.published_posts;
DROP POLICY IF EXISTS "Users can insert own published posts" ON public.published_posts;

CREATE POLICY "Users can view own published posts"
  ON public.published_posts FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own published posts"
  ON public.published_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- bot_settings
DROP POLICY IF EXISTS "Users can view own bot settings" ON public.bot_settings;
DROP POLICY IF EXISTS "Users can insert own bot settings" ON public.bot_settings;
DROP POLICY IF EXISTS "Users can update own bot settings" ON public.bot_settings;

CREATE POLICY "Users can view own bot settings"
  ON public.bot_settings FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own bot settings"
  ON public.bot_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own bot settings"
  ON public.bot_settings FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- bot_rules
DROP POLICY IF EXISTS "Users can view own bot rules" ON public.bot_rules;
DROP POLICY IF EXISTS "Users can insert own bot rules" ON public.bot_rules;
DROP POLICY IF EXISTS "Users can update own bot rules" ON public.bot_rules;
DROP POLICY IF EXISTS "Users can delete own bot rules" ON public.bot_rules;

CREATE POLICY "Users can view own bot rules"
  ON public.bot_rules FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own bot rules"
  ON public.bot_rules FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own bot rules"
  ON public.bot_rules FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own bot rules"
  ON public.bot_rules FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- bot_replies_log
DROP POLICY IF EXISTS "Users can view own bot reply logs" ON public.bot_replies_log;
DROP POLICY IF EXISTS "Users can insert own bot reply logs" ON public.bot_replies_log;

CREATE POLICY "Users can view own bot reply logs"
  ON public.bot_replies_log FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own bot reply logs"
  ON public.bot_replies_log FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- analytics_data
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics_data;
DROP POLICY IF EXISTS "Users can insert own analytics" ON public.analytics_data;
DROP POLICY IF EXISTS "Users can update own analytics" ON public.analytics_data;

CREATE POLICY "Users can view own analytics"
  ON public.analytics_data FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own analytics"
  ON public.analytics_data FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own analytics"
  ON public.analytics_data FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- competitors
DROP POLICY IF EXISTS "Users can view own competitors" ON public.competitors;
DROP POLICY IF EXISTS "Users can insert own competitors" ON public.competitors;
DROP POLICY IF EXISTS "Users can update own competitors" ON public.competitors;
DROP POLICY IF EXISTS "Users can delete own competitors" ON public.competitors;

CREATE POLICY "Users can view own competitors"
  ON public.competitors FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own competitors"
  ON public.competitors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own competitors"
  ON public.competitors FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own competitors"
  ON public.competitors FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- team_members
DROP POLICY IF EXISTS "Owners can view their team members" ON public.team_members;
DROP POLICY IF EXISTS "Owners can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Owners can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Owners can delete team members" ON public.team_members;

CREATE POLICY "Owners can view their team members"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (owner_user_id = (SELECT auth.uid()) OR member_user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can insert team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (owner_user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (owner_user_id = (SELECT auth.uid()))
  WITH CHECK (owner_user_id = (SELECT auth.uid()));

CREATE POLICY "Owners can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (owner_user_id = (SELECT auth.uid()));

-- notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
