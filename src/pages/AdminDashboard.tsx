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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Users, Settings, FileDown, Mail, Play, MapPin, Home, CalendarDays, Filter, Sliders } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MatchingRulesForm } from '@/components/matching/MatchingRulesForm';
import { DataSourcesManager } from '@/components/external-data/DataSourcesManager';

interface DinnerGroup {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  status: string;
  created_at: string;
  member_count?: number;
}


interface Neighborhood {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  zip_codes: string[];
  member_count: number;
  family_count: number;
  family_groups_count: number;
  active_dinners_count: number;
  current_season: string;
  community_tags: string[];
  latitude: number | null;
  longitude: number | null;
  state_region: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { isAdmin, adminRole, loading: adminLoading } = useAdmin();
  const { loading: matchingLoading, generateMatches, approveGroup, exportGroups, sendNotifications } = useMatching();
  const [groups, setGroups] = useState<DinnerGroup[]>([]);
  
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
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


      // Fetch neighborhoods
      const { data: neighborhoodsData, error: neighborhoodsError } = await supabase
        .from('neighborhoods')
        .select('*')
        .order('name');

      if (neighborhoodsError) throw neighborhoodsError;
      setNeighborhoods(neighborhoodsData || []);

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
            <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
            <TabsTrigger value="matching">Matching System</TabsTrigger>
            <TabsTrigger value="external-sources">External Sources</TabsTrigger>
            <TabsTrigger value="matching-rules">Matching Rules</TabsTrigger>
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

          <TabsContent value="neighborhoods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Neighborhoods Overview</CardTitle>
                <CardDescription>Monitor neighborhood activity and metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Neighborhoods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{neighborhoods.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {neighborhoods.reduce((sum, n) => sum + n.member_count, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Families</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {neighborhoods.reduce((sum, n) => sum + n.family_count, 0)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Dinners</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {neighborhoods.reduce((sum, n) => sum + n.active_dinners_count, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {Array.from(new Set(neighborhoods.map(n => n.state))).map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {Array.from(new Set(
                        neighborhoods
                          .filter(n => selectedState === 'all' || n.state === selectedState)
                          .map(n => n.city)
                      )).map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Neighborhoods Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Neighborhood</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Families</TableHead>
                        <TableHead>Family Groups</TableHead>
                        <TableHead>Active Dinners</TableHead>
                        <TableHead>Season</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {neighborhoods
                        .filter(n => selectedState === 'all' || n.state === selectedState)
                        .filter(n => selectedCity === 'all' || n.city === selectedCity)
                        .map((neighborhood) => (
                        <TableRow key={neighborhood.id}>
                          <TableCell className="font-medium">{neighborhood.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {neighborhood.city}, {neighborhood.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {neighborhood.member_count}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Home className="h-3 w-3" />
                              {neighborhood.family_count}
                            </div>
                          </TableCell>
                          <TableCell>{neighborhood.family_groups_count}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {neighborhood.active_dinners_count}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{neighborhood.current_season}</Badge>
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

          {/* External Sources Tab */}
          <TabsContent value="external-sources" className="space-y-6">
            <DataSourcesManager />
          </TabsContent>

          {/* Matching Rules Tab */}
          <TabsContent value="matching-rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5" />
                  Community Matching Rules
                </CardTitle>
                <CardDescription>
                  Configure how groups are automatically formed for each neighborhood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select a neighborhood to configure its matching rules. Each neighborhood can have unique rules for gender, age, stage of life, seasonal preferences, and location requirements.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {neighborhoods.slice(0, 9).map((neighborhood) => (
                      <Card key={neighborhood.id} className="p-4">
                        <div className="flex flex-col space-y-2">
                          <h4 className="font-medium">{neighborhood.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {neighborhood.city}, {neighborhood.state}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{neighborhood.member_count} members</span>
                            <span>{neighborhood.active_dinners_count} active dinners</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedNeighborhood(neighborhood)}
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Configure Rules
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Matching Rules - {neighborhood.name}</DialogTitle>
                              </DialogHeader>
                              {selectedNeighborhood && (
                                <MatchingRulesForm 
                                  neighborhood={selectedNeighborhood}
                                  onClose={() => setSelectedNeighborhood(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    ))}
                  </div>
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