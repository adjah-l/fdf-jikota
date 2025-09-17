import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Lightbulb, Target } from "lucide-react";
import { flags } from "@/config/flags";

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
      <StickyHeader />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building community at scale
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We started mbio because people everywhere are longing for genuine community—and because too many leaders are struggling to turn a crowd into a place where everyone belongs and truly cares for one another.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-8 md:p-12">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg leading-relaxed">
                Community isn't just about being together, it's about being cared for. We live in a world where connection is easy to find online but hard to experience in real life. People need more than events—they need relationships that meet their everyday needs: someone to call in a crisis, someone to celebrate with, someone to share the highs and lows of life.
              </p>
              <p className="text-lg leading-relaxed">
                For more than a decade, the Family Dinner Foundation has been proving what's possible. Through nearly 50,000 people across 30 cities and 3 continents, we saw that when people gather with intention and commit to one another, strangers quickly become family. From that foundation we created mbio.
              </p>
              <p className="text-lg leading-relaxed">
                In Efik, mbio means "people." And people are what this is all about. Mbio exists so members can find their people and build reliable, life-giving relationships through our 5C Mutual Care Framework: Commitment, Connection, Communication, Crisis, and Celebration.
              </p>
              <p className="text-lg leading-relaxed">
                Because we believe everyone deserves a community that shows up, shares life, and makes sure no one has to do life alone.
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Mission Section */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our mission</h2>
            <p className="text-lg leading-relaxed mb-8">
              To connect people in communities where everyone has meaningful relationships and the support they need - whether you're a member looking for your people or a leader building stronger organizations.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">People connected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-muted-foreground">Cities worldwide</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Continents served</div>
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
            Whether you're a member seeking genuine community or leading a church, university, HOA, professional organization, or social group - we'd love to help you create connections that feel like family.
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
      <PremiumFooter />
    </div>
  );
};

export default About;