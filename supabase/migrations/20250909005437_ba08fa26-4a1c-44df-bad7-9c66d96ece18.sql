-- Add email column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email text;

-- Create unique index on email to prevent duplicates (allows nulls)
CREATE UNIQUE INDEX idx_profiles_email_unique 
ON public.profiles (email) 
WHERE email IS NOT NULL;