import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "per month",
      description: "Perfect for smaller communities getting started",
      members: "Up to 200 members",
      popular: false,
      features: [
        { name: "Smart group matching", included: true },
        { name: "Basic care network", included: true },
        { name: "Email notifications", included: true },
        { name: "Mobile app access", included: true },
        { name: "Basic analytics", included: true },
        { name: "Community support", included: true },
        { name: "Advanced matching rules", included: false },
        { name: "Custom branding", included: false },
        { name: "SMS notifications", included: false },
        { name: "API access", included: false },
        { name: "Dedicated support", included: false }
      ]
    },
    {
      name: "Professional",
      price: "$149",
      period: "per month",
      description: "For growing communities that need more features",
      members: "Up to 1,000 members",
      popular: true,
      features: [
        { name: "Smart group matching", included: true },
        { name: "Advanced care network", included: true },
        { name: "Email notifications", included: true },
        { name: "Mobile app access", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced matching rules", included: true },
        { name: "Custom branding", included: true },
        { name: "SMS notifications", included: true },
        { name: "Data import/export", included: true },
        { name: "API access", included: false },
        { name: "Dedicated support", included: false }
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with custom needs",
      members: "Unlimited members",
      popular: false,
      features: [
        { name: "Everything in Professional", included: true },
        { name: "Unlimited matching rules", included: true },
        { name: "Full white-label branding", included: true },
        { name: "Multi-organization management", included: true },
        { name: "Advanced integrations", included: true },
        { name: "Custom development", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "SLA guarantees", included: true },
        { name: "On-premise deployment", included: true },
        { name: "Custom training", included: true },
        { name: "24/7 phone support", included: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your community size and needs. All plans include core features to get you started building stronger connections.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period !== "pricing" && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="text-sm font-medium text-primary mt-2">
                  {plan.members}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                  size="lg"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm ${!feature.included ? 'text-muted-foreground' : ''}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What's included in the free trial?</h3>
              <p className="text-muted-foreground">
                All plans include a 14-day free trial with full access to features. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do you count members?</h3>
              <p className="text-muted-foreground">
                We count active members - people who have profiles and can participate in groups. Archived or inactive members don't count toward your limit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade at any time. Changes take effect at your next billing cycle, and we'll prorate any differences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What kind of support do you offer?</h3>
              <p className="text-muted-foreground">
                All plans include community support. Professional plans get priority email support, and Enterprise customers get dedicated account management.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Button size="lg" className="px-8">
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;