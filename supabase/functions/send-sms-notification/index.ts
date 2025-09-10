import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSNotificationRequest {
  to: string;
  message: string;
  threadId?: string;
  groupName?: string;
  senderName?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const sendTwilioSMS = async (to: string, body: string) => {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Missing Twilio configuration');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const formData = new FormData();
  formData.append('To', to);
  formData.append('From', fromNumber);
  formData.append('Body', body);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio API error: ${error}`);
  }

  return await response.json();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, threadId, groupName, senderName }: SMSNotificationRequest = await req.json();

    // Create or get SMS thread
    let thread;
    if (threadId) {
      const { data: existingThread } = await supabase
        .from('sms_threads')
        .select('*')
        .eq('id', threadId)
        .single();
      
      thread = existingThread;
    } else {
      // Create new thread for this phone number
      const { data: newThread, error: threadError } = await supabase
        .from('sms_threads')
        .insert({
          phone_number: to,
          user_id: null, // Will be set when user responds
        })
        .select()
        .single();

      if (threadError) throw threadError;
      thread = newThread;
    }

    // Generate response link
    const baseUrl = 'https://dc357da0-0bba-40e8-ba77-4553eda009f2.lovableproject.com';
    const responseLink = `${baseUrl}/sms-respond/${thread.thread_token}`;

    // Format SMS message
    let smsBody = message;
    if (groupName) {
      smsBody = `${groupName}: ${message}`;
    }
    if (senderName) {
      smsBody = `${senderName} says: ${smsBody}`;
    }
    
    // Add response link
    smsBody += `\n\nReply directly to this text or visit: ${responseLink}`;

    // Send SMS via Twilio
    const twilioResponse = await sendTwilioSMS(to, smsBody);

    // Save SMS message to database
    await supabase
      .from('sms_messages')
      .insert({
        thread_id: thread.id,
        message_sid: twilioResponse.sid,
        from_number: twilioResponse.from,
        to_number: twilioResponse.to,
        body: smsBody,
        direction: 'outbound',
        status: twilioResponse.status,
      });

    console.log('SMS sent successfully:', {
      to,
      sid: twilioResponse.sid,
      threadId: thread.id
    });

    return new Response(JSON.stringify({
      success: true,
      messageSid: twilioResponse.sid,
      threadId: thread.id,
      responseLink
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-sms-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);