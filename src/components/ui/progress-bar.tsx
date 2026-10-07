"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      size = "md",
      showPercentage = true,
      ...props
    },
    ref
  ) => {
    const percentage = (value / max) * 100;

    const sizeClasses = {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-3",
    }[size];

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-full bg-background/50 overflow-hidden",
          sizeClasses,
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />

        {showPercentage && (
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 text-xs font-medium text-primary/90",
              sizeClasses
            )}
          >
            {Math.round(value)}%
          </span>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";