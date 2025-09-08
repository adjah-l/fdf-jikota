import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Users, MapPin, Calendar, Users2, Hash, Clock, Eye } from 'lucide-react';
import { MatchingPolicy, useMatchingPolicies, SimulationResult } from '@/hooks/useMatchingPolicies';
import { Neighborhood } from '@/hooks/useNeighborhoods';

interface MatchingRulesFormProps {
  neighborhood: Neighborhood;
  onClose?: () => void;
}

const defaultPolicy: Partial<MatchingPolicy> = {
  mode: 'automatic',
  default_group_size: 5,
  family_group_size: 4,
  gender_mode: 'mixed',
  gender_allowed: ['men', 'women'],
  gender_hard: false,
  gender_weight: 40,
  stage_alignment: 'mix',
  stage_hard: false,
  stage_weight: 60,
  season_use: false,
  season_value: 'winter',
  season_weight: 50,
  family_stage_alignment: 'mix',
  family_stage_hard: false,
  family_stage_weight: 40,
  age_alignment: 'mix',
  age_hard: false,
  age_weight: 30,
  location_scope: 'inside_only',
  max_distance_miles: 25,
  location_hard: true,
  same_community_weight: 50,
  fallback_strategy: 'auto_relax'
};

export const MatchingRulesForm: React.FC<MatchingRulesFormProps> = ({ neighborhood, onClose }) => {
  const { getPolicyByNeighborhood, createOrUpdatePolicy, simulateMatching } = useMatchingPolicies();
  const [policy, setPolicy] = useState<Partial<MatchingPolicy>>(defaultPolicy);
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const loadPolicy = async () => {
      const existingPolicy = await getPolicyByNeighborhood(neighborhood.id);
      if (existingPolicy) {
        setPolicy(existingPolicy);
      }
      setLoading(false);
    };

    loadPolicy();
  }, [neighborhood.id, getPolicyByNeighborhood]);

  const updatePolicy = (updates: Partial<MatchingPolicy>) => {
    setPolicy(prev => ({ ...prev, ...updates }));
  };

  const handleSimulate = async () => {
    setSimulating(true);
    const result = await simulateMatching(neighborhood.id, policy);
    setSimulation(result);
    setSimulating(false);
  };

  const handleSave = async () => {
    const success = await createOrUpdatePolicy(neighborhood.id, policy);
    if (success && onClose) {
      onClose();
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading matching policy...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Matching Rules - {neighborhood.name}</h2>
          <p className="text-muted-foreground">Configure how groups are automatically formed in this community</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSimulate} disabled={simulating}>
            <Eye className="h-4 w-4 mr-2" />
            {simulating ? 'Simulating...' : 'Simulate'}
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {simulation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{simulation.eligible_members}</div>
                <div className="text-sm text-blue-700">Eligible Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{simulation.potential_groups}</div>
                <div className="text-sm text-green-700">Potential Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{simulation.waitlist_members}</div>
                <div className="text-sm text-orange-700">Waitlist Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matching Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Matching Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mode">Mode</Label>
              <Select value={policy.mode} onValueChange={(value: 'automatic' | 'review_required') => updatePolicy({ mode: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="review_required">Review Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="default_group_size">Default Group Size</Label>
              <Slider
                value={[policy.default_group_size || 5]}
                onValueChange={([value]) => updatePolicy({ default_group_size: value })}
                min={3}
                max={10}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">{policy.default_group_size} individuals</div>
            </div>
            <div>
              <Label htmlFor="family_group_size">Family Group Size</Label>
              <Slider
                value={[policy.family_group_size || 4]}
                onValueChange={([value]) => updatePolicy({ family_group_size: value })}
                min={2}
                max={8}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground mt-1">{policy.family_group_size} families</div>
            </div>
          </CardContent>
        </Card>

        {/* Gender Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gender Matching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Setting</Label>
              <Select value={policy.gender_mode} onValueChange={(value: 'mixed' | 'single') => updatePolicy({ gender_mode: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed</SelectItem>
                  <SelectItem value="single">Single Gender Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {policy.gender_mode === 'single' && (
              <div>
                <Label>Allowed Genders</Label>
                <div className="flex gap-2 mt-2">
                  {['men', 'women'].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox
                        id={gender}
                        checked={policy.gender_allowed?.includes(gender)}
                        onCheckedChange={(checked) => {
                          const allowed = policy.gender_allowed || [];
                          if (checked) {
                            updatePolicy({ gender_allowed: [...allowed, gender] });
                          } else {
                            updatePolicy({ gender_allowed: allowed.filter(g => g !== gender) });
                          }
                        }}
                      />
                      <Label htmlFor={gender} className="capitalize">{gender}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="gender_hard">Hard Requirement</Label>
              <Switch
                id="gender_hard"
                checked={policy.gender_hard}
                onCheckedChange={(checked) => updatePolicy({ gender_hard: checked })}
              />
            </div>

            {!policy.gender_hard && (
              <div>
                <Label>Weight: {policy.gender_weight}</Label>
                <Slider
                  value={[policy.gender_weight || 40]}
                  onValueChange={([value]) => updatePolicy({ gender_weight: value })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stage of Life */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Stage of Life
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Alignment</Label>
              <Select value={policy.stage_alignment} onValueChange={(value: 'mix' | 'same') => updatePolicy({ stage_alignment: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mix">Mix Allowed</SelectItem>
                  <SelectItem value="same">Same Stage Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="stage_hard">Hard Requirement</Label>
              <Switch
                id="stage_hard"
                checked={policy.stage_hard}
                onCheckedChange={(checked) => updatePolicy({ stage_hard: checked })}
              />
            </div>

            {!policy.stage_hard && (
              <div>
                <Label>Weight: {policy.stage_weight}</Label>
                <Slider
                  value={[policy.stage_weight || 60]}
                  onValueChange={([value]) => updatePolicy({ stage_weight: value })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seasonal Interest */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seasonal Interest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="season_use">Use Season in Matching</Label>
              <Switch
                id="season_use"
                checked={policy.season_use}
                onCheckedChange={(checked) => updatePolicy({ season_use: checked })}
              />
            </div>

            {policy.season_use && (
              <>
                <div>
                  <Label>Season</Label>
                  <Select value={policy.season_value} onValueChange={(value: 'fall' | 'winter' | 'spring' | 'summer') => updatePolicy({ season_value: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fall">Fall</SelectItem>
                      <SelectItem value="winter">Winter/Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Weight: {policy.season_weight}</Label>
                  <Slider
                    value={[policy.season_weight || 50]}
                    onValueChange={([value]) => updatePolicy({ season_weight: value })}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Age Group */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Age Group
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Alignment</Label>
              <Select value={policy.age_alignment} onValueChange={(value: 'mix' | 'same') => updatePolicy({ age_alignment: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mix">Mix Allowed</SelectItem>
                  <SelectItem value="same">Same Age Bucket Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="age_hard">Hard Requirement</Label>
              <Switch
                id="age_hard"
                checked={policy.age_hard}
                onCheckedChange={(checked) => updatePolicy({ age_hard: checked })}
              />
            </div>

            {!policy.age_hard && (
              <div>
                <Label>Weight: {policy.age_weight}</Label>
                <Slider
                  value={[policy.age_weight || 30]}
                  onValueChange={([value]) => updatePolicy({ age_weight: value })}
                  min={0}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Placement Scope</Label>
              <Select value={policy.location_scope} onValueChange={(value: 'inside_only' | 'nearby_ok') => updatePolicy({ location_scope: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inside_only">Inside this community only</SelectItem>
                  <SelectItem value="nearby_ok">Allow nearby communities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {policy.location_scope === 'nearby_ok' && (
              <>
                <div>
                  <Label>Max Distance: {policy.max_distance_miles} miles</Label>
                  <Slider
                    value={[policy.max_distance_miles || 25]}
                    onValueChange={([value]) => updatePolicy({ max_distance_miles: value })}
                    min={5}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Same Community Weight: {policy.same_community_weight}</Label>
                  <Slider
                    value={[policy.same_community_weight || 50]}
                    onValueChange={([value]) => updatePolicy({ same_community_weight: value })}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="location_hard">Hard Requirement</Label>
              <Switch
                id="location_hard"
                checked={policy.location_hard}
                onCheckedChange={(checked) => updatePolicy({ location_hard: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fallbacks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Fallbacks and Waitlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>If hard rules block a full group:</Label>
              <Select value={policy.fallback_strategy} onValueChange={(value: 'fill_partial' | 'auto_relax' | 'waitlist') => updatePolicy({ fallback_strategy: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fill_partial">Fill what you can and keep open</SelectItem>
                  <SelectItem value="auto_relax">Auto-relax lowest weight preference</SelectItem>
                  <SelectItem value="waitlist">Send to waitlist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};