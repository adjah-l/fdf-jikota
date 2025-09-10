import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getActivityTypeLabel } from '@/lib/activityTypes';

export function useMyGroup() {
  return useQuery({
    queryKey: ['my_group'],
    queryFn: async () => {
      // First, try to get the user's profile to find their group
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Look for activity group membership first
      const { data: activityMembership } = await supabase
        .from('activity_group_members')
        .select(`
          group_id,
          status,
          activity_groups (
            id,
            name,
            activity_type,
            description,
            five_c_focus,
            max_members,
            location_type,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'assigned')
        .maybeSingle();

      if (activityMembership?.activity_groups) {
        return {
          ...activityMembership.activity_groups,
          membership_status: activityMembership.status,
        };
      }

      // Fallback to dinner groups
      const { data: dinnerMembership } = await supabase
        .from('group_members')
        .select(`
          group_id,
          status,
          dinner_groups (
            id,
            name,
            description,
            five_c_focus,
            max_members,
            location_type,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.user.id)
        .eq('status', 'assigned')
        .maybeSingle();

      if (dinnerMembership?.dinner_groups) {
        return {
          ...dinnerMembership.dinner_groups,
          activity_type: 'dinner' as const,
          membership_status: dinnerMembership.status,
          _fallback: true,
        };
      }

      return null;
    },
  });
}