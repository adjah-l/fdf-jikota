import Header from "@/components/Header";
import { MarketingHero } from "@/components/marketing/Hero";
import { FiveCSection } from "@/components/marketing/FiveCSection";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import Footer from "@/components/Footer";

const HomeNew = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MarketingHero />
        <FiveCSection />
        <DinnerListings />
        <FiveCPrinciples />
      </main>
      <Footer />
    </div>
  );
};

export default HomeNew;