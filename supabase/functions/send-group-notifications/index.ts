import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { groupIds } = await req.json();
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const resend = new Resend(resendApiKey);
    
    console.log(`Sending notifications for ${groupIds.length} groups`);

    // Get groups with members and their emails
    const { data: groups, error } = await supabase
      .from('dinner_groups')
      .select(`
        *,
        group_members(
          *,
          profiles(full_name, phone_number, first_name, last_name)
        )
      `)
      .in('id', groupIds);

    if (error) throw error;

    let emailsSent = 0;

    for (const group of groups) {
      console.log(`Processing group: ${group.name}`);
      
      // Get user emails from auth.users for group members
      const userIds = group.group_members.map((gm: any) => gm.user_id);
      
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching users:', usersError);
        continue;
      }

      const groupUsers = users.users.filter(user => userIds.includes(user.id));
      
      // Prepare member list for email
      const membersList = group.group_members
        .map((gm: any) => {
          const profile = gm.profiles;
          return `• ${profile?.full_name || 'Unknown'} - ${profile?.phone_number || 'No phone'}`;
        })
        .join('\n');

      // Send email to each group member
      for (const user of groupUsers) {
        try {
          const memberProfile = group.group_members.find((gm: any) => gm.user_id === user.id)?.profiles;
          
          const emailContent = `
Dear ${memberProfile?.first_name || 'Friend'},

You've been matched with a wonderful dinner group! 🍽️

**Group:** ${group.name}
${group.description ? `**Description:** ${group.description}` : ''}

**Your dinner companions:**
${membersList}

Please reach out to your group members to coordinate your dinner plans. We recommend the host reach out first to get everyone connected!

Looking forward to hearing about your amazing dinner experience!

Best regards,
The 5C Community Team
          `;

          const { error: emailError } = await resend.emails.send({
            from: '5C Community <noreply@5ccommunity.com>',
            to: [user.email || ''],
            subject: `🍽️ You've been matched! Your dinner group: ${group.name}`,
            text: emailContent,
          });

          if (emailError) {
            console.error(`Error sending email to ${user.email}:`, emailError);
          } else {
            emailsSent++;
            console.log(`Email sent to ${user.email}`);
          }
        } catch (emailError) {
          console.error(`Error sending email to user ${user.id}:`, emailError);
        }
      }

      // Update group status to active
      await supabase
        .from('dinner_groups')
        .update({ status: 'active' })
        .eq('id', group.id);
    }

    return new Response(JSON.stringify({
      success: true,
      emailsSent,
      groupsProcessed: groups.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-group-notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);