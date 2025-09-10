-- 1) Activity type enum (safe if already created)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_activity_type') THEN
    CREATE TYPE public.group_activity_type AS ENUM ('dinner','prayer_study','workout','sports','flexible');
  END IF;
END$$;

-- 2) New generalized groups table (additive)
CREATE TABLE IF NOT EXISTS public.activity_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id),
  name text NOT NULL,
  activity_type public.group_activity_type NOT NULL DEFAULT 'dinner',
  description text,
  criteria_snapshot jsonb,
  five_c_focus text DEFAULT 'balance',
  source_dg_id uuid UNIQUE,  -- used only for migration mapping
  status text NOT NULL DEFAULT 'draft',
  scheduled_date timestamptz,
  host_user_id uuid,
  approved_by uuid,
  created_by uuid,
  max_members integer NOT NULL DEFAULT 8,
  location_type text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Bridge column on old table so we know what was migrated
ALTER TABLE IF EXISTS public.dinner_groups
  ADD COLUMN IF NOT EXISTS migrated_to uuid REFERENCES public.activity_groups(id);

-- Optional indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_activity_groups_org ON public.activity_groups(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_groups_source ON public.activity_groups(source_dg_id);

-- 4) Backfill copy
-- Use row_to_json to safely read optional columns from dinner_groups without compile-time coupling.
INSERT INTO public.activity_groups (org_id, name, activity_type, description, criteria_snapshot, source_dg_id, status, scheduled_date, host_user_id, approved_by, created_by, max_members, location_type)
SELECT
  -- org_id if it exists on dinner_groups, otherwise null
  ((row_to_json(dg)->>'org_id')::uuid),
  COALESCE(dg.name, 'Dinner Group ' || LEFT(dg.id::text, 8)),
  'dinner'::public.group_activity_type,
  (row_to_json(dg)->>'description'),
  (row_to_json(dg)->'criteria_snapshot')::jsonb,
  dg.id,
  COALESCE((row_to_json(dg)->>'status'), 'draft'),
  ((row_to_json(dg)->>'scheduled_date')::timestamptz),
  ((row_to_json(dg)->>'host_user_id')::uuid),
  ((row_to_json(dg)->>'approved_by')::uuid),
  ((row_to_json(dg)->>'created_by')::uuid),
  COALESCE(((row_to_json(dg)->>'max_members')::integer), 8),
  (row_to_json(dg)->>'location_type')
FROM public.dinner_groups dg
WHERE dg.migrated_to IS NULL
ON CONFLICT (source_dg_id) DO NOTHING;

-- 5) Link old rows to their new counterparts
UPDATE public.dinner_groups dg
SET migrated_to = ag.id
FROM public.activity_groups ag
WHERE ag.source_dg_id = dg.id
  AND dg.migrated_to IS NULL;

-- 6) RLS enablement for new table
ALTER TABLE public.activity_groups ENABLE ROW LEVEL SECURITY;

-- Proper RLS policies for activity_groups
CREATE POLICY "Admins can manage all activity groups"
ON public.activity_groups
FOR ALL
TO authenticated
USING (is_admin());

CREATE POLICY "Organization members can view their org's activity groups"
ON public.activity_groups
FOR SELECT
TO authenticated
USING (
  org_id IS NULL OR 
  org_id = ANY(get_user_orgs())
);

CREATE POLICY "Everyone can view approved activity groups"
ON public.activity_groups
FOR SELECT
TO authenticated
USING (status IN ('approved', 'active', 'completed'));

-- Create activity_group_members table
CREATE TABLE IF NOT EXISTS public.activity_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.activity_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'assigned',
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on activity_group_members
ALTER TABLE public.activity_group_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_group_members
CREATE POLICY "Admins can manage all activity group members"
ON public.activity_group_members
FOR ALL
TO authenticated
USING (is_admin());

CREATE POLICY "Users can view their own activity group memberships"
ON public.activity_group_members
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Migrate group members
INSERT INTO public.activity_group_members (group_id, user_id, status, added_at)
SELECT 
  ag.id as group_id,
  gm.user_id,
  gm.status,
  gm.added_at
FROM public.group_members gm
JOIN public.dinner_groups dg ON gm.group_id = dg.id
JOIN public.activity_groups ag ON ag.source_dg_id = dg.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.activity_group_members agm 
  WHERE agm.group_id = ag.id AND agm.user_id = gm.user_id
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_activity_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activity_groups_updated_at
BEFORE UPDATE ON public.activity_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_activity_groups_updated_at();