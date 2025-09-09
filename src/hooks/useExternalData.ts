import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ExternalDataSource {
  id: string;
  name: string;
  source_type: 'google_sheets' | 'jotform' | 'csv_upload' | 'excel_upload';
  source_identifier?: string;
  configuration: Record<string, any>;
  field_mapping: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportBatch {
  id: string;
  source_id: string;
  filename?: string;
  total_records: number;
  valid_records: number;
  invalid_records: number;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  error_summary: any[];
  created_at: string;
  updated_at: string;
}

export interface ExternalProfile {
  id: string;
  source_id: string;
  batch_id: string;
  raw_data: Record<string, any>;
  mapped_data: Record<string, any>;
  validation_status: 'pending' | 'valid' | 'invalid' | 'needs_review';
  validation_errors: any[];
  neighborhood_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalGroup {
  id: string;
  batch_id: string;
  name: string;
  description?: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'active' | 'completed';
  group_size: number;
  neighborhood_id?: string;
  is_reverted?: boolean;
  email_sent_at?: string;
  email_sent_by?: string;
  external_group_members?: Array<{
    id: string;
    status: string;
    external_profiles?: {
      id: string;
      mapped_data: any;
      raw_data?: any;
      validation_status?: string;
    };
  }>;
  matching_policy_used?: Record<string, any>;
  compatibility_score?: number;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  members?: ExternalProfile[];
}

export const useExternalData = () => {
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File, sourceType: 'csv_upload' | 'excel_upload', fieldMapping: Record<string, string>) => {
    setLoading(true);
    try {
      // First create the data source
      const { data: sourceData, error: sourceError } = await supabase
        .from('external_data_sources')
        .insert({
          name: file.name,
          source_type: sourceType,
          source_identifier: file.name,
          field_mapping: fieldMapping,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (sourceError) throw sourceError;

      // Call edge function to process the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source_id', sourceData.id);
      formData.append('field_mapping', JSON.stringify(fieldMapping));

      const { data, error } = await supabase.functions.invoke('process-file-upload', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "File uploaded successfully",
        description: `Processed ${data.total_records} records from ${file.name}`,
      });

      return data;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDataSources = async () => {
    try {
      const { data, error } = await supabase
        .from('external_data_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ExternalDataSource[];
    } catch (error: any) {
      console.error('Error fetching data sources:', error);
      toast({
        variant: "destructive",
        title: "Error fetching data sources",
        description: error.message,
      });
      return [];
    }
  };

  const getImportBatches = async (sourceId?: string) => {
    try {
      let query = supabase
        .from('import_batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ImportBatch[];
    } catch (error: any) {
      console.error('Error fetching import batches:', error);
      toast({
        variant: "destructive",
        title: "Error fetching import batches",
        description: error.message,
      });
      return [];
    }
  };

  const getExternalGroups = async (batchId?: string) => {
    try {
      let query = supabase
        .from('external_groups')
        .select(`
          *,
          external_group_members (
            id,
            status,
            external_profiles (
              id,
              mapped_data,
              validation_status
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (batchId) {
        query = query.eq('batch_id', batchId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include members
      const transformedData = data?.map(group => ({
        ...group,
        members: group.external_group_members?.map((member: any) => member.external_profiles) || []
      })) || [];

      return transformedData as ExternalGroup[];
    } catch (error: any) {
      console.error('Error fetching external groups:', error);
      toast({
        variant: "destructive",
        title: "Error fetching external groups",
        description: error.message,
      });
      return [];
    }
  };

  const approveExternalGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('external_groups')
        .update({ 
          status: 'approved',
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Group approved",
        description: "The external group has been approved.",
      });
    } catch (error: any) {
      console.error('Error approving external group:', error);
      toast({
        variant: "destructive",
        title: "Error approving group",
        description: error.message,
      });
      throw error;
    }
  };

  const generateExternalMatches = async (batchId: string, neighborhoodId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-external-matches', {
        body: { batchId, neighborhoodId }
      });

      if (error) throw error;

      toast({
        title: "External matches generated",
        description: `Generated ${data.groupsCreated} groups from external data.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating external matches:', error);
      toast({
        variant: "destructive",
        title: "Error generating external matches",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const exportExternalGroups = async (format: 'pdf' | 'excel', groupIds?: string[], batchId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-external-groups', {
        body: { format, groupIds, batchId }
      });

      if (error) throw error;

      // Create a blob from the response and trigger download
      const blob = new Blob([data], { 
        type: format === 'excel' ? 'text/csv' : 'text/html' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `external-dinner-groups.${format === 'excel' ? 'csv' : 'html'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `External groups exported in ${format.toUpperCase()} format.`,
      });
    } catch (error: any) {
      console.error('Error exporting external groups:', error);
      toast({
        variant: "destructive",
        title: "Error exporting groups",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploadFile,
    getDataSources,
    getImportBatches,
    getExternalGroups,
    approveExternalGroup,
    generateExternalMatches,
    exportExternalGroups,
  };
};