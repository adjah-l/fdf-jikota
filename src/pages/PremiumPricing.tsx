import { PremiumNavigation } from "@/components/layout/PremiumNavigation";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, Users, Building2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "Individual",
    price: "$15",
    period: "/month",
    description: "Perfect for individuals looking to build community connections",
    gradient: "from-primary/5 to-primary/10",
    borderColor: "border-primary/20",
    features: [
      "Join neighborhood groups",
      "5C framework tools",
      "Mutual care network",
      "Group messaging",
      "Activity matching",
      "24/7 support"
    ],
    popular: false
  },
  {
    name: "Organization",
    price: "$499",
    period: "/month",
    description: "For organizations building community at scale",
    gradient: "from-secondary/5 to-secondary/10", 
    borderColor: "border-secondary/30",
    features: [
      "Unlimited member groups",
      "Custom matching algorithms",
      "Advanced analytics",
      "Admin dashboard",
      "Training & onboarding",
      "Priority support",
      "Custom integrations",
      "White-label options"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Large-scale implementations with full customization",
    gradient: "from-accent/5 to-accent/10",
    borderColor: "border-accent/20",
    features: [
      "Everything in Organization",
      "Custom development",
      "Dedicated success manager",
      "API access",
      "Advanced security",
      "Custom reporting",
      "Multi-org management",
      "SLA guarantees"
    ],
    popular: false
  }
];

const faq = [
  {
    question: "What makes mbio different from other community platforms?",
    answer: "mbio is built on the proven 5C framework (Commitment, Communication, Connection, Crisis support, and Celebration) that creates lasting community bonds, not just digital connections."
  },
  {
    question: "How does the matching algorithm work?",
    answer: "Our smart matching considers location, life stage, interests, availability, and personality to create groups of 4-5 people who are most likely to form lasting friendships."
  },
  {
    question: "Can organizations customize the platform?",
    answer: "Yes! Organization and Enterprise plans include customization options, from branding to custom matching criteria and workflow modifications."
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include comprehensive onboarding, training materials, and ongoing support. Enterprise customers get dedicated success managers."
  },
  {
    question: "Do you offer nonprofit discounts?",
    answer: "Yes, we offer special pricing for qualifying nonprofits, churches, and educational institutions. Contact us for details."
  }
];

const PremiumPricing = () => {
  const navigate = useNavigate();

  const handleGetStarted = (plan: string) => {
    if (plan === "Enterprise") {
      navigate('/contact');
    } else {
      navigate('/signup');
    }
  };

  const handleContactSales = () => {
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
              Pricing That Builds <span className="text-primary">Real Community</span>
            </h1>
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Choose the plan that fits your community size. From individuals seeking belonging 
              to organizations scaling care across thousands of members.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`hover-lift border-0 shadow-soft hover:shadow-lift relative ${
                  plan.popular ? 'ring-2 ring-secondary ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-secondary text-secondary-foreground font-semibold px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-4`}>
                    {plan.name === 'Individual' && <Users className="w-8 h-8 text-foreground" />}
                    {plan.name === 'Organization' && <Building2 className="w-8 h-8 text-foreground" />}
                    {plan.name === 'Enterprise' && <Heart className="w-8 h-8 text-foreground" />}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? "premium" : "premium-outline"}
                    size="lg"
                    onClick={() => handleGetStarted(plan.name)}
                    className="w-full"
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-premium-body text-muted-foreground">
                Everything you need to know about mbio pricing and features.
              </p>
            </div>

            <div className="space-y-6">
              {faq.map((item, idx) => (
                <Card key={idx} className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <h3 className="font-semibold text-lg text-foreground mb-3">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Community?
            </h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
              Join thousands of individuals and hundreds of organizations creating lasting 
              connections through the 5C framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => handleGetStarted('Individual')}
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                onClick={handleContactSales}
                className="border-white text-white hover:bg-white/10"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default PremiumPricing;