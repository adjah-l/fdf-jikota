import { NavLink, useLocation } from 'react-router-dom'
import { useOrganizations } from '@/hooks/useOrganizations'
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
} from '@/components/ui/sidebar'
import {
  Home,
  Users,
  MapPin,
  Settings,
  Heart,
  MessageSquare,
  BarChart3,
  Upload,
  Zap,
  Shield,
} from 'lucide-react'

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Groups', url: '/groups', icon: Users },
  { title: 'Neighborhoods', url: '/neighborhoods', icon: MapPin },
  { title: 'Mutual Care', url: '/care', icon: Heart },
]

const adminNavItems = [
  { title: 'Admin Dashboard', url: '/admin', icon: Shield },
  { title: 'Matching Engine', url: '/admin/matching', icon: Zap },
  { title: 'External Data', url: '/admin/data', icon: Upload },
  { title: 'Messaging', url: '/admin/messaging', icon: MessageSquare },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
]

const settingsNavItems = [
  { title: 'Profile', url: '/profile', icon: Settings },
]

export const AppSidebar = () => {
  const { state } = useSidebar()
  const location = useLocation()
  const { currentOrg, hasRole } = useOrganizations()
  const collapsed = state === 'collapsed'
  
  const currentPath = location.pathname
  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50'

  const isAdminSection = adminNavItems.some(item => isActive(item.url))
  const isMainSection = mainNavItems.some(item => isActive(item.url))
  const isSettingsSection = settingsNavItems.some(item => isActive(item.url))

  const showAdminSection = currentOrg && hasRole(currentOrg.id, 'admin')

  return (
    <Sidebar
      className={collapsed ? 'w-14' : 'w-64'}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-sidebar-border shadow-soft">
        {/* Main Navigation */}
        <SidebarGroup className="px-3 py-3">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider">
            {!collapsed && 'Main'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <NavLink to={item.url} end className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/5 text-sidebar-primary border border-primary/20 shadow-sm' 
                          : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
                      }`
                    }>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {showAdminSection && (
          <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider">
              {!collapsed && 'Administration'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className="group w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                    >
                      <NavLink to={item.url} className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary/10 to-secondary/5 text-sidebar-primary border border-primary/20 shadow-sm' 
                            : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
                        }`
                      }>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings Navigation */}
        <SidebarGroup className="px-3 py-2">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider">
            {!collapsed && 'Settings'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                  >
                    <NavLink to={item.url} className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/5 text-sidebar-primary border border-primary/20 shadow-sm' 
                          : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
                      }`
                    }>
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
  )
}