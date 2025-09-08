import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface MatchingPolicy {
  id: string;
  neighborhood_id: string;
  mode: 'automatic' | 'review_required';
  default_group_size: number;
  family_group_size: number;
  
  // Gender rules
  gender_mode: 'mixed' | 'single';
  gender_allowed: string[];
  gender_hard: boolean;
  gender_weight: number;
  
  // Stage of life rules
  stage_alignment: 'mix' | 'same';
  stage_hard: boolean;
  stage_weight: number;
  
  // Seasonal rules
  season_use: boolean;
  season_value: 'fall' | 'winter' | 'spring' | 'summer';
  season_weight: number;
  
  // Family stage rules
  family_stage_alignment: 'mix' | 'same';
  family_stage_hard: boolean;
  family_stage_weight: number;
  
  // Age rules
  age_alignment: 'mix' | 'same';
  age_hard: boolean;
  age_weight: number;
  
  // Location rules
  location_scope: 'inside_only' | 'nearby_ok';
  max_distance_miles: number;
  location_hard: boolean;
  same_community_weight: number;
  
  // Fallback strategy
  fallback_strategy: 'fill_partial' | 'auto_relax' | 'waitlist';
  
  created_at: string;
  updated_at: string;
}

export interface SimulationResult {
  eligible_members: number;
  potential_groups: number;
  waitlist_members: number;
  simulation_details: {
    policy_used: MatchingPolicy;
    member_breakdown: {
      total: number;
      eligible: number;
      filtered_out: number;
    };
  };
}

export const useMatchingPolicies = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<MatchingPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('matching_policies')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching matching policies:', error);
        toast({
          variant: "destructive",
          title: "Error fetching matching policies",
          description: error.message,
        });
      } else {
        setPolicies((data || []) as MatchingPolicy[]);
      }
    } catch (error) {
      console.error('Error fetching matching policies:', error);
    }
  };

  const getPolicyByNeighborhood = async (neighborhoodId: string): Promise<MatchingPolicy | null> => {
    try {
      const { data, error } = await supabase
        .from('matching_policies')
        .select('*')
        .eq('neighborhood_id', neighborhoodId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching policy:', error);
        return null;
      }

      return data as MatchingPolicy;
    } catch (error) {
      console.error('Error fetching policy:', error);
      return null;
    }
  };

  const createOrUpdatePolicy = async (neighborhoodId: string, policyData: Partial<MatchingPolicy>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to manage matching policies.",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('matching_policies')
        .upsert({
          neighborhood_id: neighborhoodId,
          created_by: user.id,
          ...policyData
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error saving matching policy",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Matching policy saved",
        description: "The matching policy has been updated successfully.",
      });

      await fetchPolicies();
      return true;
    } catch (error) {
      console.error('Error saving matching policy:', error);
      return false;
    }
  };

  const simulateMatching = async (neighborhoodId: string, overrides?: Partial<MatchingPolicy>): Promise<SimulationResult | null> => {
    try {
      const { data, error } = await supabase
        .rpc('simulate_matching', {
          neighborhood_id_param: neighborhoodId,
          policy_overrides: overrides ? JSON.stringify(overrides) : '{}'
        });

      if (error) {
        console.error('Error simulating matching:', error);
        toast({
          variant: "destructive",
          title: "Error simulating matching",
          description: error.message,
        });
        return null;
      }

      return (data?.[0] as unknown as SimulationResult) || null;
    } catch (error) {
      console.error('Error simulating matching:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPolicies();
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    policies,
    loading,
    getPolicyByNeighborhood,
    createOrUpdatePolicy,
    simulateMatching,
    refetch: fetchPolicies
  };
};