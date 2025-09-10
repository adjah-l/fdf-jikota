import { useState, useEffect } from 'react'
import { useOrganizations } from '@/hooks/useOrganizations'
import { useNeighborhoods } from '@/hooks/useNeighborhoods'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Zap, Settings, Play, Eye, History, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { matchingPolicySchema } from '@/lib/schemas'
import type { MatchingPolicy } from '@/lib/schemas'

interface SimulationResult {
  eligible_members: number
  potential_groups: number
  waitlist_members: number
  simulation_details: any
}

export const AdminMatchingPage = () => {
  const { currentOrg, hasRole } = useOrganizations()
  const { neighborhoods } = useNeighborhoods()
  const { toast } = useToast()
  const [policies, setPolicies] = useState<any[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('')
  const [currentPolicy, setCurrentPolicy] = useState<any>(null)
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const form = useForm<Partial<MatchingPolicy>>({
    resolver: zodResolver(matchingPolicySchema.partial()),
    defaultValues: {
      mode: 'automatic',
      default_group_size: 5,
      age_weight: 30,
      location_weight: 50,
      family_stage_weight: 40,
      gender_weight: 40,
      age_hard: false,
      location_hard: true,
      family_stage_hard: false,
      gender_hard: false,
      gender_mode: 'mixed',
      max_distance_miles: 25,
    },
  })

  const fetchPolicies = async () => {
    if (!currentOrg) return

    try {
      const { data, error } = await supabase
        .from('matching_policies')
        .select(`
          *,
          neighborhoods (
            name,
            city,
            state
          )
        `)
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPolicies(data || [])
      
      if (data && data.length > 0) {
        setCurrentPolicy(data[0])
        form.reset(data[0] as any)
      }
    } catch (error: any) {
      console.error('Error fetching policies:', error)
      toast({
        title: 'Error',
        description: 'Failed to load matching policies',
        variant: 'destructive',
      })
    }
  }

  const savePolicy = async (data: Partial<MatchingPolicy>) => {
    if (!currentOrg || !selectedNeighborhood) return

    setLoading(true)
    try {
      const policyData = {
        ...data,
        org_id: currentOrg.id,
        neighborhood_id: selectedNeighborhood,
      }

      let result
      if (currentPolicy) {
        result = await supabase
          .from('matching_policies')
          .update(policyData)
          .eq('id', currentPolicy.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('matching_policies')
          .insert(policyData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: 'Success',
        description: 'Matching policy saved successfully',
      })

      await fetchPolicies()
    } catch (error: any) {
      console.error('Error saving policy:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save matching policy',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const runSimulation = async () => {
    if (!selectedNeighborhood) return

    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('simulate_matching', {
        neighborhood_id_param: selectedNeighborhood,
        policy_overrides: form.getValues(),
      })

      if (error) throw error
      setSimulation(data[0] || null)
      setPreviewOpen(true)
    } catch (error: any) {
      console.error('Error running simulation:', error)
      toast({
        title: 'Error',
        description: 'Failed to run matching simulation',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const generateMatches = async () => {
    if (!selectedNeighborhood) return

    setLoading(true)
    try {
      // Save policy first
      await savePolicy(form.getValues())
      
      // Generate matches
      const { error } = await supabase.functions.invoke('generate-matches', {
        body: {
          neighborhoodId: selectedNeighborhood,
          criteriaWeights: form.getValues(),
        },
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Matching run started successfully',
      })
    } catch (error: any) {
      console.error('Error generating matches:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate matches',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentOrg && hasRole(currentOrg.id, 'admin')) {
      fetchPolicies()
    }
  }, [currentOrg])

  if (!currentOrg || !hasRole(currentOrg.id, 'admin')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">You need admin permissions to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Matching Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure intelligent matching algorithms for groups
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={runSimulation} disabled={loading || !selectedNeighborhood}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Matches
          </Button>
          <Button onClick={generateMatches} disabled={loading || !selectedNeighborhood}>
            <Play className="h-4 w-4 mr-2" />
            Generate Matches
          </Button>
        </div>
      </div>

      {/* Neighborhood Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Neighborhood</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a neighborhood to configure matching..." />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name} - {neighborhood.city}, {neighborhood.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Policy Configuration */}
      {selectedNeighborhood && (
        <Tabs defaultValue="weights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="weights">Matching Weights</TabsTrigger>
            <TabsTrigger value="constraints">Hard Constraints</TabsTrigger>
            <TabsTrigger value="settings">Group Settings</TabsTrigger>
            <TabsTrigger value="history">Match History</TabsTrigger>
          </TabsList>

          <TabsContent value="weights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Matching Criteria Weights</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Adjust how important each factor is in creating compatible groups (0-100)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Weight */}
                <div className="space-y-2">
                  <Label>Age Similarity ({form.watch('age_weight', 30)}%)</Label>
                  <Slider
                    value={[form.watch('age_weight', 30)]}
                    onValueChange={(value) => form.setValue('age_weight', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Location Weight */}
                <div className="space-y-2">
                  <Label>Geographic Proximity ({form.watch('location_weight', 50)}%)</Label>
                  <Slider
                    value={[form.watch('location_weight', 50)]}
                    onValueChange={(value) => form.setValue('location_weight', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Family Stage Weight */}
                <div className="space-y-2">
                  <Label>Family Stage Compatibility ({form.watch('family_stage_weight', 40)}%)</Label>
                  <Slider
                    value={[form.watch('family_stage_weight', 40)]}
                    onValueChange={(value) => form.setValue('family_stage_weight', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Gender Weight */}
                <div className="space-y-2">
                  <Label>Gender Balance ({form.watch('gender_weight', 40)}%)</Label>
                  <Slider
                    value={[form.watch('gender_weight', 40)]}
                    onValueChange={(value) => form.setValue('gender_weight', value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="constraints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hard Constraints</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enable strict requirements that must be met for group formation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Age Range Requirement</Label>
                    <p className="text-sm text-muted-foreground">Groups must have similar age ranges</p>
                  </div>
                  <Switch
                    checked={form.watch('age_hard', false)}
                    onCheckedChange={(checked) => form.setValue('age_hard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Location Requirement</Label>
                    <p className="text-sm text-muted-foreground">Groups must be within max distance</p>
                  </div>
                  <Switch
                    checked={form.watch('location_hard', true)}
                    onCheckedChange={(checked) => form.setValue('location_hard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Family Stage Requirement</Label>
                    <p className="text-sm text-muted-foreground">Groups must have compatible family stages</p>
                  </div>
                  <Switch
                    checked={form.watch('family_stage_hard', false)}
                    onCheckedChange={(checked) => form.setValue('family_stage_hard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gender Balance Requirement</Label>
                    <p className="text-sm text-muted-foreground">Enforce gender distribution rules</p>
                  </div>
                  <Switch
                    checked={form.watch('gender_hard', false)}
                    onCheckedChange={(checked) => form.setValue('gender_hard', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Formation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="group-size">Default Group Size</Label>
                    <Input
                      id="group-size"
                      type="number"
                      min="3"
                      max="12"
                      {...form.register('default_group_size', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-distance">Max Distance (miles)</Label>
                    <Input
                      id="max-distance"
                      type="number"
                      min="1"
                      max="100"
                      {...form.register('max_distance_miles', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Gender Mode</Label>
                  <Select
                    value={form.watch('gender_mode', 'mixed')}
                    onValueChange={(value) => form.setValue('gender_mode', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed Groups</SelectItem>
                      <SelectItem value="separate">Separate by Gender</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button onClick={() => savePolicy(form.getValues())} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Policy'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Matching Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No matching runs yet</p>
                  <p className="text-sm">Run your first match to see results here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Matching Preview</DialogTitle>
            <DialogDescription>
              See how many groups would be formed with current settings
            </DialogDescription>
          </DialogHeader>
          {simulation && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{simulation.eligible_members}</div>
                    <p className="text-xs text-muted-foreground">Eligible Members</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{simulation.potential_groups}</div>
                    <p className="text-xs text-muted-foreground">Potential Groups</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{simulation.waitlist_members}</div>
                    <p className="text-xs text-muted-foreground">Waitlist</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setPreviewOpen(false)} variant="outline">
                  Close Preview
                </Button>
                <Button onClick={() => { generateMatches(); setPreviewOpen(false) }}>
                  Generate These Matches
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}