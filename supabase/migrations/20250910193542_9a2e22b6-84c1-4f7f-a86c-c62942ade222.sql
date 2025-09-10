-- Add SMS integration tables
CREATE TABLE IF NOT EXISTS public.sms_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.dinner_groups(id) ON DELETE SET NULL,
  phone_number text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES public.sms_threads(id) ON DELETE CASCADE,
  message_sid text UNIQUE,
  from_number text NOT NULL,
  to_number text NOT NULL,
  body text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  status text DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add SMS notification preferences to profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_replies boolean DEFAULT true;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_sms_threads_phone ON public.sms_threads(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_threads_user ON public.sms_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_threads_token ON public.sms_threads(thread_token);
CREATE INDEX IF NOT EXISTS idx_sms_messages_thread ON public.sms_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_sid ON public.sms_messages(message_sid);

-- Enable RLS
ALTER TABLE public.sms_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for SMS threads
CREATE POLICY "Users can view their own SMS threads" 
ON public.sms_threads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SMS threads" 
ON public.sms_threads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS threads" 
ON public.sms_threads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all SMS threads" 
ON public.sms_threads 
FOR SELECT 
USING (is_admin());

-- RLS policies for SMS messages
CREATE POLICY "Users can view messages in their threads" 
ON public.sms_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sms_threads 
    WHERE sms_threads.id = sms_messages.thread_id 
    AND sms_threads.user_id = auth.uid()
  )
);

CREATE POLICY "System can insert SMS messages" 
ON public.sms_messages 
FOR INSERT 
WITH CHECK (true); -- Edge functions will handle this

CREATE POLICY "Admins can view all SMS messages" 
ON public.sms_messages 
FOR SELECT 
USING (is_admin());

-- Function to get thread by token (for SMS responses)
CREATE OR REPLACE FUNCTION public.get_thread_by_token(token_param text)
RETURNS public.sms_threads
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.sms_threads 
  WHERE thread_token = token_param AND is_active = true
  LIMIT 1;
$$;