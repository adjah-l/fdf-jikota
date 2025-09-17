import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Share who you are and your season of life.",
    detail: "Tell us about your interests, availability, and what kind of community you're looking for."
  },
  {
    number: "02", 
    icon: Users,
    title: "Get Matched",
    description: "We place you in a group of 5 individuals or 4 families.",
    detail: "Our matching algorithm considers location, interests, life stage, and availability."
  },
  {
    number: "03",
    icon: Heart,
    title: "Live the 5Cs",
    description: "Meet regularly, care for one another, and grow in belonging.",
    detail: "Practice Care, Consistency, Commitment, Confidants, and Celebration together."
  }
];

export function HowItWorks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/groups');
    }
  };

  return (
    <>
      <section id="how-it-works" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
              How mbio Works
            </h2>
            <p className="text-premium-body text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your community and start belonging.
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="relative">
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0 transform translate-x-4"></div>
                    )}
                    
                    <Card className="relative z-10 hover-lift border-0 shadow-soft hover:shadow-lift bg-gradient-to-br from-card to-card/50">
                      <CardContent className="p-8 text-center">
                        {/* Step Number */}
                        <div className="w-12 h-12 rounded-full bg-gradient-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                          {step.number}
                        </div>
                        
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-6">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        
                        {/* Content */}
                        <h3 className="font-inter text-xl font-semibold mb-3 text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed">
                          {step.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button 
                variant="premium" 
                size="xl"
                onClick={handleGetStarted}
                className="shadow-primary"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
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