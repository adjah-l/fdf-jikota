import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Church, Home, Building2, Users, Heart, Zap, Shield, BarChart3 } from "lucide-react";

const ForOrganizations = () => {
  const organizationTypes = [
    {
      icon: Church,
      title: "Churches & Faith Communities",
      subtitle: "Build deeper connections in your congregation",
      problems: [
        "Only 25% of members are in small groups",
        "New visitors struggle to find community",
        "Pastoral care doesn't scale with growth",
        "Seasonal groups are hard to organize"
      ],
      solutions: [
        "Smart matching creates balanced small groups automatically",
        "New member integration with welcome groups",
        "Member-to-member care networks reduce pastoral load",
        "Seasonal group formation with life stage preferences"
      ],
      cta: "Perfect for churches of 200+ members"
    },
    {
      icon: Home,
      title: "HOAs & Neighborhoods",
      subtitle: "Transform neighbors into community",
      problems: [
        "Residents don't know their neighbors",
        "Community events have low participation",
        "New residents feel isolated",
        "Volunteer coordination is chaotic"
      ],
      solutions: [
        "Neighborhood zone-based dinner groups",
        "Mutual care networks for neighbor support",
        "New resident welcome and integration",
        "Organized volunteer matching and coordination"
      ],
      cta: "Ideal for communities of 100+ households"
    },
    {
      icon: Building2,
      title: "Professional Organizations",
      subtitle: "Create meaningful peer connections",
      problems: [
        "Members don't network beyond events",
        "Professional development lacks peer support",
        "Alumni connections fade after graduation",
        "Knowledge sharing happens in silos"
      ],
      solutions: [
        "Industry-specific peer mentoring circles",
        "Professional development cohorts with accountability",
        "Alumni networking dinner groups by location/industry",
        "Expertise sharing and resource exchange"
      ],
      cta: "Built for associations with 300+ members"
    }
  ];

  const platformBenefits = [
    {
      icon: Users,
      title: "Intelligent Matching",
      description: "AI-powered algorithms consider location, life stage, interests, availability, and custom criteria to form balanced groups."
    },
    {
      icon: Heart,
      title: "Care Networks",
      description: "Member-to-member service exchange with reputation systems, making mutual support scalable and sustainable."
    },
    {
      icon: Zap,
      title: "Automated Operations", 
      description: "Streamline group formation, member onboarding, communication campaigns, and care coordination."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Built-in verification systems, privacy controls, and moderation tools keep your community safe."
    },
    {
      icon: BarChart3,
      title: "Insights & Analytics",
      description: "Track engagement, measure community health, and get actionable insights to improve connections."
    }
  ];

  const successMetrics = [
    { label: "Member Engagement", value: "3x increase", description: "in regular group participation" },
    { label: "Connection Rate", value: "85%", description: "of new members form lasting relationships" },
    { label: "Administrative Time", value: "75% reduction", description: "in manual coordination tasks" },
    { label: "Community Satisfaction", value: "4.8/5", description: "average rating from members" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">For Organizations</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Turn your members into a thriving community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stop struggling with manual group formation and member engagement. Our platform helps you systematically build the connected community your members deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Schedule a Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              View Success Stories
            </Button>
          </div>
        </div>

        {/* Organization Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Built for your organization type
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Each organization faces unique challenges in building community. See how we solve them for your sector.
          </p>
          
          <div className="space-y-12">
            {organizationTypes.map((org, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <org.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{org.title}</CardTitle>
                        <CardDescription>{org.subtitle}</CardDescription>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-destructive">Common Challenges:</h4>
                      <ul className="space-y-2">
                        {org.problems.map((problem, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3 text-green-600">Our Solutions:</h4>
                    <ul className="space-y-2 mb-6">
                      {org.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium text-primary">{org.cta}</p>
                      <Button className="mt-3" size="sm">
                        See Case Study
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            One platform, powerful results
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to build, manage, and grow authentic community connections.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformBenefits.slice(0, 3).map((benefit, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
            {platformBenefits.slice(3).map((benefit, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Proven results across organizations
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            See the impact organizations are achieving with our platform.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your community?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using our platform to build stronger, more connected communities. Start with a personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Schedule Your Demo
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Download Case Studies
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            30-minute demo • No commitment required • Custom pricing available
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForOrganizations;