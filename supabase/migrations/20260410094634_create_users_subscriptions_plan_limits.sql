/*
  # Create users, subscriptions, and plan_limits tables

  1. New Tables
    - `users` - User profiles linked to auth.users
      - id (uuid, pk, references auth.users)
      - email, display_name, avatar_url, language, theme, timezone
      - plan_type, trial_ends_at, is_email_verified, onboarding_completed
    - `subscriptions` - Stripe subscription records per user
      - id, user_id, stripe_customer_id, stripe_subscription_id
      - plan_type, status, current_period_start/end, cancel_at_period_end
    - `plan_limits` - Static plan feature limits (seeded)
      - id, plan_type, max_connected_accounts, max_posts_per_month
      - max_storage_mb, ai_writer_enabled, ai_posts_per_month
      - bot_enabled, bot_ai_replies, advanced_analytics, competitor_analysis
      - max_competitors, max_team_members, price_monthly_cents, stripe_price_id

  2. Security
    - RLS enabled on users and subscriptions
    - plan_limits is read-only for authenticated users (no user-specific data)

  3. Seed data
    - 4 plan_limits rows: trial, basic, pro, enterprise
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  theme text NOT NULL DEFAULT 'light',
  timezone text NOT NULL DEFAULT 'UTC',
  plan_type text NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  is_email_verified boolean NOT NULL DEFAULT false,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL DEFAULT '',
  stripe_subscription_id text NOT NULL DEFAULT '',
  plan_type text NOT NULL DEFAULT 'trial',
  status text NOT NULL DEFAULT 'trialing',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  cancelled_at timestamptz,
  customer_email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS plan_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type text UNIQUE NOT NULL,
  max_connected_accounts integer NOT NULL DEFAULT 1,
  max_posts_per_month integer NOT NULL DEFAULT 30,
  max_storage_mb integer NOT NULL DEFAULT 5120,
  ai_writer_enabled boolean NOT NULL DEFAULT false,
  ai_posts_per_month integer NOT NULL DEFAULT 0,
  bot_enabled boolean NOT NULL DEFAULT false,
  bot_ai_replies boolean NOT NULL DEFAULT false,
  advanced_analytics boolean NOT NULL DEFAULT false,
  competitor_analysis boolean NOT NULL DEFAULT false,
  max_competitors integer NOT NULL DEFAULT 0,
  max_team_members integer NOT NULL DEFAULT 1,
  price_monthly_cents integer NOT NULL DEFAULT 0,
  stripe_price_id text NOT NULL DEFAULT ''
);

ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view plan limits"
  ON plan_limits FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO plan_limits (plan_type, max_connected_accounts, max_posts_per_month, max_storage_mb, ai_writer_enabled, ai_posts_per_month, bot_enabled, bot_ai_replies, advanced_analytics, competitor_analysis, max_competitors, max_team_members, price_monthly_cents, stripe_price_id)
VALUES
  ('trial',      1,   30,    5120,  false,  0,   false, false, false, false, 0,  1,  0,    ''),
  ('basic',      3,   100,   20480, true,   100, false, false, true,  false, 0,  1,  900,  ''),
  ('pro',        10,  -1,    102400,true,   -1,  true,  true,  true,  true,  10, 5,  2900, ''),
  ('enterprise', -1,  -1,    -1,    true,   -1,  true,  true,  true,  true,  -1, -1, 9900, '')
ON CONFLICT (plan_type) DO NOTHING;
