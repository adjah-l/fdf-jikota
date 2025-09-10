import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiveCSection } from "@/components/marketing/FiveCSection";
import { Church, Home, Building, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { flags } from "@/config/flags";

const organizationTypes = [
  {
    title: "Churches",
    icon: Church,
    description: "Create small groups that practice connection, care, and community across your congregation.",
    features: ["Dinner", "Prayer / Bible Study", "Working Out", "Watch Sporting Events", "Flexible"]
  },
  {
    title: "HOAs & Communities", 
    icon: Home,
    description: "Build stronger neighborhoods through regular gatherings and mutual support systems.",
    features: ["Dinner", "Prayer / Bible Study", "Working Out", "Watch Sporting Events", "Flexible"]
  },
  {
    title: "Professional Organizations",
    icon: Building,
    description: "Foster meaningful connections beyond networking through structured relationship building.",
    features: ["Dinner", "Prayer / Bible Study", "Working Out", "Watch Sporting Events", "Flexible"]
  }
];

const ForOrganizations = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <main className="py-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            For Organizations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Whether you lead a church, HOA, or professional organization, the 5C framework creates lasting community connections through diverse group activities.
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/organizations/new')}>
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </section>

        {/* Organization Types */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {organizationTypes.map((org, index) => {
              const Icon = org.icon;
              
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{org.title}</CardTitle>
                    <CardDescription>{org.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {org.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 5C Framework */}
        <FiveCSection />

        {/* CTA Section */}
        <section className="container mx-auto px-4 text-center py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Join organizations using the 5C framework to build stronger communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/contact')}>Schedule Demo</Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/about')}>Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForOrganizations;