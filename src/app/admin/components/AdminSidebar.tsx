import { 
  BarChart3, 
  Settings, 
  Users, 
  FileSpreadsheet, 
  UserCheck, 
  Zap, 
  Heart, 
  MessageSquare, 
  Target,
  CheckSquare,
  Shuffle
} from "lucide-react";
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

const adminNavItems = [
  { title: "Overview", url: "/admin2", icon: BarChart3, end: true },
  { title: "Members", url: "/admin2/members", icon: Users, end: false },
  { title: "Groups", url: "/admin2/groups", icon: UserCheck, end: false },
  { title: "Import", url: "/admin2/import", icon: FileSpreadsheet, end: false },
];

const matchingNavItems = [
  { title: "Policies", url: "/admin2/matching-policies", icon: Target, end: false },
  { title: "Preview", url: "/admin2/matching-preview", icon: Shuffle, end: false },
  { title: "Approvals", url: "/admin2/matching-approvals", icon: CheckSquare, end: false },
];

const engagementNavItems = [
  { title: "Care", url: "/admin2/care", icon: Heart, end: false },
  { title: "Templates", url: "/admin2/messaging-templates", icon: MessageSquare, end: false },
  { title: "Campaigns", url: "/admin2/messaging-campaigns", icon: Zap, end: false },
];

const settingsNavItems = [
  { title: "Settings", url: "/admin2/settings", icon: Settings, end: false },
];

export const AdminSidebar = () => {
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

  const renderNavSection = (items: typeof adminNavItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground font-medium">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
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
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent className="bg-background/95 backdrop-blur-md border-r shadow-soft">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="font-space text-lg font-bold text-primary">mbio</div>
            {!collapsed && <span className="text-xs text-muted-foreground">Admin Panel</span>}
          </div>
        </div>
        {renderNavSection(adminNavItems, "Management")}
        {renderNavSection(matchingNavItems, "Matching")}
        {renderNavSection(engagementNavItems, "Engagement")}
        {renderNavSection(settingsNavItems, "System")}
      </SidebarContent>
    </Sidebar>
  );
};