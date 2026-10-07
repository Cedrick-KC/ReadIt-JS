"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  defaultValue?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = 3,
      readOnly = false,
      size = "md",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(
      () => controlledValue ?? defaultValue
    );

    const starCount = 5;

    const handleMouseEnter = (index: number) => {
      if (!readOnly) setValue(index + 0.5);
    };

    const handleMouseLeave = () => {
      setValue(controlledValue ?? defaultValue);
    };

    const handleClick = (index: number) => {
      if (!readOnly) setValue(index + 0.5);
    };

    const starSize =
      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        {...props}
      >
        {[...Array(starCount).keys()].map((index) => {
          const starValue = value - index;
          const isHalf = starValue > 0 && starValue < 1;

          return (
            <svg
              key={index}
              className={cn(
                starSize,
                "fill-current hover:fill-yellow-500",
                "cursor-pointer select-none transition-colors",
                isHalf && "opacity-50",
                readOnly && "cursor-default"
              )}
              viewBox="0 0 24 24"
              aria-label={`Rating ${index + 1} stars`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = "Rating";