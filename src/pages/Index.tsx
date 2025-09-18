import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import { ActivitiesShowcase } from "@/components/marketing/ActivitiesShowcase";
import { FiveCsSection } from "@/components/marketing/FiveCsSection";
import Hero from "@/components/Hero";
import { NewHero } from "@/components/marketing/NewHero";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import Footer from "@/components/Footer";
import { flags } from "@/config/flags";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <main>
        {flags.enableNewMarketing ? <NewHero /> : <Hero />}
        <ActivitiesShowcase />
        <FiveCsSection />
        <DinnerListings />
        <FiveCPrinciples />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
