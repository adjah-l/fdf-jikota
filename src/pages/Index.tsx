import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import { ActivitiesShowcase } from "@/components/marketing/ActivitiesShowcase";
import { FiveCsSection } from "@/components/marketing/FiveCsSection";
import { FiveCSection } from "@/components/marketing/FiveCSection";
import Hero from "@/components/Hero";
import { NewHero } from "@/components/marketing/NewHero";
import { MarketingHero } from "@/components/marketing/Hero";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { flags } from "@/config/flags";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <main>
        {flags.enableNewMarketing ? <MarketingHero /> : <Hero />}
        {flags.enableNewMarketing ? <FiveCSection /> : <FiveCsSection />}
        <ActivitiesShowcase />
        <DinnerListings />
        <FiveCPrinciples />
      </main>
      <PremiumFooter />
    </div>
  );
};

export default Index;
