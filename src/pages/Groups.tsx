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
        return 'bg-green-500/10 text-green-600 border-green-200'
      case 'approved':
        return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'completed':
        return 'bg-gray-500/10 text-gray-600 border-gray-200'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-white" />
      case 'approved':
        return <Calendar className="h-4 w-4 text-white" />
      case 'completed':
        return <Star className="h-4 w-4 text-white" />
      case 'draft':
        return <Clock className="h-4 w-4 text-white" />
      default:
        return <AlertCircle className="h-4 w-4 text-white" />
    }
  }

  const activeGroups = groups.filter(g => ['active', 'approved'].includes(g.status))
  const pastGroups = groups.filter(g => g.status === 'completed')
  const draftGroups = groups.filter(g => g.status === 'draft')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse bg-white/60 backdrop-blur border-white/20">
                <CardHeader>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent mb-4">
              My Groups
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey of connection through shared activities
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="outline" className="bg-white/80 backdrop-blur border-white/40 text-blue-700 px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {activeGroups.length} Active Groups
              </Badge>
            </div>
          </div>

          {/* Limited Access Notice */}
          {!currentOrg && (
            <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50 backdrop-blur">
              <CardContent className="py-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Limited Access</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      You're viewing basic group information. To see full details including locations, member information, and participate in messaging, you need to join an organization.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" asChild>
                        <a href="/organizations">Join Organization</a>
                      </Button>
                      <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white" asChild>
                        <a href="/profile">Complete Profile</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Groups State */}
          {groups.length === 0 ? (
            <Card className="bg-white/60 backdrop-blur border-white/20 shadow-xl">
              <CardContent className="py-16 text-center">
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl opacity-20"></div>
                    <Users className="relative h-20 w-20 mx-auto text-blue-600 mb-6" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No groups yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  You haven't been matched to any groups yet. Complete your profile and join a neighborhood to get started!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white" asChild>
                    <a href="/profile">Complete Profile</a>
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" asChild>
                    <a href="/neighborhoods">Browse Neighborhoods</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Groups Tabs */
            <Tabs defaultValue="active" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="bg-white/80 backdrop-blur border border-white/20 shadow-lg">
                  <TabsTrigger value="active" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                    <CheckCircle className="h-4 w-4" />
                    Active ({activeGroups.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                    <Star className="h-4 w-4" />
                    Past ({pastGroups.length})
                  </TabsTrigger>
                  {draftGroups.length > 0 && (
                    <TabsTrigger value="draft" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                      <Clock className="h-4 w-4" />
                      Draft ({draftGroups.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="active" className="space-y-6">
                {activeGroups.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2">
                    {activeGroups.map((group) => (
                      <Card key={group.id} className="group bg-white/60 backdrop-blur border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                {group.name}
                                <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                                  {getStatusIcon(group.status)}
                                </div>
                              </CardTitle>
                              <CardDescription className="text-gray-600 text-base">
                                {group.description}
                              </CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(group.status)} font-medium`}>
                              {group.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                          {/* Group Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Users className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-gray-700">{group.group_members?.length || 0}/{group.max_members} members</span>
                            </div>
                            {currentOrg && group.scheduled_date && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-gray-700">{format(new Date(group.scheduled_date), 'MMM d, yyyy')}</span>
                              </div>
                            )}
                            {currentOrg && group.neighborhood && (
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-2">
                                <MapPin className="h-5 w-5 text-indigo-600" />
                                <span className="font-medium text-gray-700">{group.neighborhood.name}, {group.neighborhood.city}</span>
                              </div>
                            )}
                            {!currentOrg && (
                              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg col-span-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <span className="text-amber-700 font-medium">Join organization to see location details</span>
                              </div>
                            )}
                          </div>

                          {/* Members */}
                          {currentOrg && group.group_members && group.group_members.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Group Members</h4>
                              <div className="flex -space-x-3">
                                {group.group_members.slice(0, 5).map((member: any) => (
                                  <Avatar key={member.id} className="h-10 w-10 border-3 border-white shadow-md">
                                    <AvatarImage src={member.profiles?.avatar_url} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                                      {member.profiles?.full_name?.[0] || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {group.group_members.length > 5 && (
                                  <div className="h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full border-3 border-white shadow-md flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">+{group.group_members.length - 5}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {!currentOrg && (
                            <div className="bg-amber-50 rounded-lg p-4">
                              <p className="text-amber-700 font-medium">
                                Member details available after joining an organization
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-gray-100">
                            {currentOrg ? (
                              <>
                                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                                  View Details
                                </Button>
                                {group.status === 'active' && (
                                  <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white">
                                    Message Group
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" asChild>
                                <a href="/organizations">Join Organization for Full Access</a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-3xl opacity-20"></div>
                      <CheckCircle className="relative h-20 w-20 mx-auto text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No active groups</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      You don't have any active groups at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                {pastGroups.length > 0 ? (
                  <div className="grid gap-6">
                    {pastGroups.map((group) => (
                      <Card key={group.id} className="bg-white/40 backdrop-blur border-white/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                              {group.name}
                              <Star className="h-5 w-5 text-yellow-500" />
                            </CardTitle>
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">Completed</Badge>
                          </div>
                          <CardDescription className="text-gray-600">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-gray-600">
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {group.group_members?.length || 0} members
                              </span>
                              {currentOrg && group.scheduled_date && (
                                <span className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {format(new Date(group.scheduled_date), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                            {currentOrg ? (
                              <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white">
                                View Memories
                              </Button>
                            ) : (
                              <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white" asChild>
                                <a href="/organizations">Join Organization</a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>
                      <Star className="relative h-20 w-20 mx-auto text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No completed groups yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your completed groups will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>

              {draftGroups.length > 0 && (
                <TabsContent value="draft" className="space-y-6">
                  <div className="grid gap-6">
                    {draftGroups.map((group) => (
                      <Card key={group.id} className="bg-white/40 backdrop-blur border-dashed border-yellow-300/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-lg">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                              {group.name}
                              <Clock className="h-5 w-5 text-yellow-600" />
                            </CardTitle>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Draft</Badge>
                          </div>
                          <CardDescription className="text-gray-600">{group.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                            <p className="text-yellow-700 font-medium">
                              This group is still being organized and hasn't been finalized yet.
                            </p>
                          </div>
                          <Button variant="outline" className="bg-white/80 backdrop-blur border-white/40 hover:bg-white">
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
      </div>
    </div>
  )
}