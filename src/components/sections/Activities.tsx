import { Card } from "@/components/ui/card";
import { 
  Utensils, 
  BookOpen, 
  Dumbbell, 
  Gamepad2, 
  Clock 
} from "lucide-react";

const activities = [
  {
    icon: Utensils,
    name: "Dinner Together",
    description: "Share meals that spark conversation"
  },
  {
    icon: BookOpen,
    name: "Prayer & Bible Study", 
    description: "Grow in faith through reflection"
  },
  {
    icon: Dumbbell,
    name: "Working Out",
    description: "Build healthy rhythms together"
  },
  {
    icon: Gamepad2,
    name: "Watch Sports & More",
    description: "Celebrate and unwind"
  },
  {
    icon: Clock,
    name: "Flexible",
    description: "Community that adapts to your season"
  }
];

export const Activities = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-space text-3xl font-bold text-foreground mb-12 text-center">
            Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <Card key={activity.name} className="text-center p-6 border-border/50">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};