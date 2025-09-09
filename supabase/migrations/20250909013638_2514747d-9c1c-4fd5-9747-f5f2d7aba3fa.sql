-- Create email configuration table for external batches
CREATE TABLE public.external_batch_email_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.import_batches(id) ON DELETE CASCADE,
  subject TEXT NOT NULL DEFAULT 'Your Five Course Dinner Group Assignment',
  from_name TEXT NOT NULL DEFAULT 'Five Course',
  from_email TEXT NOT NULL DEFAULT 'groups@fivecourse.org',
  body_template TEXT NOT NULL DEFAULT 'Hello {{member_names}}! You''ve been matched for a Five Course dinner group...',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create external matching policies table
CREATE TABLE public.external_matching_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.import_batches(id) ON DELETE CASCADE,
  age_weight INTEGER NOT NULL DEFAULT 30,
  location_weight INTEGER NOT NULL DEFAULT 50,
  family_stage_weight INTEGER NOT NULL DEFAULT 40,
  interests_weight INTEGER NOT NULL DEFAULT 35,
  max_distance_miles INTEGER DEFAULT 25,
  default_group_size INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add columns to external_groups for enhanced tracking
ALTER TABLE public.external_groups 
ADD COLUMN is_reverted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN email_sent_by UUID REFERENCES auth.users(id);

-- Enable RLS on new tables
ALTER TABLE public.external_batch_email_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_matching_policies ENABLE ROW LEVEL SECURITY;

-- Create policies for external_batch_email_configs
CREATE POLICY "Admins can manage external batch email configs" 
ON public.external_batch_email_configs 
FOR ALL 
USING (is_admin());

-- Create policies for external_matching_policies
CREATE POLICY "Admins can manage external matching policies" 
ON public.external_matching_policies 
FOR ALL 
USING (is_admin());

-- Create trigger for updated_at on external_batch_email_configs
CREATE TRIGGER update_external_batch_email_configs_updated_at
BEFORE UPDATE ON public.external_batch_email_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on external_matching_policies
CREATE TRIGGER update_external_matching_policies_updated_at
BEFORE UPDATE ON public.external_matching_policies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create new indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_external_batch_email_configs_batch_id ON public.external_batch_email_configs(batch_id);
CREATE INDEX IF NOT EXISTS idx_external_matching_policies_batch_id ON public.external_matching_policies(batch_id);
CREATE INDEX IF NOT EXISTS idx_external_groups_is_reverted ON public.external_groups(is_reverted);