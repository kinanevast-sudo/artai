/*
  # Add trigger to sync email verification status

  1. Changes
    - Creates a trigger function that fires when auth.users is updated
    - When email_confirmed_at becomes non-null (user verifies email),
      it sets is_email_verified = true in public.users table
    - Also handles upsert on new user creation to ensure the row exists

  2. Notes
    - This keeps public.users.is_email_verified in sync with Supabase Auth state
    - The trigger runs as SECURITY DEFINER to bypass RLS when updating the users table
*/

CREATE OR REPLACE FUNCTION public.sync_email_verified()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.users
    SET is_email_verified = true,
        updated_at = now()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;

CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_email_verified();
