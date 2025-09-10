import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Lightbulb, Target } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe that strong communities are built through meaningful connections between real people, not just digital interactions."
    },
    {
      icon: Heart,
      title: "Mutual Care",
      description: "The best communities are those where members actively care for one another, sharing resources and support when needed."
    },
    {
      icon: Lightbulb,
      title: "Thoughtful Technology",
      description: "Technology should enable human connection, not replace it. We build tools that bring people together in the real world."
    },
    {
      icon: Target,
      title: "Intentional Growth",
      description: "Sustainable community growth happens through intentional structure and systems, not just hoping people will connect."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former community pastor who saw the challenge of building connections at scale in growing churches.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Marcus Williams", 
      role: "CTO & Co-founder",
      bio: "Tech leader with 15+ years building platforms that connect people in meaningful ways.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Dr. Rachel Kim",
      role: "Head of Community Science",
      bio: "PhD in Social Psychology, researching how technology can strengthen rather than weaken social bonds.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building community at scale
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We started mbio because we saw leaders struggling with the same problem: how do you turn a crowd of people into a community where everyone belongs?
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-8 md:p-12">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Our story</h2>
              <p className="text-lg leading-relaxed">
                It started in a church of 800 people where only 200 were in small groups. The pastoral team knew that real community happened in smaller circles, but creating and maintaining those groups was overwhelming. Traditional methods didn't scale.
              </p>
              <p className="text-lg leading-relaxed">
                We realized this wasn't just a church problem. HOAs struggled to turn neighbors into communities. Professional organizations had members who barely knew each other. Alumni networks existed on paper but not in practice.
              </p>
              <p className="text-lg leading-relaxed">
                So we built mbio - a platform that helps leaders systematically form groups, facilitate mutual care, and create the conditions where authentic community can flourish. Because everyone deserves to belong somewhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our mission</h2>
            <p className="text-lg leading-relaxed mb-8">
              To help leaders transform crowds into communities where every person has meaningful connections and opportunities to give and receive care.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Members connected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Groups formed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Organizations served</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join us in building better communities
          </h2>
          <p className="text-muted-foreground mb-8">
            Whether you're leading a church, HOA, or professional organization, we'd love to help you create the community you envision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;