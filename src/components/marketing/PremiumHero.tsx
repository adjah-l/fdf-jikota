import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export function PremiumHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/groups');
    }
  };

  const handleSeeHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(220,100%,50%,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(169,100%,39%,0.1),transparent_50%)]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Main Headlines */}
            <h1 className="font-space text-premium-hero md:text-premium-hero-mobile mb-8 text-foreground leading-tight">
              Find Your People.
              <br />
              <span className="text-primary">Build Your Community.</span>
            </h1>
            
            {/* Subcopy */}
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-foreground">mbio</span> means "a people" in Efik, a Nigerian language. 
              We help you belong through shared activities and the 5C framework for lasting care.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                variant="premium" 
                size="xl" 
                onClick={handleJoinGroup}
                className="min-w-[200px] shadow-primary"
              >
                Join a Group
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="premium-outline" 
                size="xl"
                onClick={handleSeeHowItWorks}
                className="min-w-[200px]"
              >
                <Play className="mr-2 w-5 h-5" />
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>2,500+ Neighbors Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>45+ Neighborhoods</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>95% Feel More Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
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