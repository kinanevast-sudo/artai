/*
  # Add covering indexes for all unindexed foreign keys

  ## Summary
  Adds indexes on all foreign key columns that were flagged as missing covering indexes.
  This improves query performance for JOIN operations and cascading operations.

  ## Indexes Added
  - ai_generation_logs.user_id
  - analytics_data.connected_account_id
  - bot_replies_log.rule_id
  - bot_replies_log.user_id
  - bot_rules.user_id
  - competitors.user_id
  - connected_accounts.user_id
  - media_library.user_id
  - notifications.user_id
  - post_platforms.connected_account_id
  - post_platforms.post_id
  - post_platforms.user_id
  - published_posts.post_id
  - published_posts.user_id
  - scheduled_posts.user_id
  - subscriptions.user_id
  - team_members.member_user_id
  - team_members.owner_user_id
*/

CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_user_id ON public.ai_generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_connected_account_id ON public.analytics_data(connected_account_id);
CREATE INDEX IF NOT EXISTS idx_bot_replies_log_rule_id ON public.bot_replies_log(rule_id);
CREATE INDEX IF NOT EXISTS idx_bot_replies_log_user_id ON public.bot_replies_log(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_rules_user_id ON public.bot_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_competitors_user_id ON public.competitors(user_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_id ON public.connected_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_media_library_user_id ON public.media_library(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_connected_account_id ON public.post_platforms(connected_account_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON public.post_platforms(post_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_user_id ON public.post_platforms(user_id);
CREATE INDEX IF NOT EXISTS idx_published_posts_post_id ON public.published_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_published_posts_user_id ON public.published_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON public.scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member_user_id ON public.team_members(member_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_owner_user_id ON public.team_members(owner_user_id);
