import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandHeart, Link, MessageCircle, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const principles = [
  {
    id: "commitment",
    icon: HandHeart,
    title: "Commitment",
    description: "Pledged commitment to your group for a specified period. Weekly communication and biweekly gatherings with rotating leads to stay deeply connected.",
    color: "text-primary"
  },
  {
    id: "communication", 
    icon: MessageCircle,
    title: "Communication",
    description: "Consistent weekly communication with each group member to maintain strong relational bonds and mutual understanding.",
    color: "text-success"
  },
  {
    id: "connection",
    icon: Link,
    title: "Connection",
    description: "Building meaningful relationships through regular gatherings and intentional community that goes beyond surface-level interactions.",
    color: "text-info"
  },
  {
    id: "crisis",
    icon: Shield,
    title: "Crisis Support", 
    description: "Individual call within 24 hours plus tangible group care within a week when a member faces personal or emotional crisis.",
    color: "text-destructive"
  },
  {
    id: "celebration",
    icon: Sparkles,
    title: "Celebration",
    description: "Individual call within 24 hours plus tangible group care within a week when a member reaches milestones worth celebrating.",
    color: "text-primary-glow"
  }
];

const FiveCPrinciples = () => {
  const navigate = useNavigate();

  const handleJoinCareGroup = () => {
    navigate('/community-care');
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground flex flex-wrap items-center justify-center gap-4">
            <span>The</span>
            <span className="h-4 w-32 bg-gradient-community rounded-full"></span>
            <span>Practice</span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
            5C Mutual Care
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're teaching people how to be human again. Beyond shared meals, we foster deep community connections 
            through five core principles that create a mutual care framework for neighbors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {principles.map((principle) => {
            const IconComponent = principle.icon;
            return (
              <Card key={principle.id} className="group hover:shadow-warm transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <IconComponent className={`w-8 h-8 ${principle.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button variant="community" size="lg" onClick={handleJoinCareGroup}>
            Join a 5C Care Group
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FiveCPrinciples;