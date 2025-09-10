-- 1) Activity type enum (safe if already created)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'group_activity_type') THEN
    CREATE TYPE public.group_activity_type AS ENUM ('dinner','prayer_study','workout','sports','flexible');
  END IF;
END$$;

-- 2) Check if activity_groups already exists and has the right structure
DO $$
BEGIN
  -- Only add source_dg_id if the table exists but doesn't have this column
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_groups' AND table_schema = 'public') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_groups' AND column_name = 'source_dg_id' AND table_schema = 'public') THEN
      ALTER TABLE public.activity_groups ADD COLUMN source_dg_id uuid UNIQUE;
    END IF;
  ELSE
    -- Create the table if it doesn't exist
    CREATE TABLE public.activity_groups (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id uuid REFERENCES public.organizations(id),
      name text NOT NULL,
      activity_type public.group_activity_type NOT NULL DEFAULT 'dinner',
      description text,
      criteria_snapshot jsonb,
      five_c_focus text DEFAULT 'balance',
      source_dg_id uuid UNIQUE,
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
  END IF;
END$$;

-- 3) Bridge column on old table so we know what was migrated
ALTER TABLE IF EXISTS public.dinner_groups
  ADD COLUMN IF NOT EXISTS migrated_to uuid REFERENCES public.activity_groups(id);

-- Optional indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_activity_groups_org ON public.activity_groups(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_groups_source ON public.activity_groups(source_dg_id);

-- 4) Migrate data only if dinner_groups exist and activity_groups is ready
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dinner_groups' AND table_schema = 'public') THEN
    -- Backfill copy with safe column access
    INSERT INTO public.activity_groups (org_id, name, activity_type, description, source_dg_id, status, max_members)
    SELECT
      dg.org_id,
      COALESCE(dg.name, 'Dinner Group ' || LEFT(dg.id::text, 8)),
      'dinner'::public.group_activity_type,
      dg.description,
      dg.id,
      COALESCE(dg.status, 'draft'),
      COALESCE(dg.max_members, 8)
    FROM public.dinner_groups dg
    WHERE dg.migrated_to IS NULL
    ON CONFLICT (source_dg_id) DO NOTHING;

    -- Link old rows to their new counterparts
    UPDATE public.dinner_groups dg
    SET migrated_to = ag.id
    FROM public.activity_groups ag
    WHERE ag.source_dg_id = dg.id
      AND dg.migrated_to IS NULL;
  END IF;
END$$;

-- 5) RLS enablement for new table
ALTER TABLE public.activity_groups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all activity groups" ON public.activity_groups;
DROP POLICY IF EXISTS "Organization members can view their org's activity groups" ON public.activity_groups;
DROP POLICY IF EXISTS "Everyone can view approved activity groups" ON public.activity_groups;

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
  (org_id = ANY(get_user_orgs()))
);

CREATE POLICY "Everyone can view approved activity groups"
ON public.activity_groups
FOR SELECT
TO authenticated
USING (status IN ('approved', 'active', 'completed'));

-- Create activity_group_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.activity_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'assigned',
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on activity_group_members
ALTER TABLE public.activity_group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all activity group members" ON public.activity_group_members;
DROP POLICY IF EXISTS "Users can view their own activity group memberships" ON public.activity_group_members;

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

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_activity_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_activity_groups_updated_at ON public.activity_groups;
CREATE TRIGGER update_activity_groups_updated_at
BEFORE UPDATE ON public.activity_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_activity_groups_updated_at();