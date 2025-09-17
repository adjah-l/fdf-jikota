import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export function CTABanner() {
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

  return (
    <>
      <section className="py-24 bg-gradient-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,white,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,white,transparent_50%)]" />
        </div>

        {/* Efik Symbol Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="text-white text-9xl font-bold">mbio</div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            {/* Headline */}
            <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-white">
              Your Community Is Waiting.
            </h2>
            
            {/* Subcopy */}
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of neighbors who have found belonging through shared activities 
              and the 5C framework for lasting care.
            </p>
            
            {/* CTA */}
            <Button 
              variant="secondary" 
              size="xl"
              onClick={handleJoinGroup}
              className="bg-white text-primary hover:bg-white/90 hover:shadow-lift shadow-lg min-w-[200px]"
            >
              Join the Waitlist
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Supporting Text */}
            <p className="text-white/70 text-sm mt-8">
              Start belonging today
            </p>
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