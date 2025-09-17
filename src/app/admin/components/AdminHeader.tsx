import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, ToggleRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const switchToMemberView = () => {
    navigate("/app");
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur-md shadow-soft supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="font-space text-xl font-bold text-foreground">mbio</div>
              <span className="text-sm text-muted-foreground">Admin</span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Powered by Family Dinner Foundation
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={`${user?.user_metadata?.full_name || 'Admin'} profile picture`} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.email?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border shadow-lift" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-foreground">{user?.user_metadata?.full_name || "Admin"}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-muted/50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={switchToMemberView} className="hover:bg-muted/50">
                <ToggleRight className="mr-2 h-4 w-4" />
                <span>Switch to Member</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="hover:bg-muted/50 text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};