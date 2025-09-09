import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandHeart, Link, MessageCircle, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const principles = [
  {
    id: "commitment",
    icon: HandHeart,
    title: "Commitment",
    description: "Weekly one-to-one calls and biweekly gatherings to stay connected with your care group.",
    color: "text-primary"
  },
  {
    id: "connection", 
    icon: Link,
    title: "Connection",
    description: "Build meaningful relationships with neighbors who share similar life stages and values.",
    color: "text-info"
  },
  {
    id: "communication",
    icon: MessageCircle, 
    title: "Communication",
    description: "Open, honest dialogue that strengthens understanding and trust within the community.",
    color: "text-success"
  },
  {
    id: "crisis",
    icon: Shield,
    title: "Crisis Support", 
    description: "Be there for each other during difficult times with practical help and emotional support.",
    color: "text-destructive"
  },
  {
    id: "celebration",
    icon: Sparkles,
    title: "Celebration",
    description: "Share in life's joyful moments, from birthdays to achievements and community milestones.",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            The <span className="bg-gradient-community bg-clip-text text-transparent">5C Mutual Care</span> Practice
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Beyond shared meals, we foster deep community connections through five core principles 
            that help neighbors truly care for one another.
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