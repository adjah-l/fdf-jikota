import { Badge as UIBadge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  status?: "open" | "waitlist" | "full" | "active" | "inactive";
  className?: string;
}

export const Badge = ({ 
  children, 
  variant, 
  status, 
  className = "" 
}: BadgeProps) => {
  // If status is provided, override variant with status-specific styling
  if (status) {
    const statusClasses = {
      open: "bg-green-100 text-green-800 border-green-200",
      waitlist: "bg-yellow-100 text-yellow-800 border-yellow-200",
      full: "bg-red-100 text-red-800 border-red-200",
      active: "bg-blue-100 text-blue-800 border-blue-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
      <UIBadge 
        variant="outline" 
        className={`${statusClasses[status]} ${className}`}
      >
        {children}
      </UIBadge>
    );
  }

  return (
    <UIBadge variant={variant} className={className}>
      {children}
    </UIBadge>
  );
};