"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { EmptyState } from "@/components/empty-state";
import { BookCard } from "@/components/library/book-card";
import { CollectionCard } from "@/components/library/collection-card";
import {
  BookmarkIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LibraryProps {
  className?: string;
}

type LibraryTab = "continue" | "saved" | "want-to-read" | "finished";

export const MyLibrary = ({ className }: LibraryProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTab, setSelectedTab] =
    useState<LibraryTab>("continue");

  const [collections, setCollections] = useState<any[]>([]);
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateCollection, setShowCreateCollection] =
    useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  // Fetch library data
  useEffect(() => {
    setIsLoading(true);

    // TODO: Fetch user's library data from API
    // const fetchLibraryData = async () => {
    //   const response = await fetch("/api/library", {
    //     credentials: "include",
    //   });
    //   const data = await response.json();
    //   setCollections(data.collections);
    //   setUserCollections(data.userCollections);
    //   setIsLoading(false);
    // };
    // fetchLibraryData();

    // Mock data for now
    setCollections([]);
    setUserCollections([]);
    setIsLoading(false);
  }, []);

  const tabs: Array<{ label: string; value: LibraryTab }> = [
    { label: "Continue Reading", value: "continue" },
    { label: "Saved", value: "saved" },
    { label: "Want to Read", value: "want-to-read" },
    { label: "Finished", value: "finished" },
  ];

  const collectionsData = [
    {
      id: "1",
      name: "My AI Fiction",
      description: "AI-generated fiction I'm reading",
      coverUrl: "/placeholder-collection-1.jpg",
      visibility: "private",
      itemCount: 12,
    },
    {
      id: "2",
      name: "Research Papers",
      description: "Technical and research works",
      coverUrl: "/placeholder-collection-2.jpg",
      visibility: "public",
      itemCount: 5,
    },
    {
      id: "3",
      name: "Finished Books",
      description: "Books I've completed",
      coverUrl: "/placeholder-collection-3.jpg",
      visibility: "private",
      itemCount: 8,
    },
  ];

  return (
    <section className={cn("p-4 md:p-8", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="border-b border-border/50 mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={cn(
                  "flex-1 rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors",
                  selectedTab === tab.value &&
                    "bg-primary/10 text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4">
            Your Collections
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {userCollections.length > 0 ? (
              userCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))
            ) : (
              <EmptyState
                icon={<Plus className="h-6 w-6" />}
                title="No Collections Yet"
                description="Create collections to organize your reading"
                ctaText="Create Collection"
                ctaUrl="#"
              />
            )}
          </div>
        </div>

        {/* Create Collection Modal */}
        {showCreateCollection && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-2xl font-medium mb-4">
                Create Collection
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Collection Name
                  </label>

                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) =>
                      setNewCollectionName(e.target.value)
                    }
                    required
                    className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="My Collection"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Organize books by genre, topic, or reading status
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowCreateCollection(false)}
                  className="flex-1 rounded-md border border-input px-4 py-2 text-sm hover:bg-secondary/10 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => setShowCreateCollection(false)}
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Books by Tab */}
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">
            {selectedTab === "continue"
              ? "Continue Reading"
              : selectedTab === "saved"
                ? "Saved"
                : selectedTab === "want-to-read"
                  ? "Want to Read"
                  : "Finished"}
          </h3>

          {isLoading ? (
            <div className="prose max-w-none lg:prose-lg px-8 py-8">
              <p>Loading your library...</p>
            </div>
          ) : (
            userCollections.length === 0 &&
            selectedTab === "continue" && (
              <EmptyState
                icon={<BookmarkIcon className="h-6 w-6" />}
                title="No Books in This Section"
                description="Start reading a book and it will appear here"
                ctaText="Explore Library"
                ctaUrl="/explore"
              />
            )
          )}

          {(userCollections.length > 0 ||
            selectedTab !== "continue") && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Placeholder for books - would be fetched from API */}
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <BookCard
                    key={i}
                    work={{
                      id: `${i}`,
                      title: `Book ${i + 1}`,
                      subtitle: "By Various Authors",
                      coverUrl: "/placeholder-book-cover.jpg",
                      contentType: "book",
                      aiProvenance: {
                        provider: "Claude",
                        model: "Claude 3.5 Sonnet",
                        involvementType: "aiAssisted",
                      },
                    }}
                    viewMode={viewMode}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};