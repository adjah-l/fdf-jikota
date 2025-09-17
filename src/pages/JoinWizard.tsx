import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { 
  CheckCircle, ArrowRight, ArrowLeft, Building, Mail, 
  User, MapPin, Clock, Heart, CreditCard 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const JoinWizard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organization: searchParams.get("org") || "",
    subOrganization: searchParams.get("sub") || "",
    email: "",
    inviteCode: "",
    verificationMethod: "email",
    fullName: "",
    phone: "",
    stageOfLife: "",
    neighborhood: "",
    activityPreference: "",
    availability: [] as string[],
    interests: [] as string[],
    intro: "",
    agreeToTerms: false,
    agreeToPledge: false
  });

  useEffect(() => {
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user]);

  const organizations = {
    "stanford-university": { name: "Stanford University", logo: "🎓" },
    "lakeside-hoa-dallas": { name: "Lakeside HOA", logo: "🏘️" },
    "urban-professionals-network": { name: "Urban Professionals Network", logo: "🏢" }
  };

  const stageOfLifeOptions = [
    "High School Student",
    "College Undergraduate", 
    "Graduate Student",
    "Young Professional",
    "Established Professional",
    "Parent with Young Children",
    "Parent with Teenagers",
    "Empty Nester",
    "Retiree"
  ];

  const activityOptions = [
    "Dinner Together",
    "Prayer & Bible Study",
    "Working Out", 
    "Watch Sports & More",
    "Flexible"
  ];

  const availabilityOptions = [
    "Monday Evening",
    "Tuesday Evening", 
    "Wednesday Evening",
    "Thursday Evening",
    "Friday Evening",
    "Saturday Morning",
    "Saturday Evening",
    "Sunday Afternoon",
    "Sunday Evening"
  ];

  const interestOptions = [
    "Faith & Spirituality",
    "Fitness & Wellness",
    "Food & Cooking",
    "Sports & Recreation",
    "Arts & Culture",
    "Professional Development",
    "Parenting & Family",
    "Community Service",
    "Outdoor Activities",
    "Gaming & Entertainment"
  ];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log("Joining group with data:", formData);
    navigate(`/confirmation?org=${formData.organization}`);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityChange = (time: string, checked: boolean) => {
    if (checked) {
      updateFormData("availability", [...formData.availability, time]);
    } else {
      updateFormData("availability", formData.availability.filter(t => t !== time));
    }
  };

  const handleInterestsChange = (interest: string, checked: boolean) => {
    if (checked) {
      updateFormData("interests", [...formData.interests, interest]);
    } else {
      updateFormData("interests", formData.interests.filter(i => i !== interest));
    }
  };

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background">
          <StickyHeader />
          <main className="pt-20">
            <div className="container mx-auto px-6 py-16">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="font-space text-4xl font-bold text-foreground mb-4">
                  Join Your Community
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Please sign in to continue with joining your group.
                </p>
                <Button onClick={() => setShowAuthModal(true)} variant="premium">
                  Sign In to Continue
                </Button>
              </div>
            </div>
          </main>
          <PremiumFooter />
        </div>
        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          defaultMode="signup"
        />
      </>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Choose Your Organization
              </CardTitle>
              <CardDescription>
                Select the organization you'd like to join, or we'll help you find one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Organization</Label>
                <Select 
                  value={formData.organization} 
                  onValueChange={(value) => updateFormData("organization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(organizations).map(([key, org]) => (
                      <SelectItem key={key} value={key}>
                        {org.logo} {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {!formData.organization && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Don't see your organization? 
                  </p>
                  <Button variant="outline" size="sm">
                    Request Your Organization
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Or join a citywide community while we set up your organization.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Verify Your Membership
              </CardTitle>
              <CardDescription>
                Confirm you're part of this organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="your.email@organization.edu"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll check if your email domain matches your organization.
                </p>
              </div>

              <div>
                <Label>Invite Code (Optional)</Label>
                <Input
                  value={formData.inviteCode}
                  onChange={(e) => updateFormData("inviteCode", e.target.value)}
                  placeholder="Enter invite code if you have one"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Tell Us About Yourself
              </CardTitle>
              <CardDescription>
                Help us find the perfect group match for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label>Stage of Life</Label>
                <Select 
                  value={formData.stageOfLife} 
                  onValueChange={(value) => updateFormData("stageOfLife", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your stage of life" />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOfLifeOptions.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Neighborhood/Area</Label>
                <Input
                  value={formData.neighborhood}
                  onChange={(e) => updateFormData("neighborhood", e.target.value)}
                  placeholder="Where are you located?"
                />
              </div>

              <div>
                <Label>Preferred Activity Type</Label>
                <Select 
                  value={formData.activityPreference} 
                  onValueChange={(value) => updateFormData("activityPreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What kind of group interests you most?" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityOptions.map((activity) => (
                      <SelectItem key={activity} value={activity}>
                        {activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability & Interests
              </CardTitle>
              <CardDescription>
                When are you available and what interests you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">When are you available?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {availabilityOptions.map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.availability.includes(time)}
                        onCheckedChange={(checked) => handleAvailabilityChange(time, checked as boolean)}
                      />
                      <Label htmlFor={time} className="text-sm">
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">What are your interests?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestsChange(interest, checked as boolean)}
                      />
                      <Label htmlFor={interest} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Brief Introduction</Label>
                <Textarea
                  value={formData.intro}
                  onChange={(e) => updateFormData("intro", e.target.value)}
                  placeholder="Tell your future group a bit about yourself..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Community Pledge
              </CardTitle>
              <CardDescription>
                Your investment in authentic community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Community Investment</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">Initiation Fee</p>
                      <p className="text-sm text-muted-foreground">One-time community setup</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">$99</p>
                      <p className="text-xs text-muted-foreground">One time</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-background rounded-lg border">
                    <div>
                      <p className="font-medium">Monthly Mutual Care</p>
                      <p className="text-sm text-muted-foreground">Only charged if no care logged</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">$9</p>
                      <p className="text-xs text-green-600">Waived with participation</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    The monthly fee is automatically waived when you log any act of mutual care 
                    with your group - whether giving or receiving support through our 5C framework.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <span className="text-primary underline cursor-pointer">Terms of Service</span> and <span className="text-primary underline cursor-pointer">Community Guidelines</span>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="pledge"
                    checked={formData.agreeToPledge}
                    onCheckedChange={(checked) => updateFormData("agreeToPledge", checked)}
                  />
                  <Label htmlFor="pledge" className="text-sm">
                    I understand the investment structure and commit to participating in mutual care within my community
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Ready to Join!
              </CardTitle>
              <CardDescription>
                Review your information and complete your membership.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization:</span>
                  <span className="font-medium">
                    {organizations[formData.organization as keyof typeof organizations]?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stage of Life:</span>
                  <span className="font-medium">{formData.stageOfLife}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Preferred Activity:</span>
                  <span className="font-medium">{formData.activityPreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{formData.neighborhood}</span>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  You'll be placed in a group that matches your preferences and receive leader approval within 2-3 days.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <StickyHeader />
        
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-2xl mx-auto">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step < currentStep ? "bg-green-600 text-white" :
                        step === currentStep ? "bg-primary text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                      </div>
                      {step < 6 && (
                        <div className={`w-12 h-0.5 ${
                          step < currentStep ? "bg-green-600" : "bg-muted"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep} of 6
                  </p>
                </div>
              </div>

              {/* Step Content */}
              {renderStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {currentStep === 6 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.agreeToTerms || !formData.agreeToPledge}
                    className="flex items-center gap-2"
                    variant="premium"
                  >
                    Complete Membership
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !formData.organization) ||
                      (currentStep === 2 && !formData.email) ||
                      (currentStep === 3 && (!formData.fullName || !formData.stageOfLife)) ||
                      (currentStep === 4 && formData.availability.length === 0) ||
                      (currentStep === 5 && (!formData.agreeToTerms || !formData.agreeToPledge))
                    }
                    className="flex items-center gap-2"
                    variant="premium"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        <PremiumFooter />
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signup"
      />
    </>
  );
};

export default JoinWizard;