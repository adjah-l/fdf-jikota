import PricingTabs from "@/components/marketing/PricingTabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import Footer from "@/components/Footer";
import { flags } from "@/config/flags";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Pricing that builds commitment and community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your pledge creates commitment. Your care creates community.
          </p>
        </div>

        {/* Pricing Tabs */}
        <div className="mb-16">
          <PricingTabs />
        </div>

        {/* Shared FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What is included in membership?</h3>
              <p className="text-muted-foreground">
                Matching, 5C framework tools, mutual care credits, messaging.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can organizations subsidize members?</h3>
              <p className="text-muted-foreground">
                Yes, organizations can cover member pledges or recurring contributions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer discounts for nonprofits?</h3>
              <p className="text-muted-foreground">
                Yes, contact us for nonprofit rates.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to build thriving groups?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Join a Group
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              For Organizations
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;