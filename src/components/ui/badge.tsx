"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium";

    const variantClasses = {
      default: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary",
      destructive: "bg-destructive/10 text-destructive",
      outline: "border border-input bg-transparent text-inherit",
    }[variant];

    const classes = cn(baseClasses, variantClasses, className);

    return <span ref={ref} className={classes} {...props} />;
  }
);

Badge.displayName = "Badge";