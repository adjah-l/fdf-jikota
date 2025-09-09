import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganizations } from '@/hooks/useOrganizations'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star
} from 'lucide-react'
import { format } from 'date-fns'

interface DinnerGroup {
  id: string
  name: string
  description: string
  status: string
  max_members: number
  scheduled_date?: string
  location_type?: string
  created_at: string
  group_members: any[]
  neighborhood?: {
    name: string
    city: string
    state: string
  }
}

export const GroupsPage = () => {
  const { user } = useAuth()
  const { currentOrg } = useOrganizations()
  const [groups, setGroups] = useState<DinnerGroup[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGroups = async () => {
    if (!user) return

    try {
      if (currentOrg) {
        // Full access for organization members
        const { data, error } = await supabase
          .from('dinner_groups')
          .select(`
            *,
            group_members!inner (
              *,
              profiles (
                full_name,
                avatar_url
              )
            ),
            neighborhoods (
              name,
              city,
              state
            )
          `)
          .eq('group_members.user_id', user.id)
          .eq('org_id', currentOrg.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setGroups(data || [])
      } else {
        // Limited access for non-organization members - show general info only
        const { data, error } = await supabase
          .from('dinner_groups')
          .select(`
            id,
            name,
            description,
            status,
            max_members,
            created_at,
            group_members!inner (
              id,
              user_id
            )
          `)
          .eq('group_members.user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setGroups(data || [])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [user, currentOrg])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'approved':
        return <Calendar className="h-4 w-4" />
      case 'completed':
        return <Star className="h-4 w-4" />
      case 'draft':
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const activeGroups = groups.filter(g => ['active', 'approved'].includes(g.status))
  const pastGroups = groups.filter(g => g.status === 'completed')
  const draftGroups = groups.filter(g => g.status === 'draft')

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            My Dinner Groups
          </h1>
          <p className="text-muted-foreground mt-2">
            Your journey of connection through shared meals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {activeGroups.length} Active Groups
          </Badge>
        </div>
      </div>

      {/* Groups Content */}
      {!currentOrg && (
        <Card className="mb-6 bg-muted/50 border-dashed">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Limited Access</h3>
                <p className="text-muted-foreground mb-4">
                  You're viewing basic group information. To see full details including locations, member information, and participate in messaging, you need to join an organization.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <a href="/organizations">Join Organization</a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/profile">Complete Profile</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No dinner groups yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't been matched to any dinner groups yet. Complete your profile and join a neighborhood to get started!
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <a href="/profile">Complete Profile</a>
              </Button>
              <Button asChild>
                <a href="/neighborhoods">Browse Neighborhoods</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Active ({activeGroups.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Past ({pastGroups.length})
            </TabsTrigger>
            {draftGroups.length > 0 && (
              <TabsTrigger value="draft" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Draft ({draftGroups.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeGroups.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {activeGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {group.name}
                            {getStatusIcon(group.status)}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {group.description}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Group Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{group.group_members?.length || 0}/{group.max_members} members</span>
                        </div>
                        {currentOrg && group.scheduled_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(group.scheduled_date), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        {currentOrg && group.neighborhood && (
                          <div className="flex items-center gap-2 col-span-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{group.neighborhood.name}, {group.neighborhood.city}</span>
                          </div>
                        )}
                        {!currentOrg && (
                          <div className="flex items-center gap-2 col-span-2 text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Join organization to see location details</span>
                          </div>
                        )}
                      </div>

                      {/* Members */}
                      {currentOrg && group.group_members && group.group_members.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Group Members</h4>
                          <div className="flex -space-x-2">
                            {group.group_members.slice(0, 5).map((member: any, index) => (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={member.profiles?.avatar_url} />
                                <AvatarFallback className="text-xs">
                                  {member.profiles?.full_name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {group.group_members.length > 5 && (
                              <div className="h-8 w-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                                <span className="text-xs">+{group.group_members.length - 5}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {!currentOrg && (
                        <div className="text-sm text-muted-foreground italic">
                          Member details available after joining an organization
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {currentOrg ? (
                          <>
                            <Button size="sm" className="flex-1">
                              View Details
                            </Button>
                            {group.status === 'active' && (
                              <Button size="sm" variant="outline">
                                Message Group
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button size="sm" className="flex-1" asChild>
                            <a href="/organizations">Join Organization for Full Access</a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No active groups</h3>
                <p className="text-muted-foreground">
                  You don't have any active dinner groups at the moment.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastGroups.length > 0 ? (
              <div className="grid gap-4">
                {pastGroups.map((group) => (
                  <Card key={group.id} className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {group.name}
                          <Star className="h-4 w-4 text-yellow-500" />
                        </CardTitle>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.group_members?.length || 0} members
                          </span>
                          {currentOrg && group.scheduled_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(group.scheduled_date), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        {currentOrg ? (
                          <Button size="sm" variant="outline">
                            View Memories
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" asChild>
                            <a href="/organizations">Join Organization</a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed groups yet</h3>
                <p className="text-muted-foreground">
                  Your completed dinner groups will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          {draftGroups.length > 0 && (
            <TabsContent value="draft" className="space-y-4">
              <div className="grid gap-4">
                {draftGroups.map((group) => (
                  <Card key={group.id} className="border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {group.name}
                          <Clock className="h-4 w-4 text-yellow-500" />
                        </CardTitle>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-3">
                        This group is still being organized and hasn't been finalized yet.
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}