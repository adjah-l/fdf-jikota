import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumHero } from "@/components/marketing/PremiumHero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { OurStory } from "@/components/marketing/OurStory";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTABanner } from "@/components/marketing/CTABanner";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";

const HomePremium = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <StickyHeader />
      <main>
        <PremiumHero />
        <ValueProposition />
        <OurStory />
        <HowItWorks />
        <Testimonials />
        <CTABanner />
      </main>
      <PremiumFooter />
    </div>
  );
};

export default HomePremium;