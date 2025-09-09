import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useExternalData } from './useExternalData';

export interface ExternalMatchingPolicy {
  id: string;
  batch_id: string;
  age_weight: number;
  location_weight: number;
  family_stage_weight: number;
  interests_weight: number;
  max_distance_miles?: number;
  default_group_size: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ExternalBatchEmailConfig {
  id: string;
  batch_id: string;
  subject: string;
  from_name: string;
  from_email: string;
  body_template: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useEnhancedExternalData = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const externalData = useExternalData();

  // Get or create matching policy for batch
  const getMatchingPolicy = async (batchId: string): Promise<ExternalMatchingPolicy | null> => {
    try {
      const { data, error } = await supabase
        .from('external_matching_policies')
        .select('*')
        .eq('batch_id', batchId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching matching policy:', error);
      return null;
    }
  };

  const createOrUpdateMatchingPolicy = async (
    batchId: string, 
    policy: Partial<ExternalMatchingPolicy>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const existingPolicy = await getMatchingPolicy(batchId);
      
      if (existingPolicy) {
        const { error } = await supabase
          .from('external_matching_policies')
          .update({
            ...policy,
            updated_at: new Date().toISOString()
          })
          .eq('batch_id', batchId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('external_matching_policies')
          .insert({
            batch_id: batchId,
            created_by: user?.id,
            ...policy
          });
        
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving matching policy:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get or create email config for batch
  const getEmailConfig = async (batchId: string): Promise<ExternalBatchEmailConfig | null> => {
    try {
      const { data, error } = await supabase
        .from('external_batch_email_configs')
        .select('*')
        .eq('batch_id', batchId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching email config:', error);
      return null;
    }
  };

  const createOrUpdateEmailConfig = async (
    batchId: string, 
    config: Partial<ExternalBatchEmailConfig>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const existingConfig = await getEmailConfig(batchId);
      
      if (existingConfig) {
        const { error } = await supabase
          .from('external_batch_email_configs')
          .update({
            ...config,
            updated_at: new Date().toISOString()
          })
          .eq('batch_id', batchId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('external_batch_email_configs')
          .insert({
            batch_id: batchId,
            created_by: user?.id,
            ...config
          });
        
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving email config:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Generate matches with custom policy
  const generateMatchesWithPolicy = async (
    batchId: string, 
    policy?: Partial<ExternalMatchingPolicy>
  ): Promise<any> => {
    try {
      setLoading(true);
      
      if (policy) {
        await createOrUpdateMatchingPolicy(batchId, policy);
      }
      
      return await externalData.generateExternalMatches(batchId);
    } catch (error) {
      console.error('Error generating matches with policy:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Revert group approval
  const revertGroupApproval = async (groupId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('external_groups')
        .update({
          status: 'pending_approval',
          is_reverted: true,
          approved_by: null
        })
        .eq('id', groupId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reverting group approval:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Send group introduction email
  const sendGroupIntroduction = async (groupId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('send-group-introduction', {
        body: { groupId }
      });
      
      if (error) throw error;
      
      // Update group to mark email as sent
      await supabase
        .from('external_groups')
        .update({
          email_sent_at: new Date().toISOString(),
          email_sent_by: user?.id
        })
        .eq('id', groupId);
      
      return true;
    } catch (error) {
      console.error('Error sending group introduction:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear all groups for a batch
  const clearAllGroups = async (batchId: string): Promise<void> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('external_groups')
        .delete()
        .eq('batch_id', batchId);

      if (error) throw error;
      console.log('All groups cleared for batch:', batchId);
    } catch (error: any) {
      console.error('Error clearing groups:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getMatchingPolicy,
    createOrUpdateMatchingPolicy,
    getEmailConfig,
    createOrUpdateEmailConfig,
    generateMatchesWithPolicy,
    revertGroupApproval,
    sendGroupIntroduction,
    clearAllGroups,
    ...externalData
  };
};