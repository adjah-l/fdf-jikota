import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  family_profile: string | null;
  age_group: string | null;
  
  // Location fields
  city: string | null;
  state_region: string | null;
  country: string | null;
  neighborhood_name: string | null;
  development_subdivision: string | null;
  closest_fd_city: string | null;
  new_to_city: string | null;
  
  // Spouse information
  spouse_first_name: string | null;
  spouse_last_name: string | null;
  spouse_email: string | null;
  spouse_phone: string | null;
  
  // Family details
  children_ages: string | null;
  season_interest: string | null;
  group_interest: string | null;
  
  // Personal preferences
  favorite_dinner_meal: string | null;
  favorite_dessert: string | null;
  activities: string[] | null;
  work_from_home: string | null;
  hometown: string | null;
  ways_to_serve: string[] | null;
  willing_to_welcome: boolean | null;
  instagram_handle: string | null;
  
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message,
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating profile",
          description: error.message,
        });
        throw error;
      }

      setProfile(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
};