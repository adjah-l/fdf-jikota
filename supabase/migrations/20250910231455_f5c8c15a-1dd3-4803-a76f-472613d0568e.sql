-- Add preferred_activity_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_activity_type public.group_activity_type;