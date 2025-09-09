import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let batchId: string | null = null;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const sourceId = formData.get('source_id') as string;
    const fieldMappingStr = formData.get('field_mapping') as string;

    if (!file || !sourceId || !fieldMappingStr) {
      throw new Error('Missing required fields');
    }

    const fieldMapping = JSON.parse(fieldMappingStr);
    console.log('Processing file:', file.name, 'for source:', sourceId);

    // Create import batch
    const { data: batchData, error: batchError } = await supabaseClient
      .from('import_batches')
      .insert({
        source_id: sourceId,
        filename: file.name,
        status: 'processing'
      })
      .select()
      .single();

    if (batchError) throw batchError;
    batchId = batchData.id;

    let records: any[] = [];
    let totalRecords = 0;
    let validRecords = 0;
    let invalidRecords = 0;
    const errors: string[] = [];

    // Process file based on type
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        const rawData: any = {};
        
        headers.forEach((header, index) => {
          rawData[header] = values[index] || '';
        });

        // Map to profile fields
        const mappedData: any = {};
        let isValid = true;
        const recordErrors: string[] = [];

        Object.entries(fieldMapping).forEach(([fileColumn, profileField]) => {
          if (profileField && rawData[fileColumn]) {
            mappedData[profileField] = rawData[fileColumn];
          }
        });

        // Basic validation
        if (!mappedData.full_name && !mappedData.first_name) {
          isValid = false;
          recordErrors.push('Missing name information');
        }

        // Validate email format if provided
        if (mappedData.email && !isValidEmail(mappedData.email)) {
          recordErrors.push('Invalid email format');
        }

        // Validate phone format if provided
        if (mappedData.phone_number && !isValidPhone(mappedData.phone_number)) {
          recordErrors.push('Invalid phone format');
        }

        totalRecords++;
        
        if (isValid && recordErrors.length === 0) {
          validRecords++;
        } else {
          invalidRecords++;
          errors.push(`Row ${i}: ${recordErrors.join(', ')}`);
        }

        records.push({
          source_id: sourceId,
          batch_id: batchData.id,
          raw_data: rawData,
          mapped_data: mappedData,
          validation_status: isValid && recordErrors.length === 0 ? 'valid' : 'invalid',
          validation_errors: recordErrors
        });
      }
    } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Process Excel files
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Excel file must have at least a header row and one data row');
      }

      const headers = jsonData[0] as string[];
      
      for (let i = 1; i < jsonData.length; i++) {
        const values = jsonData[i] as string[];
        const rawData: any = {};
        
        headers.forEach((header, index) => {
          rawData[header] = values[index] || '';
        });

        // Map to profile fields
        const mappedData: any = {};
        let isValid = true;
        const recordErrors: string[] = [];

        Object.entries(fieldMapping).forEach(([fileColumn, profileField]) => {
          if (profileField && rawData[fileColumn]) {
            mappedData[profileField] = rawData[fileColumn];
          }
        });

        // Basic validation
        if (!mappedData.full_name && !mappedData.first_name) {
          isValid = false;
          recordErrors.push('Missing name information');
        }

        // Validate email format if provided
        if (mappedData.email && !isValidEmail(mappedData.email)) {
          recordErrors.push('Invalid email format');
        }

        // Validate phone format if provided
        if (mappedData.phone_number && !isValidPhone(mappedData.phone_number)) {
          recordErrors.push('Invalid phone format');
        }

        totalRecords++;
        
        if (isValid && recordErrors.length === 0) {
          validRecords++;
        } else {
          invalidRecords++;
          errors.push(`Row ${i}: ${recordErrors.join(', ')}`);
        }

        records.push({
          source_id: sourceId,
          batch_id: batchData.id,
          raw_data: rawData,
          mapped_data: mappedData,
          validation_status: isValid && recordErrors.length === 0 ? 'valid' : 'invalid',
          validation_errors: recordErrors
        });
      }
    } else {
      throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
    }

    // Insert all profiles
    if (records.length > 0) {
      const { error: profilesError } = await supabaseClient
        .from('external_profiles')
        .insert(records);

      if (profilesError) {
        console.error('Error inserting profiles:', profilesError);
        throw profilesError;
      }
    }

    // Update batch status
    const { error: updateError } = await supabaseClient
      .from('import_batches')
      .update({
        total_records: totalRecords,
        valid_records: validRecords,
        invalid_records: invalidRecords,
        status: 'completed',
        error_summary: errors.slice(0, 100) // Limit to first 100 errors
      })
      .eq('id', batchData.id);

    if (updateError) throw updateError;

    console.log(`File processed successfully: ${validRecords}/${totalRecords} valid records`);

    return new Response(
      JSON.stringify({
        batch_id: batchData.id,
        total_records: totalRecords,
        valid_records: validRecords,
        invalid_records: invalidRecords,
        errors: errors.slice(0, 10) // Return first 10 errors for display
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error processing file:', error);

    try {
      // Attempt to mark batch as failed if it was created
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      if (batchId) {
        await supabaseClient
          .from('import_batches')
          .update({ status: 'failed', error_summary: [String(error?.message || error)] })
          .eq('id', batchId);
      }
    } catch (innerErr) {
      console.error('Also failed to update batch status:', innerErr);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process file'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // Check if it's a valid length (10-15 digits)
  return digits.length >= 10 && digits.length <= 15;
}