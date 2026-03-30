import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  scroll?: boolean;
}

// Clases base para todos los botones
const BASE_CLASSES =
  "uppercase inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-fit";

// Mapeo de variantes
const VARIANT_CLASSES = {
  default: "bg-button-orange text-primary-black hover:bg-button-orange-hover",
  secondary: "bg-primary-black !text-primary-white hover:bg-gray-800",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

// Mapeo de tamaños
const SIZE_CLASSES = {
  default: "h-[48px] px-4 text-body-medium gap-2",
  sm: "h-[36px] px-3 text-body-small gap-1.5",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon,
      iconPosition = "right",
      href,
      scroll,
      children,
      ...props
    },
    ref,
  ) => {
    const combinedClassName = cn(
      BASE_CLASSES,
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      iconPosition === "right" && "flex-row-reverse",
      className,
    );

    const content = (
      <>
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          scroll={scroll}
          ref={ref as any}
          className={combinedClassName}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
