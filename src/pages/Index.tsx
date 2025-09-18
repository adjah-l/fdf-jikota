import Header from "@/components/Header";
import { StickyHeader } from "@/components/marketing/StickyHeader";
import { ActivitiesShowcase } from "@/components/marketing/ActivitiesShowcase";
import { FiveCsSection } from "@/components/marketing/FiveCsSection";
import Hero from "@/components/Hero";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { OurStory } from "@/components/marketing/OurStory";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTABanner } from "@/components/marketing/CTABanner";
import { flags } from "@/config/flags";

const Index = () => {
  console.log("[Index] rendering - flags.enableNewMarketing:", flags.enableNewMarketing);
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <StickyHeader /> : <Header />}
      <main>
        {flags.enableNewMarketing ? (
          <>
            <PremiumHero />
            <ValueProposition />
            <OurStory />
            <HowItWorks />
            <Testimonials />
            <CTABanner />
          </>
        ) : (
          <>
            <Hero />
            <ActivitiesShowcase />
            <FiveCsSection />
            <DinnerListings />
            <FiveCPrinciples />
          </>
        )}
      </main>
      <PremiumFooter />
    </div>
  );
};

export default Index;
