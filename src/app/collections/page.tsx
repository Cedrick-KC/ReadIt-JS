"use client";

import { CollectionCard } from "@/components/library/collection-card";

const collections = [
  {
    id: "1",
    name: "My Favorites",
    description: "Books and works I want to keep close.",
    visibility: "private" as const,
    createdAt: new Date().toISOString(),
    workCount: 0,
    items: [],
  },
  {
    id: "2",
    name: "Recommended Reading",
    description: "A collection of works worth exploring.",
    visibility: "public" as const,
    createdAt: new Date().toISOString(),
    workCount: 0,
    items: [],
  },
];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="mt-2 text-muted-foreground">
            Organize your favorite works into collections.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
