import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FiveCStatus, FiveCKey, getFiveCHealthScore } from "@/lib/fiveC";
import { Heart, MessageCircle, Users, AlertTriangle, PartyPopper } from "lucide-react";

interface FiveCMeterProps {
  status: FiveCStatus;
  size?: 'small' | 'large';
  className?: string;
}

const fiveCConfig = {
  commitment: {
    label: 'Commitment',
    icon: Heart,
    color: 'bg-red-500',
    description: 'Dedicated to showing up for one another'
  },
  communication: {
    label: 'Communication',
    icon: MessageCircle,
    color: 'bg-blue-500',
    description: 'Open, honest dialogue that builds trust'
  },
  connection: {
    label: 'Connection',
    icon: Users,
    color: 'bg-blue-500',
    description: 'Building meaningful relationships'
  },
  crisis: {
    label: 'Crisis',
    icon: AlertTriangle,
    color: 'bg-orange-500',
    description: 'Supporting each other through challenges'
  },
  celebration: {
    label: 'Celebration',
    icon: PartyPopper,
    color: 'bg-yellow-500',
    description: 'Recognize wins and milestones'
  }
} as const;

export function FiveCMeter({ status, size = 'large', className }: FiveCMeterProps) {
  const healthScore = getFiveCHealthScore(status);
  const isSmall = size === 'small';

  if (isSmall) {
    return (
      <div className={cn("flex gap-1", className)}>
        {Object.entries(fiveCConfig).map(([key, config]) => {
          const isActive = status[key as FiveCKey].active;
          const Icon = config.icon;
          
          return (
            <div
              key={key}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                isActive ? config.color : "bg-muted"
              )}
              title={`${config.label}: ${isActive ? 'Active' : 'Needs attention'}`}
            >
              <Icon className={cn("w-3 h-3", isActive ? "text-white" : "text-muted-foreground")} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">5C Framework</h3>
            <Badge variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}>
              {healthScore}% Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {Object.entries(fiveCConfig).map(([key, config]) => {
              const cStatus = status[key as FiveCKey];
              const Icon = config.icon;
              
              return (
                <div key={key} className="text-center space-y-2">
                  <div
                    className={cn(
                      "w-12 h-12 mx-auto rounded-full flex items-center justify-center",
                      cStatus.active ? config.color : "bg-muted"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", cStatus.active ? "text-white" : "text-muted-foreground")} />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className={cn(
                      "text-xs",
                      cStatus.active ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {cStatus.active ? 'Active' : 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Every group follows five practices that create durable community
          </div>
        </div>
      </CardContent>
    </Card>
  );
}