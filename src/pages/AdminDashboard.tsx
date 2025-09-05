import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useMatching } from '@/hooks/useMatching';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Loader2, Users, Settings, FileDown, Mail, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DinnerGroup {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  status: string;
  created_at: string;
  member_count?: number;
}

interface MatchingCriteria {
  id: string;
  name: string;
  weight: number;
  is_active: boolean;
  criteria_type: string;
}

const AdminDashboard = () => {
  const { isAdmin, adminRole, loading: adminLoading } = useAdmin();
  
  console.log('AdminDashboard: isAdmin =', isAdmin, 'adminRole =', adminRole, 'loading =', adminLoading);
  const { loading: matchingLoading, generateMatches, approveGroup, exportGroups, sendNotifications } = useMatching();
  const [groups, setGroups] = useState<DinnerGroup[]>([]);
  const [criteria, setCriteria] = useState<MatchingCriteria[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('dinner_groups')
        .select('*, group_members(count)')
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      const groupsWithCounts = groupsData.map(group => ({
        ...group,
        member_count: group.group_members?.[0]?.count || 0
      }));

      setGroups(groupsWithCounts);

      // Fetch matching criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from('matching_criteria')
        .select('*')
        .order('weight', { ascending: false });

      if (criteriaError) throw criteriaError;
      setCriteria(criteriaData);

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

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleGenerateMatches = async () => {
    await generateMatches();
    fetchData();
  };

  const handleApproveGroup = async (groupId: string) => {
    await approveGroup(groupId);
    fetchData();
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    const groupIds = selectedGroups.length > 0 ? selectedGroups : undefined;
    await exportGroups(format, groupIds);
  };

  const handleSendNotifications = async () => {
    if (selectedGroups.length === 0) {
      toast({
        variant: "destructive",
        title: "No groups selected",
        description: "Please select groups to send notifications for.",
      });
      return;
    }
    await sendNotifications(selectedGroups);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      pending_approval: 'destructive',
      approved: 'default',
      active: 'default',
      completed: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage dinner groups and matching system</p>
          </div>
          <Badge variant="outline" className="capitalize">{adminRole} Access</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groups.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groups.filter(g => g.status === 'pending_approval').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groups.filter(g => g.status === 'approved' || g.status === 'active').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList>
            <TabsTrigger value="groups">Groups Management</TabsTrigger>
            <TabsTrigger value="matching">Matching System</TabsTrigger>
            <TabsTrigger value="criteria">Criteria Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dinner Groups</CardTitle>
                <CardDescription>Manage and approve dinner group assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={handleGenerateMatches}
                    disabled={matchingLoading}
                  >
                    {matchingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate New Matches
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('pdf')}
                    disabled={matchingLoading}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('excel')}
                    disabled={matchingLoading}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Excel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSendNotifications}
                    disabled={matchingLoading || selectedGroups.length === 0}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Notifications ({selectedGroups.length})
                  </Button>
                </div>

                <Separator />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGroups(groups.map(g => g.id));
                              } else {
                                setSelectedGroups([]);
                              }
                            }}
                            checked={selectedGroups.length === groups.length && groups.length > 0}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedGroups.includes(group.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGroups([...selectedGroups, group.id]);
                                } else {
                                  setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{getStatusBadge(group.status)}</TableCell>
                          <TableCell>{group.member_count || 0} / {group.max_members}</TableCell>
                          <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {group.status === 'pending_approval' && (
                              <Button
                                size="sm"
                                onClick={() => handleApproveGroup(group.id)}
                              >
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matching Algorithm</CardTitle>
                <CardDescription>Configure how members are matched into dinner groups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The matching algorithm considers multiple factors to create balanced dinner groups.
                  Click "Generate New Matches" to create preliminary groups that require your approval.
                </p>
                <Button onClick={handleGenerateMatches} disabled={matchingLoading}>
                  {matchingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate New Matches
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criteria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matching Criteria</CardTitle>
                <CardDescription>Adjust the weight of different matching factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{criterion.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {criterion.criteria_type.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{Math.round(criterion.weight * 100)}%</span>
                        <Badge variant={criterion.is_active ? 'default' : 'secondary'}>
                          {criterion.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;