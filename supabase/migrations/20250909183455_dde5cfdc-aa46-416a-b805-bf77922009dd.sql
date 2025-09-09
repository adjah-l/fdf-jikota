-- Create multitenancy foundation: Organizations and roles
CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'moderator', 'member');

-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  settings JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Organization members table
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role public.org_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(org_id, user_id)
);

-- Add org_id to existing tables for scoping
ALTER TABLE public.neighborhoods ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.dinner_groups ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.matching_policies ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.external_data_sources ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Matching runs audit table
CREATE TABLE public.matching_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  neighborhood_id UUID REFERENCES public.neighborhoods(id) ON DELETE CASCADE,
  policy_snapshot JSONB NOT NULL,
  input_criteria JSONB NOT NULL,
  output_summary JSONB NOT NULL,
  groups_created INTEGER NOT NULL DEFAULT 0,
  members_matched INTEGER NOT NULL DEFAULT 0,
  waitlist_count INTEGER NOT NULL DEFAULT 0,
  run_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Message templates for multi-channel messaging
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'email', 'sms', 'push'
  subject TEXT,
  template_body TEXT NOT NULL,
  variables JSONB DEFAULT '[]' NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Message events log
CREATE TABLE public.message_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.message_templates(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL,
  channel TEXT NOT NULL,
  event_type TEXT NOT NULL,
  message_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mutual care system
CREATE TABLE public.service_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_requests INTEGER,
  credits_per_request INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'normal',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open',
  credits_offered INTEGER NOT NULL DEFAULT 1,
  fulfilled_by UUID,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Double-entry transactions ledger
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  from_user_id UUID,
  to_user_id UUID,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matching_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Helper functions for organization access
CREATE OR REPLACE FUNCTION public.get_user_orgs(user_id_param UUID DEFAULT auth.uid())
RETURNS UUID[]
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(org_id) 
  FROM public.organization_members 
  WHERE user_id = user_id_param AND is_active = true;
$$;

-- Fixed role hierarchy function using proper casting
CREATE OR REPLACE FUNCTION public.has_org_role(org_id_param UUID, required_role public.org_role, user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE org_id = org_id_param 
    AND user_id = user_id_param 
    AND is_active = true
    AND (
      (required_role = 'member'::public.org_role AND role IN ('member'::public.org_role, 'moderator'::public.org_role, 'admin'::public.org_role, 'owner'::public.org_role)) OR
      (required_role = 'moderator'::public.org_role AND role IN ('moderator'::public.org_role, 'admin'::public.org_role, 'owner'::public.org_role)) OR
      (required_role = 'admin'::public.org_role AND role IN ('admin'::public.org_role, 'owner'::public.org_role)) OR
      (required_role = 'owner'::public.org_role AND role = 'owner'::public.org_role)
    )
  );
$$;

-- Basic RLS policies for organizations
CREATE POLICY "Users can view their organization memberships"
ON public.organization_members
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Organization members can view their org"
ON public.organizations
FOR SELECT
USING (id = ANY(get_user_orgs()));

-- Update triggers for timestamps
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();