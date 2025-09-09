import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { groupId } = await req.json();
    
    if (!groupId) {
      throw new Error('Group ID is required');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get group with members and email config
    const { data: group, error: groupError } = await supabaseClient
      .from('external_groups')
      .select(`
        *,
        external_group_members (
          id,
          status,
          external_profiles (
            id,
            mapped_data,
            raw_data
          )
        ),
        import_batches (
          id,
          external_batch_email_configs (*)
        )
      `)
      .eq('id', groupId)
      .single();

    if (groupError) throw groupError;
    if (!group) throw new Error('Group not found');

    // Get email config for the batch
    const emailConfig = group.import_batches?.external_batch_email_configs?.[0];
    if (!emailConfig) {
      throw new Error('No email configuration found for this batch');
    }

    // Prepare member data
    const members = group.external_group_members || [];
    const memberNames = members
      .map(m => `${m.external_profiles?.mapped_data?.first_name} ${m.external_profiles?.mapped_data?.last_name}`)
      .filter(Boolean)
      .join(' and ');

    const memberDetails = members
      .map(m => {
        const data = m.external_profiles?.mapped_data;
        return `• ${data?.first_name} ${data?.last_name} (${data?.email}) - ${data?.phone_number || 'No phone'}`;
      })
      .join('\n');

    // Get city from members
    const cities = members
      .map(m => m.external_profiles?.mapped_data?.city)
      .filter(Boolean);
    const groupLocation = cities.length > 0 ? `${cities[0]} area` : 'Local area';

    // Template replacements
    const templateData: Record<string, string> = {
      'member_names': memberNames,
      'group_member_details': memberDetails,
      'group_name': group.name,
      'suggested_meeting_time': 'Within the next 2 weeks',
      'group_location': groupLocation,
      'from_name': emailConfig.from_name
    };

    // Replace template variables
    let emailBody = emailConfig.body_template;
    Object.entries(templateData).forEach(([key, value]) => {
      emailBody = emailBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    // Send emails to all members
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const emailPromises = members.map(async (member) => {
      const memberEmail = member.external_profiles?.mapped_data?.email;
      if (!memberEmail) return null;

      try {
        const response = await resend.emails.send({
          from: `${emailConfig.from_name} <${emailConfig.from_email}>`,
          to: [memberEmail],
          subject: emailConfig.subject,
          html: emailBody.replace(/\n/g, '<br>')
        });

        console.log(`Email sent to ${memberEmail}:`, response);
        return response;
      } catch (error) {
        console.error(`Failed to send email to ${memberEmail}:`, error);
        return null;
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r !== null).length;

    console.log(`Sent ${successCount}/${members.length} introduction emails for group ${groupId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent: successCount,
      totalMembers: members.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in send-group-introduction function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);