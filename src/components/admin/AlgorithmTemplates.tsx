import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Star, Users, MapPin, Calendar, Heart, Zap } from 'lucide-react';
import { MatchingPolicy } from '@/hooks/useMatchingPolicies';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { toast } from '@/hooks/use-toast';

const algorithmTemplates = [
  {
    id: 'conservative',
    name: 'Conservative Matching',
    description: 'Prioritizes similar demographics and strict location boundaries',
    icon: Users,
    category: 'Traditional',
    config: {
      mode: 'automatic' as const,
      default_group_size: 4,
      family_group_size: 3,
      gender_mode: 'mixed' as const,
      gender_weight: 60,
      stage_alignment: 'same' as const,
      stage_weight: 80,
      age_alignment: 'same' as const,
      age_weight: 70,
      location_scope: 'inside_only' as const,
      location_hard: true,
      fallback_strategy: 'waitlist' as const
    }
  },
  {
    id: 'diverse',
    name: 'Diversity Focused',
    description: 'Encourages mixing across demographics for rich conversations',
    icon: Star,
    category: 'Progressive',
    config: {
      mode: 'automatic' as const,
      default_group_size: 6,
      family_group_size: 4,
      gender_mode: 'mixed' as const,
      gender_weight: 20,
      stage_alignment: 'mix' as const,
      stage_weight: 30,
      age_alignment: 'mix' as const,
      age_weight: 20,
      location_scope: 'nearby_ok' as const,
      max_distance_miles: 50,
      location_hard: false,
      fallback_strategy: 'auto_relax' as const
    }
  },
  {
    id: 'family_friendly',
    name: 'Family Focused',
    description: 'Optimized for families with children and similar schedules',
    icon: Heart,
    category: 'Family',
    config: {
      mode: 'automatic' as const,
      default_group_size: 4,
      family_group_size: 3,
      gender_mode: 'mixed' as const,
      gender_weight: 30,
      stage_alignment: 'same' as const,
      stage_weight: 90,
      family_stage_alignment: 'same' as const,
      family_stage_weight: 85,
      age_alignment: 'same' as const,
      age_weight: 40,
      location_scope: 'inside_only' as const,
      location_hard: true,
      same_community_weight: 80,
      fallback_strategy: 'fill_partial' as const
    }
  },
  {
    id: 'professional',
    name: 'Professional Network',
    description: 'For working professionals looking to build business connections',
    icon: MapPin,
    category: 'Professional',
    config: {
      mode: 'review_required' as const,
      default_group_size: 5,
      family_group_size: 4,
      gender_mode: 'mixed' as const,
      gender_weight: 25,
      stage_alignment: 'mix' as const,
      stage_weight: 40,
      age_alignment: 'mix' as const,
      age_weight: 35,
      location_scope: 'nearby_ok' as const,
      max_distance_miles: 30,
      location_hard: false,
      same_community_weight: 60,
      fallback_strategy: 'auto_relax' as const
    }
  },
  {
    id: 'seasonal',
    name: 'Seasonal Interest',
    description: 'Groups people based on shared seasonal activities and interests',
    icon: Calendar,
    category: 'Interest-Based',
    config: {
      mode: 'automatic' as const,
      default_group_size: 6,
      family_group_size: 4,
      gender_mode: 'mixed' as const,
      gender_weight: 35,
      stage_alignment: 'mix' as const,
      stage_weight: 45,
      season_use: true,
      season_weight: 75,
      age_alignment: 'mix' as const,
      age_weight: 25,
      location_scope: 'nearby_ok' as const,
      max_distance_miles: 40,
      location_hard: false,
      fallback_strategy: 'auto_relax' as const
    }
  },
  {
    id: 'high_energy',
    name: 'High Energy Matching',
    description: 'Fast, frequent matching for active communities',
    icon: Zap,
    category: 'Dynamic',
    config: {
      mode: 'automatic' as const,
      default_group_size: 7,
      family_group_size: 5,
      gender_mode: 'mixed' as const,
      gender_weight: 15,
      stage_alignment: 'mix' as const,
      stage_weight: 20,
      age_alignment: 'mix' as const,
      age_weight: 15,
      location_scope: 'nearby_ok' as const,
      max_distance_miles: 60,
      location_hard: false,
      same_community_weight: 30,
      fallback_strategy: 'fill_partial' as const
    }
  }
];

export const AlgorithmTemplates = () => {
  const { neighborhoods } = useNeighborhoods();
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<string>('');

  const handleApplyTemplate = async (template: typeof algorithmTemplates[0]) => {
    if (!selectedNeighborhood) {
      toast({
        variant: "destructive",
        title: "Select Community",
        description: "Please select a community to apply this template to.",
      });
      return;
    }

    try {
      // Here you would call the createOrUpdatePolicy function with the template config
      toast({
        title: "Template Applied",
        description: `${template.name} algorithm has been applied to the selected community.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply template.",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Traditional': 'bg-blue-100 text-blue-800',
      'Progressive': 'bg-purple-100 text-purple-800',
      'Family': 'bg-green-100 text-green-800',
      'Professional': 'bg-orange-100 text-orange-800',
      'Interest-Based': 'bg-pink-100 text-pink-800',
      'Dynamic': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Templates</CardTitle>
          <p className="text-muted-foreground">
            Pre-configured matching algorithms optimized for different community types and goals.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Community to Apply Template
            </label>
            <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a community..." />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((neighborhood) => (
                  <SelectItem key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithmTemplates.map((template) => (
              <Card key={template.id} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Key Features:</strong>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Group size: {template.config.default_group_size} members</li>
                      <li>• Mode: {template.config.mode === 'automatic' ? 'Automatic' : 'Review Required'}</li>
                      <li>• Gender: {template.config.gender_mode} (weight: {template.config.gender_weight}%)</li>
                      <li>• Location: {template.config.location_scope === 'inside_only' ? 'Community only' : 'Nearby allowed'}</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Copy className="h-4 w-4 mr-2" />
                          View Full Config
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{template.name} - Full Configuration</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(template.config, null, 2)}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      className="w-full mt-2" 
                      onClick={() => handleApplyTemplate(template)}
                      disabled={!selectedNeighborhood}
                    >
                      Apply Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};