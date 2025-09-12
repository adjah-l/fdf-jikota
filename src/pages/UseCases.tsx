import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Church, Home, Building2, Users, Heart, MessageSquare } from "lucide-react";

const UseCases = () => {
  const useCases = [
    {
      icon: Church,
      title: "Churches",
      description: "Seasonal small groups and mutual care communities",
      features: [
        "Seasonal group formation with life stage matching",
        "Care networks for pastoral support at scale", 
        "Groups that build lasting relationships",
        "Member-to-member service exchange"
      ],
      cta: "Perfect for churches of 200+ members"
    },
    {
      icon: Home,
      title: "HOAs & Neighborhoods", 
      description: "Turn neighbors into community through structured connection",
      features: [
        "Activity-based groups by neighborhood zones",
        "Neighbor-to-neighbor care requests",
        "New resident integration programs",
        "Community event coordination"
      ],
      cta: "Ideal for HOAs and neighborhood associations"
    },
    {
      icon: Building2,
      title: "Universities & Schools",
      description: "Student communities and alumni networks with lasting connections",
      features: [
        "Student life groups by interests and activities",
        "Alumni networking with meaningful relationships",
        "Peer mentoring and study groups",
        "Campus community building initiatives"
      ],
      cta: "Perfect for universities, colleges, and schools"
    },
    {
      icon: Users,
      title: "Professional & Social Organizations",
      description: "Cohorts with peer support and professional development",
      features: [
        "Industry peer mentoring circles",
        "Professional development cohorts", 
        "Social clubs with authentic connections",
        "Knowledge and resource sharing networks"
      ],
      cta: "Built for professional associations and social organizations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            One platform, many use cases
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From churches to universities to HOAs to professional organizations, see how members are finding their people and leaders are creating thriving communities.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {useCase.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-primary pt-2">
                  {useCase.cta}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Features */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shared platform features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Smart Matching</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered algorithms consider location, life stage, interests, and availability
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Care Networks</h3>
              <p className="text-sm text-muted-foreground">
                Member-to-member service exchange with credits and reputation systems
              </p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Communication</h3>
              <p className="text-sm text-muted-foreground">
                Built-in messaging, email campaigns, and group coordination tools
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your community?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands already experiencing community that genuinely cares for each other like family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              See Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCases;