-- Create enum for activity types
CREATE TYPE IF NOT EXISTS public.group_activity_type AS ENUM (
  'dinner',
  'prayer_study', 
  'workout',
  'sports',
  'flexible'
);

-- Create new activity_groups table
CREATE TABLE IF NOT EXISTS public.activity_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id),
  name text NOT NULL,
  activity_type public.group_activity_type NOT NULL DEFAULT 'dinner',
  description text,
  criteria_snapshot jsonb,
  five_c_focus text DEFAULT 'balance',
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

-- Enable RLS on activity_groups
ALTER TABLE public.activity_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for activity_groups (mirror dinner_groups policies)
CREATE POLICY "Admins can create activity groups" 
ON public.activity_groups 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update activity groups" 
ON public.activity_groups 
FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can view all activity groups" 
ON public.activity_groups 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "Everyone can view approved activity groups" 
ON public.activity_groups 
FOR SELECT 
TO authenticated
USING ((status = 'approved'::text) OR (status = 'active'::text) OR (status = 'completed'::text));

-- Add migration bridge column to dinner_groups
ALTER TABLE IF EXISTS public.dinner_groups 
ADD COLUMN IF NOT EXISTS migrated_to uuid REFERENCES public.activity_groups(id);

-- Create activity_group_members table (mirror group_members)
CREATE TABLE IF NOT EXISTS public.activity_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.activity_groups(id),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'assigned',
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on activity_group_members
ALTER TABLE public.activity_group_members ENABLE ROW LEVEL SECURITY;

-- Create policies for activity_group_members (mirror group_members policies)
CREATE POLICY "Admins can manage activity group memberships" 
ON public.activity_group_members 
FOR ALL
TO authenticated
USING (is_admin());

CREATE POLICY "Users can view their own activity group memberships" 
ON public.activity_group_members 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

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