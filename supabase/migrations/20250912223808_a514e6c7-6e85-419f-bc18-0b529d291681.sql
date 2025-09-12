-- Check if the trigger for creating profiles exists and fix any issues

-- First, check if the trigger exists
SELECT 
    tgname as trigger_name,
    tgenabled as enabled,
    pg_get_triggerdef(oid) as definition
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass 
AND tgname LIKE '%user%';

-- Check current RLS policies on profiles table
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- The handle_new_user function needs to be able to INSERT into profiles
-- Let's create a policy that allows the function to create profiles
CREATE POLICY "System can create profiles for new users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Also ensure the trigger exists for new user creation
DO $$
BEGIN
    -- Check if trigger exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created' 
        AND tgrelid = 'auth.users'::regclass
    ) THEN
        -- Create the trigger if it doesn't exist
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;