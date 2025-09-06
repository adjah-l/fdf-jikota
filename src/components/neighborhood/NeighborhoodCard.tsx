import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Calendar, Home, CalendarDays } from "lucide-react";
import { Neighborhood } from "@/hooks/useNeighborhoods";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  isJoined?: boolean;
  onJoin: (neighborhoodId: string) => void;
  onLeave?: (neighborhoodId: string) => void;
  loading?: boolean;
}

const NeighborhoodCard = ({ 
  neighborhood, 
  isJoined = false, 
  onJoin, 
  onLeave, 
  loading = false 
}: NeighborhoodCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {neighborhood.name}
        </CardTitle>
        <CardDescription>
          {neighborhood.city}, {neighborhood.state}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {neighborhood.description && (
          <p className="text-sm text-muted-foreground">
            {neighborhood.description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {neighborhood.member_count} members
          </div>
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {neighborhood.family_count} families
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {neighborhood.active_dinners_count} active dinners
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {neighborhood.current_season} season
          </div>
        </div>
        
        {neighborhood.family_groups_count > 0 && (
          <div className="text-xs text-muted-foreground">
            {neighborhood.family_groups_count} family groups
          </div>
        )}
        
        {neighborhood.community_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {neighborhood.community_tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {neighborhood.zip_codes.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Zip codes: {neighborhood.zip_codes.join(', ')}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isJoined ? (
          <Button 
            variant="outline" 
            onClick={() => onLeave?.(neighborhood.id)}
            disabled={loading}
            className="w-full"
          >
            Leave Neighborhood
          </Button>
        ) : (
          <Button 
            onClick={() => onJoin(neighborhood.id)}
            disabled={loading}
            className="w-full"
          >
            Join Neighborhood
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NeighborhoodCard;