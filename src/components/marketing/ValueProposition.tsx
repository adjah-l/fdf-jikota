import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, BookOpen, Dumbbell, Trophy, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const activities = [
  {
    key: "dinner",
    title: "Dinner Together",
    description: "Share meals that spark conversation.",
    icon: UtensilsCrossed,
    gradient: "from-primary/10 to-primary/5"
  },
  {
    key: "prayer_study",
    title: "Prayer & Bible Study",
    description: "Grow in faith through reflection.",
    icon: BookOpen,
    gradient: "from-secondary/10 to-secondary/5"
  },
  {
    key: "workout",
    title: "Working Out",
    description: "Build healthy rhythms with others.",
    icon: Dumbbell,
    gradient: "from-accent/10 to-accent/5"
  },
  {
    key: "sports",
    title: "Watch Sports & More",
    description: "Celebrate wins, share the moment.",
    icon: Trophy,
    gradient: "from-primary/15 to-primary/8"
  },
  {
    key: "flexible",
    title: "Flexible",
    description: "Community adapts to your season of life.",
    icon: Sparkles,
    gradient: "from-secondary/15 to-secondary/8"
  }
];

export function ValueProposition() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleExploreGroups = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/groups');
    }
  };

  return (
    <>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Life Together, Your Way
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              Choose an activity that fits your community. Every group practices the 5C framework.
            </p>
          </div>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <Card 
                  key={activity.key} 
                  className="group hover-lift border-0 shadow-soft hover:shadow-lift bg-gradient-to-br from-card to-card/50"
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {activity.description}
                    </p>
                    <Button 
                      variant="premium-outline" 
                      size="sm"
                      onClick={handleExploreGroups}
                      className="w-full"
                    >
                      Explore Groups
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              variant="premium" 
              size="lg"
              onClick={handleExploreGroups}
              className="shadow-primary"
            >
              Join a Group
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
}