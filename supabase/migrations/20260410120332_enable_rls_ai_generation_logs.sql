/*
  # Enable RLS on ai_generation_logs table

  ## Summary
  The ai_generation_logs table has RLS policies defined but RLS was not enabled,
  meaning the policies were not being enforced. This migration enables RLS and
  also updates the existing policies to use the optimized (select auth.uid()) pattern.

  ## Changes
  - Enable RLS on ai_generation_logs
  - Drop and recreate policies with optimized auth.uid() pattern
*/

ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI logs" ON public.ai_generation_logs;
DROP POLICY IF EXISTS "Users can insert own AI logs" ON public.ai_generation_logs;

CREATE POLICY "Users can view own AI logs"
  ON public.ai_generation_logs FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own AI logs"
  ON public.ai_generation_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
