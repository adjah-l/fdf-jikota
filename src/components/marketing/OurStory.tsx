import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart } from "lucide-react";

export function OurStory() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-space text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Why We Started mbio
          </h2>
        </div>

        {/* Alternating Panels */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Panel 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-premium-body text-muted-foreground leading-relaxed">
                    People were surrounded by crowds but still felt alone. We saw the need for a new way to create community at scale.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-background rounded-3xl p-8 shadow-soft">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="font-space text-2xl font-bold mb-4 text-foreground">
                    The Problem
                  </h3>
                  <p className="text-muted-foreground">
                    Modern life disconnects us from our neighbors, leaving us isolated despite being surrounded by people.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-background rounded-3xl p-8 shadow-soft">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="font-space text-2xl font-bold mb-4 text-foreground">
                    Our Solution
                  </h3>
                  <p className="text-muted-foreground">
                    mbio exists to make belonging accessible through structured community care.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-soft">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-secondary" />
                  </div>
                  <p className="text-premium-body text-muted-foreground leading-relaxed mb-4">
                    <span className="font-semibold text-foreground">mbio</span> exists to make belonging accessible. 
                    Rooted in Efik culture, our name means "a people" or "a community."
                  </p>
                  <p className="text-premium-body text-muted-foreground leading-relaxed">
                    We build this on the <span className="font-semibold text-primary">5C framework</span>—Care, 
                    Consistency, Commitment, Confidants, and Celebration.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}