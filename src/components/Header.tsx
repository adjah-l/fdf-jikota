import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Menu, Bell, User } from "lucide-react";

const Header = () => {
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
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Find Dinners
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Host
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              5C Groups
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Community
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
                3
              </Badge>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>

            {/* Join/Login Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
              <Button variant="default" size="sm">
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;