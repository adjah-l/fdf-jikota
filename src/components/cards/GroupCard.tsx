import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface GroupCardProps {
  groupId?: string;
  orgSlug?: string;
  name: string;
  activity: string;
  status: "open" | "waitlist" | "full";
  nextMeeting: string;
  leaders: string[];
  members: number;
  maxMembers: number;
  className?: string;
  showJoinButton?: boolean;
}

export const GroupCard = ({ 
  groupId,
  orgSlug,
  name, 
  activity, 
  status, 
  nextMeeting, 
  leaders, 
  members, 
  maxMembers,
  className,
  showJoinButton = false
}: GroupCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Open</Badge>;
      case "waitlist":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Waitlist</Badge>;
      case "full":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Full</Badge>;
      default:
        return null;
    }
  };

  const groupDetailUrl = groupId && orgSlug ? `/orgs/${orgSlug}/groups/${groupId}` : '#';

  return (
    <Card className={`border-border/50 hover:shadow-lg transition-shadow ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          {getStatusBadge(status)}
        </div>
        <CardDescription>{activity}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Next: {new Date(nextMeeting).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {members}/{maxMembers} members
          </div>
          <div>
            <span className="text-xs font-medium">Leaders:</span>
            <div className="text-xs">{leaders.join(", ")}</div>
          </div>
        </div>
        
        {showJoinButton && groupId && orgSlug && (
          <Link to={groupDetailUrl}>
            <Button variant="outline" className="w-full uppercase tracking-wider">
              View Group
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};