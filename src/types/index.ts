export type Language = 'en' | 'ar' | 'fr' | 'es'
export type Theme = 'light' | 'dark'
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
export type PlanType = 'trial' | 'basic' | 'pro' | 'enterprise'
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete'

export interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url: string
  language: Language
  theme: Theme
  timezone: string
  plan_type: PlanType
  trial_ends_at: string
  is_email_verified: boolean
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan_type: PlanType
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at: string | null
  created_at: string
  updated_at: string
}

export interface PlanLimits {
  id: string
  plan_type: PlanType
  max_connected_accounts: number
  max_posts_per_month: number
  max_storage_mb: number
  ai_writer_enabled: boolean
  ai_posts_per_month: number
  bot_enabled: boolean
  bot_ai_replies: boolean
  advanced_analytics: boolean
  competitor_analysis: boolean
  max_competitors: number
  max_team_members: number
  price_monthly_cents: number
  stripe_price_id: string
}

export interface ConnectedAccount {
  id: string
  user_id: string
  platform: Platform
  account_id: string
  account_name: string
  account_username: string
  avatar_url: string
  is_active: boolean
  followers_count: number
  following_count: number
  posts_count: number
  token_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface MediaItem {
  id: string
  user_id: string
  file_name: string
  file_type: 'image' | 'video'
  mime_type: string
  file_size_bytes: number
  url: string
  thumbnail_url: string
  width: number
  height: number
  duration_seconds: number
  alt_text: string
  tags: string[]
  created_at: string
}

export interface ScheduledPost {
  id: string
  user_id: string
  title: string
  content: string
  media_ids: string[]
  hashtags: string[]
  scheduled_at: string | null
  status: PostStatus
  ai_generated: boolean
  ai_prompt: string
  failure_reason: string
  publish_now: boolean
  created_at: string
  updated_at: string
  post_platforms?: PostPlatform[]
}

export interface PostPlatform {
  id: string
  post_id: string
  user_id: string
  platform: Platform
  connected_account_id: string | null
  custom_content: string
  status: 'pending' | 'publishing' | 'published' | 'failed'
  external_post_id: string
  failure_reason: string
  published_at: string | null
  created_at: string
}

export interface BotSettings {
  id: string
  user_id: string
  is_enabled: boolean
  ai_replies_enabled: boolean
  default_language: Language
  reply_delay_seconds: number
  max_replies_per_day: number
  platforms: Platform[]
  blacklisted_words: string[]
  created_at: string
  updated_at: string
}

export interface BotRule {
  id: string
  user_id: string
  name: string
  trigger_keywords: string[]
  reply_template: string
  platforms: Platform[]
  is_active: boolean
  match_exact: boolean
  case_sensitive: boolean
  trigger_count: number
  created_at: string
  updated_at: string
}

export interface AnalyticsData {
  id: string
  user_id: string
  connected_account_id: string | null
  platform: Platform
  date: string
  followers_count: number
  following_count: number
  posts_count: number
  total_likes: number
  total_comments: number
  total_shares: number
  total_reach: number
  total_impressions: number
  engagement_rate: number
  new_followers: number
  profile_views: number
  link_clicks: number
  created_at: string
}

export interface Competitor {
  id: string
  user_id: string
  platform: Platform
  username: string
  display_name: string
  avatar_url: string
  profile_url: string
  followers_count: number
  following_count: number
  posts_count: number
  avg_likes: number
  avg_comments: number
  engagement_rate: number
  last_synced_at: string | null
  created_at: string
}

export interface TeamMember {
  id: string
  owner_user_id: string
  member_user_id: string | null
  invited_email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'pending' | 'accepted' | 'declined' | 'revoked'
  invited_at: string
  accepted_at: string | null
}

export interface Notification {
  id: string
  user_id: string
  type: 'post_published' | 'post_failed' | 'bot_reply' | 'plan_expiring' | 'plan_expired' | 'team_invite' | 'analytics_ready' | 'system'
  title: string
  message: string
  action_url: string
  is_read: boolean
  created_at: string
}
