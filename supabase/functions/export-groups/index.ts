import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { format, groupIds } = await req.json();
    
    console.log(`Exporting groups in ${format} format`);

    // Get groups with members and profiles
    let query = supabase
      .from('dinner_groups')
      .select(`
        *,
        group_members(
          *,
          profiles(full_name, phone_number, first_name, last_name)
        )
      `);

    if (groupIds && groupIds.length > 0) {
      query = query.in('id', groupIds);
    }

    const { data: groups, error } = await query.order('created_at');

    if (error) throw error;

    console.log(`Found ${groups.length} groups to export`);

    if (format === 'excel') {
      return exportToExcel(groups);
    } else if (format === 'pdf') {
      return exportToPDF(groups);
    } else {
      throw new Error('Unsupported format');
    }

  } catch (error: any) {
    console.error('Error in export-groups:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

function exportToExcel(groups: any[]): Response {
  // Create CSV content (simple Excel-compatible format)
  let csvContent = 'Group Name,Status,Member Count,Member Names,Phone Numbers,Created Date\n';
  
  for (const group of groups) {
    const memberNames = group.group_members
      .map((gm: any) => gm.profiles?.full_name || 'Unknown')
      .join('; ');
    
    const phoneNumbers = group.group_members
      .map((gm: any) => gm.profiles?.phone_number || 'N/A')
      .join('; ');
    
    const row = [
      `"${group.name}"`,
      `"${group.status}"`,
      group.group_members.length,
      `"${memberNames}"`,
      `"${phoneNumbers}"`,
      `"${new Date(group.created_at).toLocaleDateString()}"`
    ].join(',');
    
    csvContent += row + '\n';
  }

  return new Response(csvContent, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="dinner-groups.csv"'
    }
  });
}

function exportToPDF(groups: any[]): Response {
  // Create HTML content that can be converted to PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dinner Groups Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .group { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; }
        .group-header { background-color: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px; }
        .member { margin: 5px 0; }
        .status { font-weight: bold; text-transform: capitalize; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>Dinner Groups Export</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
  `;

  for (const group of groups) {
    htmlContent += `
      <div class="group">
        <div class="group-header">
          <h2>${group.name}</h2>
          <div class="status">Status: ${group.status.replace('_', ' ')}</div>
          <div>Created: ${new Date(group.created_at).toLocaleDateString()}</div>
          <div>Members: ${group.group_members.length}/${group.max_members}</div>
        </div>
        
        ${group.description ? `<p><strong>Description:</strong> ${group.description}</p>` : ''}
        
        <h3>Members</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const member of group.group_members) {
      htmlContent += `
        <tr>
          <td>${member.profiles?.full_name || 'Unknown'}</td>
          <td>${member.profiles?.phone_number || 'N/A'}</td>
          <td>${member.status}</td>
        </tr>
      `;
    }

    htmlContent += `
          </tbody>
        </table>
      </div>
    `;
  }

  htmlContent += `
    </body>
    </html>
  `;

  return new Response(htmlContent, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html',
      'Content-Disposition': 'attachment; filename="dinner-groups.html"'
    }
  });
}

serve(handler);