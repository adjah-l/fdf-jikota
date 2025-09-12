-- Fix critical security vulnerability in org_five_c_settings table
-- Replace overly permissive policies with proper organization-based access control

-- Step 1: Drop the dangerous policy that allows anyone to manage settings
DROP POLICY IF EXISTS "Organizations can manage their 5C settings" ON public.org_five_c_settings;

-- Step 2: Create secure policy for organization administrators
-- Only organization admins can manage their organization's 5C settings
CREATE POLICY "Organization admins can manage 5C settings" 
ON public.org_five_c_settings 
FOR ALL
USING (has_org_role(org_id, 'admin'::org_role))
WITH CHECK (has_org_role(org_id, 'admin'::org_role));

-- Step 3: Allow organization members to view (but not modify) their org's settings
-- This enables legitimate read access for features that need to display settings
CREATE POLICY "Organization members can view 5C settings" 
ON public.org_five_c_settings 
FOR SELECT
USING (has_org_role(org_id, 'member'::org_role));

-- Step 4: Allow super admins to manage all organization settings
-- This provides necessary access for platform administration
CREATE POLICY "Super admins can manage all 5C settings" 
ON public.org_five_c_settings 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Step 5: Add helpful comment explaining the security model
COMMENT ON TABLE public.org_five_c_settings IS 'Organization 5C settings with role-based access - only organization admins can modify, members can view, super admins have full access';