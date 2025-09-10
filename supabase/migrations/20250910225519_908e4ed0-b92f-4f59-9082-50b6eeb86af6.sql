-- Create a unified view for all groups
CREATE OR REPLACE VIEW public.groups_all AS
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