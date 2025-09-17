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
  Utensils, BookOpen, Dumbbell, Gamepad2, Clock,
  ChevronRight, Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const SubOrgPage = () => {
  const { slug, subslug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate(`/join?org=${slug}&sub=${subslug}`);
    }
  };

  // Sample sub-organization data (would normally come from API)
  const subOrgData = {
    "stanford-university": {
      "black-student-union": {
        name: "Black Student Union",
        parentName: "Stanford University",
        logo: "✊🏿",
        heroImage: "/lovable-uploads/5ed33293-854d-4706-bcba-782b8b7f340b.png",
        headline: "Find Your People in BSU",
        subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
        about: [
          "The Black Student Union at Stanford creates space for authentic connection and mutual support among Black students navigating one of the world's most demanding academic environments.",
          "Our 5C framework ensures BSU becomes more than just meetings - it's a family that supports each other through academic challenges, celebrates cultural heritage, and builds lasting friendships.",
          "Join fellow Black Cardinals in creating community that honors both your Stanford experience and your cultural identity, with activities ranging from study groups to cultural celebrations."
        ],
        groups: [
          {
            name: "BSU Study Circle",
            activity: "Study & Support",
            status: "open",
            nextMeeting: "2025-01-20",
            leaders: ["Kendra Williams", "Jerome Davis"],
            members: 6,
            maxMembers: 10
          },
          {
            name: "Cultural Dinner Collective",
            activity: "Dinner Together",
            status: "waitlist",
            nextMeeting: "2025-01-22",
            leaders: ["Asha Johnson"],
            members: 8,
            maxMembers: 8
          }
        ],
        memberCount: 23,
        groupCount: 4
      },
      "graduate-christian-fellowship": {
        name: "Graduate Christian Fellowship",
        parentName: "Stanford University", 
        logo: "✝️",
        heroImage: "/lovable-uploads/9524b6bc-bb50-4307-ab6c-c4c2b6aa7999.png",
        headline: "Faith Community at Stanford",
        subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
        about: [
          "Graduate Christian Fellowship provides a home for graduate students seeking to integrate faith with rigorous academic pursuit at Stanford.",
          "Our 5C framework creates authentic Christian community that supports both spiritual growth and academic excellence, offering prayer support during qualifying exams and celebrating research breakthroughs.",
          "From Bible studies to fellowship dinners, find your people who understand both the challenges of graduate school and the joy of following Christ together."
        ],
        groups: [
          {
            name: "Wednesday Bible Study",
            activity: "Prayer & Bible Study",
            status: "open", 
            nextMeeting: "2025-01-22",
            leaders: ["David Kim", "Sarah Martinez"],
            members: 7,
            maxMembers: 12
          }
        ],
        memberCount: 18,
        groupCount: 3
      }
    },
    "lakeside-hoa-dallas": {
      "maple-street-block": {
        name: "Maple Street Block",
        parentName: "Lakeside HOA",
        logo: "🍁", 
        heroImage: "/lovable-uploads/9524b6bc-bb50-4307-ab6c-c4c2b6aa7999.png",
        headline: "Your Block, Your Family",
        subcopy: "mbio means \"a people\" in Efik, a Nigerian language. We help you belong through shared activities and the 5C framework for lasting care.",
        about: [
          "Maple Street residents are discovering what it means to be true neighbors - moving beyond polite waves to genuine friendship and mutual support.",
          "Our 5C framework helps families on the block create lasting connections, from sharing meals to supporting each other through life's ups and downs.",
          "Whether you're new to the neighborhood or have lived here for years, find your place in a community where neighbors truly care for one another."
        ],
        groups: [
          {
            name: "Maple Street Family Dinners",
            activity: "Dinner Together",
            status: "open",
            nextMeeting: "2025-01-19",
            leaders: ["Jennifer Walsh", "Tom Rodriguez"],
            members: 4,
            maxMembers: 6
          }
        ],
        memberCount: 12,
        groupCount: 2
      }
    }
  };

  const parentData = subOrgData[slug as keyof typeof subOrgData];
  const subOrg = parentData?.[subslug as string] as any;

  if (!subOrg) {
    return <div>Sub-organization not found</div>;
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
          {/* Breadcrumb */}
          <section className="py-4 bg-muted/30 border-b">
            <div className="container mx-auto px-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/orgs" className="hover:text-primary">
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/orgs/${slug}`} className="hover:text-primary">
                  {subOrg.parentName}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{subOrg.name}</span>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-5xl">{subOrg.logo}</div>
                      <div>
                        <h1 className="font-space text-4xl md:text-5xl font-bold text-foreground">
                          {subOrg.name}
                        </h1>
                        <p className="text-muted-foreground">
                          Part of {subOrg.parentName}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {subOrg.headline}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {subOrg.subcopy}
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
                      src={subOrg.heroImage} 
                      alt={subOrg.name}
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
                  About {subOrg.name}
                </h2>
                <div className="space-y-6">
                  {subOrg.about.map((paragraph, index) => (
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
                    {subOrg.groupCount} active groups | {subOrg.memberCount} members
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subOrg.groups.map((group) => (
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
                  Ready to find your people in {subOrg.name}? Join today and discover what it means to truly belong.
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

export default SubOrgPage;