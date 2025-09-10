import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import { MarketingHero } from "@/components/marketing/Hero";
import { FiveCSection } from "@/components/marketing/FiveCSection";
import { ActivitiesShowcase } from "@/components/marketing/ActivitiesShowcase";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import Footer from "@/components/Footer";
import { flags } from "@/config/flags";

const HomeNew = () => {
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <main>
        <MarketingHero />
        <FiveCSection />
        <ActivitiesShowcase />
        <DinnerListings />
        <FiveCPrinciples />
      </main>
      <Footer />
    </div>
  );
};

export default HomeNew;