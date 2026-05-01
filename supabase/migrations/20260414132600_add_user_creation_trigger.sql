/*
  # Add trigger to auto-create users profile on auth signup

  ## Purpose
  When a new user signs up via Supabase Auth (email/password or Google OAuth),
  automatically insert a corresponding row into the public.users table.
  This bypasses RLS issues that occur because the user isn't fully authenticated
  at the moment of signup.

  ## Changes
  - Creates function `handle_new_user()` that runs as SECURITY DEFINER (elevated privileges)
  - Creates trigger `on_auth_user_created` on auth.users that fires after INSERT
  - The function upserts into public.users to safely handle any duplicates

  ## Notes
  - Uses ON CONFLICT DO UPDATE to handle re-runs safely
  - Reads display_name from auth metadata (set during signUp call)
  - avatar_url is read from raw_user_meta_data (populated by Google OAuth)
  - The trigger approach is the recommended Supabase pattern for this use case
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(
      EXCLUDED.display_name,
      public.users.display_name
    ),
    avatar_url = CASE
      WHEN EXCLUDED.avatar_url != '' THEN EXCLUDED.avatar_url
      ELSE public.users.avatar_url
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
