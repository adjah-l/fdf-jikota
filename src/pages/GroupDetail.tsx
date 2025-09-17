import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as CustomBadge } from "@/components/common/Badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FiveCTracker } from "@/components/groups/FiveCTracker";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  UserPlus,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const GroupDetail = () => {
  const { slug, groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sample group data (would normally come from API)
  const groupData = {
    "wilbur-hall-dinner": {
      id: "wilbur-hall-dinner",
      name: "Wilbur Hall Dinner Group",
      orgName: "Stanford University",
      orgSlug: "stanford-university",
      activity: "Dinner Together",
      status: "open" as const,
      description: "A weekly dinner group for Wilbur Hall residents to connect over shared meals and build lasting friendships.",
      nextMeeting: "2025-01-20T18:00:00",
      meetingFrequency: "Weekly on Sundays",
      location: "Wilbur Hall Common Room",
      leaders: [
        { name: "Sarah Kim", email: "sarahk@stanford.edu", phone: "+1 (555) 123-4567" },
        { name: "Marcus Johnson", email: "marcus.j@stanford.edu", phone: "+1 (555) 123-4568" }
      ],
      members: [
        { name: "Sarah Kim", role: "Leader" },
        { name: "Marcus Johnson", role: "Leader" },
        { name: "Emma Chen", role: "Member" },
        { name: "David Rodriguez", role: "Member" }
      ],
      maxMembers: 5,
      capacity: "4/5",
      fiveCEvents: [
        {
          id: "1",
          type: "commitment" as const,
          description: "Sarah organized a group study session before finals",
          date: "2025-01-15",
          loggedBy: "Marcus Johnson"
        },
        {
          id: "2",
          type: "celebration" as const,
          description: "Celebrated Emma's acceptance to graduate program",
          date: "2025-01-10",
          loggedBy: "Sarah Kim"
        }
      ]
    }
  };

  const group = groupData[groupId as keyof typeof groupData];

  if (!group) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Group Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The group you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate(`/orgs/${slug}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organization
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate(`/join?org=${slug}&group=${groupId}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <CustomBadge status="open">Open</CustomBadge>;
      case "waitlist":
        return <CustomBadge status="waitlist">Waitlist</CustomBadge>;
      case "full":
        return <CustomBadge status="full">Full</CustomBadge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen">
        {/* Breadcrumb */}
        <section className="py-4 bg-muted/30 border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button 
                onClick={() => navigate(`/orgs/${slug}`)}
                className="hover:text-primary flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                {group.orgName}
              </button>
              <span>/</span>
              <span className="text-foreground font-medium">{group.name}</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="font-space text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {group.name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {group.activity} • {group.orgName}
                  </p>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(group.status)}
                    <span className="text-sm text-muted-foreground">
                      {group.capacity} members
                    </span>
                  </div>
                </div>
                
                {group.status === "open" && (
                  <Button 
                    variant="premium" 
                    size="lg"
                    onClick={handleJoinGroup}
                    className="uppercase tracking-wider"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>
        </section>

        {/* Group Details */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Meeting Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Meeting Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Next Meeting</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(group.nextMeeting).toLocaleDateString()} at{' '}
                          {new Date(group.nextMeeting).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Frequency</p>
                        <p className="text-sm text-muted-foreground">{group.meetingFrequency}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{group.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Group Members</CardTitle>
                    <CardDescription>
                      {group.members.length} of {group.maxMembers} members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {group.members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {group.members.length < group.maxMembers && (
                        <div className="flex items-center justify-between p-3 border-2 border-dashed border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              <UserPlus className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-muted-foreground">Open spot</p>
                              <p className="text-sm text-muted-foreground">Join this group</p>
                            </div>
                          </div>
                          {group.status === "open" && (
                            <Button size="sm" onClick={handleJoinGroup}>
                              Join
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 5C Tracker */}
                <FiveCTracker 
                  groupId={group.id}
                  events={group.fiveCEvents}
                  canLog={false} // Only leaders can log events
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Leaders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Group Leaders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.leaders.map((leader, index) => (
                      <div key={index} className="space-y-2">
                        <p className="font-medium">{leader.name}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${leader.email}`} className="hover:text-primary">
                              {leader.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${leader.phone}`} className="hover:text-primary">
                              {leader.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Activity Type</span>
                      <span className="font-medium">{group.activity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{group.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      {getStatusBadge(group.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">5C Events</span>
                      <span className="font-medium">{group.fiveCEvents.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
};

export default GroupDetail;