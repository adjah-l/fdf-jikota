-- Fix security issue with groups_all view by adding proper RLS policies
-- Since views don't inherit RLS from underlying tables by default, we need to add policies

-- Enable RLS on the view
ALTER VIEW public.groups_all SET (security_invoker = true);

-- Alternative approach: Drop and recreate with security invoker
DROP VIEW IF EXISTS public.groups_all;

CREATE VIEW public.groups_all 
WITH (security_invoker = true)
AS
SELECT
  ag.id,
  ag.org_id,
  ag.name,
  ag.activity_type,
  ag.description,
  ag.criteria_snapshot,
  ag.five_c_focus,
  ag.created_at
FROM public.activity_groups ag;