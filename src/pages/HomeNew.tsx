import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import { MarketingHero } from "@/components/marketing/Hero";
import { FiveCSection } from "@/components/marketing/FiveCSection";
import { ActivitiesShowcase } from "@/components/marketing/ActivitiesShowcase";
import DinnerListings from "@/components/DinnerListings";
import FiveCPrinciples from "@/components/FiveCPrinciples";
import Footer from "@/components/Footer";
import { flags } from "@/config/flags";
import fdBackground from "@/assets/fd-background.png";

const HomeNew = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image with opacity */}
      <div 
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${fdBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content layer */}
      <div className="relative z-10">
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
    </div>
  );
};

export default HomeNew;