import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Save, RotateCcw, Play } from 'lucide-react';
import { useEnhancedExternalData, ExternalMatchingPolicy } from '@/hooks/useEnhancedExternalData';
import { useToast } from '@/hooks/use-toast';

interface ExternalMatchingPolicyFormProps {
  batchId: string;
  onPolicyChange?: (policy: Partial<ExternalMatchingPolicy>) => void;
  onGenerateMatches?: () => void;
}

export const ExternalMatchingPolicyForm: React.FC<ExternalMatchingPolicyFormProps> = ({
  batchId,
  onPolicyChange,
  onGenerateMatches
}) => {
  const [policy, setPolicy] = useState<Partial<ExternalMatchingPolicy>>({
    age_weight: 30,
    location_weight: 50,
    family_stage_weight: 40,
    interests_weight: 35,
    max_distance_miles: 25,
    default_group_size: 5
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const { 
    loading, 
    getMatchingPolicy, 
    createOrUpdateMatchingPolicy,
    generateMatchesWithPolicy 
  } = useEnhancedExternalData();
  const { toast } = useToast();

  useEffect(() => {
    loadExistingPolicy();
  }, [batchId]);

  const loadExistingPolicy = async () => {
    const existingPolicy = await getMatchingPolicy(batchId);
    if (existingPolicy) {
      setPolicy(existingPolicy);
    }
  };

  const handlePolicyChange = (field: keyof ExternalMatchingPolicy, value: number) => {
    const newPolicy = { ...policy, [field]: value };
    setPolicy(newPolicy);
    setHasChanges(true);
    onPolicyChange?.(newPolicy);
  };

  const resetToDefaults = () => {
    const defaultPolicy = {
      age_weight: 30,
      location_weight: 50,
      family_stage_weight: 40,
      interests_weight: 35,
      max_distance_miles: 25,
      default_group_size: 5
    };
    setPolicy(defaultPolicy);
    setHasChanges(true);
    onPolicyChange?.(defaultPolicy);
  };

  const savePolicy = async () => {
    const success = await createOrUpdateMatchingPolicy(batchId, policy);
    if (success) {
      setHasChanges(false);
      toast({
        title: "Policy Saved",
        description: "Matching policy has been saved successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save matching policy.",
        variant: "destructive"
      });
    }
  };

  const generateWithCurrentPolicy = async () => {
    try {
      await generateMatchesWithPolicy(batchId, policy);
      setHasChanges(false);
      toast({
        title: "Matches Generated",
        description: "Groups have been generated with your custom policy."
      });
      onGenerateMatches?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate matches.",
        variant: "destructive"
      });
    }
  };

  const totalWeight = (policy.age_weight || 0) + 
                     (policy.location_weight || 0) + 
                     (policy.family_stage_weight || 0) + 
                     (policy.interests_weight || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Matching Configuration
          {hasChanges && <Badge variant="secondary">Unsaved Changes</Badge>}
        </CardTitle>
        <CardDescription>
          Customize how members are matched into groups. Higher weights prioritize that criteria more heavily.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weight Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Age Similarity: {policy.age_weight}%</Label>
            <Slider
              value={[policy.age_weight || 30]}
              onValueChange={(value) => handlePolicyChange('age_weight', value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Location Proximity: {policy.location_weight}%</Label>
            <Slider
              value={[policy.location_weight || 50]}
              onValueChange={(value) => handlePolicyChange('location_weight', value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Family Stage: {policy.family_stage_weight}%</Label>
            <Slider
              value={[policy.family_stage_weight || 40]}
              onValueChange={(value) => handlePolicyChange('family_stage_weight', value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Shared Interests: {policy.interests_weight}%</Label>
            <Slider
              value={[policy.interests_weight || 35]}
              onValueChange={(value) => handlePolicyChange('interests_weight', value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Group Size and Distance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="group-size">Target Group Size</Label>
            <Input
              id="group-size"
              type="number"
              min={3}
              max={10}
              value={policy.default_group_size || 5}
              onChange={(e) => handlePolicyChange('default_group_size', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-distance">Max Distance (miles)</Label>
            <Input
              id="max-distance"
              type="number"
              min={5}
              max={100}
              value={policy.max_distance_miles || 25}
              onChange={(e) => handlePolicyChange('max_distance_miles', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Total Weight: <strong>{totalWeight}%</strong> | 
            Target Groups of <strong>{policy.default_group_size}</strong> people | 
            Within <strong>{policy.max_distance_miles}</strong> miles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={savePolicy} 
            disabled={!hasChanges || loading}
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Policy
          </Button>
          
          <Button 
            onClick={resetToDefaults} 
            variant="outline"
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={generateWithCurrentPolicy} 
            disabled={loading}
            className="ml-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            Generate Matches
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};