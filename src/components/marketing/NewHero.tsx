import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Building2, MapPin, GraduationCap, Users, Church, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export function NewHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLocalInput, setShowLocalInput] = useState(false);
  const [showOrgInput, setShowOrgInput] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [orgSearch, setOrgSearch] = useState("");

  const handleJoinLocal = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowLocalInput(!showLocalInput);
    setShowOrgInput(false);
  };

  const handleFindOrg = () => {
    setShowOrgInput(!showOrgInput);
    setShowLocalInput(false);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      navigate(`/orgs?type=city&zip=${zipCode}`);
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Navigate to location-based groups
          navigate(`/orgs?type=city&lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        },
        () => {
          // Fallback if location access denied
          alert("Please enable location access or enter your ZIP code manually.");
        }
      );
    }
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orgSearch.trim()) {
      navigate(`/orgs?search=${encodeURIComponent(orgSearch)}`);
    }
  };

  const handleChipClick = (type: string) => {
    navigate(`/orgs?type=${type}`);
  };

  const orgTypes = [
    { id: "universities", label: "Universities", icon: GraduationCap },
    { id: "hoas", label: "HOAs", icon: Home },
    { id: "social", label: "Social Orgs", icon: Users },
    { id: "churches", label: "Churches", icon: Church }
  ];

  return (
    <>
      <section className="relative py-20 px-4 text-center bg-gradient-hero">
        <div className="container mx-auto max-w-[1100px]">
          
          {/* Mission Kicker */}
          <p className="text-sm md:text-base font-medium text-muted-foreground tracking-[0.02em] mb-6">
            We're building the world's largest and most trusted mutual care community.
          </p>
          
          {/* H1 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight font-space text-foreground">
            Find your people.<br />
            Build mutual care.
          </h1>
          
          {/* Subcopy */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            <strong>mbio</strong> means "a people" in Efik, a Nigerian language. Belong through shared activities and the 5C framework.
          </p>
          
          {/* Primary Path Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="text-base px-8 py-3 cta-text hover-lift shadow-primary"
              onClick={handleJoinLocal}
            >
              Join your local community
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-3 cta-text border-border text-foreground hover:bg-muted/50"
              onClick={handleFindOrg}
            >
              <Building2 className="mr-2 w-5 h-5" />
              Find your organization
            </Button>
          </div>

          {/* Local Community Input */}
          {showLocalInput && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-card border border-border rounded-lg shadow-soft">
              <form onSubmit={handleLocationSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUseLocation}
                  className="text-xs whitespace-nowrap"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Use my location
                </Button>
                <Button type="submit" size="sm" className="cta-text">
                  See groups near me
                </Button>
              </form>
            </div>
          )}

          {/* Organization Search Input */}
          {showOrgInput && (
            <div className="max-w-lg mx-auto mb-6 p-4 bg-card border border-border rounded-lg shadow-soft">
              <form onSubmit={handleOrgSubmit} className="mb-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search universities, HOAs, churches, social orgs"
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" className="cta-text">
                    Search
                  </Button>
                </div>
              </form>
              
              {/* Quick Chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {orgTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleChipClick(type.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-primary hover:text-primary-foreground transition-colors rounded-full border border-border"
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Helper Text */}
          <p className="text-sm text-muted-foreground">
            Prefer to browse first?{" "}
            <button 
              onClick={() => navigate('/orgs')}
              className="text-primary hover:underline font-medium"
            >
              Explore all organizations →
            </button>
          </p>
        </div>

        {/* Quick Chips Below Hero */}
        <div className="container mx-auto max-w-4xl mt-12 px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {orgTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleChipClick(type.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors shadow-soft"
                >
                  <IconComponent className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
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