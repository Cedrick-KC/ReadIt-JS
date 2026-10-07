"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { cn } from "@/lib/utils";

interface ExploreProps {
  className?: string;
}

type SortOption =
  | "relevance"
  | "newest"
  | "most-read"
  | "most-saved"
  | "highest-rated";

export const Explore = ({ className }: ExploreProps) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre, selectedModel, contentType, sortBy]);

  const performSearch = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        search: searchQuery,
        genre: selectedGenre || "",
        model: selectedModel || "",
        type: contentType || "",
        sort: sortBy,
      });

      const response = await fetch(`/api/works/search?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setResults(data.works || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasFilters =
    Boolean(selectedGenre) ||
    Boolean(selectedModel) ||
    Boolean(contentType);

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedModel(null);
    setContentType(null);
    setSearchQuery("");
    setSortBy("relevance");
  };

  return (
    <main className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
              R
            </span>

            <span className="text-xl font-bold tracking-tight">
              ReadIt
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <button
              onClick={() => router.push("/")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </button>

            <button className="font-semibold text-foreground">
              Explore
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Categories
            </button>
          </nav>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back home</span>
          </button>
        </div>
      </header>

      {/* Page intro */}
      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Discover something new
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Explore the library
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Search stories, research, essays, technology, and ideas
              created with AI.
            </p>
          </div>
        </div>
      </section>

      {/* Search + filters */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border bg-card p-4 shadow-sm sm:p-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, topics..."
              className="h-12 w-full rounded-2xl border bg-background pl-12 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              disabled={isLoading}
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FilterSelect
              label="Genre"
              value={selectedGenre || ""}
              onChange={(value) =>
                setSelectedGenre(value || null)
              }
              options={[
                ["", "All Genres"],
                ["fiction", "Fiction"],
                ["science", "Science"],
                ["technology", "Technology"],
                ["philosophy", "Philosophy"],
                ["history", "History"],
                ["business", "Business"],
                ["self-development", "Self Development"],
                ["poetry", "Poetry"],
                ["essays", "Essays"],
                ["research", "Research"],
                ["short-stories", "Short Stories"],
              ]}
            />

            <FilterSelect
              label="AI Model"
              value={selectedModel || ""}
              onChange={(value) =>
                setSelectedModel(value || null)
              }
              options={[
                ["", "All Models"],
                ["gpt", "GPT"],
                ["claude", "Claude"],
                ["gemini", "Gemini"],
                ["llama", "Llama"],
                ["mistral", "Mistral"],
              ]}
            />

            <FilterSelect
              label="Content type"
              value={contentType || ""}
              onChange={(value) =>
                setContentType(value || null)
              }
              options={[
                ["", "All Types"],
                ["book", "Book"],
                ["article", "Article"],
                ["essay", "Essay"],
              ]}
            />
          </div>

          {/* Bottom controls */}
          <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />

              {(
                [
                  ["relevance", "Relevance"],
                  ["newest", "Newest"],
                  ["most-read", "Most Read"],
                  ["most-saved", "Most Saved"],
                  ["highest-rated", "Top Rated"],
                ] as [SortOption, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    sortBy === value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary"
                >
                  Clear filters
                </button>
              )}

              <div className="flex rounded-xl border bg-background p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Grid view"
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-lg p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Searching the library..."
                : results.length > 0
                  ? `${results.length} works found`
                  : "Library collection"}
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Discover works"}
            </h2>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border bg-card"
              >
                <div className="aspect-[4/3] animate-pulse bg-secondary" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="rounded-3xl border bg-card px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No works found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try another search term or remove some filters to
              discover more works in the library.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse everything
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1 gap-4"
            )}
          >
            {results.map((work) => (
              <BookCard
                key={work.id}
                book={work}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}