import { PremiumNavigation } from "@/components/layout/PremiumNavigation";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Heart, Globe, ArrowRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const partnerTypes = [
  {
    icon: Building2,
    title: "Enterprise Partners",
    description: "Large corporations implementing community care for employees",
    examples: ["Fortune 500 Companies", "Tech Giants", "Healthcare Systems"],
    color: "from-primary/10 to-primary/5"
  },
  {
    icon: Users,
    title: "Community Organizations",
    description: "Local nonprofits and community groups scaling their impact",
    examples: ["Neighborhood Associations", "Community Centers", "Local Nonprofits"],
    color: "from-secondary/10 to-secondary/5"
  },
  {
    icon: Heart,
    title: "Healthcare Partners",
    description: "Medical organizations addressing social determinants of health",
    examples: ["Hospitals", "Clinics", "Mental Health Organizations"],
    color: "from-accent/10 to-accent/5"
  },
  {
    icon: Globe,
    title: "Faith Communities",
    description: "Churches and religious organizations building deeper connections",
    examples: ["Churches", "Synagogues", "Mosques", "Faith-based Nonprofits"],
    color: "from-primary/15 to-primary/8"
  }
];

const featuredPartners = [
  {
    name: "Metro Health System",
    type: "Healthcare",
    description: "Implementing 5C care groups for patients with chronic conditions",
    impact: "500+ patients connected",
    logo: "🏥"
  },
  {
    name: "TechCorp Global", 
    type: "Enterprise",
    description: "Employee wellness through neighborhood community building",
    impact: "2,000+ employees engaged",
    logo: "🏢"
  },
  {
    name: "Community Fellowship",
    type: "Faith Community",
    description: "Deepening congregational care through structured 5C groups",
    impact: "300+ members participating",
    logo: "⛪"
  },
  {
    name: "Riverside Neighborhood Assoc.",
    type: "Community",
    description: "Strengthening neighborhood bonds through shared activities",
    impact: "150+ families connected",
    logo: "🏘️"
  }
];

const Partners = () => {
  const navigate = useNavigate();

  const handleBecomePartner = () => {
    navigate('/for-organizations');
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <PremiumNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-space text-premium-hero md:text-premium-hero-mobile mb-8 text-foreground">
              Our <span className="text-primary">Partners</span>
            </h1>
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We partner with organizations that share our vision of building belonging 
              through the 5C framework. Together, we're making community care accessible at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="premium" 
                size="xl"
                onClick={handleBecomePartner}
                className="shadow-primary"
              >
                Become a Partner
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="premium-outline" 
                size="xl"
                onClick={handleContactUs}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Partner Categories
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              We work with diverse organizations to bring the 5C framework to their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {partnerTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.title} className="hover-lift border-0 shadow-soft hover:shadow-lift">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6`}>
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                      {type.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {type.description}
                    </p>
                    <div className="space-y-2">
                      {type.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Featured Partners
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              Organizations already implementing the 5C framework with remarkable results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredPartners.map((partner) => (
              <Card key={partner.name} className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{partner.logo}</div>
                    <div>
                      <h3 className="font-inter text-xl font-semibold text-foreground mb-1">
                        {partner.name}
                      </h3>
                      <div className="text-sm text-primary font-medium mb-2">
                        {partner.type}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {partner.description}
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Impact</div>
                    <div className="font-semibold text-foreground">{partner.impact}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-8 text-foreground">
              Why Partner with mbio?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                  Proven Framework
                </h3>
                <p className="text-muted-foreground">
                  The 5C framework has helped thousands build lasting community connections.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                  Full Support
                </h3>
                <p className="text-muted-foreground">
                  Complete training, resources, and ongoing support for your implementation.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                  Measurable Impact
                </h3>
                <p className="text-muted-foreground">
                  Track engagement, connection, and wellbeing outcomes with our tools.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="premium" 
                size="xl"
                onClick={handleBecomePartner}
                className="shadow-primary"
              >
                Start Partnership
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="premium-outline" 
                size="xl"
                onClick={handleContactUs}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default Partners;