-- Fix critical security vulnerability in five_c_events table
-- Replace overly permissive policies with proper organization-based access control

-- Step 1: Drop the dangerous policy that allows anyone to manage events
DROP POLICY IF EXISTS "Organizations can manage their 5C events" ON public.five_c_events;

-- Step 2: Create secure policy for organization members to view events
-- Members can view events from their organization
CREATE POLICY "Organization members can view 5C events" 
ON public.five_c_events 
FOR SELECT
USING (
  org_id IS NULL OR has_org_role(org_id, 'member'::org_role)
);

-- Step 3: Create secure policy for organization members to create events
-- Members can create events for their organization, and must set correct org_id
CREATE POLICY "Organization members can create 5C events" 
ON public.five_c_events 
FOR INSERT
WITH CHECK (
  -- If org_id is specified, user must be a member of that organization
  (org_id IS NULL) OR 
  (org_id IS NOT NULL AND has_org_role(org_id, 'member'::org_role))
);

-- Step 4: Create secure policy for organization admins to manage events
-- Organization admins can update/delete events from their organization
CREATE POLICY "Organization admins can manage 5C events" 
ON public.five_c_events 
FOR UPDATE
USING (
  org_id IS NULL OR has_org_role(org_id, 'admin'::org_role)
);

CREATE POLICY "Organization admins can delete 5C events" 
ON public.five_c_events 
FOR DELETE
USING (
  org_id IS NULL OR has_org_role(org_id, 'admin'::org_role)
);

-- Step 5: Allow users to manage their own personal events (where user_id matches)
-- This covers events that might be user-specific rather than organization-wide
CREATE POLICY "Users can manage their own 5C events" 
ON public.five_c_events 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Step 6: Allow super admins to manage all events
-- This provides necessary access for platform administration and data integrity
CREATE POLICY "Super admins can manage all 5C events" 
ON public.five_c_events 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Step 7: Add helpful comment explaining the security model
COMMENT ON TABLE public.five_c_events IS '5C event tracking with organization-based access control - members can view/create org events, admins can manage org events, users can manage personal events, super admins have full access';