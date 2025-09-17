import { PremiumNavigation } from "@/components/layout/PremiumNavigation";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, Lightbulb, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/for-organizations');
  };

  const handleContact = () => {
    navigate('/contact');
  };
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
    <div className="min-h-screen bg-background font-inter">
      <PremiumNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-space text-premium-hero md:text-premium-hero-mobile mb-8 text-foreground">
              Building <span className="text-primary">Community at Scale</span>
            </h1>
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We started mbio because people everywhere are longing for genuine community—and because too many leaders are struggling to turn a crowd into a place where everyone belongs and truly cares for one another.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="premium" 
                size="xl"
                onClick={handleGetStarted}
                className="shadow-primary"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="premium-outline" 
                size="xl"
                onClick={handleContact}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
              <CardContent className="p-8 md:p-12 space-y-6">
                <h2 className="font-space text-4xl md:text-5xl font-bold mb-8 text-foreground">Our Story</h2>
                <p className="text-premium-body leading-relaxed text-muted-foreground">
                  Community isn't just about being together, it's about being cared for. We live in a world where connection is easy to find online but hard to experience in real life. People need more than events—they need relationships that meet their everyday needs: someone to call in a crisis, someone to celebrate with, someone to share the highs and lows of life.
                </p>
                <p className="text-premium-body leading-relaxed text-muted-foreground">
                  For more than a decade, the Family Dinner Foundation has been proving what's possible. Through nearly 50,000 people across 30 cities and 3 continents, we saw that when people gather with intention and commit to one another, strangers quickly become family. From that foundation we created mbio.
                </p>
                <p className="text-premium-body leading-relaxed text-muted-foreground">
                  In Efik, <strong className="text-foreground">mbio means "a people."</strong> And people are what this is all about. Mbio exists so members can find their people and build reliable, life-giving relationships through our <strong className="text-primary">5C Mutual Care Framework</strong>: Commitment, Connection, Communication, Crisis, and Celebration.
                </p>
                <p className="text-premium-body leading-relaxed text-muted-foreground">
                  Because we believe everyone deserves a community that shows up, shares life, and makes sure no one has to do life alone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Our Values
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do in building authentic communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="hover-lift border-0 shadow-soft hover:shadow-lift">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground mb-2">
                          {value.title}
                        </CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Impact Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-8 text-foreground">Our Mission & Impact</h2>
            <p className="text-premium-body md:text-premium-body-lg leading-relaxed text-muted-foreground mb-12">
              To connect people in communities where everyone has meaningful relationships and the support they need - whether you're a member looking for your people or a leader building stronger organizations.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                  <div className="text-sm text-muted-foreground">People connected</div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">30+</div>
                  <div className="text-sm text-muted-foreground">Cities worldwide</div>
                </CardContent>
              </Card>
              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <div className="text-sm text-muted-foreground">Continents served</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6">
              Join Us in Building Better Communities
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
              Whether you're a member seeking genuine community or leading a church, university, HOA, professional organization, or social group - we'd love to help you create connections that feel like family.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="secondary" 
                size="xl"
                onClick={handleGetStarted}
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={handleContact}
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default About;