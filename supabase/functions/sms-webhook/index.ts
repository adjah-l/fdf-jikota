import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const parseFormData = async (request: Request): Promise<Record<string, string>> => {
  const formData = await request.formData();
  const data: Record<string, string> = {};
  
  for (const [key, value] of formData.entries()) {
    data[key] = value.toString();
  }
  
  return data;
};

const findOrCreateThread = async (fromNumber: string, toNumber: string) => {
  // First, try to find existing thread for this phone number
  const { data: existingThread } = await supabase
    .from('sms_threads')
    .select('*')
    .eq('phone_number', fromNumber)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (existingThread) {
    // Update thread timestamp
    await supabase
      .from('sms_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', existingThread.id);
    
    return existingThread;
  }

  // Create new thread
  const { data: newThread, error } = await supabase
    .from('sms_threads')
    .insert({
      phone_number: fromNumber,
      user_id: null, // Will be linked when user claims the thread
    })
    .select()
    .single();

  if (error) throw error;
  return newThread;
};

const sendTwilioReply = async (to: string, body: string) => {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing Twilio configuration');
    return null;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const formData = new FormData();
  formData.append('To', to);
  formData.append('From', fromNumber);
  formData.append('Body', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio API error:', error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Twilio SMS:', error);
    return null;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse Twilio webhook data
    const webhookData = await parseFormData(req);
    
    console.log('Received SMS webhook:', {
      from: webhookData.From,
      to: webhookData.To,
      body: webhookData.Body?.substring(0, 100), // Log first 100 chars
      messageSid: webhookData.MessageSid
    });

    const fromNumber = webhookData.From;
    const toNumber = webhookData.To;
    const messageBody = webhookData.Body || '';
    const messageSid = webhookData.MessageSid;

    // Find or create SMS thread
    const thread = await findOrCreateThread(fromNumber, toNumber);

    // Save incoming message
    await supabase
      .from('sms_messages')
      .insert({
        thread_id: thread.id,
        message_sid: messageSid,
        from_number: fromNumber,
        to_number: toNumber,
        body: messageBody,
        direction: 'inbound',
        status: 'received',
      });

    // Check if message contains commands
    const lowerBody = messageBody.toLowerCase().trim();
    
    if (lowerBody === 'stop' || lowerBody === 'unsubscribe') {
      // Handle unsubscribe
      await supabase
        .from('sms_threads')
        .update({ is_active: false })
        .eq('id', thread.id);

      await sendTwilioReply(fromNumber, 
        "You've been unsubscribed from SMS notifications. Text START to resubscribe.");
      
    } else if (lowerBody === 'start' || lowerBody === 'subscribe') {
      // Handle resubscribe
      await supabase
        .from('sms_threads')
        .update({ is_active: true })
        .eq('id', thread.id);

      await sendTwilioReply(fromNumber,
        "You're now subscribed to SMS notifications from Five Course!");
      
    } else if (lowerBody.startsWith('link') || lowerBody.includes('web')) {
      // Send link to web interface
      const baseUrl = 'https://dc357da0-0bba-40e8-ba77-4553eda009f2.lovableproject.com';
      const responseLink = `${baseUrl}/sms-respond/${thread.thread_token}`;
      
      await sendTwilioReply(fromNumber,
        `Here's your personalized link to respond via the web interface: ${responseLink}`);
      
    } else {
      // Handle regular message - could be forwarded to group or handled as response
      const baseUrl = 'https://dc357da0-0bba-40e8-ba77-4553eda009f2.lovableproject.com';
      const responseLink = `${baseUrl}/sms-respond/${thread.thread_token}`;
      
      // For now, acknowledge receipt and provide link
      await sendTwilioReply(fromNumber,
        `Message received! To view the full conversation and respond, visit: ${responseLink}\n\nOr continue texting here.`);
    }

    // Return TwiML response (required by Twilio)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Message received successfully!</Message>
</Response>`;

    return new Response(twimlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in sms-webhook function:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, there was an error processing your message. Please try again.</Message>
</Response>`;

    return new Response(errorTwiml, {
      status: 200, // Always return 200 to Twilio to prevent retries
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);