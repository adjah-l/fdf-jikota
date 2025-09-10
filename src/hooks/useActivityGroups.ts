import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActivityTypeLabel, type ActivityType } from '@/lib/activityTypes';
import type { Database } from '@/integrations/supabase/types';

type ActivityGroupInsert = Database['public']['Tables']['activity_groups']['Insert'];
type ActivityGroupUpdate = Database['public']['Tables']['activity_groups']['Update'];

export type CreateActivityGroupInput = {
  name: string;
  activity_type: ActivityType;
  description?: string | null;
  five_c_focus?: string | null;
  max_members?: number;
  location_type?: string | null;
  org_id?: string | null;
};

export function useActivityGroups() {
  const queryClient = useQueryClient();

  // Fetch activity groups with optional org filter
  async function fetchActivityGroups(orgId?: string) {
    let query = supabase
      .from('activity_groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (orgId) {
      query = query.eq('org_id', orgId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  // Fallback to dinner groups if activity groups are empty
  async function fetchDinnerGroupsFallback(orgId?: string) {
    let query = supabase
      .from('dinner_groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (orgId) {
      query = query.eq('org_id', orgId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data ?? []).map((dg: any) => ({
      id: dg.migrated_to ?? dg.id,
      org_id: dg.org_id ?? null,
      name: dg.name ?? `Dinner Group ${String(dg.id).slice(0, 8)}`,
      activity_type: 'dinner' as ActivityType,
      description: dg.description ?? null,
      five_c_focus: 'balance',
      status: dg.status ?? 'draft',
      max_members: dg.max_members ?? 8,
      location_type: dg.location_type ?? null,
      created_at: dg.created_at,
      updated_at: dg.updated_at,
      _fallback: true, // Mark as fallback data
    }));
  }

  // Hook to list activity groups
  const listActivityGroups = (orgId?: string) =>
    useQuery({
      queryKey: ['activity_groups', orgId ?? 'all'],
      queryFn: () => fetchActivityGroups(orgId),
    });

  // Hook to list groups with fallback to dinner groups
  const listGroupsWithFallback = (orgId?: string) =>
    useQuery({
      queryKey: ['groups_with_fallback', orgId ?? 'all'],
      queryFn: async () => {
        const activityGroups = await fetchActivityGroups(orgId);
        if (activityGroups.length > 0) {
          return activityGroups;
        }
        
        // If no activity groups, try dinner groups as fallback
        const fallbackGroups = await fetchDinnerGroupsFallback(orgId);
        return fallbackGroups;
      },
    });

  // Hook to get a single activity group
  const getActivityGroup = (id: string) =>
    useQuery({
      queryKey: ['activity_group', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('activity_groups')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      },
      enabled: !!id,
    });

  // Mutation to create an activity group
  const createActivityGroup = useMutation({
    mutationFn: async (input: CreateActivityGroupInput) => {
      const insertData: ActivityGroupInsert = {
        name: input.name,
        activity_type: input.activity_type,
        description: input.description || null,
        five_c_focus: input.five_c_focus || 'balance',
        max_members: input.max_members || 8,
        location_type: input.location_type || null,
        org_id: input.org_id || null,
      };
      
      const { data, error } = await supabase
        .from('activity_groups')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity_groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups_with_fallback'] });
    },
  });

  // Mutation to update an activity group
  const updateActivityGroup = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CreateActivityGroupInput> }) => {
      const updateData: ActivityGroupUpdate = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.activity_type !== undefined) updateData.activity_type = input.activity_type;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.five_c_focus !== undefined) updateData.five_c_focus = input.five_c_focus;
      if (input.max_members !== undefined) updateData.max_members = input.max_members;
      if (input.location_type !== undefined) updateData.location_type = input.location_type;
      if (input.org_id !== undefined) updateData.org_id = input.org_id;
      
      const { data, error } = await supabase
        .from('activity_groups')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activity_groups'] });
      queryClient.invalidateQueries({ queryKey: ['groups_with_fallback'] });
      queryClient.invalidateQueries({ queryKey: ['activity_group', variables.id] });
    },
  });

  return {
    listActivityGroups,
    listGroupsWithFallback,
    getActivityGroup,
    createActivityGroup,
    updateActivityGroup,
    getActivityTypeLabel,
  };
}