import { useState } from 'react'
import { useMutualCare } from '@/hooks/useMutualCare'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Plus, Clock, CheckCircle, AlertTriangle, Filter, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createServiceOfferSchema, createServiceRequestSchema } from '@/lib/schemas'
import type { CreateServiceOfferInput, CreateServiceRequestInput } from '@/lib/schemas'

const categoryOptions = [
  { value: 'transportation', label: 'Transportation' },
  { value: 'childcare', label: 'Childcare' },
  { value: 'meals', label: 'Meals' },
  { value: 'errands', label: 'Errands' },
  { value: 'home_help', label: 'Home Help' },
  { value: 'tech_support', label: 'Tech Support' },
  { value: 'emotional_support', label: 'Emotional Support' },
  { value: 'professional_skills', label: 'Professional Skills' },
  { value: 'other', label: 'Other' },
]

const urgencyOptions = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
]

export const CommunityCarePage = () => {
  const { user } = useAuth()
  const {
    serviceOffers,
    serviceRequests,
    userCredits,
    loading,
    createServiceOffer,
    createServiceRequest,
    fulfillServiceRequest,
  } = useMutualCare()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [offerDialogOpen, setOfferDialogOpen] = useState(false)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  const offerForm = useForm<CreateServiceOfferInput>({
    resolver: zodResolver(createServiceOfferSchema),
    defaultValues: {
      credits_per_request: 1,
    },
  })

  const requestForm = useForm<CreateServiceRequestInput>({
    resolver: zodResolver(createServiceRequestSchema),
    defaultValues: {
      urgency: 'normal',
      credits_offered: 1,
    },
  })

  const onCreateOffer = async (data: CreateServiceOfferInput) => {
    const success = await createServiceOffer(data)
    if (success) {
      setOfferDialogOpen(false)
      offerForm.reset()
    }
  }

  const onCreateRequest = async (data: CreateServiceRequestInput) => {
    const success = await createServiceRequest(data)
    if (success) {
      setRequestDialogOpen(false)
      requestForm.reset()
    }
  }

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    return matchesSearch && matchesCategory && request.status === 'open'
  })

  const filteredOffers = serviceOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || offer.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Community Care
          </h1>
          <p className="text-muted-foreground mt-2">
            Help each other thrive through mutual support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {userCredits} Credits Available
          </Badge>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">How Community Care Works</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">🔄 Credit System</h3>
            <p className="text-muted-foreground">
              Use credits to request help or earn them by helping others. Everyone starts with credits to get the community going.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">🤝 Mutual Support</h3>
            <p className="text-muted-foreground">
              Help your neighbors with rides, meals, errands, childcare, and more. Building stronger communities together.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">💫 Credit Replenishment</h3>
            <p className="text-muted-foreground">
              Credits are automatically replenished monthly, and you earn additional credits by completing help requests from others.
            </p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request Help
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Community Help</DialogTitle>
                <DialogDescription>
                  Ask your community for help with something you need.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={requestForm.handleSubmit(onCreateRequest)} className="space-y-4">
                <div>
                  <Label htmlFor="request-category">Category</Label>
                  <Select onValueChange={(value) => requestForm.setValue('category', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="request-title">What do you need help with?</Label>
                  <Input
                    id="request-title"
                    placeholder="e.g., Need a ride to the airport"
                    {...requestForm.register('title')}
                  />
                </div>
                <div>
                  <Label htmlFor="request-description">Description</Label>
                  <Textarea
                    id="request-description"
                    placeholder="Provide more details about your request..."
                    {...requestForm.register('description')}
                  />
                </div>
                <div>
                  <Label htmlFor="request-urgency">Urgency</Label>
                  <Select onValueChange={(value) => requestForm.setValue('urgency', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Normal" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="request-credits">Credits to Offer</Label>
                  <Input
                    id="request-credits"
                    type="number"
                    min="1"
                    max={userCredits}
                    {...requestForm.register('credits_offered', { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You have {userCredits} credits available
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Request'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Offer Help
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Offer Community Help</DialogTitle>
                <DialogDescription>
                  Share what you can help others with.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={offerForm.handleSubmit(onCreateOffer)} className="space-y-4">
                <div>
                  <Label htmlFor="offer-category">Category</Label>
                  <Select onValueChange={(value) => offerForm.setValue('category', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offer-title">What can you help with?</Label>
                  <Input
                    id="offer-title"
                    placeholder="e.g., Airport rides available"
                    {...offerForm.register('title')}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-description">Description</Label>
                  <Textarea
                    id="offer-description"
                    placeholder="Describe what you can help with..."
                    {...offerForm.register('description')}
                  />
                </div>
                <div>
                  <Label htmlFor="offer-credits">Credits per Request</Label>
                  <Input
                    id="offer-credits"
                    type="number"
                    min="1"
                    max="10"
                    {...offerForm.register('credits_per_request', { valueAsNumber: true })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Offer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests and offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Help Requests ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Available Help ({filteredOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {filteredRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request: any) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.requester?.avatar_url} />
                          <AvatarFallback>
                            {request.requester?.full_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            by {request.requester?.full_name || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="outline" 
                          className={urgencyOptions.find(u => u.value === request.urgency)?.color}
                        >
                          {urgencyOptions.find(u => u.value === request.urgency)?.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {request.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {categoryOptions.find(c => c.value === request.category)?.label}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700">
                          {request.credits_offered} credits
                        </Badge>
                      </div>
                      {request.requester_id !== user?.id && (
                        <Button 
                          size="sm"
                          onClick={() => fulfillServiceRequest(request.id)}
                          disabled={loading}
                        >
                          Help
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No help requests found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filters' 
                  : 'Be the first to ask for help from your community'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {filteredOffers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffers.map((offer: any) => (
                <Card key={offer.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={offer.profiles?.avatar_url} />
                        <AvatarFallback>
                          {offer.profiles?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          by {offer.profiles?.full_name || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {categoryOptions.find(c => c.value === offer.category)?.label}
                        </Badge>
                        <Badge variant="outline">
                          {offer.credits_per_request} credits
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No help offers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter 
                  ? 'Try adjusting your search or filters' 
                  : 'Be the first to offer help to your community'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}