"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  ctaText,
  ctaUrl,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-12", className)}>
      <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
        {icon}
      </div>

      <h2 className="text-xl font-medium">{title}</h2>

      <p className="text-muted-foreground text-center max-w-md">
        {description}
      </p>

      {ctaText && ctaUrl && (
        <div className="mt-6">
          <a
            href={ctaUrl}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {ctaText}
          </a>
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = "EmptyState";