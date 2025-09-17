import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "premium" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  className?: string;
  disabled?: boolean;
}

export const CTAButton = ({ 
  children, 
  onClick, 
  href, 
  variant = "premium", 
  size = "lg",
  className = "",
  disabled = false
}: CTAButtonProps) => {
  const baseClasses = "uppercase tracking-wider font-bold";
  const combinedClasses = `${baseClasses} ${className}`;

  if (href) {
    return (
      <a href={href} className="inline-block">
        <Button 
          variant={variant} 
          size={size} 
          className={combinedClasses}
          disabled={disabled}
        >
          {children}
        </Button>
      </a>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};