import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Users, Zap, AlertTriangle, CheckCircle, Play, Save, Copy, Trash2 } from 'lucide-react';
import { useMatchingPolicies, MatchingPolicy } from '@/hooks/useMatchingPolicies';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { MatchingRulesForm } from '@/components/matching/MatchingRulesForm';
import { AlgorithmTemplates } from '@/components/admin/AlgorithmTemplates';
import { MatchingSimulator } from '@/components/admin/MatchingSimulator';
import { toast } from '@/hooks/use-toast';

export const MatchingAlgorithms = () => {
  const { policies, loading, refetch } = useMatchingPolicies();
  const { neighborhoods } = useNeighborhoods();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('policies');

  const getNeighborhoodName = (neighborhoodId: string) => {
    const neighborhood = neighborhoods.find(n => n.id === neighborhoodId);
    return neighborhood?.name || 'Unknown';
  };

  const getStatusBadge = (policy: MatchingPolicy) => {
    if (policy.mode === 'automatic') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge variant="outline">Review Mode</Badge>;
  };

  const handleRunMatching = async (neighborhoodId: string) => {
    try {
      // This would call the matching algorithm
      toast({
        title: "Matching Started",
        description: "The matching algorithm is running for this neighborhood.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run matching algorithm.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading matching algorithms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Matching Algorithms</h1>
          <p className="text-muted-foreground">
            Configure and manage group matching algorithms for each community
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            <Settings className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          {/* Algorithm Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Algorithms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{policies.length}</div>
                <div className="text-sm text-muted-foreground">Configured communities</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Automatic Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {policies.filter(p => p.mode === 'automatic').length}
                </div>
                <div className="text-sm text-muted-foreground">Running automatically</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Review Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {policies.filter(p => p.mode === 'review_required').length}
                </div>
                <div className="text-sm text-muted-foreground">Require review</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Configured Matching Policies</CardTitle>
            </CardHeader>
            <CardContent>
              {policies.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Matching Policies</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first matching algorithm to start forming groups.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{getNeighborhoodName(policy.neighborhood_id)}</h3>
                          {getStatusBadge(policy)}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunMatching(policy.neighborhood_id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Run
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-1" />
                                Configure
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Configure Matching Algorithm</DialogTitle>
                              </DialogHeader>
                              <MatchingRulesForm 
                                neighborhood={neighborhoods.find(n => n.id === policy.neighborhood_id)!} 
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Group Size</div>
                          <div className="font-medium">{policy.default_group_size} members</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Gender Mode</div>
                          <div className="font-medium capitalize">{policy.gender_mode}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Location Scope</div>
                          <div className="font-medium">
                            {policy.location_scope === 'inside_only' ? 'Community Only' : 'Nearby OK'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Fallback</div>
                          <div className="font-medium capitalize">{policy.fallback_strategy.replace('_', ' ')}</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-muted-foreground">
                          Last updated: {new Date(policy.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <AlgorithmTemplates />
        </TabsContent>

        <TabsContent value="simulator">
          <MatchingSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
};