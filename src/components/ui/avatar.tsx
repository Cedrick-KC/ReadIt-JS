"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "group";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}, ref) => {
  let baseClasses = "relative flex h-10 w-10 rounded-full items-center justify-center";

  let sizeClasses = {
    default: "h-10 w-10",
    sm: "h-9 w-9",
    lg: "h-12 w-12",
    icon: "h-6 w-6",
  }[size];

  const classes = cn(baseClasses, sizeClasses, className);

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Avatar.displayName = "Avatar";