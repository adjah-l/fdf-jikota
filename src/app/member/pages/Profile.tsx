import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Heart, Settings, Shield, Camera, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { flags } from "@/config/flags";

const MemberProfile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    bio: "New to the neighborhood and excited to meet new people!",
    
    // Location
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    neighborhood: "Downtown",
    
    // Preferences
    ageGroup: "30-39",
    familyStage: "single",
    seasonalInterest: "winter",
    groupInterest: "mixed",
    availableEvening: ["tuesday", "thursday", "weekend"],
    dietaryRestrictions: ["vegetarian"],
    interests: ["cooking", "books", "hiking"],
    
    // Service Offers
    waysToServe: ["technology", "transportation", "errands"],
    
    // Verification
    verificationStatus: "pending",
    churchAffiliation: "",
    workEmail: "",
  });

  const handleSave = (section: string) => {
    // TODO: Implement API call
    toast({
      title: "Profile updated",
      description: `Your ${section} information has been saved.`,
    });
  };

  const handleVerificationSubmit = () => {
    // TODO: Implement verification logic
    toast({
      title: "Verification submitted",
      description: "We'll review your information and update your status.",
    });
  };

  const availabilityOptions = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "weekend", label: "Weekends" }
  ];

  const interestOptions = [
    "cooking", "books", "hiking", "movies", "music", "sports", "travel", 
    "gardening", "photography", "crafts", "technology", "volunteering"
  ];

  const serviceOptions = [
    { id: "childcare", label: "Childcare" },
    { id: "transportation", label: "Transportation" },
    { id: "errands", label: "Errands & Shopping" },
    { id: "technology", label: "Technology Help" },
    { id: "moving", label: "Moving & Lifting" },
    { id: "meals", label: "Meals & Cooking" },
    { id: "pets", label: "Pet Care" },
    { id: "maintenance", label: "Home Maintenance" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="text-lg">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <Badge variant={profileData.verificationStatus === 'verified' ? 'default' : 'secondary'}>
              {profileData.verificationStatus === 'verified' ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{profileData.neighborhood}, {profileData.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{profileData.ageGroup}</span>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">{profileData.bio}</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell your community a bit about yourself..."
                  rows={3}
                />
              </div>
              <Button onClick={() => handleSave('basic')}>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Help us match you with nearby community members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Street address"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={profileData.postalCode}
                    onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={profileData.neighborhood}
                  onChange={(e) => setProfileData({...profileData, neighborhood: e.target.value})}
                />
              </div>
              <Button onClick={() => handleSave('location')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matching Preferences</CardTitle>
              <CardDescription>Help us create the best group matches for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <Select value={profileData.ageGroup} onValueChange={(value) => setProfileData({...profileData, ageGroup: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-29">18-29</SelectItem>
                      <SelectItem value="30-39">30-39</SelectItem>
                      <SelectItem value="40-49">40-49</SelectItem>
                      <SelectItem value="50-59">50-59</SelectItem>
                      <SelectItem value="60+">60+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Family Stage</Label>
                  <Select value={profileData.familyStage} onValueChange={(value) => setProfileData({...profileData, familyStage: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="young-family">Young Family</SelectItem>
                      <SelectItem value="growing-family">Growing Family</SelectItem>
                      <SelectItem value="empty-nest">Empty Nest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Available Evenings</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availabilityOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={profileData.availableEvening.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProfileData({
                              ...profileData,
                              availableEvening: [...profileData.availableEvening, option.id]
                            });
                          } else {
                            setProfileData({
                              ...profileData,
                              availableEvening: profileData.availableEvening.filter(day => day !== option.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={profileData.interests.includes(interest)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProfileData({
                              ...profileData,
                              interests: [...profileData.interests, interest]
                            });
                          } else {
                            setProfileData({
                              ...profileData,
                              interests: profileData.interests.filter(i => i !== interest)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={interest} className="text-sm capitalize">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => handleSave('preferences')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Ways I Can Serve
              </CardTitle>
              <CardDescription>
                Select the ways you'd like to help your community members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={profileData.waysToServe.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProfileData({
                            ...profileData,
                            waysToServe: [...profileData.waysToServe, service.id]
                          });
                        } else {
                          setProfileData({
                            ...profileData,
                            waysToServe: profileData.waysToServe.filter(s => s !== service.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={service.id}>{service.label}</Label>
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSave('services')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          {flags.enableVerification ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Trust Verification
                  </CardTitle>
                  <CardDescription>
                    Help build trust in the community by verifying your identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">Verification Status</div>
                      <div className="text-sm text-muted-foreground">
                        {profileData.verificationStatus === 'verified' 
                          ? 'Your profile has been verified' 
                          : 'Verification pending review'
                        }
                      </div>
                    </div>
                    <Badge variant={profileData.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                      {profileData.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="churchAffiliation">Church Affiliation (Optional)</Label>
                      <Input
                        id="churchAffiliation"
                        value={profileData.churchAffiliation}
                        onChange={(e) => setProfileData({...profileData, churchAffiliation: e.target.value})}
                        placeholder="Your church or faith community"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workEmail">Work Email (Optional)</Label>
                      <Input
                        id="workEmail"
                        type="email"
                        value={profileData.workEmail}
                        onChange={(e) => setProfileData({...profileData, workEmail: e.target.value})}
                        placeholder="Your workplace email for verification"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Why verify?</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Build trust with community members</li>
                      <li>• Get better group matches</li>
                      <li>• Access to additional features</li>
                      <li>• Priority in group formation</li>
                    </ul>
                  </div>

                  <Button onClick={handleVerificationSubmit}>
                    Submit for Verification
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Verification Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Trust verification features are currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberProfile;