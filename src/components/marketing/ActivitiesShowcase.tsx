import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ACTIVITY_TYPES } from "@/lib/activityTypes";
import { UtensilsCrossed, BookOpen, Dumbbell, Tv, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const activityIcons = {
  dinner: UtensilsCrossed,
  prayer_study: BookOpen, 
  workout: Dumbbell,
  sports: Tv,
  flexible: Users,
} as const;

const activityDescriptions = {
  dinner: "Share a meal and build connection.",
  prayer_study: "Gather for scripture, prayer, and spiritual growth.",
  workout: "Move together and keep each other consistent.", 
  sports: "Cheer on your team and invite new friends.",
  flexible: "Start with interest, decide the rhythm together.",
} as const;

export function ActivitiesShowcase() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreGroups = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Groups for how you gather
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose an activity that fits your community. Every group practices the 5C framework.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {ACTIVITY_TYPES.map((activity) => {
            const Icon = activityIcons[activity.key as keyof typeof activityIcons];
            const description = activityDescriptions[activity.key as keyof typeof activityDescriptions];
            
            return (
              <article key={activity.key}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{activity.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-center mb-4 min-h-[48px] flex items-center">
                      {description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleExploreGroups}
                      aria-label={`Explore ${activity.label} groups`}
                    >
                      Explore groups
                    </Button>
                  </CardContent>
                </Card>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}