import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganizations } from '@/hooks/useOrganizations'
import { useMutualCare } from '@/hooks/useMutualCare'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Calendar, 
  Heart, 
  MapPin, 
  TrendingUp,
  Clock,
  CheckCircle,
  Coins 
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const DashboardPage = () => {
  const { user } = useAuth()
  const { currentOrg, organizations } = useOrganizations()
  const { serviceRequests, userCredits } = useMutualCare()

  // Redirect to welcome page if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/welcome'
    }
  }, [user])

  if (!user) {
    return null
  }

  // Show org setup if no current org
  if (organizations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Five Course!</CardTitle>
            <CardDescription>
              Let's get you set up with your first community organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" asChild>
              <Link to="/organizations/new">Create Your Organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recentRequests = serviceRequests.slice(0, 3)
  const activeGroups = 2 // Mock data
  const upcomingDinners = 1 // Mock data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.user_metadata?.full_name || 'Friend'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening in {currentOrg?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            {userCredits} Credits
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGroups}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Dinners</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDinners}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Care Requests</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceRequests.length}</div>
            <p className="text-xs text-muted-foreground">Active in community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCredits}</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Care Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Recent Care Requests
            </CardTitle>
            <CardDescription>
              Latest requests for help in your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.length > 0 ? (
              recentRequests.map((request: any) => (
                <div key={request.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={request.requester?.avatar_url} />
                    <AvatarFallback>
                      {request.requester?.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{request.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {request.category}
                      </Badge>
                      <Badge variant="secondary">
                        {request.credits_offered} credits
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Help
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent care requests</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/care">Browse Community Care</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/care">
                <Heart className="h-4 w-4 mr-2" />
                Browse Community Care
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/groups">
                <Users className="h-4 w-4 mr-2" />
                View My Groups
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/neighborhoods">
                <MapPin className="h-4 w-4 mr-2" />
                Explore Neighborhoods
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/profile">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}