import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/join');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">mbio</div>
              <div className="text-xs text-muted-foreground">
                Powered by Family Dinner Foundation
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/orgs" className="text-foreground hover:text-primary transition-colors">
                Organizations
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            {/* Desktop Auth/CTA */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </Button>
                  <Button 
                    variant="premium" 
                    size="sm"
                    onClick={handleJoinGroup}
                    className="uppercase tracking-wider"
                  >
                    Join a Group
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/orgs"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Organizations
                </Link>
                <Link
                  to="/about"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                
                <div className="pt-4 border-t border-border space-y-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAuthModal(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="premium"
                        size="sm"
                        onClick={() => {
                          handleJoinGroup();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start uppercase tracking-wider"
                      >
                        Join a Group
                      </Button>
                    </>
                  )}
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
};