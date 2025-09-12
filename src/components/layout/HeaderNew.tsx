import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { flags } from "@/config/flags";
import { useAuth } from "@/hooks/useAuth";

export function HeaderNew() {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // TODO: Add role checking when profiles/roles are implemented
  // For now, assume admin role based on user existence
  const isAdmin = !!user; // Placeholder - replace with actual role check

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          active 
            ? "text-foreground underline underline-offset-4" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    );
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav 
        className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3" 
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/5ed33293-854d-4706-bcba-782b8b7f340b.png" 
              alt="mbio logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <Link to="/" className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              mbio
            </Link>
            <p className="text-xs text-muted-foreground">Powered by Family Dinner Foundation</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" label="Home" />
          {flags.enableNewMarketing && <NavLink to="/for-organizations" label="For Organizations" />}
          {flags.enableNewMarketing && <NavLink to="/use-cases" label="Use Cases" />}
          {flags.enableNewMarketing && <NavLink to="/pricing" label="Pricing" />}
          {flags.enableNewMarketing && <NavLink to="/about" label="About" />}

          <div className="mx-2 h-5 w-px bg-border" aria-hidden="true" />

          {!user && !loading && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}

          {user && (
            <>
              {flags.enableMemberShell && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app">Open Member App</Link>
                </Button>
              )}
              {flags.enableAdminShell && isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin2/overview">Open Admin</Link>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80" id="mobile-menu">
              <SheetHeader>
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                <NavLink to="/" label="Home" onClick={closeMobileMenu} />
                {flags.enableNewMarketing && (
                  <NavLink to="/for-organizations" label="For Organizations" onClick={closeMobileMenu} />
                )}
                {flags.enableNewMarketing && (
                  <NavLink to="/use-cases" label="Use Cases" onClick={closeMobileMenu} />
                )}
                {flags.enableNewMarketing && (
                  <NavLink to="/pricing" label="Pricing" onClick={closeMobileMenu} />
                )}
                {flags.enableNewMarketing && (
                  <NavLink to="/about" label="About" onClick={closeMobileMenu} />
                )}
                
                <hr className="my-2 border-border" />
                
                {!user && !loading ? (
                  <>
                    <Button asChild variant="ghost" onClick={closeMobileMenu}>
                      <Link to="/signin">Sign in</Link>
                    </Button>
                    <Button asChild onClick={closeMobileMenu}>
                      <Link to="/signup">Get started</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {flags.enableMemberShell && (
                      <Button asChild variant="ghost" onClick={closeMobileMenu}>
                        <Link to="/app">Open Member App</Link>
                      </Button>
                    )}
                    {flags.enableAdminShell && isAdmin && (
                      <Button asChild variant="ghost" onClick={closeMobileMenu}>
                        <Link to="/admin2/overview">Open Admin</Link>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}