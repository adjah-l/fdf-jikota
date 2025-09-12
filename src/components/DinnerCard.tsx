import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Utensils, Home } from "lucide-react";

interface DinnerCardProps {
  id: string;
  title: string;
  host: {
    name: string;
    avatar?: string;
    initials: string;
  };
  frequency: string; // "Weekly", "Bi-weekly", "Monthly"
  dayOfWeek: string; // "Monday", "Tuesday", etc.
  time: string;
  location: string;
  venue: "home" | "clubhouse";
  capacity: number;
  attendees: number;
  activityType: "dinner" | "prayer_study" | "workout" | "sports" | "flexible";
  gatheringMode: "families" | "adults" | "mixed"; // families = max 8, others = max 5
  distance: string;
  details?: string[];
  joinDeadline: string; // Season-based deadline
  isFull: boolean;
}

const DinnerCard = ({ 
  title, 
  host, 
  frequency,
  dayOfWeek,
  time, 
  location, 
  venue,
  capacity, 
  attendees, 
  activityType,
  gatheringMode,
  distance,
  details = [],
  joinDeadline,
  isFull
}: DinnerCardProps) => {
  const spotsLeft = capacity - attendees;
  const isAlmostFull = spotsLeft <= 2 && spotsLeft > 0;
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dinner': return <Utensils className="w-4 h-4" />;
      case 'prayer_study': return <Users className="w-4 h-4" />;
      case 'workout': return <Users className="w-4 h-4" />;
      case 'sports': return <Users className="w-4 h-4" />;
      case 'flexible': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };
  
  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'dinner': return 'Dinner';
      case 'prayer_study': return 'Prayer & Study';
      case 'workout': return 'Fitness';
      case 'sports': return 'Sports';
      case 'flexible': return 'Flexible';
      default: return 'Group';
    }
  };
  
  return (
    <Card className="group hover:shadow-warm transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={host.avatar} alt={`${host.name} profile picture`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {host.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">Hosted by {host.name}</p>
            </div>
          </div>
          <Badge variant={venue === "home" ? "secondary" : "outline"} className="shrink-0">
            {venue === "home" ? (
              <>
                <Home className="w-3 h-3 mr-1" />
                Home
              </>
            ) : (
              <>
                <Users className="w-3 h-3 mr-1" />
                Clubhouse
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Frequency & Schedule */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{frequency} • {dayOfWeek}s</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location} • {distance}</span>
        </div>
        
        {/* Activity Type & Gathering Mode */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getActivityIcon(activityType)}
            <Badge variant="default">
              {getActivityLabel(activityType)}
            </Badge>
          </div>
          <Badge variant={gatheringMode === "families" ? "secondary" : "outline"}>
            {gatheringMode === "families" ? "Family Groups" : gatheringMode === "adults" ? "Adults Only" : "Mixed Ages"}
          </Badge>
        </div>
        
        {/* Group Details */}
        {details.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {details.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Join Deadline */}
        <div className="text-xs text-muted-foreground">
          Join by: {joinDeadline}
        </div>
        
        {/* Capacity & Join Request */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {attendees}/{capacity} members
            </span>
            {isAlmostFull && !isFull && (
              <Badge variant="destructive" className="text-xs">
                Almost Full
              </Badge>
            )}
            {isFull && (
              <Badge variant="secondary" className="text-xs">
                Full
              </Badge>
            )}
          </div>
          
          <Button 
            variant={!isFull ? "default" : "secondary"} 
            size="sm"
            disabled={isFull}
            className="min-w-[120px]"
          >
            {!isFull ? "Request to Join" : "Full"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DinnerCard;