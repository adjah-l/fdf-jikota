import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Gift, PartyPopper, Clock } from "lucide-react";

const fiveCItems = [
  {
    title: "Connection",
    icon: Users,
    description: "Build meaningful relationships through regular interaction"
  },
  {
    title: "Care", 
    icon: Heart,
    description: "Support each other through life's challenges and needs"
  },
  {
    title: "Contribution",
    icon: Gift,
    description: "Everyone shares their unique gifts and talents"
  },
  {
    title: "Celebration",
    icon: PartyPopper,
    description: "Recognize milestones and celebrate together"
  },
  {
    title: "Consistency",
    icon: Clock,
    description: "Maintain regular rhythms that build trust over time"
  }
];

export function FiveCSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on the 5C Framework
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every group follows five practices that create durable community. Connection, Care, Contribution, Celebration, Consistency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {fiveCItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}