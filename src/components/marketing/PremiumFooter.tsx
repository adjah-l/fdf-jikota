import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export function PremiumFooter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("");

  const handleJoinGroup = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/groups');
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail("");
  };

  return (
    <>
      <footer className="bg-background border-t relative overflow-hidden">
        {/* Efik Symbol Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
          <div className="text-foreground text-[30rem] font-bold select-none">
            mbio
          </div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* About mbio */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="font-space text-2xl font-bold text-foreground mb-4">
                  mbio
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  <span className="font-semibold text-foreground">mbio</span> means 'a people.' 
                  We exist to make belonging possible, built on the 5Cs—Care, Consistency, 
                  Commitment, Confidants, and Celebration.
                </p>
                <Button 
                  variant="premium" 
                  onClick={handleJoinGroup}
                  className="shadow-primary"
                >
                  Join a Group
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-inter font-semibold text-foreground mb-6">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleJoinGroup}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    Join a Group
                  </button>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-inter font-semibold text-foreground mb-6">
                Stay Connected
              </h4>
              <p className="text-muted-foreground mb-4 text-sm">
                Get updates on new communities and the 5C framework.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border"
                />
                <Button 
                  type="submit" 
                  variant="premium-outline" 
                  size="sm" 
                  className="w-full"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Copyright */}
              <div className="text-muted-foreground text-sm">
                © 2024 mbio. Powered by Family Dinner Foundation. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
                </a> 
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-muted hover:bg-secondary transition-colors flex items-center justify-center group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-muted-foreground group-hover:text-secondary-foreground" />
                </a>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="/code-of-conduct" className="hover:text-primary transition-colors">
                  Code of Conduct
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
}