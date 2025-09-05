-- Fix Profile Issues in Supabase

-- 1. Create missing profiles for existing users
INSERT INTO public.profiles (id, username, unit)
SELECT 
    auth.users.id,
    COALESCE(auth.users.email, 'User') as username,
    'kg' as unit
FROM auth.users
LEFT JOIN public.profiles ON auth.users.id = public.profiles.id
WHERE public.profiles.id IS NULL;

-- 2. Update the trigger function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if profile doesn't already exist
  INSERT INTO public.profiles (id, username, unit)
  VALUES (NEW.id, COALESCE(NEW.email, 'User'), 'kg')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate the trigger to ensure it's active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create a function to manually create profiles (for RLS bypass)
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, username, unit)
  VALUES (user_id, COALESCE(user_email, 'User'), 'kg')
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(user_email, profiles.username),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;