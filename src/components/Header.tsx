import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Users, Menu, Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import AuthModal from "./auth/AuthModal";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Family Dinner Foundation</h1>
              <p className="text-xs text-muted-foreground">Connecting the world as a family at and beyond the dinner table</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/groups" className="text-foreground hover:text-primary transition-colors font-medium">
              Find Dinners
            </a>
            <a href="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              Host
            </a>
            <a href="/community-care" className="text-foreground hover:text-primary transition-colors font-medium">
              5C Groups
            </a>
            <a href="/community-care" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/dashboard')}>
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                3
              </Badge>
            </Button>

            {/* Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getUserInitials(profile?.full_name || user.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-foreground">
                      {profile?.full_name || user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => handleAuthClick('login')}>
                <User className="w-5 h-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>

            {/* Join/Login Buttons */}
            {!user && !loading && (
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                >
                  Log In
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleAuthClick('signup')}
                >
                  Join Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultMode={authMode}
      />
    </header>
  );
};

export default Header;