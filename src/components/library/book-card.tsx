"use client";

import * as React from "react";
import { Book } from "@/types";
import {
  BookOpen,
  Star,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookCardProps = {
  showProgress?: boolean;
  showActions?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
} & (
  | {
      book: Book;
      work?: never;
    }
  | {
      work: Book;
      book?: never;
    }
);

const coverStyles = [
  "from-blue-600 via-indigo-600 to-violet-700",
  "from-slate-800 via-blue-900 to-indigo-950",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-violet-600 via-purple-600 to-fuchsia-700",
];

export const BookCard = ({
  book,
  work,
  showProgress = true,
  showActions = true,
  className,
  viewMode = "grid",
}: BookCardProps) => {
  const item = book ?? work;

  if (!item) {
    return null;
  }

  const coverIndex =
    item.title.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    coverStyles.length;

  const fallbackCover = coverStyles[coverIndex];

  if (viewMode === "list") {
    return (
      <article
        className={cn(
          "group flex gap-4 rounded-2xl border bg-card p-3 transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg",
          className
        )}
      >
        <div
          className={cn(
            "relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br",
            fallbackCover
          )}
        >
          {item.coverUrl ? (
            <img
              src={item.coverUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between p-2 text-white">
              <BookOpen className="h-4 w-4 opacity-80" />
              <span className="line-clamp-3 text-[10px] font-bold leading-tight">
                {item.title}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.subtitle || item.genre || "A ReadIt work"}
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>by {item.creatorId || "Unknown"}</span>

            {showActions && (
              <>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {item.rating ?? "—"}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {item.readingTime || "10 min"}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-card",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl",
        className
      )}
    >
      {/* Cover */}
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden bg-gradient-to-br",
          fallbackCover
        )}
      >
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col justify-between p-6 text-white">
            <div className="flex items-center justify-between">
              <BookOpen className="h-6 w-6 opacity-80" />

              {item.genre && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {item.genre}
                </span>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                ReadIt
              </p>

              <h3 className="line-clamp-3 text-2xl font-bold leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
            Open work
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {item.status?.toLowerCase() === "published" && (
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
            Published
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {item.subtitle || item.description || "Discover this work on ReadIt."}
        </p>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
              {(item.creatorId || "U").charAt(0).toUpperCase()}
            </span>

            <span className="truncate">
              {item.creatorId || "Unknown author"}
            </span>
          </div>

          {showActions && (
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                {item.rating ?? "—"}
              </span>

              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {item.readingTime || "10 min"}
              </span>
            </div>
          )}
        </div>

        {showProgress && item.readingProgress?.percentage !== undefined && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
              <span>Reading progress</span>
              <span>{item.readingProgress.percentage}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, item.readingProgress.percentage)
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

BookCard.displayName = "BookCard";