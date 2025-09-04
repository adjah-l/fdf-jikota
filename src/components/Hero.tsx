import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Home, Calendar } from "lucide-react";
import heroDinner from "@/assets/hero-dinner.jpg";
import NeighborhoodSelector from "@/components/neighborhood/NeighborhoodSelector";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleJoinNeighborhood = () => {
    setShowNeighborhoodSelector(true);
  };

  const handleHostDinner = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // TODO: Navigate to dinner creation page
      console.log("Navigate to dinner creation");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroDinner} 
          alt="Neighbors sharing a warm dinner together"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Connect with neighbors through
            <span className="bg-gradient-primary bg-clip-text text-transparent"> shared meals</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Build belonging and community health through the simple act of sharing dinner with your neighbors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="min-w-[200px]"
              onClick={handleJoinNeighborhood}
            >
              Join Your Neighborhood
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="min-w-[200px]"
              onClick={handleHostDinner}
            >
              Host a Dinner
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">2,500+</div>
                <div className="text-sm text-muted-foreground">Neighbors Connected</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">850+</div>
                <div className="text-sm text-muted-foreground">Dinners Hosted</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <Home className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">45+</div>
                <div className="text-sm text-muted-foreground">Neighborhoods</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Feel More Connected</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NeighborhoodSelector
        open={showNeighborhoodSelector}
        onOpenChange={setShowNeighborhoodSelector}
      />
      
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="login"
      />
    </section>
  );
};

export default Hero;