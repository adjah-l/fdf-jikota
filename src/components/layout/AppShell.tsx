import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganizations } from '@/hooks/useOrganizations'
import { useMutualCare } from '@/hooks/useMutualCare'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { 
  Bell, 
  ChevronDown, 
  Coins,
  Settings,
  LogOut,
  Building2,
  Plus 
} from 'lucide-react'

export const AppShell = () => {
  const { user, signOut } = useAuth()
  const { 
    organizations, 
    currentOrg, 
    switchOrganization, 
    hasRole 
  } = useOrganizations()
  const { userCredits } = useMutualCare()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) {
    return <Outlet />
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Link to="/" className="flex flex-col leading-tight">
                <span className="font-space text-xl font-bold text-foreground hover:text-primary transition-colors">mbio</span>
                <span className="text-[10px] text-muted-foreground">Powered by Family Dinner Foundation</span>
              </Link>
              {/* Organization Selector */}
              {currentOrg && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{currentOrg.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {organizations.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => switchOrganization(org)}
                        className="flex items-center justify-between"
                      >
                        <span>{org.name}</span>
                        {org.id === currentOrg.id && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/organizations/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Organization
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Credits Display */}
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{userCredits}</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  {currentOrg && hasRole(currentOrg.id, 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}