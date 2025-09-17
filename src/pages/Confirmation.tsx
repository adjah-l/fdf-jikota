import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyHeader } from "@/components/marketing/StickyHeader";
import { PremiumFooter } from "@/components/marketing/PremiumFooter";
import { CheckCircle, Home, Users, Calendar } from "lucide-react";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orgSlug = searchParams.get("org");

  return (
    <div className="min-h-screen bg-background font-inter">
      <StickyHeader />
      
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-space text-3xl font-bold text-foreground mb-4">
                Welcome to the Community!
              </h1>
              <p className="text-lg text-muted-foreground">
                Your registration has been completed successfully. You'll be matched with a group soon.
              </p>
            </div>

            <Card className="text-left mb-8">
              <CardHeader>
                <CardTitle>What happens next?</CardTitle>
                <CardDescription>
                  Here's what you can expect in the coming days:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Profile Review</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your profile and preferences to find the perfect group match.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Group Assignment</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive an email with your group details and first meeting information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">First Meeting</p>
                    <p className="text-sm text-muted-foreground">
                      Attend your first group meeting and start building meaningful relationships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/member/home")}
                className="w-full sm:w-auto"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/groups")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse Groups
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => navigate("/community-care")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Community Care
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
};

export default Confirmation;