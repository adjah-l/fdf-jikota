import { Card } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Handshake, 
  AlertTriangle, 
  PartyPopper 
} from "lucide-react";

const fiveCs = [
  {
    icon: Heart,
    name: "Commitment",
    description: "We show up for each other"
  },
  {
    icon: MessageCircle,
    name: "Communication", 
    description: "We listen and speak with care"
  },
  {
    icon: Handshake,
    name: "Connection",
    description: "We build bonds that last"
  },
  {
    icon: AlertTriangle,
    name: "Crisis",
    description: "We step in when life gets hard"
  },
  {
    icon: PartyPopper,
    name: "Celebration",
    description: "We honor milestones and everyday wins"
  }
];

export const FiveCs = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-space text-3xl font-bold text-foreground mb-12 text-center">
            The 5Cs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {fiveCs.map((c) => {
              const IconComponent = c.icon;
              return (
                <Card key={c.name} className="text-center p-6 border-border/50">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {c.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};