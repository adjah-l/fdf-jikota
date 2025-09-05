import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminRole(null);
      setLoading(false);
      return;
    }

    try {
      // Check if user is admin
      const { data: adminCheck, error: checkError } = await supabase
        .rpc('is_admin', { user_id_param: user.id });

      if (checkError) {
        console.error('Error checking admin status:', checkError);
        setIsAdmin(false);
        setAdminRole(null);
      } else {
        setIsAdmin(adminCheck);
        
        if (adminCheck) {
          // Get admin role
          const { data: roleData, error: roleError } = await supabase
            .rpc('get_admin_role', { user_id_param: user.id });

          if (roleError) {
            console.error('Error getting admin role:', roleError);
          } else {
            setAdminRole(roleData);
          }
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  return {
    isAdmin,
    adminRole,
    loading,
    refetch: checkAdminStatus,
  };
};