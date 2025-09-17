import { PremiumNavigation } from "@/components/layout/PremiumNavigation";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Heart, 
  GraduationCap, 
  Home, 
  Briefcase,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const useCases = [
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate Wellness",
    description: "Employee wellbeing through neighborhood community building",
    gradient: "from-primary/10 to-primary/5",
    benefits: [
      "Reduced employee isolation",
      "Improved work-life balance", 
      "Stronger team relationships",
      "Higher retention rates"
    ],
    examples: [
      "Tech companies with remote workers",
      "Healthcare systems supporting staff",
      "Financial services firms"
    ]
  },
  {
    id: "healthcare",
    icon: Heart,
    title: "Healthcare & Wellness",
    description: "Address social determinants of health through community care",
    gradient: "from-secondary/10 to-secondary/5",
    benefits: [
      "Better patient outcomes",
      "Reduced readmission rates",
      "Community support networks",
      "Mental health improvement"
    ],
    examples: [
      "Hospitals and health systems",
      "Mental health organizations",
      "Senior care facilities"
    ]
  },
  {
    id: "faith",
    icon: Heart,
    title: "Faith Communities",
    description: "Deepen congregational care beyond Sunday services",
    gradient: "from-accent/10 to-accent/5",
    benefits: [
      "Stronger member connections",
      "Pastoral care support",
      "Community outreach",
      "Spiritual growth together"
    ],
    examples: [
      "Churches and congregations",
      "Faith-based nonprofits",
      "Religious organizations"
    ]
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Educational Institutions",
    description: "Build belonging among students, parents, and faculty",
    gradient: "from-primary/15 to-primary/8",
    benefits: [
      "Student engagement",
      "Parent involvement",
      "Faculty wellness",
      "Community partnerships"
    ],
    examples: [
      "Universities and colleges",
      "K-12 school districts",
      "Educational nonprofits"
    ]
  },
  {
    id: "housing",
    icon: Home,
    title: "Housing & Real Estate",
    description: "Create thriving communities in residential developments",
    gradient: "from-secondary/15 to-secondary/8",
    benefits: [
      "Higher property values",
      "Resident satisfaction",
      "Community safety",
      "Long-term tenancy"
    ],
    examples: [
      "Apartment communities",
      "Planned developments",
      "Senior living facilities"
    ]
  },
  {
    id: "community",
    icon: Users,
    title: "Community Organizations",
    description: "Scale impact through structured mutual care practices",
    gradient: "from-accent/15 to-accent/8",
    benefits: [
      "Increased engagement",
      "Volunteer retention",
      "Program effectiveness",
      "Community resilience"
    ],
    examples: [
      "Neighborhood associations",
      "Community centers",
      "Local nonprofits"
    ]
  }
];

const UseCases = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
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
              Use Cases for <span className="text-primary">Every Organization</span>
            </h1>
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              The 5C framework adapts to any organization's unique needs. 
              Discover how different sectors are building belonging at scale.
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
                onClick={handleContactUs}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {useCases.map((useCase) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={useCase.id} className="hover-lift border-0 shadow-soft hover:shadow-lift">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground mb-2">
                          {useCase.title}
                        </CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {useCase.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-secondary" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Examples */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Examples</h4>
                        <div className="flex flex-wrap gap-2">
                          {useCase.examples.map((example, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Success Stories
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              Real organizations seeing measurable impact with the 5C framework.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="font-semibold text-foreground mb-2">Metro Health</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reduced patient readmissions by 40% through community care groups.
                </p>
                <div className="text-2xl font-bold text-primary">40%</div>
                <div className="text-xs text-muted-foreground">Reduction in readmissions</div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-semibold text-foreground mb-2">TechCorp Global</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Improved employee satisfaction and reduced turnover significantly.
                </p>
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-xs text-muted-foreground">Employee satisfaction</div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">⛪</div>
                <h3 className="font-semibold text-foreground mb-2">Faith Fellowship</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Increased member engagement and community outreach participation.
                </p>
                <div className="text-2xl font-bold text-primary">300+</div>
                <div className="text-xs text-muted-foreground">Active participants</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Organization?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
              Join hundreds of organizations using the 5C framework to build belonging and strengthen communities.
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
                onClick={handleContactUs}
                className="border-white text-white hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default UseCases;