"use client";

import * as React from "react";
import { Folder, Clock, Trash, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    description: string;
    coverUrl?: string;
    visibility: "private" | "public";
    createdAt: string;
    workCount: number;
    items: Array<{ workId: string; position: number }>;
  };
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const CollectionCard = ({
  collection,
  onToggleVisibility,
  onDelete,
  onEdit,
  className,
}: CollectionCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 hover:bg-secondary/10 transition-colors cursor-default",
        "group:hover:shadow-sm",
        "group-hover:translate-y-[-1px] transition-transform",
        className
      )}
    >
      {/* Cover/Icon Area */}
      <div className="relative h-48 w-full mb-4 bg-gradient-to-br from-gray-200 to-gray-100 overflow-hidden rounded-lg">
        {collection.coverUrl ? (
          <img
            src={collection.coverUrl}
            alt={collection.name}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-200 rounded-lg">
            <span className="text-3xl font-bold">
              {collection.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Visibility badge */}
        {collection.visibility === "public" && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs rounded px-2 py-0.5">
            Public
          </div>
        )}

        {collection.visibility === "private" && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs rounded px-2 py-0.5">
            Private
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col h-full">
        <h3 className="font-medium text-lg line-clamp-2 mb-1">
          {collection.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {collection.description}
        </p>

        {/* Metadata Row */}
        <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Folder className="h-3 w-3" />
            {collection.workCount} works
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(collection.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2 pt-3 border-t border-border">
          <button
            type="button"
            aria-label="View collection"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {onEdit && (
            <button
              type="button"
              aria-label="Edit collection"
              onClick={onEdit}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary"
            >
              <MoreHorizontal className="h-4 w-4 rotate-45" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              aria-label="Delete collection"
              onClick={onDelete}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CollectionCard.displayName = "CollectionCard";