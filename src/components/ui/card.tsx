"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "elevated" | "outlined";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const baseClasses = "rounded-md border bg-card overflow-hidden";

    const variantClasses = {
      default: "border-border",
      elevated: "shadow-sm",
      outlined: "border-2 border-border",
    }[variant];

    const classes = cn(baseClasses, variantClasses, className);

    return <div ref={ref} className={classes} {...props} />;
  }
);

Card.displayName = "Card";