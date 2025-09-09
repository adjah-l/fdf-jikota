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
      // Parse CSV robustly using SheetJS to avoid comma/quote misalignment
      const text = await file.text();
      const workbook = XLSX.read(text, { type: 'string' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON rows (header + data)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: ''
      });

      if (jsonData.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      // Clean and normalize headers
      const headers = (jsonData[0] as any[]).map((header, index) => {
        const cleanHeader = String(header || `Column_${index}`)
          .replace(/\uFEFF/g, '') // remove BOM
          .replace(/\s+/g, ' ') // collapse whitespace
          .trim();
        console.log(`Header ${index}: "${cleanHeader}"`);
        return cleanHeader;
      });

      console.log('CSV headers found:', headers);
      console.log('Field mapping:', fieldMapping);

      for (let i = 1; i < jsonData.length; i++) {
        const values = jsonData[i] as any[];
        const rawData: any = {};

        // Ensure we have the right number of values
        const normalizedValues = Array(headers.length)
          .fill('')
          .map((_, index) => {
            const value = values[index];
            return value !== undefined && value !== null ? String(value).trim() : '';
          });

        headers.forEach((header, index) => {
          rawData[header] = normalizedValues[index];
        });

        // Log first few records for debugging
        if (i <= 3) {
          console.log(`Row ${i} raw data:`, rawData);
        }

        // Map to profile fields
        const mappedData: any = {};
        let isValid = true;
        const recordErrors: string[] = [];

        Object.entries(fieldMapping).forEach(([fileColumn, profileField]) => {
          const val = rawData[fileColumn as string];
          if (profileField && val !== undefined && val !== '') {
            const value = String(val).trim();
            mappedData[profileField as string] = value;

            // Log mapping for debugging (first few records only)
            if (i <= 3) {
              console.log(`Mapping: "${fileColumn}" -> "${profileField}" = "${value}"`);
            }
          }
        });

        // Log mapped data for first few records
        if (i <= 3) {
          console.log(`Row ${i} mapped data:`, mappedData);
        }

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
        
        // Validate data type consistency to catch parsing issues
        if (mappedData.new_to_city && !isYesNoResponse(mappedData.new_to_city)) {
          recordErrors.push(`"Are you new to city" field contains unexpected value: "${mappedData.new_to_city}"`);
        }
        
        if (mappedData.city && (mappedData.city.toLowerCase().includes('yes') || mappedData.city.toLowerCase().includes('no'))) {
          recordErrors.push(`City field contains yes/no response: "${mappedData.city}"`);
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
      
      // Convert to JSON with proper handling of headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false,
        defval: ''
      });
      
      if (jsonData.length < 2) {
        throw new Error('Excel file must have at least a header row and one data row');
      }

      // Clean and normalize headers
      const headers = (jsonData[0] as any[]).map((header, index) => {
        const cleanHeader = String(header || `Column_${index}`)
          .replace(/\uFEFF/g, '') // remove BOM
          .replace(/\s+/g, ' ')   // collapse whitespace
          .trim();
        console.log(`Header ${index}: "${cleanHeader}"`);
        return cleanHeader;
      });
      
      console.log('Excel headers found:', headers);
      console.log('Field mapping:', fieldMapping);
      
      for (let i = 1; i < jsonData.length; i++) {
        const values = jsonData[i] as any[];
        const rawData: any = {};
        
        // Ensure we have the right number of values
        const normalizedValues = Array(headers.length).fill('').map((_, index) => {
          const value = values[index];
          return value !== undefined && value !== null ? String(value).trim() : '';
        });
        
        headers.forEach((header, index) => {
          rawData[header] = normalizedValues[index];
        });
        
        // Log first few records for debugging
        if (i <= 3) {
          console.log(`Row ${i} raw data:`, rawData);
        }

        // Map to profile fields
        const mappedData: any = {};
        let isValid = true;
        const recordErrors: string[] = [];

        Object.entries(fieldMapping).forEach(([fileColumn, profileField]) => {
          if (profileField && rawData[fileColumn] !== undefined && rawData[fileColumn] !== '') {
            const value = String(rawData[fileColumn]).trim();
            mappedData[profileField] = value;
            
            // Log mapping for debugging (first few records only)
            if (i <= 3) {
              console.log(`Mapping: "${fileColumn}" -> "${profileField}" = "${value}"`);
            }
          }
        });
        
        // Log mapped data for first few records
        if (i <= 3) {
          console.log(`Row ${i} mapped data:`, mappedData);
        }

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
        
        // Validate data type consistency to catch parsing issues
        if (mappedData.new_to_city && !isYesNoResponse(mappedData.new_to_city)) {
          recordErrors.push(`"Are you new to city" field contains unexpected value: "${mappedData.new_to_city}"`);
        }
        
        if (mappedData.city && (mappedData.city.toLowerCase().includes('yes') || mappedData.city.toLowerCase().includes('no'))) {
          recordErrors.push(`City field contains yes/no response: "${mappedData.city}"`);
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

function isYesNoResponse(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  return ['yes', 'no', 'y', 'n', 'true', 'false', '1', '0', ''].includes(normalized);
}