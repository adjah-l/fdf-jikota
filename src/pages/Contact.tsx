import { useState } from "react";
import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { flags } from "@/config/flags";

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
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Ready to transform your community? We'd love to learn about your organization and how we can help you build stronger connections.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
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
                          <SelectItem value="church">Church</SelectItem>
                          <SelectItem value="hoa">HOA / Neighborhood</SelectItem>
                          <SelectItem value="professional">Professional Organization</SelectItem>
                          <SelectItem value="alumni">Alumni Network</SelectItem>
                          <SelectItem value="nonprofit">Nonprofit</SelectItem>
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
                          <SelectItem value="1000+">1,000+ members</SelectItem>
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

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">hello@mbio.community</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">(555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      123 Community Lane<br />
                      Austin, TX 78701
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Hours</div>
                    <div className="text-sm text-muted-foreground">
                      Mon - Fri: 9am - 6pm CST<br />
                      Response within 24 hours
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule a Demo</CardTitle>
                <CardDescription>
                  Prefer to see the platform in action?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Book Demo Call
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  30-minute personalized demo tailored to your organization's needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Questions?</CardTitle>
                <CardDescription>
                  Check our FAQ or reach out directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium">What's the setup process?</div>
                    <div className="text-sm text-muted-foreground">Usually 1-2 weeks from data import to first groups</div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium">Do you offer training?</div>
                    <div className="text-sm text-muted-foreground">Yes, we provide comprehensive onboarding</div>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="text-left">
                    <div className="font-medium">What about data privacy?</div>
                    <div className="text-sm text-muted-foreground">SOC 2 compliant with enterprise-grade security</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;