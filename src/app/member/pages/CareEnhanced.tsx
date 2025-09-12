import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Star,
  Gift,
  Zap,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Target,
  Award,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CareEnhanced = () => {
  const { toast } = useToast();
  const [newRequest, setNewRequest] = useState({
    title: "",
    category: "",
    description: "",
    urgency: "normal",
    credits: 1
  });

  const [newOffer, setNewOffer] = useState({
    title: "",
    category: "",
    description: "",
    credits: 1
  });

  // Enhanced mock data with more engaging content
  const careData = {
    credits: 15,
    creditsEarnedThisMonth: 8,
    creditsSpentThisMonth: 5,
    helpfulnessRating: 4.8,
    totalHelpGiven: 23,
    totalHelpReceived: 12,
    streakDays: 7,
    achievements: [
      { name: "Helper of the Month", icon: Star, earned: true },
      { name: "Community Builder", icon: Users, earned: true },
      { name: "Crisis Support", icon: Heart, earned: false }
    ],
    suggestions: [
      {
        id: 1,
        type: "offer",
        title: "Dog walking",
        reason: "You marked 'Pets' as an interest",
        credits: 2,
        demandLevel: "high"
      },
      {
        id: 2,
        type: "request",
        title: "Grocery pickup",
        reason: "Popular in your area",
        credits: 1,
        demandLevel: "medium"
      }
    ],
    activeRequests: [
      {
        id: 1,
        title: "Help moving furniture",
        category: "Moving",
        description: "Need help moving a couch and dining table to second floor",
        urgency: "normal",
        credits: 3,
        status: "open",
        createdAt: "2 hours ago",
        author: "You",
        responses: 2,
        estimatedTime: "2-3 hours"
      }
    ],
    activeOffers: [
      {
        id: 1,
        title: "Dog walking services",
        category: "Pets",
        description: "Available for dog walking in the evenings and weekends",
        credits: 1,
        status: "active",
        createdAt: "3 days ago",
        author: "You",
        requests: 3,
        rating: 4.9
      }
    ],
    communityRequests: [
      {
        id: 3,
        title: "Babysitting for date night",
        category: "Childcare",
        description: "Looking for someone to watch 2 kids (ages 5 and 8) for 3-4 hours this Friday evening",
        urgency: "normal",
        credits: 4,
        status: "open",
        createdAt: "30 minutes ago",
        author: { name: "Sarah Johnson", avatar: "", initials: "SJ", rating: 4.9 },
        location: "Downtown",
        estimatedTime: "3-4 hours",
        deadline: "Friday 6:00 PM",
        responses: 1
      },
      {
        id: 4,
        title: "Grocery pickup urgently needed",
        category: "Errands",
        description: "Child is sick and I can't leave the house. Need grocery pickup from nearby store",
        urgency: "high",
        credits: 3,
        status: "open",
        createdAt: "45 minutes ago",
        author: { name: "Emma Davis", avatar: "", initials: "ED", rating: 4.7 },
        location: "Midtown",
        estimatedTime: "1 hour",
        deadline: "Today 5:00 PM",
        responses: 0
      },
      {
        id: 5,
        title: "Tech help: Setting up smart TV",
        category: "Technology",
        description: "Need help setting up a new smart TV and connecting streaming services",
        urgency: "low",
        credits: 2,
        status: "open",
        createdAt: "3 hours ago",
        author: { name: "Robert Wilson", avatar: "", initials: "RW", rating: 5.0 },
        location: "Uptown",
        estimatedTime: "1-2 hours",
        deadline: "This weekend",
        responses: 2
      }
    ],
    recentActivity: [
      { 
        id: 1, 
        type: "completed", 
        message: "You helped Maria with grocery shopping", 
        credits: 2, 
        time: "1 hour ago",
        rating: 5
      },
      { 
        id: 2, 
        type: "received", 
        message: "John offered help with your moving request", 
        credits: 3, 
        time: "3 hours ago"
      },
      { 
        id: 3, 
        type: "earned", 
        message: "Received thanks from the Thompson family", 
        credits: 1, 
        time: "1 day ago",
        rating: 5
      }
    ]
  };

  const categories = [
    { name: "Childcare", icon: Users, demand: "high" },
    { name: "Transportation", icon: MapPin, demand: "medium" },
    { name: "Errands", icon: Target, demand: "high" },
    { name: "Moving", icon: Activity, demand: "low" },
    { name: "Pets", icon: Heart, demand: "medium" },
    { name: "Meals", icon: Gift, demand: "high" },
    { name: "Technology", icon: Zap, demand: "medium" }
  ];

  const handleCreateRequest = () => {
    toast({
      title: "Request created successfully!",
      description: "Your community will be notified about your request.",
    });
    setNewRequest({ title: "", category: "", description: "", urgency: "normal", credits: 1 });
  };

  const handleCreateOffer = () => {
    toast({
      title: "Offer created successfully!",
      description: "Community members can now request your help.",
    });
    setNewOffer({ title: "", category: "", description: "", credits: 1 });
  };

  const handleOfferHelp = (requestId: number) => {
    toast({
      title: "Help offer sent!",
      description: "The requester will be notified of your offer.",
    });
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive" className="text-xs animate-pulse">
          <AlertCircle className="w-3 h-3 mr-1" />
          Urgent
        </Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-subtle rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Care Network</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Give and receive support within your community. Together, we're stronger.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{careData.credits}</div>
                <div className="text-sm text-muted-foreground">Care Credits</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{careData.helpfulnessRating}</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{careData.streakDays}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Request Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Care Request</DialogTitle>
                  <DialogDescription>
                    Ask your community for help with something you need.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="request-title">What do you need help with?</Label>
                    <Input
                      id="request-title"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                      placeholder="e.g., Need help moving furniture"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newRequest.category} onValueChange={(value) => setNewRequest({...newRequest, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                              <div className="flex items-center gap-2">
                                <cat.icon className="w-4 h-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Credits Offered</Label>
                      <Select value={newRequest.credits.toString()} onValueChange={(value) => setNewRequest({...newRequest, credits: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Credit</SelectItem>
                          <SelectItem value="2">2 Credits</SelectItem>
                          <SelectItem value="3">3 Credits</SelectItem>
                          <SelectItem value="4">4 Credits</SelectItem>
                          <SelectItem value="5">5 Credits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-description">Description</Label>
                    <Textarea
                      id="request-description"
                      value={newRequest.description}
                      onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                      placeholder="Provide more details about what you need..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateRequest} className="w-full">
                    Create Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Offer Help
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Service Offer</DialogTitle>
                  <DialogDescription>
                    Offer a service to help your community members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer-title">What service are you offering?</Label>
                    <Input
                      id="offer-title"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                      placeholder="e.g., Dog walking services"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                              <div className="flex items-center gap-2">
                                <cat.icon className="w-4 h-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Credits per Request</Label>
                      <Select value={newOffer.credits.toString()} onValueChange={(value) => setNewOffer({...newOffer, credits: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Credit</SelectItem>
                          <SelectItem value="2">2 Credits</SelectItem>
                          <SelectItem value="3">3 Credits</SelectItem>
                          <SelectItem value="4">4 Credits</SelectItem>
                          <SelectItem value="5">5 Credits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-description">Description</Label>
                    <Textarea
                      id="offer-description"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                      placeholder="Describe what you're offering to help with..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateOffer} className="w-full">
                    Create Offer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{careData.creditsEarnedThisMonth}</div>
                <div className="text-xs text-muted-foreground">Earned this month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{careData.totalHelpGiven}</div>
                <div className="text-xs text-muted-foreground">Times helped others</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{careData.helpfulnessRating}</div>
                <div className="text-xs text-muted-foreground">Helpfulness rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{careData.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Suggested for You
          </CardTitle>
          <CardDescription>
            Based on your interests and community needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {careData.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                  </div>
                  <Badge variant="outline" className={getDemandColor(suggestion.demandLevel)}>
                    {suggestion.demandLevel} demand
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4" />
                    {suggestion.credits} credits
                  </div>
                  <Button size="sm" variant="outline">
                    {suggestion.type === 'offer' ? 'Create Offer' : 'Create Request'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="community" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">Community Needs</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="community" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Community Requests</h2>
              <p className="text-muted-foreground">Help your neighbors and earn care credits</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{careData.communityRequests.length} active requests</Badge>
            </div>
          </div>

          <div className="grid gap-4">
            {careData.communityRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge variant="outline">{request.category}</Badge>
                        {getUrgencyBadge(request.urgency)}
                      </div>
                      <p className="text-muted-foreground mb-3">{request.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs">{request.author.initials}</AvatarFallback>
                          </Avatar>
                          <span>{request.author.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{request.author.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.estimatedTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-primary font-medium">
                          <DollarSign className="w-4 h-4" />
                          {request.credits} credits
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {request.deadline}
                        </div>
                        {request.responses > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            {request.responses} offers
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleOfferHelp(request.id)}
                        className="min-w-[100px]"
                      >
                        Offer Help
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Requests</h2>
              <p className="text-muted-foreground">Track your requests for help</p>
            </div>
          </div>

          <div className="grid gap-4">
            {careData.activeRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge variant="default">{request.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {request.credits} credits
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <ThumbsUp className="w-4 h-4" />
                          {request.responses} offers to help
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Offers</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Offers</h2>
              <p className="text-muted-foreground">Services you're offering to the community</p>
            </div>
          </div>

          <div className="grid gap-4">
            {careData.activeOffers.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{offer.title}</h3>
                        <Badge variant="secondary">{offer.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{offer.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {offer.credits} credits per request
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {offer.rating} rating
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Users className="w-4 h-4" />
                          {offer.requests} requests
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Requests</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {careData.recentActivity.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'completed' ? 'bg-green-500' :
                          activity.type === 'received' ? 'bg-blue-500' : 'bg-purple-500'
                        }`} />
                        <div>
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{activity.rating}</span>
                          </div>
                        )}
                        <Badge variant="outline">
                          {activity.credits > 0 ? '+' : ''}{activity.credits} credits
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareEnhanced;