-- Create external data sources table
CREATE TABLE public.external_data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('google_sheets', 'jotform', 'csv_upload', 'excel_upload')),
  source_identifier TEXT, -- sheet ID, form ID, filename
  configuration JSONB DEFAULT '{}',
  field_mapping JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external profiles table  
CREATE TABLE public.external_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.external_data_sources(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL,
  raw_data JSONB NOT NULL,
  mapped_data JSONB NOT NULL,
  validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'needs_review')),
  validation_errors JSONB DEFAULT '[]',
  neighborhood_id UUID REFERENCES public.neighborhoods(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create import batches table
CREATE TABLE public.import_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES public.external_data_sources(id) ON DELETE CASCADE,
  filename TEXT,
  total_records INTEGER NOT NULL DEFAULT 0,
  valid_records INTEGER NOT NULL DEFAULT 0,
  invalid_records INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'cancelled')),
  error_summary JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external groups table
CREATE TABLE public.external_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.import_batches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected', 'active', 'completed')),
  group_size INTEGER NOT NULL,
  neighborhood_id UUID REFERENCES public.neighborhoods(id),
  matching_policy_used JSONB,
  compatibility_score NUMERIC,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create external group members table
CREATE TABLE public.external_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.external_groups(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.external_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'declined')),
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.external_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_group_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage external data sources"
  ON public.external_data_sources FOR ALL
  USING (is_admin());

CREATE POLICY "Admins can manage external profiles"
  ON public.external_profiles FOR ALL
  USING (is_admin());

CREATE POLICY "Admins can manage import batches"
  ON public.import_batches FOR ALL
  USING (is_admin());

CREATE POLICY "Admins can manage external groups"
  ON public.external_groups FOR ALL
  USING (is_admin());

CREATE POLICY "Admins can manage external group members"
  ON public.external_group_members FOR ALL
  USING (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_external_profiles_source_id ON public.external_profiles(source_id);
CREATE INDEX idx_external_profiles_batch_id ON public.external_profiles(batch_id);
CREATE INDEX idx_external_profiles_neighborhood_id ON public.external_profiles(neighborhood_id);
CREATE INDEX idx_import_batches_source_id ON public.import_batches(source_id);
CREATE INDEX idx_external_groups_batch_id ON public.external_groups(batch_id);
CREATE INDEX idx_external_group_members_group_id ON public.external_group_members(group_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_external_data_sources_updated_at
  BEFORE UPDATE ON public.external_data_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_profiles_updated_at
  BEFORE UPDATE ON public.external_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_import_batches_updated_at
  BEFORE UPDATE ON public.import_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_groups_updated_at
  BEFORE UPDATE ON public.external_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();