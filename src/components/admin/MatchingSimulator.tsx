import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Download, RefreshCw, Users, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { useMatchingPolicies, SimulationResult } from '@/hooks/useMatchingPolicies';
import { toast } from '@/hooks/use-toast';

export const MatchingSimulator = () => {
  const { neighborhoods } = useNeighborhoods();
  const { simulateMatching } = useMatchingPolicies();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [simulationHistory, setSimulationHistory] = useState<Array<{
    id: string;
    neighborhoodId: string;
    timestamp: Date;
    results: SimulationResult;
  }>>([]);

  const handleRunSimulation = async () => {
    if (!selectedNeighborhood) {
      toast({
        variant: "destructive",
        title: "Select Community",
        description: "Please select a community to simulate matching for.",
      });
      return;
    }

    setSimulating(true);
    try {
      const result = await simulateMatching(selectedNeighborhood);
      if (result) {
        setResults(result);
        setSimulationHistory(prev => [{
          id: Date.now().toString(),
          neighborhoodId: selectedNeighborhood,
          timestamp: new Date(),
          results: result
        }, ...prev.slice(0, 9)]); // Keep last 10 simulations
        
        toast({
          title: "Simulation Complete",
          description: `Generated ${result.potential_groups} potential groups from ${result.eligible_members} eligible members.`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Simulation Failed",
        description: "Failed to run matching simulation.",
      });
    }
    setSimulating(false);
  };

  const handleExportResults = () => {
    if (!results) return;
    
    const data = {
      simulation_date: new Date().toISOString(),
      neighborhood: neighborhoods.find(n => n.id === selectedNeighborhood)?.name,
      results: results
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matching-simulation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getNeighborhoodName = (id: string) => {
    return neighborhoods.find(n => n.id === id)?.name || 'Unknown';
  };

  const getEfficiencyScore = (result: SimulationResult) => {
    if (result.eligible_members === 0) return 0;
    return Math.round((result.potential_groups * 5) / result.eligible_members * 100); // Assuming average group size of 5
  };

  const getWaitlistPercentage = (result: SimulationResult) => {
    if (result.eligible_members === 0) return 0;
    return Math.round((result.waitlist_members / result.eligible_members) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Matching Simulator
          </CardTitle>
          <p className="text-muted-foreground">
            Test matching algorithms without affecting actual group formations.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Select Community
              </label>
              <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a community to simulate..." />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name} ({neighborhood.member_count || 0} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <Button 
                onClick={handleRunSimulation} 
                disabled={!selectedNeighborhood || simulating}
                className="flex items-center gap-2"
              >
                {simulating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {simulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Results */}
      {results && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Simulation Results
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.eligible_members}</div>
                  <div className="text-sm text-blue-700">Eligible Members</div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{results.potential_groups}</div>
                  <div className="text-sm text-green-700">Groups Formed</div>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{results.waitlist_members}</div>
                  <div className="text-sm text-orange-700">Waitlist</div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{getEfficiencyScore(results)}%</div>
                  <div className="text-sm text-purple-700">Efficiency</div>
                </CardContent>
              </Card>
            </div>

            {/* Efficiency Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Matching Efficiency</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Members Matched</span>
                    <span>{results.potential_groups * 5} / {results.eligible_members}</span>
                  </div>
                  <Progress 
                    value={results.eligible_members > 0 ? (results.potential_groups * 5) / results.eligible_members * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Waitlist Rate</span>
                    <span>{getWaitlistPercentage(results)}%</span>
                  </div>
                  <Progress 
                    value={getWaitlistPercentage(results)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Recommendations</h3>
              <div className="space-y-2">
                {getWaitlistPercentage(results) > 20 && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800">High Waitlist Rate</div>
                      <div className="text-yellow-700">
                        Consider relaxing hard constraints or reducing minimum group size.
                      </div>
                    </div>
                  </div>
                )}
                
                {results.potential_groups === 0 && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-red-800">No Groups Formed</div>
                      <div className="text-red-700">
                        Check matching criteria - they may be too restrictive for this community.
                      </div>
                    </div>
                  </div>
                )}
                
                {getEfficiencyScore(results) > 80 && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <UserCheck className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-green-800">Excellent Matching Efficiency</div>
                      <div className="text-green-700">
                        Your algorithm is performing well for this community size.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation History */}
      {simulationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Simulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {simulationHistory.map((sim) => (
                <div key={sim.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{getNeighborhoodName(sim.neighborhoodId)}</div>
                    <div className="text-sm text-muted-foreground">
                      {sim.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{sim.results.potential_groups}</div>
                      <div className="text-muted-foreground">Groups</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{sim.results.waitlist_members}</div>
                      <div className="text-muted-foreground">Waitlist</div>
                    </div>
                    <Badge variant={getEfficiencyScore(sim.results) > 70 ? "default" : "secondary"}>
                      {getEfficiencyScore(sim.results)}% efficient
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};