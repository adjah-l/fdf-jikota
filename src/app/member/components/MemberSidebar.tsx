import { Home, Users, Heart, MessageSquare, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const memberNavItems = [
  { title: "Home", url: "/app", icon: Home, end: true },
  { title: "My Group", url: "/app/group", icon: Users, end: false },
  { title: "My Care", url: "/app/care", icon: Heart, end: false },
  { title: "Messages", url: "/app/messages", icon: MessageSquare, end: false },
  { title: "Profile", url: "/app/profile", icon: User, end: false },
];

export const MemberSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-sidebar-border shadow-soft">
        <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-2">
            <div className="font-space text-lg font-bold text-sidebar-primary">mbio</div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xs text-sidebar-foreground/70 font-medium">Powered by</span>
                <span className="text-xs text-sidebar-foreground/70">Family Dinner Foundation</span>
              </div>
            )}
          </div>
        </div>
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {memberNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary/10 to-secondary/5 text-sidebar-primary border border-primary/20 shadow-sm' 
                            : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};