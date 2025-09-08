-- Create matching_policies table for per-community matching rules
CREATE TABLE public.matching_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  neighborhood_id UUID NOT NULL REFERENCES public.neighborhoods(id),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Matching mode settings
  mode TEXT NOT NULL DEFAULT 'automatic', -- 'automatic' or 'review_required'
  default_group_size INTEGER NOT NULL DEFAULT 5,
  family_group_size INTEGER NOT NULL DEFAULT 4,
  
  -- Gender matching rules
  gender_mode TEXT NOT NULL DEFAULT 'mixed', -- 'mixed' or 'single'
  gender_allowed TEXT[] DEFAULT ARRAY['men', 'women'],
  gender_hard BOOLEAN NOT NULL DEFAULT false,
  gender_weight INTEGER NOT NULL DEFAULT 40,
  
  -- Stage of life matching rules
  stage_alignment TEXT NOT NULL DEFAULT 'mix', -- 'mix' or 'same'
  stage_hard BOOLEAN NOT NULL DEFAULT false,
  stage_weight INTEGER NOT NULL DEFAULT 60,
  
  -- Seasonal interest matching rules
  season_use BOOLEAN NOT NULL DEFAULT false,
  season_value TEXT DEFAULT 'winter', -- 'fall', 'winter', 'spring', 'summer'
  season_weight INTEGER NOT NULL DEFAULT 50,
  
  -- Family stage alignment
  family_stage_alignment TEXT NOT NULL DEFAULT 'mix', -- 'mix' or 'same'
  family_stage_hard BOOLEAN NOT NULL DEFAULT false,
  family_stage_weight INTEGER NOT NULL DEFAULT 40,
  
  -- Age group matching rules
  age_alignment TEXT NOT NULL DEFAULT 'mix', -- 'mix' or 'same'
  age_hard BOOLEAN NOT NULL DEFAULT false,
  age_weight INTEGER NOT NULL DEFAULT 30,
  
  -- Location rules
  location_scope TEXT NOT NULL DEFAULT 'inside_only', -- 'inside_only' or 'nearby_ok'
  max_distance_miles INTEGER DEFAULT 25,
  location_hard BOOLEAN NOT NULL DEFAULT true,
  same_community_weight INTEGER NOT NULL DEFAULT 50,
  
  -- Fallback strategy
  fallback_strategy TEXT NOT NULL DEFAULT 'auto_relax', -- 'fill_partial', 'auto_relax', 'waitlist'
  
  -- Make sure each neighborhood only has one active policy
  UNIQUE(neighborhood_id)
);

-- Enable RLS
ALTER TABLE public.matching_policies ENABLE ROW LEVEL SECURITY;

-- Create policies for matching_policies table
CREATE POLICY "Admins can manage matching policies" 
ON public.matching_policies 
FOR ALL 
USING (is_admin());

-- Create audit log for policy changes
CREATE TABLE public.matching_policy_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID NOT NULL REFERENCES public.matching_policies(id),
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  old_policy JSONB,
  new_policy JSONB,
  change_reason TEXT
);

-- Enable RLS for audit table
ALTER TABLE public.matching_policy_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for audit table
CREATE POLICY "Admins can view policy audit" 
ON public.matching_policy_audit 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_matching_policies_updated_at
BEFORE UPDATE ON public.matching_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get matching policy for a neighborhood
CREATE OR REPLACE FUNCTION public.get_matching_policy(neighborhood_id_param UUID)
RETURNS public.matching_policies
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.matching_policies 
  WHERE neighborhood_id = neighborhood_id_param;
$$;

-- Create function to simulate matching for a neighborhood
CREATE OR REPLACE FUNCTION public.simulate_matching(
  neighborhood_id_param UUID,
  policy_overrides JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  eligible_members INTEGER,
  potential_groups INTEGER,
  waitlist_members INTEGER,
  simulation_details JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  policy_rec public.matching_policies;
  member_count INTEGER;
  group_size INTEGER;
BEGIN
  -- Get the matching policy for this neighborhood
  SELECT * INTO policy_rec
  FROM public.matching_policies 
  WHERE neighborhood_id = neighborhood_id_param;
  
  -- If no policy exists, create default
  IF policy_rec.id IS NULL THEN
    INSERT INTO public.matching_policies (neighborhood_id)
    VALUES (neighborhood_id_param)
    RETURNING * INTO policy_rec;
  END IF;
  
  -- Count eligible members (simplified for now)
  SELECT COUNT(*) INTO member_count
  FROM public.user_neighborhoods un
  JOIN public.profiles p ON un.user_id = p.user_id
  WHERE un.neighborhood_id = neighborhood_id_param 
  AND un.is_active = true;
  
  group_size := policy_rec.default_group_size;
  
  -- Return simulation results (simplified calculation)
  RETURN QUERY SELECT 
    member_count,
    GREATEST(0, member_count / group_size),
    GREATEST(0, member_count % group_size),
    jsonb_build_object(
      'policy_used', row_to_json(policy_rec),
      'member_breakdown', jsonb_build_object(
        'total', member_count,
        'eligible', member_count,
        'filtered_out', 0
      )
    );
END;
$$;