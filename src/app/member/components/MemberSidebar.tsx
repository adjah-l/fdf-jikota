import { Home, Users, Heart, MessageSquare, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string, end: boolean) => {
    if (end) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string, end: boolean) => {
    const active = isActive(path, end);
    return active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className={getNavCls(item.url, item.end)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
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