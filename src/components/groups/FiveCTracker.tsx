import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Handshake, 
  AlertTriangle, 
  PartyPopper,
  Plus
} from "lucide-react";
import { useState } from "react";

interface FiveCEvent {
  id: string;
  type: "commitment" | "communication" | "connection" | "crisis" | "celebration";
  description: string;
  date: string;
  loggedBy: string;
}

interface FiveCTrackerProps {
  groupId: string;
  events?: FiveCEvent[];
  canLog?: boolean;
  className?: string;
}

const fiveCTypes = [
  {
    key: "commitment" as const,
    icon: Heart,
    name: "Commitment",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    key: "communication" as const,
    icon: MessageCircle,
    name: "Communication",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    key: "connection" as const,
    icon: Handshake,
    name: "Connection",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    key: "crisis" as const,
    icon: AlertTriangle,
    name: "Crisis",
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  {
    key: "celebration" as const,
    icon: PartyPopper,
    name: "Celebration",
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  }
];

export const FiveCTracker = ({ 
  groupId, 
  events = [], 
  canLog = false,
  className = ""
}: FiveCTrackerProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Calculate progress for each C
  const getTypeProgress = (type: string) => {
    const typeEvents = events.filter(e => e.type === type);
    return Math.min((typeEvents.length / 5) * 100, 100); // Cap at 100%
  };

  // Get recent events for each type
  const getRecentEvents = (type: string) => {
    return events
      .filter(e => e.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const handleLogEvent = (type: string) => {
    // This would open a modal or form to log a new 5C event
    console.log(`Logging ${type} event for group ${groupId}`);
    setSelectedType(type);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>5C Framework Progress</span>
            {canLog && (
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Log Event
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {fiveCTypes.map((type) => {
              const IconComponent = type.icon;
              const progress = getTypeProgress(type.key);
              const recentEvents = getRecentEvents(type.key);

              return (
                <div key={type.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${type.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {recentEvents.length} recent events
                        </p>
                      </div>
                    </div>
                    {canLog && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleLogEvent(type.key)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Progress value={progress} className="h-2" />

                  {recentEvents.length > 0 && (
                    <div className="space-y-2">
                      {recentEvents.map((event) => (
                        <div key={event.id} className="text-sm bg-muted/30 rounded p-3">
                          <p className="text-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.date).toLocaleDateString()} • {event.loggedBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};