import { useState } from "react";
import { PremiumNavigation } from "@/components/layout/PremiumNavigation";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, ArrowRight, MessageSquare, HelpCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    organizationType: "",
    members: "",
    message: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScheduleDemo = () => {
    navigate('/for-organizations');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      organization: "",
      organizationType: "",
      members: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <PremiumNavigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-space text-premium-hero md:text-premium-hero-mobile mb-8 text-foreground">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-premium-body md:text-premium-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your community? We'd love to learn about your organization and how we can help you build stronger connections through the 5C framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="premium" 
                size="xl"
                onClick={handleScheduleDemo}
                className="shadow-primary"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="premium-outline" 
                size="xl"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Send a Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-background" id="contact-form">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardHeader>
                  <CardTitle className="font-space text-2xl font-bold text-foreground">Send us a message</CardTitle>
                  <CardDescription className="text-premium-body text-muted-foreground">
                    Tell us about your organization and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization Name *</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => handleInputChange("organization", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Organization Type *</Label>
                        <Select value={formData.organizationType} onValueChange={(value) => handleInputChange("organizationType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="church">Church / Faith Community</SelectItem>
                            <SelectItem value="university">University / College</SelectItem>
                            <SelectItem value="corporate">Corporate / Business</SelectItem>
                            <SelectItem value="healthcare">Healthcare Organization</SelectItem>
                            <SelectItem value="hoa">HOA / Neighborhood</SelectItem>
                            <SelectItem value="nonprofit">Nonprofit Organization</SelectItem>
                            <SelectItem value="professional">Professional Organization</SelectItem>
                            <SelectItem value="alumni">Alumni Network</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Approximate Member Count</Label>
                        <Select value={formData.members} onValueChange={(value) => handleInputChange("members", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50-200">50 - 200 members</SelectItem>
                            <SelectItem value="200-500">200 - 500 members</SelectItem>
                            <SelectItem value="500-1000">500 - 1,000 members</SelectItem>
                            <SelectItem value="1000-5000">1,000 - 5,000 members</SelectItem>
                            <SelectItem value="5000+">5,000+ members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us about your community goals and any specific challenges you're facing..."
                      />
                    </div>

                    <Button type="submit" variant="premium" size="lg" className="w-full shadow-primary">
                      <MessageSquare className="mr-2 w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Quick Questions */}
            <div className="space-y-8">
              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardHeader>
                  <CardTitle className="font-semibold text-foreground">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-sm text-muted-foreground">welcome@ourfamilydinner.org</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-sm text-muted-foreground">212.518.3324</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Address</div>
                      <div className="text-sm text-muted-foreground">
                        3839 McKinney Ave, St 155-5170<br />
                        Dallas, TX 75204
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift border-0 shadow-soft hover:shadow-lift">
                <CardHeader>
                  <CardTitle className="font-semibold text-foreground flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Quick Questions?
                  </CardTitle>
                  <CardDescription>
                    Check our common questions or reach out directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium text-foreground text-sm">What's the setup process?</div>
                      <div className="text-xs text-muted-foreground">Usually 1-2 weeks from data import to first groups</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="font-medium text-foreground text-sm">Do you offer training?</div>
                      <div className="text-xs text-muted-foreground">Yes, we provide comprehensive onboarding and support</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                      <Shield className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">What about data privacy?</div>
                        <div className="text-xs text-muted-foreground">SOC 2 compliant with enterprise-grade security</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </div>
  );
};

export default Contact;