import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { OurStory } from "@/components/marketing/OurStory";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FiveCsSection } from "@/components/marketing/FiveCsSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTABanner } from "@/components/marketing/CTABanner";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Building2, GraduationCap, Users } from "lucide-react";

const HomePremium = () => {
  const [activeTab, setActiveTab] = useState("organizations");

  const tabs = [
    {
      id: "organizations",
      label: "Organizations",
      icon: Building2,
      link: "/for-organizations",
      description: "Transform your organization with the 5C framework"
    },
    {
      id: "universities", 
      label: "Universities",
      icon: GraduationCap,
      link: "/use-cases#education",
      description: "Build belonging among students, parents, and faculty"
    },
    {
      id: "student-groups",
      label: "Student Groups", 
      icon: Users,
      link: "/partners",
      description: "Connect student communities across campuses"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <StickyHeader />
      <main>
        <PremiumHero />
        <ValueProposition />
        <OurStory />
        
        {/* Community Categories Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Tab Navigation */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center bg-white rounded-2xl p-2 shadow-soft border">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mr-4">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex space-x-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="text-center">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`transition-all duration-300 ${
                      activeTab === tab.id ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                      {tab.description}
                    </p>
                    <Link
                      to={tab.link}
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-primary"
                    >
                      <tab.icon className="w-5 h-5" />
                      Learn More About {tab.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <FiveCsSection />
        <Testimonials />
        <CTABanner />
      </main>
      <PremiumFooter />
    </div>
  );
};

export default HomePremium;