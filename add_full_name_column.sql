-- Add full_name column to profiles table
ALTER TABLE public.profiles ADD COLUMN full_name TEXT;

-- Update existing records to use auth metadata if available
UPDATE public.profiles 
SET full_name = (
  SELECT (auth.users.raw_user_meta_data->>'full_name')::TEXT
  FROM auth.users 
  WHERE auth.users.id = profiles.id
  AND auth.users.raw_user_meta_data->>'full_name' IS NOT NULL
);

-- Update the trigger function to handle full_name
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, unit)
  VALUES (
    NEW.id, 
    COALESCE(NEW.email, 'User'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    'kg'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(NEW.email, profiles.username),
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the create_user_profile function
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID, user_email TEXT, user_full_name TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, unit)
  VALUES (user_id, COALESCE(user_email, 'User'), COALESCE(user_full_name, user_email, 'User'), 'kg')
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(user_email, profiles.username),
    full_name = COALESCE(user_full_name, profiles.full_name),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;