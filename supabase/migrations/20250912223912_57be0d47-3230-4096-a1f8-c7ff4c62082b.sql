-- Clean up duplicate policies and fix authentication flow

-- Remove duplicate policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Users can view group members profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.profiles;

-- The handle_new_user function should be SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Remove the overly permissive system policy since the function is now SECURITY DEFINER
DROP POLICY IF EXISTS "System can create profiles for new users" ON public.profiles;