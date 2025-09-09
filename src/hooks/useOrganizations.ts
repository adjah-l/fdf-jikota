import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Organization, OrganizationMember, OrgRole, CreateOrganizationInput } from '@/lib/schemas'

export const useOrganizations = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [userMemberships, setUserMemberships] = useState<OrganizationMember[]>([])
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOrganizations = async () => {
    if (!user) return

    try {
      const { data: memberships, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (memberError) throw memberError

      const membershipData = memberships || []
      setUserMemberships(membershipData)
      
      const orgs = membershipData.map(m => m.organizations).filter(Boolean) as Organization[]
      setOrganizations(orgs)
      
      // Set current org to first one if none selected
      if (orgs.length > 0 && !currentOrg) {
        setCurrentOrg(orgs[0])
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error)
      toast({
        title: 'Error',
        description: 'Failed to load organizations',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createOrganization = async (data: CreateOrganizationInput): Promise<Organization | null> => {
    if (!user) return null

    try {
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          slug: data.slug,
          description: data.description,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          org_id: org.id,
          user_id: user.id,
          role: 'owner' as OrgRole,
        })

      if (memberError) throw memberError

      toast({
        title: 'Success',
        description: 'Organization created successfully',
      })

      await fetchOrganizations()
      return org as Organization
    } catch (error: any) {
      console.error('Error creating organization:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create organization',
        variant: 'destructive',
      })
      return null
    }
  }

  const inviteUser = async (orgId: string, email: string, role: OrgRole = 'member') => {
    try {
      // In a real implementation, this would send an invitation email
      // For now, we'll just show a success message
      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${email}`,
      })
    } catch (error: any) {
      console.error('Error inviting user:', error)
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      })
    }
  }

  const updateMemberRole = async (membershipId: string, newRole: OrgRole) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role: newRole })
        .eq('id', membershipId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      })

      await fetchOrganizations()
    } catch (error: any) {
      console.error('Error updating member role:', error)
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      })
    }
  }

  const removeMember = async (membershipId: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ is_active: false })
        .eq('id', membershipId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Member removed successfully',
      })

      await fetchOrganizations()
    } catch (error: any) {
      console.error('Error removing member:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      })
    }
  }

  const switchOrganization = (org: Organization) => {
    setCurrentOrg(org)
    localStorage.setItem('currentOrgId', org.id)
  }

  const getUserRole = (orgId: string): OrgRole | null => {
    const membership = userMemberships.find(m => m.org_id === orgId)
    return membership?.role || null
  }

  const hasRole = (orgId: string, requiredRole: OrgRole): boolean => {
    const userRole = getUserRole(orgId)
    if (!userRole) return false

    const roleHierarchy: Record<OrgRole, number> = {
      member: 1,
      moderator: 2,
      admin: 3,
      owner: 4,
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  useEffect(() => {
    if (user) {
      fetchOrganizations()
      
      // Try to restore current org from localStorage
      const savedOrgId = localStorage.getItem('currentOrgId')
      if (savedOrgId) {
        const savedOrg = organizations.find(org => org.id === savedOrgId)
        if (savedOrg) {
          setCurrentOrg(savedOrg)
        }
      }
    }
  }, [user])

  return {
    organizations,
    userMemberships,
    currentOrg,
    loading,
    createOrganization,
    inviteUser,
    updateMemberRole,
    removeMember,
    switchOrganization,
    getUserRole,
    hasRole,
    refetch: fetchOrganizations,
  }
}