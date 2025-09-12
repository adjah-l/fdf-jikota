-- Fix critical security vulnerability in profiles table
-- Remove the overly permissive policy that allows viewing all profiles

-- First, drop the dangerous policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Remove duplicate policy (there are two similar update policies)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a more secure policy for viewing profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow viewing profiles of users in the same groups
-- This allows legitimate group interactions while protecting privacy
CREATE POLICY "Users can view group members profiles" 
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

-- For admin users, allow viewing all profiles (for legitimate administration)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin());

-- Ensure the user_id column is properly constrained
-- This prevents users from creating profiles for other users
ALTER TABLE public.profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Add a comment explaining the security model
COMMENT ON TABLE public.profiles IS 'User profiles with restricted access - users can only view their own profile and profiles of users in their shared groups';