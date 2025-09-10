-- Fix security warnings from 5C migration
-- Set search_path for security functions to prevent mutable search path warnings

CREATE OR REPLACE FUNCTION public.update_org_five_c_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;