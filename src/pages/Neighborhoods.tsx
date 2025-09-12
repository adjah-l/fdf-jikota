import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NeighborhoodSelector from '@/components/neighborhood/NeighborhoodSelector';
import DinnerCard from '@/components/DinnerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const NeighborhoodsPage = () => {
  const { user } = useAuth();
  const { userNeighborhoods, loading } = useNeighborhoods();
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Updated mock group data with proper business rules
  const mockGroups = [
    {
      id: '1',
      title: 'Italian Cooking & Connection',
      host: { name: 'Maria Rodriguez', initials: 'MR' },
      frequency: 'Weekly',
      dayOfWeek: 'Thursday',
      time: '7:00 PM',
      location: '123 Oak Street',
      venue: 'home' as const,
      capacity: 5, // adults only group
      attendees: 4,
      activityType: 'dinner' as const,
      lifeStage: 'married_no_children' as const,
      gatheringMode: 'adults' as const,
      distance: '0.3 miles',
      details: ['Italian cuisine focus', 'Practice 5C framework'],
      joinDeadline: 'March 15, 2024',
      isFull: false
    },
    {
      id: '2',
      title: 'Sunday Prayer & Connection',
      host: { name: 'The Johnson Family', initials: 'JF' },
      frequency: 'Weekly',
      dayOfWeek: 'Sunday',
      time: '11:00 AM',
      location: '456 Maple Avenue',
      venue: 'home' as const,
      capacity: 8, // family group
      attendees: 6,
      activityType: 'prayer_study' as const,
      lifeStage: 'married_with_children' as const,
      gatheringMode: 'families' as const,
      distance: '0.5 miles',
      details: ['Bible study focus', 'All ages welcome'],
      joinDeadline: 'March 15, 2024',
      isFull: false
    },
    {
      id: '3',
      title: 'Tuesday Fitness & Care',
      host: { name: 'Carlos & Sofia Mendez', initials: 'CM' },
      frequency: 'Bi-weekly',
      dayOfWeek: 'Tuesday',
      time: '6:30 PM',
      location: '789 Pine Street',
      venue: 'home' as const,
      capacity: 5, // mixed adults group
      attendees: 5,
      activityType: 'workout' as const,
      lifeStage: 'single_no_children' as const,
      gatheringMode: 'mixed' as const,
      distance: '0.7 miles',
      details: ['Outdoor activities', 'All fitness levels'],
      joinDeadline: 'March 15, 2024',
      isFull: true
    },
    {
      id: '4',
      title: 'Sports Watch & Connect',
      host: { name: 'David Chen', initials: 'DC' },
      frequency: 'Weekly',
      dayOfWeek: 'Saturday',
      time: '7:30 PM',
      location: '321 Elm Drive',
      venue: 'home' as const,
      capacity: 5, // adults only
      attendees: 3,
      activityType: 'sports' as const,
      lifeStage: 'married_no_children' as const,
      gatheringMode: 'adults' as const,
      distance: '0.4 miles',
      details: ['Local team games', 'Snacks provided'],
      joinDeadline: 'March 15, 2024',
      isFull: false
    },
    {
      id: '5',
      title: 'Creative Connections Group',
      host: { name: 'The Thompson Family', initials: 'TF' },
      frequency: 'Monthly',
      dayOfWeek: 'Saturday',
      time: '6:00 PM',
      location: '654 Birch Lane',
      venue: 'clubhouse' as const,
      capacity: 8, // family group
      attendees: 7,
      activityType: 'flexible' as const,
      lifeStage: 'mixed' as const,
      gatheringMode: 'families' as const,
      distance: '0.6 miles',
      details: ['Rotating activities', 'Family-friendly'],
      joinDeadline: 'March 15, 2024',
      isFull: false
    },
    {
      id: '6',
      title: 'Healthy Living Together',
      host: { name: 'Dr. Sarah Williams', initials: 'SW' },
      frequency: 'Bi-weekly',
      dayOfWeek: 'Wednesday',
      time: '5:30 PM',
      location: '987 Cedar Court',
      venue: 'home' as const,
      capacity: 5, // adults group
      attendees: 4,
      activityType: 'dinner' as const,
      lifeStage: 'single_with_children' as const,
      gatheringMode: 'adults' as const,
      distance: '0.8 miles',
      details: ['Healthy recipes', 'Wellness focus'],
      joinDeadline: 'March 15, 2024',
      isFull: false
    }
  ];

  const selectedNeighborhood = userNeighborhoods[0]?.neighborhood;

  const filteredGroups = mockGroups.filter(group =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.lifeStage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.gatheringMode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || userNeighborhoods.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-12 px-4">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Discover Your Neighborhood</h1>
              <p className="text-muted-foreground text-lg">
                Join a neighborhood to see upcoming groups and connect with your local community through the 5C framework.
              </p>
            </div>
            
            <Card className="p-8">
              <div className="space-y-4">
                <MapPin className="w-12 h-12 text-primary mx-auto" />
                <h2 className="text-2xl font-semibold">Choose Your Neighborhood</h2>
                <p className="text-muted-foreground">
                  Select your neighborhood to discover local group opportunities and meet your neighbors through meaningful activities.
                </p>
                <Button onClick={() => setShowSelector(true)} size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Browse Neighborhoods
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
        
        <NeighborhoodSelector
          open={showSelector}
          onOpenChange={setShowSelector}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        {/* Neighborhood Header */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MapPin className="w-8 h-8 text-primary" />
                {selectedNeighborhood?.name || 'Your Neighborhood'}
              </h1>
              <p className="text-muted-foreground">
                {selectedNeighborhood?.city}, {selectedNeighborhood?.state}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowSelector(true)}
            >
              Change Neighborhood
            </Button>
          </div>

          {/* Neighborhood Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{selectedNeighborhood?.member_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{mockGroups.length}</p>
                    <p className="text-sm text-muted-foreground">Active Groups</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium">Very Active</p>
                    <p className="text-sm text-muted-foreground">Community Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Tags */}
          <div className="flex flex-wrap gap-2">
            {selectedNeighborhood?.community_tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            )) || (
              <>
                <Badge variant="secondary">Family-Friendly</Badge>
                <Badge variant="secondary">Dog-Friendly</Badge>
                <Badge variant="secondary">Foodie Community</Badge>
                <Badge variant="secondary">Active Lifestyle</Badge>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Groups in Your Neighborhood</CardTitle>
            <CardDescription>
              Join ongoing groups practicing the 5C framework and building lasting connections with your neighbors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search groups by focus, host, life stage, or gathering mode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <DinnerCard
              key={group.id}
              id={group.id}
              title={group.title}
              host={group.host}
              frequency={group.frequency}
              dayOfWeek={group.dayOfWeek}
              time={group.time}
              location={group.location}
              venue={group.venue}
              capacity={group.capacity}
              attendees={group.attendees}
              activityType={group.activityType}
              lifeStage={group.lifeStage}
              gatheringMode={group.gatheringMode}
              distance={group.distance}
              details={group.details}
              joinDeadline={group.joinDeadline}
              isFull={group.isFull}
            />
          ))}
        </div>

        {filteredGroups.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No groups found matching "{searchTerm}". Try a different search term.
            </p>
          </div>
        )}

        {/* Start Your Own Group Section */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Start Your Own Group</h3>
            <p className="text-muted-foreground mb-4">
              Create a lasting community by starting a mutual care group in {selectedNeighborhood?.name || 'your neighborhood'}.
            </p>
            <Button size="lg">
              Start a Group
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
      
      <NeighborhoodSelector
        open={showSelector}
        onOpenChange={setShowSelector}
      />
    </div>
  );
};

export default NeighborhoodsPage;