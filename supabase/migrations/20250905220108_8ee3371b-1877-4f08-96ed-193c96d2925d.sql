-- Create admin roles enum and table
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'moderator',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin roles
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_id_param
  );
$$;

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id_param UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_users 
  WHERE user_id = user_id_param;
$$;

-- Admin policies
CREATE POLICY "Only admins can view admin users" ON public.admin_users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only super admins can insert admin users" ON public.admin_users
  FOR INSERT WITH CHECK (public.get_admin_role() = 'super_admin');

CREATE POLICY "Only super admins can update admin users" ON public.admin_users
  FOR UPDATE USING (public.get_admin_role() = 'super_admin');

-- Create dinner_groups table
CREATE TABLE public.dinner_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_members INTEGER NOT NULL DEFAULT 8,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'active', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  location_type TEXT CHECK (location_type IN ('hosted', 'restaurant', 'community_center')),
  host_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dinner_groups
ALTER TABLE public.dinner_groups ENABLE ROW LEVEL SECURITY;

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.dinner_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'declined')),
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS on group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create matching_criteria table for admin configuration
CREATE TABLE public.matching_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  criteria_type TEXT NOT NULL CHECK (criteria_type IN ('age_group', 'location', 'family_profile', 'work_from_home', 'season_interest')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on matching_criteria
ALTER TABLE public.matching_criteria ENABLE ROW LEVEL SECURITY;

-- Insert default matching criteria
INSERT INTO public.matching_criteria (name, weight, criteria_type) VALUES
  ('Age Group Compatibility', 0.25, 'age_group'),
  ('Location Proximity', 0.30, 'location'),
  ('Family Stage Alignment', 0.20, 'family_profile'),
  ('Work Schedule Compatibility', 0.15, 'work_from_home'),
  ('Seasonal Interest', 0.10, 'season_interest');

-- Policies for dinner_groups
CREATE POLICY "Everyone can view approved groups" ON public.dinner_groups
  FOR SELECT USING (status = 'approved' OR status = 'active' OR status = 'completed');

CREATE POLICY "Admins can view all groups" ON public.dinner_groups
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create groups" ON public.dinner_groups
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update groups" ON public.dinner_groups
  FOR UPDATE USING (public.is_admin());

-- Policies for group_members
CREATE POLICY "Users can view their own group memberships" ON public.group_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all group memberships" ON public.group_members
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage group memberships" ON public.group_members
  FOR ALL USING (public.is_admin());

-- Policies for matching_criteria
CREATE POLICY "Admins can manage matching criteria" ON public.matching_criteria
  FOR ALL USING (public.is_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dinner_groups_updated_at
  BEFORE UPDATE ON public.dinner_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matching_criteria_updated_at
  BEFORE UPDATE ON public.matching_criteria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();