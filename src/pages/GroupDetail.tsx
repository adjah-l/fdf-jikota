import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as CustomBadge } from "@/components/common/Badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FiveCTracker } from "@/components/groups/FiveCTracker";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  UserPlus,
  Mail,
  Phone,
  Star,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const GroupDetail = () => {
  const { slug, groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      // Fetch from activity_groups table
      const { data: activityGroup, error: activityError } = await supabase
        .from('activity_groups')
        .select(`
          *,
          activity_group_members (
            user_id,
            status,
            profiles (
              full_name,
              email,
              phone_number
            )
          ),
          organizations (
            name,
            slug
          )
        `)
        .eq('id', groupId)
        .single();

      if (activityError && activityError.code !== 'PGRST116') {
        throw activityError;
      }

      if (activityGroup) {
        setGroup({
          ...activityGroup,
          type: 'activity_group'
        });
        setLoading(false);
        return;
      }

      // If not found, fetch from dinner_groups table
      const { data: dinnerGroup, error: dinnerError } = await supabase
        .from('dinner_groups')
        .select(`
          *,
          group_members (
            user_id,
            status,
            profiles (
              full_name,
              email,
              phone_number
            )
          ),
          organizations (
            name,
            slug
          )
        `)
        .eq('id', groupId)
        .single();

      if (dinnerError) {
        throw dinnerError;
      }

      setGroup({
        ...dinnerGroup,
        type: 'dinner_group'
      });
    } catch (error) {
      console.error('Error fetching group:', error);
      toast({
        title: "Error",
        description: "Failed to load group details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!group) return;

    setJoining(true);
    try {
      const memberTable = group.type === 'activity_group' ? 'activity_group_members' : 'group_members';
      const groupIdField = group.type === 'activity_group' ? 'group_id' : 'group_id';

      const { error } = await supabase
        .from(memberTable)
        .insert({
          [groupIdField]: group.id,
          user_id: user.id,
          status: 'assigned'
        });

      if (error) throw error;

      toast({
        title: "Welcome to the group!",
        description: "You've successfully joined the group. You'll receive an email with next steps.",
      });

      // Refresh group data
      fetchGroupData();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive"
      });
    } finally {
      setJoining(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return <CustomBadge status="open">Open</CustomBadge>;
      case "waitlist":
        return <CustomBadge status="waitlist">Waitlist</CustomBadge>;
      case "full":
        return <CustomBadge status="full">Full</CustomBadge>;
      default:
        return <CustomBadge status="open">Open</CustomBadge>;
    }
  };

  const isUserMember = () => {
    if (!user || !group) return false;
    const members = group.type === 'activity_group' ? group.activity_group_members : group.group_members;
    return members?.some((member: any) => member.user_id === user.id && member.status === 'assigned');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading group details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

  const members = group.type === 'activity_group' ? group.activity_group_members : group.group_members;
  const currentMemberCount = members?.length || 0;
  const isMember = isUserMember();

  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen">
        {/* Breadcrumb */}
        <section className="py-4 bg-muted/30 border-b">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button 
                onClick={() => navigate(`/orgs/${group.organizations?.slug || slug}`)}
                className="hover:text-primary flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                {group.organizations?.name || "Organization"}
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
                    {group.activity_type || "Dinner"} • {group.organizations?.name}
                  </p>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(group.status)}
                    <span className="text-sm text-muted-foreground">
                      {currentMemberCount}/{group.max_members} members
                    </span>
                    {isMember && (
                      <CustomBadge status="open">
                        <Star className="w-3 h-3 mr-1" />
                        Member
                      </CustomBadge>
                    )}
                  </div>
                </div>
                
                {!isMember && currentMemberCount < group.max_members && (
                  <Button 
                    variant="premium" 
                    size="lg"
                    onClick={handleJoinGroup}
                    disabled={joining}
                    className="uppercase tracking-wider"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {joining ? "Joining..." : "Join Group"}
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
                      {currentMemberCount} of {group.max_members} members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {members?.map((member: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{member.profiles?.full_name || "Member"}</p>
                              <p className="text-sm text-muted-foreground">{member.status}</p>
                            </div>
                          </div>
                          {isMember && member.profiles?.email && (
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      {currentMemberCount < group.max_members && (
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
                          {!isMember && (
                            <Button size="sm" onClick={handleJoinGroup} disabled={joining}>
                              {joining ? "Joining..." : "Join"}
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
                  events={[]} // Will be populated from database
                  canLog={isMember}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Group</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.host_user_id && (
                      <div>
                        <p className="font-medium mb-2">Group Host</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>Contact via group messaging</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isMember && (
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Group Messages
                      </Button>
                    )}
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
                      <span className="font-medium">{group.activity_type || "Dinner"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{currentMemberCount}/{group.max_members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      {getStatusBadge(group.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{new Date(group.created_at).toLocaleDateString()}</span>
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