-- Fix critical security vulnerability in profiles table
-- Step 1: Remove the dangerous policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Step 2: Create policy to allow viewing profiles of users in the same groups
-- This allows legitimate group interactions while protecting privacy
CREATE POLICY "Users can view group member profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() != user_id AND (
    -- User is in the same activity group
    EXISTS (
      SELECT 1 FROM public.activity_group_members agm1
      JOIN public.activity_group_members agm2 ON agm1.group_id = agm2.group_id
      WHERE agm1.user_id = auth.uid() 
      AND agm2.user_id = profiles.user_id
      AND agm1.status = 'assigned' 
      AND agm2.status = 'assigned'
    )
    OR
    -- User is in the same dinner group (for backward compatibility)
    EXISTS (
      SELECT 1 FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() 
      AND gm2.user_id = profiles.user_id
      AND gm1.status = 'assigned' 
      AND gm2.status = 'assigned'
    )
  )
);

-- Step 3: For admin users, allow viewing all profiles (for legitimate administration)
CREATE POLICY "Admins can view all user profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Step 4: Add helpful comment explaining the security model
COMMENT ON TABLE public.profiles IS 'User profiles with restricted access - users can only view their own profile and profiles of users in their shared groups';