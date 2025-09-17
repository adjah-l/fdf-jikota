import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { Link } from "react-router-dom";
import { Building, Home, Users, Church, MapPin } from "lucide-react";

const OrgsDirectory = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const orgTypes = [
    { id: "all", label: "All Organizations", icon: Building },
    { id: "universities", label: "Universities", icon: Building },
    { id: "hoas", label: "HOAs", icon: Home },
    { id: "social", label: "Social Orgs", icon: Users },
    { id: "churches", label: "Churches", icon: Church },
  ];

  const organizations = [
    {
      id: "stanford-university",
      name: "Stanford University",
      type: "universities",
      city: "Stanford, CA",
      description: "Find your people at Stanford through meaningful connections and shared experiences.",
      logo: "🎓",
      memberCount: 57,
      groupCount: 12,
      status: "active"
    },
    {
      id: "lakeside-hoa-dallas",
      name: "Lakeside HOA",
      type: "hoas", 
      city: "Dallas, TX",
      description: "Belong where you live. Meet neighbors and make your community feel like family.",
      logo: "🏘️",
      memberCount: 34,
      groupCount: 7,
      status: "active"
    },
    {
      id: "urban-professionals-network",
      name: "Urban Professionals Network",
      type: "social",
      city: "Multiple Cities",
      description: "Community for professionals who share your pace and purpose.",
      logo: "🏢",
      memberCount: 41,
      groupCount: 9,
      status: "active"
    }
  ];

  const filteredOrgs = activeFilter === "all" 
    ? organizations 
    : organizations.filter(org => org.type === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      <StickyHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-space text-4xl md:text-6xl font-bold text-foreground mb-6">
                Find Your Organization
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join a community where you already belong. Connect through shared activities 
                and the 5C framework for lasting mutual care.
              </p>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">mbio</span> means "a people" in Efik, a Nigerian language
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-2">
              {orgTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveFilter(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === type.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Organizations Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredOrgs.map((org) => (
                <Card key={org.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{org.logo}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {org.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {org.city}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {org.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{org.groupCount} groups</span>
                        <span>{org.memberCount} members</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    </div>
                    
                    <Link to={`/orgs/${org.id}`}>
                      <Button className="w-full" variant="outline">
                        View Organization
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrgs.length === 0 && (
              <div className="text-center py-16">
                <div className="text-muted-foreground mb-4">
                  No organizations found in this category.
                </div>
                <Button onClick={() => setActiveFilter("all")} variant="outline">
                  View All Organizations
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-space text-3xl font-bold text-foreground mb-4">
                Don't See Your Organization?
              </h2>
              <p className="text-muted-foreground mb-8">
                Request to add your organization and help your community discover the power of belonging.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="premium" className="shadow-primary">
                  Request Your Organization
                </Button>
                <Button variant="outline">
                  Join Citywide Community
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </div>
  );
};

export default OrgsDirectory;