import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface OrgCardProps {
  slug: string;
  name: string;
  logo: string;
  city?: string;
  description: string;
  memberCount?: number;
  groupCount?: number;
  className?: string;
}

export const OrgCard = ({ 
  slug, 
  name, 
  logo, 
  city, 
  description, 
  memberCount, 
  groupCount,
  className 
}: OrgCardProps) => {
  return (
    <Card className={`border-border/50 hover:shadow-lg transition-shadow ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">{logo}</div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            {city && (
              <CardDescription className="text-sm text-muted-foreground">
                {city}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        {(memberCount || groupCount) && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {groupCount && <span>{groupCount} groups</span>}
            {memberCount && <span>{memberCount} members</span>}
          </div>
        )}
        
        <Link to={`/orgs/${slug}`}>
          <Button variant="outline" className="w-full uppercase tracking-wider">
            View Organization
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};