import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MatchingCriteria {
  id: string;
  name: string;
  weight: number;
  is_active: boolean;
  criteria_type: string;
}

export interface DinnerGroup {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  status: string;
  created_by: string | null;
  approved_by: string | null;
  scheduled_date: string | null;
  location_type: string | null;
  host_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: string;
  added_at: string;
}

export const useMatching = () => {
  const [loading, setLoading] = useState(false);

  const generateMatches = async (criteriaWeights?: Record<string, number>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-matches', {
        body: { criteriaWeights }
      });

      if (error) throw error;

      toast({
        title: "Matches generated",
        description: `Generated ${data.groupsCreated} potential groups with ${data.membersMatched} members.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error generating matches:', error);
      toast({
        variant: "destructive",
        title: "Error generating matches",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('dinner_groups')
        .update({ 
          status: 'approved',
          approved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', groupId);

      if (error) throw error;

      toast({
        title: "Group approved",
        description: "The group has been approved and members will be notified.",
      });
    } catch (error: any) {
      console.error('Error approving group:', error);
      toast({
        variant: "destructive",
        title: "Error approving group",
        description: error.message,
      });
      throw error;
    }
  };

  const exportGroups = async (format: 'pdf' | 'excel', groupIds?: string[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-groups', {
        body: { format, groupIds }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data.file], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dinner-groups.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export completed",
        description: `Groups exported successfully as ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      console.error('Error exporting groups:', error);
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

  const sendNotifications = async (groupIds: string[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-group-notifications', {
        body: { groupIds }
      });

      if (error) throw error;

      toast({
        title: "Notifications sent",
        description: `Sent notifications to ${data.emailsSent} members across ${groupIds.length} groups.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      toast({
        variant: "destructive",
        title: "Error sending notifications",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateMatches,
    approveGroup,
    exportGroups,
    sendNotifications,
  };
};