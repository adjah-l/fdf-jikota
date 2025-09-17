import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Link, useNavigate } from "react-router-dom";
import { 
  Users, Calendar, MapPin, Heart, MessageCircle, 
  Handshake, AlertTriangle, PartyPopper, 
  Utensils, BookOpen, Dumbbell, Gamepad2, Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const OrgPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate(`/join?org=${slug}`);
    }
  };

  // Sample organization data (would normally come from API)
  const orgData = {
    "stanford-university": {
      name: "Stanford University",
      logo: "🎓",
      heroImage: "/lovable-uploads/5ed33293-854d-4706-bcba-782b8b7f340b.png",
      headline: "Find Your People at Stanford",
      subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
      about: [
        "College should feel like connection. mbio helps you build real relationships through shared meals, study groups, and meaningful activities that go beyond surface-level interactions.",
        "Our 5C framework - Commitment, Communication, Connection, Crisis care, and Celebration - ensures your Stanford community becomes a lasting support system that extends far beyond graduation.",
        "Join fellow Cardinals in discovering what it means to truly belong, whether you're navigating academics, building career networks, or simply finding your people in one of the world's most dynamic university environments."
      ],
      subOrgs: [
        { name: "Black Student Union", slug: "black-student-union" },
        { name: "Graduate Christian Fellowship", slug: "graduate-christian-fellowship" }
      ],
      groups: [
        {
          name: "Wilbur Hall Dinner Group",
          activity: "Dinner Together",
          status: "open",
          nextMeeting: "2025-01-20",
          leaders: ["Sarah Kim", "Marcus Johnson"],
          members: 6,
          maxMembers: 8
        },
        {
          name: "GCF Bible Study South",
          activity: "Prayer & Bible Study", 
          status: "waitlist",
          nextMeeting: "2025-01-22",
          leaders: ["Rebecca Chen"],
          members: 8,
          maxMembers: 8
        },
        {
          name: "Saturday Stadium Crew",
          activity: "Watch Sports & More",
          status: "open",
          nextMeeting: "2025-01-25",
          leaders: ["David Martinez", "Emma Wilson"],
          members: 5,
          maxMembers: 8
        }
      ],
      memberCount: 57,
      groupCount: 12
    },
    "lakeside-hoa-dallas": {
      name: "Lakeside HOA",
      logo: "🏘️", 
      heroImage: "/lovable-uploads/9524b6bc-bb50-4307-ab6c-c4c2b6aa7999.png",
      headline: "Belong Where You Live",
      subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
      about: [
        "Meet neighbors, share life, and make your community feel like family. Lakeside HOA members are discovering the joy of genuine neighborhood connections through structured activities and mutual care.",
        "Our 5C framework helps neighbors move beyond casual waves to meaningful relationships - supporting each other through life's challenges and celebrating wins together.",
        "From family dinners to walking groups, we're building the kind of community where everyone knows they belong and have people who genuinely care."
      ],
      subOrgs: [
        { name: "Maple Street Block", slug: "maple-street-block" },
        { name: "Lakeside South", slug: "lakeside-south" }
      ],
      groups: [
        {
          name: "Maple Street Family Dinner",
          activity: "Dinner Together",
          status: "open", 
          nextMeeting: "2025-01-19",
          leaders: ["Jennifer Walsh", "Tom Rodriguez"],
          members: 4,
          maxMembers: 6
        },
        {
          name: "Lakeside South Weekend Walks",
          activity: "Working Out",
          status: "full",
          nextMeeting: "2025-01-21",
          leaders: ["Maria Santos"],
          members: 8,
          maxMembers: 8
        }
      ],
      memberCount: 34,
      groupCount: 7
    },
    "urban-professionals-network": {
      name: "Urban Professionals Network",
      logo: "🏢",
      heroImage: "/lovable-uploads/5ed33293-854d-4706-bcba-782b8b7f340b.png", 
      headline: "Community for the Journey",
      subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
      about: [
        "Meet peers who share your pace and purpose. Urban Professionals Network connects driven individuals who understand the unique challenges of city life and career growth.",
        "Our 5C framework creates authentic relationships that support both personal and professional development - from workout buddies to crisis support to celebrating career wins.",
        "Whether you're new to the city, changing careers, or simply seeking deeper connections beyond networking events, find your people here."
      ],
      subOrgs: [
        { name: "Dallas Chapter", slug: "dallas-chapter" },
        { name: "NYC Chapter", slug: "nyc-chapter" }
      ],
      groups: [
        {
          name: "Uptown Workout Crew",
          activity: "Working Out",
          status: "open",
          nextMeeting: "2025-01-18",
          leaders: ["Alex Thompson", "Priya Patel"],
          members: 5,
          maxMembers: 8
        },
        {
          name: "Thursday Dinner Downtown", 
          activity: "Dinner Together",
          status: "waitlist",
          nextMeeting: "2025-01-23",
          leaders: ["Michael Chang"],
          members: 8,
          maxMembers: 8
        },
        {
          name: "Flexible Friday Mixers",
          activity: "Flexible",
          status: "open", 
          nextMeeting: "2025-01-24",
          leaders: ["Sarah Blake", "Jordan Lee"],
          members: 6,
          maxMembers: 8
        }
      ],
      memberCount: 41,
      groupCount: 9
    }
  };

  const org = orgData[slug as keyof typeof orgData];

  if (!org) {
    return <div>Organization not found</div>;
  }

  const activities = [
    {
      icon: Utensils,
      name: "Dinner Together",
      description: "Share meals that spark conversation"
    },
    {
      icon: BookOpen,
      name: "Prayer & Bible Study", 
      description: "Grow in faith through reflection"
    },
    {
      icon: Dumbbell,
      name: "Working Out",
      description: "Build healthy rhythms together"
    },
    {
      icon: Gamepad2,
      name: "Watch Sports & More",
      description: "Celebrate and unwind"
    },
    {
      icon: Clock,
      name: "Flexible",
      description: "Community that adapts to your season"
    }
  ];

  const fiveCs = [
    {
      icon: Heart,
      name: "Commitment",
      description: "We show up for each other"
    },
    {
      icon: MessageCircle,
      name: "Communication", 
      description: "We listen and speak with care"
    },
    {
      icon: Handshake,
      name: "Connection",
      description: "We build bonds that last"
    },
    {
      icon: AlertTriangle,
      name: "Crisis",
      description: "We step in when life gets hard"
    },
    {
      icon: PartyPopper,
      name: "Celebration",
      description: "We honor milestones and everyday wins"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Open</Badge>;
      case "waitlist":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Waitlist</Badge>;
      case "full":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Full</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <StickyHeader />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-5xl">{org.logo}</div>
                      <h1 className="font-space text-4xl md:text-5xl font-bold text-foreground">
                        {org.name}
                      </h1>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {org.headline}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {org.subcopy}
                    </p>
                    <Button 
                      variant="premium" 
                      size="lg"
                      onClick={handleJoinGroup}
                      className="shadow-primary"
                    >
                      Join a Group
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={org.heroImage} 
                      alt={org.name}
                      className="rounded-2xl shadow-soft w-full h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-space text-3xl font-bold text-foreground mb-8 text-center">
                  About {org.name}
                </h2>
                <div className="space-y-6">
                  {org.about.map((paragraph, index) => (
                    <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Activities Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-space text-3xl font-bold text-foreground mb-12 text-center">
                  Activities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {activities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <Card key={activity.name} className="text-center p-6 border-border/50">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {activity.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 5Cs Section */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-space text-3xl font-bold text-foreground mb-12 text-center">
                  The 5Cs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {fiveCs.map((c) => {
                    const IconComponent = c.icon;
                    return (
                      <Card key={c.name} className="text-center p-6 border-border/50">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-secondary" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {c.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {c.description}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Groups Grid */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="font-space text-3xl font-bold text-foreground">
                    Groups
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {org.groupCount} active groups | {org.memberCount} members
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {org.groups.map((group) => (
                    <Card key={group.name} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          {getStatusBadge(group.status)}
                        </div>
                        <CardDescription>{group.activity}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Next: {new Date(group.nextMeeting).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {group.members}/{group.maxMembers} members
                          </div>
                          <div>
                            <span className="text-xs font-medium">Leaders:</span>
                            <div className="text-xs">{group.leaders.join(", ")}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Sub-Organizations */}
                {org.subOrgs.length > 0 && (
                  <div className="mt-16">
                    <h3 className="font-space text-2xl font-bold text-foreground mb-8">
                      Sub-Organizations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {org.subOrgs.map((subOrg) => (
                        <Card key={subOrg.slug} className="border-border/50">
                          <CardHeader>
                            <CardTitle className="text-lg">{subOrg.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Link to={`/orgs/${slug}/${subOrg.slug}`}>
                              <Button variant="outline" className="w-full">
                                View Sub-Organization
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="font-space text-3xl font-bold text-foreground mb-4">
                  Your Community Is Waiting
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Ready to find your people at {org.name}? Join today and discover what it means to truly belong.
                </p>
                <Button 
                  variant="premium" 
                  size="lg"
                  onClick={handleJoinGroup}
                  className="shadow-primary"
                >
                  Join a Group
                </Button>
              </div>
            </div>
          </section>
        </main>

        <PremiumFooter />
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
};

export default OrgPage;