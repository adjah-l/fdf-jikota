import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

const PricingTabs = () => {
  const organizationTiers = [
    {
      name: "Small Community",
      price: "$2,500",
      period: "per year",
      members: "Up to 200 members",
      features: [
        "Automated group matching",
        "Sub-community management", 
        "Mutual care reporting"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Medium Community",
      price: "$7,500", 
      period: "per year",
      members: "200–1,000 members",
      features: [
        "All Small features",
        "Advanced reporting",
        "Messaging automations"
      ],
      cta: "Contact Us",
      popular: true
    },
    {
      name: "Large Community",
      price: "Starting at $15,000",
      period: "per year", 
      members: "1,000+ members",
      features: [
        "Enterprise support",
        "White-label options",
        "Integrations"
      ],
      cta: "Schedule a Demo",
      popular: false
    }
  ];

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="organizations">Organizations</TabsTrigger>
      </TabsList>

      <TabsContent value="members" className="space-y-8">
        <div className="max-w-md mx-auto">
          <Card className="relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
              Serve once a month, and your membership is covered
            </Badge>
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl">Individual Membership</CardTitle>
              <CardDescription>
                Your pledge creates commitment. Your care creates community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Initiation Pledge</span>
                  <span className="font-bold text-xl">$99 one-time</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recurring Contribution</span>
                  <span className="font-bold text-xl">$9/month*</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  *Unless you complete at least one act of mutual care
                </p>
              </div>
              <Button className="w-full" size="lg">
                Join a Group
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Member FAQ */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Why a pledge?</h3>
            <p className="text-muted-foreground">
              It ensures commitment to your group.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How does mutual care offset work?</h3>
            <p className="text-muted-foreground">
              Complete one act of mutual care each month and your $9 is waived.
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="organizations" className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {organizationTiers.map((tier, index) => (
            <Card key={index} className={`relative h-full ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
                <CardDescription className="mt-2">{tier.members}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Enterprise partnerships (universities, real estate developers, corporates) start at $10,000 setup + $5–10 per member annually.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PricingTabs;