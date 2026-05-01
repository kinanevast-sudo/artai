/*
  # Create bot_settings, bot_rules, and bot_replies_log tables

  1. New Tables
    - `bot_settings` - Per-user auto-reply bot configuration
      - id, user_id, is_enabled, ai_replies_enabled, default_language
      - reply_delay_seconds, max_replies_per_day, platforms, blacklisted_words
    - `bot_rules` - Keyword-triggered reply rules
      - id, user_id, name, trigger_keywords, reply_template, platforms
      - is_active, match_exact, case_sensitive, trigger_count
    - `bot_replies_log` - Log of all bot replies sent
      - id, user_id, rule_id, platform, trigger_text, reply_text, is_ai_generated

  2. Security
    - RLS enabled on all tables
    - All access restricted to owning user
*/

CREATE TABLE IF NOT EXISTS bot_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_enabled boolean NOT NULL DEFAULT false,
  ai_replies_enabled boolean NOT NULL DEFAULT false,
  default_language text NOT NULL DEFAULT 'en',
  reply_delay_seconds integer NOT NULL DEFAULT 30,
  max_replies_per_day integer NOT NULL DEFAULT 100,
  platforms text[] NOT NULL DEFAULT '{}',
  blacklisted_words text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bot_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot settings"
  ON bot_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot settings"
  ON bot_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bot settings"
  ON bot_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bot_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  trigger_keywords text[] NOT NULL DEFAULT '{}',
  reply_template text NOT NULL DEFAULT '',
  platforms text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  match_exact boolean NOT NULL DEFAULT false,
  case_sensitive boolean NOT NULL DEFAULT false,
  trigger_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bot_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot rules"
  ON bot_rules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot rules"
  ON bot_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bot rules"
  ON bot_rules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bot rules"
  ON bot_rules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS bot_replies_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rule_id uuid REFERENCES bot_rules(id) ON DELETE SET NULL,
  platform text NOT NULL,
  trigger_text text NOT NULL DEFAULT '',
  reply_text text NOT NULL DEFAULT '',
  is_ai_generated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bot_replies_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot reply logs"
  ON bot_replies_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot reply logs"
  ON bot_replies_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
