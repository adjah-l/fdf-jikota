import { MapPin } from "lucide-react";
import { StatCounter } from "@/components/common/StatCounter";

interface MapWithPinsProps {
  groupCount: number;
  memberCount: number;
  className?: string;
}

export const MapWithPins = ({ 
  groupCount, 
  memberCount, 
  className = "" 
}: MapWithPinsProps) => {
  return (
    <section className={`py-16 bg-muted/30 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Placeholder */}
            <div className="relative h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive Map Coming Soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  View group locations and find communities near you
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <StatCounter
                  value={groupCount}
                  label="Active Groups"
                  size="lg"
                />
                <StatCounter
                  value={memberCount}
                  label="Members"
                  size="lg"
                />
              </div>
              
              <div className="text-center">
                <h3 className="font-space text-2xl font-bold text-foreground mb-4">
                  Growing Community
                </h3>
                <p className="text-muted-foreground">
                  Join thousands of people who have found their community through shared activities 
                  and meaningful connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};