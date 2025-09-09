-- Add comprehensive RLS policies for new tables

-- Matching runs policies
CREATE POLICY "Organization members can view matching runs"
ON public.matching_runs
FOR SELECT
USING (has_org_role(org_id, 'member'));

CREATE POLICY "Organization admins can create matching runs"
ON public.matching_runs
FOR INSERT
WITH CHECK (has_org_role(org_id, 'admin'));

-- Message templates policies
CREATE POLICY "Organization members can view message templates"
ON public.message_templates
FOR SELECT
USING (has_org_role(org_id, 'member'));

CREATE POLICY "Organization admins can manage message templates"
ON public.message_templates
FOR ALL
USING (has_org_role(org_id, 'admin'));

-- Message events policies
CREATE POLICY "Organization members can view message events"
ON public.message_events
FOR SELECT
USING (has_org_role(org_id, 'member') OR auth.uid() = recipient_id);

CREATE POLICY "Organization admins can create message events"
ON public.message_events
FOR INSERT
WITH CHECK (has_org_role(org_id, 'admin'));

-- Service offers policies
CREATE POLICY "Organization members can view service offers"
ON public.service_offers
FOR SELECT
USING (has_org_role(org_id, 'member'));

CREATE POLICY "Users can manage their own service offers"
ON public.service_offers
FOR ALL
USING (auth.uid() = user_id AND has_org_role(org_id, 'member'));

-- Service requests policies
CREATE POLICY "Organization members can view service requests"
ON public.service_requests
FOR SELECT
USING (has_org_role(org_id, 'member'));

CREATE POLICY "Users can create service requests"
ON public.service_requests
FOR INSERT
WITH CHECK (auth.uid() = requester_id AND has_org_role(org_id, 'member'));

CREATE POLICY "Users can update their own service requests"
ON public.service_requests
FOR UPDATE
USING (auth.uid() = requester_id AND has_org_role(org_id, 'member'));

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (has_org_role(org_id, 'member') AND (auth.uid() = from_user_id OR auth.uid() = to_user_id));

CREATE POLICY "System can create transactions"
ON public.transactions
FOR INSERT
WITH CHECK (has_org_role(org_id, 'member'));