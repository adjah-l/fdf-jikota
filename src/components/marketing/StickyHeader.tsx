import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export function StickyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/join');
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/home-premium');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start">
              <div className="font-space text-2xl font-bold text-foreground">
                mbio
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Powered by Family Dinner Foundation
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                to="/orgs" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Organizations
              </Link>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <Link 
                to="/use-cases" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Use Cases
              </Link>
              <Link 
                to="/pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={handleDashboard}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </Button>
                  <Button 
                    variant="premium" 
                    onClick={handleJoinGroup}
                    className="shadow-primary"
                  >
                    Join a Group
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAuthModal(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="premium" 
                    onClick={handleJoinGroup}
                    className="shadow-primary"
                  >
                    Join a Group
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

            {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-background border-t border-border">
              <nav className="py-4 space-y-2">
                <Link 
                  to="/orgs" 
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Organizations
                </Link>
                <button 
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </button>
                <Link 
                  to="/use-cases" 
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Use Cases
                </Link>
                <Link 
                  to="/pricing" 
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  to="/about" 
                  className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        handleDashboard();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </button>
                )}
                <div className="px-4 py-2">
                  <Button 
                    variant="premium" 
                    onClick={() => {
                      handleJoinGroup();
                      setIsMenuOpen(false);
                    }}
                    className="w-full shadow-primary"
                  >
                    Join a Group
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
}