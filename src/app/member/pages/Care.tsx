import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Plus, Clock, MapPin, User, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { flags } from "@/config/flags";

const MemberCare = () => {
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

  // TODO: Replace with real data from API
  const careData = {
    credits: 12,
    requests: [
      {
        id: 1,
        title: "Help moving furniture",
        category: "Moving",
        description: "Need help moving a couch and dining table to second floor",
        urgency: "normal",
        credits: 3,
        status: "open",
        createdAt: "2 hours ago",
        author: "You"
      },
      {
        id: 2,
        title: "Ride to airport",
        category: "Transportation",
        description: "Need a ride to the airport early morning on Dec 15th",
        urgency: "high",
        credits: 2,
        status: "fulfilled",
        createdAt: "1 day ago",
        author: "You",
        fulfilledBy: "Mike Chen"
      }
    ],
    offers: [
      {
        id: 1,
        title: "Dog walking services",
        category: "Pets",
        description: "Available for dog walking in the evenings and weekends",
        credits: 1,
        status: "active",
        createdAt: "3 days ago",
        author: "You"
      }
    ],
    communityRequests: [
      {
        id: 3,
        title: "Babysitting for date night",
        category: "Childcare",
        description: "Looking for someone to watch 2 kids (ages 5 and 8) for 3-4 hours",
        urgency: "normal",
        credits: 4,
        status: "open",
        createdAt: "30 minutes ago",
        author: "Sarah Johnson",
        location: "Downtown"
      },
      {
        id: 4,
        title: "Grocery pickup",
        category: "Errands",
        description: "Can't make it to the store today, would appreciate grocery pickup",
        urgency: "high",
        credits: 2,
        status: "open",
        createdAt: "1 hour ago",
        author: "Emma Davis",
        location: "Midtown"
      }
    ],
    transactions: [
      { id: 1, type: "earned", amount: 3, description: "Helped Mike with moving", date: "Dec 10" },
      { id: 2, type: "spent", amount: 2, description: "Grocery pickup by Sarah", date: "Dec 8" },
      { id: 3, type: "earned", amount: 1, description: "Dog walking for Emma", date: "Dec 5" },
      { id: 4, type: "bonus", amount: 5, description: "New member welcome bonus", date: "Dec 1" }
    ]
  };

  const categories = [
    "Childcare", "Transportation", "Errands", "Moving", "Pets", "Meals", "Technology", "Other"
  ];

  const handleCreateRequest = () => {
    // TODO: Implement API call
    console.log("Creating request:", newRequest);
    setNewRequest({ title: "", category: "", description: "", urgency: "normal", credits: 1 });
  };

  const handleCreateOffer = () => {
    // TODO: Implement API call
    console.log("Creating offer:", newOffer);
    setNewOffer({ title: "", category: "", description: "", credits: 1 });
  };

  const handleHelpWith = (requestId: number) => {
    // TODO: Implement help offer
    console.log("Offering help with request:", requestId);
  };

  if (!flags.enableCareLedger) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Care Network Coming Soon</h3>
          <p className="text-muted-foreground">
            The mutual care feature is currently in development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Care</h1>
          <p className="text-muted-foreground">
            Give and receive support within your community
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{careData.credits}</div>
            <div className="text-sm text-muted-foreground">Care Credits</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold">Care Requests</h2>
              <p className="text-muted-foreground">Your requests for help from the community</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Care Request</DialogTitle>
                  <DialogDescription>
                    Ask your community for help with something you need.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="request-title">Title</Label>
                    <Input
                      id="request-title"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                      placeholder="What do you need help with?"
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
                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
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
          </div>

          <div className="grid gap-4">
            {careData.requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                        {request.urgency === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{request.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {request.credits} credits
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.createdAt}
                        </div>
                        {request.fulfilledBy && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Helped by {request.fulfilledBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Requests */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community Requests</h3>
            <div className="grid gap-4">
              {careData.communityRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{request.title}</h3>
                          <Badge variant="outline">{request.category}</Badge>
                          {request.urgency === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {request.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {request.credits} credits
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {request.createdAt}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleHelpWith(request.id)}>
                        Offer Help
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-semibold">My Offers</h2>
              <p className="text-muted-foreground">Services you're offering to the community</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Offer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Service Offer</DialogTitle>
                  <DialogDescription>
                    Offer a service to help your community members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="offer-title">Title</Label>
                    <Input
                      id="offer-title"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                      placeholder="What service are you offering?"
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
                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
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

          <div className="grid gap-4">
            {careData.offers.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{offer.title}</h3>
                        <Badge variant="outline">{offer.category}</Badge>
                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                          {offer.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{offer.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {offer.credits} credits per request
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Created {offer.createdAt}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Credit Balance
                </CardTitle>
                <CardDescription>Your current care credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">{careData.credits}</div>
                <p className="text-muted-foreground mb-4">Available to spend on care requests</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Total Earned</div>
                    <div className="text-muted-foreground">15 credits</div>
                  </div>
                  <div>
                    <div className="font-medium">Total Spent</div>
                    <div className="text-muted-foreground">8 credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How Credits Work</CardTitle>
                <CardDescription>Understanding the care credit system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-sm">Earn Credits</div>
                    <div className="text-xs text-muted-foreground">Help others and earn credits</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-sm">Spend Credits</div>
                    <div className="text-xs text-muted-foreground">Use credits to request help</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-sm">Welcome Bonus</div>
                    <div className="text-xs text-muted-foreground">New members get 5 free credits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your credit earning and spending history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careData.transactions.map((transaction) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.type === 'earned' ? 'bg-green-500' :
                          transaction.type === 'spent' ? 'bg-red-500' : 'bg-purple-500'
                        }`} />
                        <div>
                          <div className="font-medium text-sm">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        transaction.type === 'earned' || transaction.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earned' || transaction.type === 'bonus' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberCare;