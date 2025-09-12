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

  // Mock group data for demonstration
  const mockGroups = [
    {
      id: '1',
      title: 'Italian Cooking & Connection',
      host: { name: 'Maria Rodriguez', initials: 'MR' },
      date: '2024-01-15',
      time: '7:00 PM',
      location: '123 Oak Street',
      venue: 'home' as const,
      capacity: 8,
      attendees: 6,
      activityType: 'Dinner',
      distance: '0.3 miles',
      details: ['Weekly gatherings', 'Practice 5C framework'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '2',
      title: 'Sunday Prayer & Connection',
      host: { name: 'The Johnson Family', initials: 'JF' },
      date: '2024-01-16',
      time: '11:00 AM',
      location: '456 Maple Avenue',
      venue: 'home' as const,
      capacity: 12,
      attendees: 8,
      activityType: 'Prayer / Bible Study',
      distance: '0.5 miles',
      details: ['Bible study focus', 'All levels welcome'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '3',
      title: 'Tuesday Fitness & Care',
      host: { name: 'Carlos & Sofia Mendez', initials: 'CM' },
      date: '2024-01-16',
      time: '6:30 PM',
      location: '789 Pine Street',
      venue: 'home' as const,
      capacity: 10,
      attendees: 7,
      activityType: 'Working Out',
      distance: '0.7 miles',
      details: ['Outdoor activities', 'All fitness levels'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '4',
      title: 'Sports Watch Party',
      host: { name: 'David Chen', initials: 'DC' },
      date: '2024-01-17',
      time: '7:30 PM',
      location: '321 Elm Drive',
      venue: 'home' as const,
      capacity: 6,
      attendees: 4,
      activityType: 'Watch Sporting Events',
      distance: '0.4 miles',
      details: ['Local team games', 'Snacks provided'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '5',
      title: 'Creative Connections Group',
      host: { name: 'The Thompson Family', initials: 'TF' },
      date: '2024-01-18',
      time: '6:00 PM',
      location: '654 Birch Lane',
      venue: 'home' as const,
      capacity: 15,
      attendees: 12,
      activityType: 'Flexible',
      distance: '0.6 miles',
      details: ['Rotating activities', 'Family-friendly'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '6',
      title: 'Healthy Living Together',
      host: { name: 'Dr. Sarah Williams', initials: 'SW' },
      date: '2024-01-19',
      time: '5:30 PM',
      location: '987 Cedar Court',
      venue: 'clubhouse' as const,
      capacity: 8,
      attendees: 5,
      activityType: 'Dinner',
      distance: '0.8 miles',
      details: ['Healthy recipes', 'Wellness focus'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '7',
      title: 'Community Connection Gathering',
      host: { name: 'Sunset Hills Community', initials: 'SC' },
      date: '2024-01-20',
      time: '6:00 PM',
      location: '147 Community Center Way',
      venue: 'clubhouse' as const,
      capacity: 30,
      attendees: 22,
      activityType: 'Flexible',
      distance: '0.2 miles',
      details: ['Monthly community event', 'All activities welcome'],
      neighborhood: 'Sunset Hills'
    },
    {
      id: '8',
      title: 'Active Outdoors Group',
      host: { name: 'Mike & Lisa Brown', initials: 'MB' },
      date: '2024-01-21',
      time: '5:00 PM',
      location: '258 Willow Street',
      venue: 'home' as const,
      capacity: 20,
      attendees: 15,
      activityType: 'Working Out',
      distance: '0.9 miles',
      details: ['Outdoor activities', 'Weather permitting'],
      neighborhood: 'Sunset Hills'
    }
  ];

  const selectedNeighborhood = userNeighborhoods[0]?.neighborhood;

  const filteredGroups = mockGroups.filter(group =>
    group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.activityType.toLowerCase().includes(searchTerm.toLowerCase())
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
                placeholder="Search groups by focus, host, or activity type..."
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
              date={group.date}
              time={group.time}
              location={group.location}
              venue={group.venue}
              capacity={group.capacity}
              attendees={group.attendees}
              mealType={group.activityType as any}
              distance={group.distance}
              dietary={group.details}
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