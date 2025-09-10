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
      <SidebarContent className="pt-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {showAdminSection && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
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
  )
}