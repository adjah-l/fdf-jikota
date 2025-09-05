-- Check if there are any admin users, if not, we'll need to manually add one
-- This query will help us understand the current admin setup

-- First, let's see if we have any admin users
-- If you're logged in, we can add your user_id to the admin_users table

-- For now, let's create a temporary way to see all profiles so we can identify which user needs admin access
SELECT 
  p.user_id,
  p.full_name,
  p.first_name,
  p.last_name,
  au.role as admin_role
FROM profiles p
LEFT JOIN admin_users au ON p.user_id = au.user_id
ORDER BY p.created_at DESC
LIMIT 10;