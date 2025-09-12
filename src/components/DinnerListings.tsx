import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./auth/AuthModal";
import DinnerCard from "./DinnerCard";

// Mock data for dinner listings
const mockDinners = [
  {
    id: "1",
    title: "Weekend Taco Night",
    host: { name: "Sarah Chen", initials: "SC" },
    frequency: "Weekly",
    dayOfWeek: "Saturday",
    time: "6:00 PM",
    location: "Oak Street",
    venue: "home" as const,
    capacity: 5,
    attendees: 4,
    activityType: "dinner" as const,
    gatheringMode: "adults" as const,
    distance: "0.2 mi",
    details: ["Vegetarian options", "Gluten-free friendly"],
    joinDeadline: "March 15, 2024",
    isFull: false
  },
  {
    id: "2", 
    title: "Neighborhood Family Connection",
    host: { name: "Marcus Johnson", initials: "MJ" },
    frequency: "Bi-weekly",
    dayOfWeek: "Sunday",
    time: "5:30 PM", 
    location: "Community Clubhouse",
    venue: "clubhouse" as const,
    capacity: 8,
    attendees: 6,
    activityType: "flexible" as const,
    gatheringMode: "families" as const,
    distance: "0.4 mi",
    details: ["Family activities", "All ages welcome"],
    joinDeadline: "March 15, 2024",
    isFull: false
  },
  {
    id: "3",
    title: "Italian Family Dinner",
    host: { name: "Anna Rodriguez", initials: "AR" },
    frequency: "Weekly",
    dayOfWeek: "Wednesday",
    time: "7:00 PM",
    location: "Maple Avenue", 
    venue: "home" as const,
    capacity: 5,
    attendees: 4,
    activityType: "dinner" as const,
    gatheringMode: "adults" as const,
    distance: "0.1 mi",
    details: ["Italian cuisine", "Vegetarian options"],
    joinDeadline: "March 15, 2024",
    isFull: false
  },
  {
    id: "4",
    title: "Family Fun & Connection",
    host: { name: "Lisa Park", initials: "LP" },
    frequency: "Monthly",
    dayOfWeek: "Friday",
    time: "6:30 PM",
    location: "Pine Street",
    venue: "home" as const,
    capacity: 8,
    attendees: 7,
    activityType: "flexible" as const,
    gatheringMode: "families" as const,
    distance: "0.3 mi",
    details: ["Family activities", "All ages welcome"],
    joinDeadline: "March 15, 2024",
    isFull: false
  }
];

const DinnerListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHostDinner = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleMoreFilters = () => {
    navigate('/groups');
  };

  const handleLoadMore = () => {
    // In a real app, this would load more dinners from an API
    console.log('Loading more dinners...');
  };

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Upcoming <span className="text-primary">Neighborhood Dinners</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join your neighbors for shared meals and meaningful connections right in your community.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Your Perfect Dinner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by host, location, or meal type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="weekend">Weekend</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="lg" className="h-12" onClick={handleMoreFilters}>
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Host Your Own Section */}
        <Card className="mb-8 bg-gradient-subtle border-primary/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Want to host your neighbors?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Hosting a group is a wonderful way to strengthen your community connections. 
              We'll help you every step of the way!
            </p>
            <Button variant="hero" size="lg" onClick={handleHostDinner}>
              <Plus className="w-4 h-4 mr-2" />
              Host a Group
            </Button>
          </CardContent>
        </Card>

        {/* Dinner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockDinners.map((dinner) => (
            <DinnerCard key={dinner.id} {...dinner} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore}>
            <Calendar className="w-4 h-4 mr-2" />
            Load More Dinners
          </Button>
        </div>
      </div>
      
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="login"
      />
    </section>
  );
};

export default DinnerListings;