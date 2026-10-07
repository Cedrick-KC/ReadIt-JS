"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/components/library/book-card";
import { SearchIcon, Folder, Tag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoriesProps {
  className?: string;
}

export const Categories = ({ className }: CategoriesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "most-read" | "highest-rated">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        category: selectedCategory || "",
        tag: selectedTag || "",
        type: contentType || "",
        sort: sortBy,
      });

      const response = await fetch(`/api/works/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.works);
      }
    } catch (error) {
      console.error("Categories search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: "1", name: "Fiction", slug: "fiction", icon: "BookOpen", count: 47 },
    { id: "2", name: "Science", slug: "science", icon: "Atom", count: 23 },
    { id: "3", name: "Technology", slug: "technology", icon: "Code", count: 31 },
    { id: "4", name: "Philosophy", slug: "philosophy", icon: "Book", count: 12 },
    { id: "5", name: "History", slug: "history", icon: "History", count: 28 },
    { id: "6", name: "Business", slug: "business", icon: "Chart", count: 19 },
    { id: "7", name: "Poetry", slug: "poetry", icon: "Palette", count: 8 },
    { id: "8", name: "Essays", slug: "essays", icon: "PenTool", count: 15 },
    { id: "9", name: "Research", slug: "research", icon: "Flask", count: 11 },
    { id: "10", name: "Short Stories", slug: "short-stories", icon: "TextCursor", count: 22 },
  ];

  const tags = [
    { id: "1", name: "AI", count: 34 },
    { id: "2", name: "Machine Learning", count: 18 },
    { id: "3", name: "Ethics", count: 12 },
    { id: "4", name: "Future", count: 25 },
    { id: "5", name: "Humanity", count: 16 },
    { id: "6", name: "Innovation", count: 20 },
    { id: "7", name: "Creativity", count: 14 },
    { id: "8", name: "Society", count: 19 },
  ];

  const handleGenreChange = (category: string | null) => {
    setSelectedCategory(category);
    if (!searchQuery) {
      setResults([]);
    }
  };

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    if (!searchQuery) {
      setResults([]);
    }
  };

  return (
    <section className={cn("p-4 md:p-8", className || "")}>
      <div className="max-w-7xl mx-auto">

        {/* Search and Filters Section */}
        <div className="border-b border-border/50 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Field */}
            <div className="flex-1 flex items-center">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories, books, authors..."
                className="flex-1 rounded-md border border-input pl-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            {/* Category Filter */}
            <div className="hidden sm:w-80 sm:block">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Category</label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-full rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name} <span className="text-xs">{category.count}</span>
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="sm:w-80 sm:hidden mt-2 sm:mt-0">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs text-muted-foreground"
                    onClick={() => {
                      if (selectedTag === tag.id) {
                        setSelectedTag(null);
                      } else {
                        setSelectedTag(tag.id);
                      }
                    }}
                  >
                    {tag.name} <span className="ml-1 text-xxs bg-primary/20 rounded px-1.5 py-0.5">{tag.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setContentType("book")}
              className={cn(
  "flex-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors",
  contentType === "book" ? "bg-primary/10 text-primary" : ""
)}
            >
              Book
            </button>
            <button
              onClick={() => setContentType("article")}
            className={cn(
  "flex-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors",
  contentType === "book" ? "bg-primary/10 text-primary" : ""
)}
            >
              Article
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setSortBy("newest")}
            className={cn(
  "flex-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors",
  contentType === "book" ? "bg-primary/10 text-primary" : ""
)}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy("most-read")}
            className={cn(
  "flex-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors",
  contentType === "book" ? "bg-primary/10 text-primary" : ""
)}
          >
            Most Read
          </button>
          <button
            onClick={() => setSortBy("highest-rated")}
          className={cn(
  "flex-1 rounded-md border border-input px-3 py-1.5 text-sm font-medium transition-colors",
  contentType === "book" ? "bg-primary/10 text-primary" : ""
)}
          >
            Highest Rated
          </button>
        </div>
      </div>

      {/* Results Section */}
      {isLoading && (
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center h-32">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-muted-foreground animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="ml-4">Loading results...</span>
          </div>
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <div className="mt-8 empty-state">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mt-4 text-center">No results found</h3>
          <p className="text-muted-foreground text-center mt-2">Try adjusting your search terms or browse different categories.</p>
          <div className="mt-6">
            <a href="/explore" className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors">
              Browse Library
            </a>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {results.map((work) => (
            <BookCard
              key={work.id}
              book={work}
            />
          ))}
        </div>
      )}
    </section>
  );
};