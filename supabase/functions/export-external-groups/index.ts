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
    const { format, groupIds, batchId } = await req.json();
    
    console.log(`Exporting external groups in ${format} format`);

    // Get external groups with members and profiles
    let query = supabase
      .from('external_groups')
      .select(`
        *,
        external_group_members(
          *,
          external_profiles(
            id,
            mapped_data,
            validation_status,
            raw_data
          )
        ),
        import_batches(
          filename,
          source_id,
          external_data_sources(name, source_type)
        )
      `);

    if (groupIds && groupIds.length > 0) {
      query = query.in('id', groupIds);
    } else if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data: groups, error } = await query.order('created_at');

    if (error) throw error;

    console.log(`Found ${groups.length} external groups to export`);

    if (format === 'excel') {
      return exportToExcel(groups);
    } else if (format === 'pdf') {
      return exportToPDF(groups);
    } else {
      throw new Error('Unsupported format');
    }

  } catch (error: any) {
    console.error('Error in export-external-groups:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

function exportToExcel(groups: any[]): Response {
  // Create CSV content with detailed member information (one row per member)
  let csvContent = 'Group ID,Group Name,Group Status,Group Size,Compatibility Score,Source File,Source Type,Batch ID,Member Name,Member Email,Member Phone,Member City,Age Group,Family Profile,Activities,Group Interest,Original First Name,Original Last Name,Member Status,Group Created Date\n';
  
  for (const group of groups) {
    const members = group.external_group_members || [];
    const sourceFile = group.import_batches?.filename || 'Unknown';
    const sourceType = group.import_batches?.external_data_sources?.source_type || 'Unknown';
    const compatibilityScore = group.compatibility_score ? `${Math.round(group.compatibility_score * 100)}%` : 'N/A';
    const groupCreatedDate = new Date(group.created_at).toLocaleDateString();
    
    // If no members, create one row with group info
    if (members.length === 0) {
      const row = [
        `"${group.id}"`,
        `"${group.name}"`,
        `"${group.status}"`,
        group.group_size,
        `"${compatibilityScore}"`,
        `"${sourceFile}"`,
        `"${sourceType}"`,
        `"${group.batch_id}"`,
        '"No Members"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        '"N/A"',
        `"${groupCreatedDate}"`
      ].join(',');
      csvContent += row + '\n';
    } else {
      // Create one row per member
      for (const member of members) {
        const profile = member.external_profiles;
        const mappedData = profile?.mapped_data || {};
        const rawData = profile?.raw_data || {};
        
        const memberName = mappedData.full_name || 
                          `${mappedData.first_name || ''} ${mappedData.last_name || ''}`.trim() ||
                          'Unknown';
        const memberEmail = mappedData.email || 'N/A';
        const memberPhone = mappedData.phone_number || 'N/A';
        const memberCity = mappedData.city || rawData.city || 'N/A';
        const ageGroup = mappedData.age_group || rawData.age_group || 'N/A';
        const familyProfile = mappedData.family_profile || rawData.family_profile || 'N/A';
        const activities = Array.isArray(mappedData.activities) ? mappedData.activities.join('; ') : 
                          (mappedData.activities || rawData.activities || 'N/A');
        const groupInterest = mappedData.group_interest || rawData.group_interest || 'N/A';
        const originalFirstName = rawData.first_name || mappedData.first_name || 'N/A';
        const originalLastName = rawData.last_name || mappedData.last_name || 'N/A';
        
        const row = [
          `"${group.id}"`,
          `"${group.name}"`,
          `"${group.status}"`,
          group.group_size,
          `"${compatibilityScore}"`,
          `"${sourceFile}"`,
          `"${sourceType}"`,
          `"${group.batch_id}"`,
          `"${memberName}"`,
          `"${memberEmail}"`,
          `"${memberPhone}"`,
          `"${memberCity}"`,
          `"${ageGroup}"`,
          `"${familyProfile}"`,
          `"${activities}"`,
          `"${groupInterest}"`,
          `"${originalFirstName}"`,
          `"${originalLastName}"`,
          `"${member.status}"`,
          `"${groupCreatedDate}"`
        ].join(',');
        
        csvContent += row + '\n';
      }
    }
  }

  return new Response(csvContent, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="external-dinner-groups-detailed.csv"'
    }
  });
}

function exportToPDF(groups: any[]): Response {
  // Create HTML content that can be converted to PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>External Dinner Groups Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .group { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; }
        .group-header { background-color: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px; }
        .member { margin: 5px 0; }
        .status { font-weight: bold; text-transform: capitalize; }
        .metadata { font-size: 12px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>External Dinner Groups Export</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
  `;

  for (const group of groups) {
    const members = group.external_group_members || [];
    const sourceFile = group.import_batches?.filename || 'Unknown';
    const sourceType = group.import_batches?.external_data_sources?.source_type || 'Unknown';
    const compatibilityScore = group.compatibility_score ? `${Math.round(group.compatibility_score * 100)}%` : 'N/A';

    htmlContent += `
      <div class="group">
        <div class="group-header">
          <h2>${group.name}</h2>
          <div class="status">Status: ${group.status.replace('_', ' ')}</div>
          <div>Created: ${new Date(group.created_at).toLocaleDateString()}</div>
          <div>Members: ${members.length}/${group.group_size}</div>
          <div class="metadata">
            Source: ${sourceFile} (${sourceType}) | 
            Compatibility: ${compatibilityScore}
          </div>
        </div>
        
        ${group.description ? `<p><strong>Description:</strong> ${group.description}</p>` : ''}
        
        <h3>Members</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    for (const member of members) {
      const profile = member.external_profiles;
      const memberName = profile?.mapped_data?.full_name || 
                         `${profile?.mapped_data?.first_name || ''} ${profile?.mapped_data?.last_name || ''}`.trim() ||
                         'Unknown';
      const memberEmail = profile?.mapped_data?.email || 'N/A';
      const memberPhone = profile?.mapped_data?.phone_number || 'N/A';
      
      htmlContent += `
        <tr>
          <td>${memberName}</td>
          <td>${memberEmail}</td>
          <td>${memberPhone}</td>
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
      'Content-Disposition': 'attachment; filename="external-dinner-groups.html"'
    }
  });
}

serve(handler);