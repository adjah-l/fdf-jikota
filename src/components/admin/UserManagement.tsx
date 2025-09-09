import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, UserPlus, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { OrgRole } from '@/lib/schemas';

interface User {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  organization_memberships?: {
    id: string;
    org_id: string;
    user_id: string;
    role: OrgRole;
    is_active: boolean;
    organizations: {
      name: string;
      slug: string;
    };
  }[];
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch users with their organization memberships
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          email,
          created_at
        `);

      if (userError) throw userError;

      // Fetch organization memberships separately
      const { data: membershipData, error: membershipError } = await supabase
        .from('organization_members')
        .select(`
          id,
          org_id,
          user_id,
          role,
          is_active,
          organizations(name, slug)
        `);

      if (membershipError) throw membershipError;

      // Combine users with their memberships
      const usersWithMemberships = userData?.map(user => ({
        ...user,
        organization_memberships: membershipData?.filter(m => m.user_id === user.user_id) || []
      })) || [];

      // Fetch all organizations
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .order('name');

      if (orgError) throw orgError;

      setUsers(usersWithMemberships);
      setOrganizations(orgData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (membershipId: string, newRole: OrgRole) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role: newRole })
        .eq('id', membershipId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      await fetchData();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const updateUserStatus = async (membershipId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ is_active: isActive })
        .eq('id', membershipId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      });

      await fetchData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOrg = selectedOrg === 'all' || 
      user.organization_memberships?.some(m => m.org_id === selectedOrg);

    return matchesSearch && matchesOrg;
  });

  const getRoleBadgeVariant = (role: OrgRole) => {
    switch (role) {
      case 'owner': return 'default';
      case 'admin': return 'secondary';
      case 'moderator': return 'outline';
      default: return 'secondary';
    }
  };

  const getAdminCount = (orgId: string) => {
    return users.filter(user => 
      user.organization_memberships?.some(m => 
        m.org_id === orgId && m.role === 'admin' && m.is_active
      )
    ).length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">Loading users...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage users across all organizations and designate up to 4 admins per organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Organization Admin Counts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {organizations.map(org => {
              const adminCount = getAdminCount(org.id);
              return (
                <Card key={org.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {adminCount}/4 admins
                        </p>
                      </div>
                      <Badge variant={adminCount >= 4 ? "default" : "secondary"}>
                        {adminCount >= 4 ? "Full" : "Available"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organizations</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-muted-foreground">ID: {user.user_id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.email || 'No email'}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {user.organization_memberships?.map((membership) => (
                          <div key={membership.id} className="flex items-center gap-2">
                            <span className="text-sm">{membership.organizations.name}</span>
                            <Badge variant={getRoleBadgeVariant(membership.role)} className="text-xs">
                              {membership.role}
                            </Badge>
                            {!membership.is_active && (
                              <Badge variant="destructive" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Dialog 
                        open={isEditDialogOpen && selectedUser?.id === user.id} 
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setSelectedUser(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage User: {user.full_name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {user.organization_memberships?.map((membership) => {
                              const currentAdminCount = getAdminCount(membership.org_id);
                              const canPromoteToAdmin = membership.role !== 'admin' && currentAdminCount < 4;
                              
                              return (
                                <div key={membership.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <p className="font-medium">{membership.organizations.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Current: {membership.role} • {membership.is_active ? 'Active' : 'Inactive'}
                                      </p>
                                    </div>
                                    <Badge variant={getRoleBadgeVariant(membership.role)}>
                                      {membership.role}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex gap-2 flex-wrap">
                                    <Label className="text-sm">Role:</Label>
                                    <Select
                                      value={membership.role}
                                      onValueChange={(value: OrgRole) => updateUserRole(membership.id, value)}
                                    >
                                      <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem 
                                          value="admin"
                                          disabled={!canPromoteToAdmin && membership.role !== 'admin'}
                                        >
                                          Admin {!canPromoteToAdmin && membership.role !== 'admin' ? '(Full)' : ''}
                                        </SelectItem>
                                        <SelectItem value="owner">Owner</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    
                                    <Button
                                      size="sm"
                                      variant={membership.is_active ? "destructive" : "default"}
                                      onClick={() => updateUserStatus(membership.id, !membership.is_active)}
                                    >
                                      {membership.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};