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
  date: string;
  time: string;
  location: string;
  venue: "home" | "clubhouse";
  capacity: number;
  attendees: number;
  mealType: "potluck" | "restaurant";
  distance: string;
  dietary?: string[];
}

const DinnerCard = ({ 
  title, 
  host, 
  date, 
  time, 
  location, 
  venue,
  capacity, 
  attendees, 
  mealType,
  distance,
  dietary = []
}: DinnerCardProps) => {
  const spotsLeft = capacity - attendees;
  const isAlmostFull = spotsLeft <= 2;
  
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
        {/* Date & Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
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
        
        {/* Meal Type */}
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-muted-foreground" />
          <Badge variant={mealType === "restaurant" ? "default" : "secondary"}>
            {mealType === "restaurant" ? "Restaurant Bundle" : "Potluck Style"}
          </Badge>
        </div>
        
        {/* Dietary Tags */}
        {dietary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dietary.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Capacity & RSVP */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {attendees}/{capacity} attending
            </span>
            {isAlmostFull && (
              <Badge variant="destructive" className="text-xs">
                Almost Full
              </Badge>
            )}
          </div>
          
          <Button 
            variant={spotsLeft > 0 ? "default" : "secondary"} 
            size="sm"
            disabled={spotsLeft === 0}
            className="min-w-[80px]"
          >
            {spotsLeft > 0 ? "RSVP" : "Full"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DinnerCard;