import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Neighborhood {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  zip_codes: string[];
  member_count: number;
  active_dinners_count: number;
  community_tags: string[];
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserNeighborhood {
  id: string;
  user_id: string;
  neighborhood_id: string;
  joined_at: string;
  is_active: boolean;
  neighborhood?: Neighborhood;
}

export const useNeighborhoods = () => {
  const { user } = useAuth();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [userNeighborhoods, setUserNeighborhoods] = useState<UserNeighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNeighborhoods = async () => {
    try {
      const { data, error } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching neighborhoods:', error);
        toast({
          variant: "destructive",
          title: "Error fetching neighborhoods",
          description: error.message,
        });
      } else {
        setNeighborhoods(data || []);
      }
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const fetchUserNeighborhoods = async () => {
    if (!user) {
      setUserNeighborhoods([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_neighborhoods')
        .select(`
          *,
          neighborhood:neighborhoods(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching user neighborhoods:', error);
        toast({
          variant: "destructive",
          title: "Error fetching your neighborhoods",
          description: error.message,
        });
      } else {
        setUserNeighborhoods(data || []);
      }
    } catch (error) {
      console.error('Error fetching user neighborhoods:', error);
    }
  };

  const joinNeighborhood = async (neighborhoodId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to join a neighborhood.",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_neighborhoods')
        .insert({
          user_id: user.id,
          neighborhood_id: neighborhoodId,
          is_active: true
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error joining neighborhood",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Welcome to your neighborhood!",
        description: "You've successfully joined the neighborhood.",
      });

      await fetchUserNeighborhoods();
      return true;
    } catch (error) {
      console.error('Error joining neighborhood:', error);
      return false;
    }
  };

  const leaveNeighborhood = async (neighborhoodId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_neighborhoods')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('neighborhood_id', neighborhoodId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error leaving neighborhood",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Left neighborhood",
        description: "You've left the neighborhood successfully.",
      });

      await fetchUserNeighborhoods();
      return true;
    } catch (error) {
      console.error('Error leaving neighborhood:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchNeighborhoods(),
        fetchUserNeighborhoods()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    neighborhoods,
    userNeighborhoods,
    loading,
    joinNeighborhood,
    leaveNeighborhood,
    refetch: () => Promise.all([fetchNeighborhoods(), fetchUserNeighborhoods()])
  };
};