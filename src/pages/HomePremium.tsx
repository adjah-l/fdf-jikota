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
        <HowItWorks />
        <FiveCsSection />
        <Testimonials />
        
        {/* Community Categories Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {/* Tab Navigation - Smaller and more compact */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center bg-white rounded-xl p-1.5 shadow-soft border">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mr-3">
                    <Home className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex space-x-1">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tab Content - More compact */}
              <div className="text-center">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`transition-all duration-300 ${
                      activeTab === tab.id ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                      {tab.description}
                    </p>
                    <Link
                      to={tab.link}
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-primary text-sm"
                    >
                      <tab.icon className="w-4 h-4" />
                      Learn More About {tab.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTABanner />
      </main>
      <PremiumFooter />
    </div>
  );
};

export default HomePremium;