import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", icon, iconPosition = "right", children, ...props }, ref) => {
    // Definimos las clases base
    const baseClasses =
      "uppercase inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-fit";

    // Mapeo de variantes
    const variantClasses = {
      default: "bg-button-orange text-primary-foreground hover:bg-button-orange-hover",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }[variant];

    // Mapeo de tamaños
    const sizeClasses = {
      default: "h-[48px] px-4 text-body gap-2 ",
      sm: "h-[36px] px-3 text-body-sm gap-1.5",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses,
          sizeClasses,
          iconPosition === "right" && "flex-row-reverse",
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

