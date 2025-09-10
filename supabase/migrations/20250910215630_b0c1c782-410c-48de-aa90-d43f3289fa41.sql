-- 5C Framework Database Integration
-- Non-destructive additive changes only

-- Store org level default 5C emphasis
CREATE TABLE IF NOT EXISTS public.org_five_c_settings (
  org_id uuid PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  default_focus text NOT NULL DEFAULT 'balance' CHECK (default_focus IN ('balance', 'connection', 'care', 'contribution', 'celebration', 'consistency')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Simple event log that maps user or group activities to one of the 5C
CREATE TABLE IF NOT EXISTS public.five_c_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id),
  group_id uuid REFERENCES public.dinner_groups(id),
  user_id uuid REFERENCES auth.users(id),
  c_key text NOT NULL CHECK (c_key IN ('connection','care','contribution','celebration','consistency')),
  meta jsonb DEFAULT '{}',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add optional five_c_focus to saved criteria (if column doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'dinner_groups' 
                   AND column_name = 'five_c_focus') THEN
        ALTER TABLE public.dinner_groups ADD COLUMN five_c_focus text;
    END IF;
END $$;

-- RLS policies for new tables
ALTER TABLE public.org_five_c_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.five_c_events ENABLE ROW LEVEL SECURITY;

-- Policies for 5C data (drop existing first to avoid conflicts)
DROP POLICY IF EXISTS "Organizations can manage their 5C settings" ON public.org_five_c_settings;
CREATE POLICY "Organizations can manage their 5C settings" ON public.org_five_c_settings
FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Organizations can manage their 5C events" ON public.five_c_events;
CREATE POLICY "Organizations can manage their 5C events" ON public.five_c_events
FOR ALL USING (true) WITH CHECK (true);

-- Create update trigger for org_five_c_settings
CREATE OR REPLACE FUNCTION public.update_org_five_c_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_org_five_c_settings_updated_at ON public.org_five_c_settings;
CREATE TRIGGER update_org_five_c_settings_updated_at
BEFORE UPDATE ON public.org_five_c_settings
FOR EACH ROW EXECUTE FUNCTION public.update_org_five_c_settings_updated_at();