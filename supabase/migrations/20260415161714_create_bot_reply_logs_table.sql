/*
  # Create bot_reply_logs table

  ## Summary
  Stores a record of every message the auto-reply bot responded to.
  Used to display the "Reply Logs" tab in the Bot settings UI and to
  track bot activity over time.

  ## New Table: bot_reply_logs
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → users) - which user owns this account
  - `connected_account_id` (uuid, FK → connected_accounts) - the page that received the message
  - `platform` (text) - e.g. 'facebook'
  - `sender_id` (text) - the Messenger user ID or comment author ID
  - `incoming_message` (text) - the message/comment that triggered the rule
  - `reply_sent` (text) - the text that was sent as a reply
  - `replied_at` (timestamptz) - when the reply was sent
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled; users can only SELECT/INSERT their own logs
*/

CREATE TABLE IF NOT EXISTS bot_reply_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  connected_account_id uuid REFERENCES connected_accounts(id) ON DELETE SET NULL,
  platform text NOT NULL DEFAULT 'facebook',
  sender_id text NOT NULL DEFAULT '',
  incoming_message text NOT NULL DEFAULT '',
  reply_sent text NOT NULL DEFAULT '',
  replied_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bot_reply_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot reply logs"
  ON bot_reply_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bot reply logs"
  ON bot_reply_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert bot reply logs"
  ON bot_reply_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_bot_reply_logs_user_id ON bot_reply_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_reply_logs_replied_at ON bot_reply_logs(replied_at DESC);
