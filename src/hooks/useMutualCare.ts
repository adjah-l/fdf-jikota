import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useOrganizations } from '@/hooks/useOrganizations'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { 
  ServiceOffer, 
  ServiceRequest, 
  Transaction,
  CreateServiceOfferInput,
  CreateServiceRequestInput 
} from '@/lib/schemas'

export const useMutualCare = () => {
  const { user } = useAuth()
  const { currentOrg } = useOrganizations()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [serviceOffers, setServiceOffers] = useState<any[]>([])
  const [serviceRequests, setServiceRequests] = useState<any[]>([])
  const [userCredits, setUserCredits] = useState(0)

  const fetchServiceOffers = async () => {
    if (!currentOrg) return

    try {
      const { data, error } = await supabase
        .from('service_offers')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('org_id', currentOrg.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setServiceOffers(data || [])
    } catch (error: any) {
      console.error('Error fetching service offers:', error)
    }
  }

  const fetchServiceRequests = async () => {
    if (!currentOrg) return

    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          requester:requester_id (
            full_name,
            avatar_url
          ),
          fulfiller:fulfilled_by (
            full_name,
            avatar_url
          )
        `)
        .eq('org_id', currentOrg.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setServiceRequests(data || [])
    } catch (error: any) {
      console.error('Error fetching service requests:', error)
    }
  }

  const fetchUserCredits = async () => {
    if (!user || !currentOrg) return

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('org_id', currentOrg.id)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)

      if (error) throw error

      const credits = (data || []).reduce((total, transaction: any) => {
        // If user received credits (to_user_id), add amount
        // If user spent credits (from_user_id), subtract amount
        return transaction.to_user_id === user.id 
          ? total + transaction.amount 
          : total - transaction.amount
      }, 10) // Starting credits

      setUserCredits(Math.max(0, credits))
    } catch (error: any) {
      console.error('Error fetching user credits:', error)
    }
  }

  const createServiceOffer = async (data: CreateServiceOfferInput): Promise<boolean> => {
    if (!user || !currentOrg) return false

    setLoading(true)
    try {
      const { error } = await supabase
        .from('service_offers')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          tags: data.tags || [],
          max_requests: data.max_requests,
          credits_per_request: data.credits_per_request || 1,
          org_id: currentOrg.id,
          user_id: user.id,
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Service offer created successfully',
      })

      await fetchServiceOffers()
      return true
    } catch (error: any) {
      console.error('Error creating service offer:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service offer',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const createServiceRequest = async (data: CreateServiceRequestInput): Promise<boolean> => {
    if (!user || !currentOrg) return false

    // Check if user has enough credits
    if (userCredits < data.credits_offered) {
      toast({
        title: 'Insufficient Credits',
        description: `You need ${data.credits_offered} credits but only have ${userCredits}`,
        variant: 'destructive',
      })
      return false
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          urgency: data.urgency || 'normal',
          tags: data.tags || [],
          credits_offered: data.credits_offered || 1,
          org_id: currentOrg.id,
          requester_id: user.id,
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Service request created successfully',
      })

      await fetchServiceRequests()
      return true
    } catch (error: any) {
      console.error('Error creating service request:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service request',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const fulfillServiceRequest = async (requestId: string): Promise<boolean> => {
    if (!user || !currentOrg) return false

    setLoading(true)
    try {
      const request = serviceRequests.find(r => r.id === requestId)
      if (!request) throw new Error('Request not found')

      // Update request as fulfilled
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({
          status: 'completed',
          fulfilled_by: user.id,
          fulfilled_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      // Create transaction for credit transfer
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          org_id: currentOrg.id,
          from_user_id: request.requester_id,
          to_user_id: user.id,
          amount: request.credits_offered,
          transaction_type: 'service_completion',
          reference_id: requestId,
          reference_type: 'service_request',
          description: `Completed: ${request.title}`,
        })

      if (transactionError) throw transactionError

      toast({
        title: 'Success',
        description: `You earned ${request.credits_offered} credits!`,
      })

      await Promise.all([
        fetchServiceRequests(),
        fetchUserCredits(),
      ])

      return true
    } catch (error: any) {
      console.error('Error fulfilling service request:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to fulfill service request',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const deactivateServiceOffer = async (offerId: string): Promise<boolean> => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('service_offers')
        .update({ is_active: false })
        .eq('id', offerId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Service offer deactivated',
      })

      await fetchServiceOffers()
      return true
    } catch (error: any) {
      console.error('Error deactivating service offer:', error)
      toast({
        title: 'Error',
        description: 'Failed to deactivate service offer',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const cancelServiceRequest = async (requestId: string): Promise<boolean> => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Service request cancelled',
      })

      await fetchServiceRequests()
      return true
    } catch (error: any) {
      console.error('Error cancelling service request:', error)
      toast({
        title: 'Error',
        description: 'Failed to cancel service request',
        variant: 'destructive',
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentOrg && user) {
      Promise.all([
        fetchServiceOffers(),
        fetchServiceRequests(),
        fetchUserCredits(),
      ])
    }
  }, [currentOrg, user])

  return {
    serviceOffers,
    serviceRequests,
    userCredits,
    loading,
    createServiceOffer,
    createServiceRequest,
    fulfillServiceRequest,
    deactivateServiceOffer,
    cancelServiceRequest,
    fetchServiceOffers,
    fetchServiceRequests,
    fetchUserCredits,
  }
}