"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  asChild?: boolean;
  variant?: "default" | "outline" | "underlined";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      {
        default: "shadow-sm",
        outline: "border-0 px-0 bg-transparent",
        underlined:
          "border-0 bg-transparent px-0 py-1 leading-none text-sm outline-none",
      }[variant],
      size !== "default" &&
        `text-[${size === "sm" ? "0.85rem" : "1.1rem"}]`,
      className
    );

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";