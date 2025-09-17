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
  const collapsed = state === "collapsed";

  const renderNavSection = (items: typeof adminNavItems, label: string) => (
    <SidebarGroup className="px-3 py-2">
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider mb-2">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
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
  );

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
        {renderNavSection(adminNavItems, "Management")}
        {renderNavSection(matchingNavItems, "Matching")}
        {renderNavSection(engagementNavItems, "Engagement")}
        {renderNavSection(settingsNavItems, "System")}
      </SidebarContent>
    </Sidebar>
  );
};