import { ReactNode } from "react";

interface StatCounterProps {
  value: number | string;
  label: string;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const StatCounter = ({ 
  value, 
  label, 
  icon, 
  className = "",
  size = "md"
}: StatCounterProps) => {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  };

  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`text-center ${className}`}>
      {icon && (
        <div className="flex justify-center mb-2">
          {icon}
        </div>
      )}
      <div className={`font-bold text-primary ${sizeClasses[size]}`}>
        {value}
      </div>
      <div className={`text-muted-foreground ${labelSizeClasses[size]}`}>
        {label}
      </div>
    </div>
  );
};