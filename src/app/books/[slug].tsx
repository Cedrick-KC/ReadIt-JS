"use client";

import { notFound } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookCard } from "@/components/library/book-card";
import { Reader } from "@/components/reader";
import { useRouter } from "next/navigation";
import { BookmarkIcon, HeartIcon, Loader2, MessageCircle, X, BookOpen} from "lucide-react";
import type { Bookmark } from "@/types";

interface Work {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverUrl?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  contentType: string;
  aiProvenance?: {
    provider: string;
    model: string;
    modelVersion?: string;
    involvementType: "fullyAI" | "aiAssisted" | "humanWithAI" | "other";
    humanEdited?: boolean;
    humanEditor?: string;
    generationDate?: string;
    disclosure?: string;
  };
  tags?: { name: string }[];
  category?: string;
  language?: string;
  publishedAt?: string;
  readingProgress?: {
    percentage: number;
    chapter: number;
    lastReadAt?: string;
  };
  bookmarks?: Bookmark[];
}

export default function BookDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    // Fetch work by slug
    fetch(`/api/works/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.work) {
          notFound();
        }
        setWork(data.work);
        setIsBookmarked(data.work.bookmarks?.includes(1) || false);
        setIsHighlighted(data.work.highlights?.length > 0 || false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching work:", err);
        notFound();
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="prose max-w-none lg:prose-lg px-8 py-8">
          <p>Loading work...</p>
        </div>
      </div>
    );
  }

  if (!work) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-background">
      {/* Header with back button and actions */}
      <header className="border-b border-border/50 pb-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
              aria-label="Back to library"
            >
              <X className="h-5 w-5" />
            </button>
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ReadIt Library</span>
          </div>

          <div className="flex items-center gap-3">
            {isBookmarked ? (
              <button
                onClick={() => {
                  // TODO: Remove bookmark
                  setIsBookmarked(false);
                }}
                className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
                aria-label="Remove bookmark"
              >
                <BookmarkIcon className="h-4 w-4 text-primary" />
              </button>
            ) : (
              <button
                onClick={() => {
                  // TODO: Add bookmark
                  setIsBookmarked(true);
                }}
                className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
                aria-label="Bookmark"
              >
                <BookmarkIcon className="h-4 w-4 text-primary" />
              </button>
            )}

            <Reader
              book={work}
              onClose={() => router.back()}
              className="hidden md:block"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Book cover and info on desktop */}
        <div className="lg:block lg:w-1/2">
          {/* Cover image */}
          {work.coverUrl ? (
            <img
              src="/placeholder-book-cover.jpg"
              alt={work.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          ) : (
            <div
              className="w-full h-64 bg-gradient-to-b from-secondary/20 via-secondary/10 to-secondary/20 rounded-lg flex items-center justify-center"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3">
            <p className="text-lg font-medium">{work.title}</p>
            {work.subtitle && (
              <p className="text-muted-foreground">{work.subtitle}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <span className="text-sm text-muted-foreground">
                by {" "}
                <a href={`/creator/${work.creator.id}`} className="hover:text-primary transition-colors">
                  {work.creator.name}
                </a>
              </span>

              <span className="text-sm text-muted-foreground">
                • {" "}
                {work.contentType}
              </span>
            </div>

            {/* AI Provenance Badge */}
            {work.aiProvenance && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary/80 text-xs">
                <span className="ai-badge">AI {work.aiProvenance.involvementType}</span>
              </div>
            )}

            {/* Tags */}
            {work.tags && work.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Reading progress */}
            {work.readingProgress && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Reading progress:
                </p>
                <div className="bg-secondary/20 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${work.readingProgress.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {work.readingProgress.percentage}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content area on desktop */}
        <div className="lg:block lg:w-1/2 pl-8">
          {/* Description */}
          {work.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
                About this work
              </h3>
              <p className="text-muted-foreground leading-relaxed">{work.description}</p>
            </div>
          )}

          {/* Reader button */}
          <div className="mt-8">
            <button
              onClick={() => {
                // Navigate to reader or open in new section
                // For now, just scroll or show indicator
              }}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Reading
            </button>
          </div>
        </div>

        {/* Mobile layout - stack everything */}
        <div className="hidden lg:hidden mt-6">
          {/* Cover */}
          {work.coverUrl ? (
            <img
              src="/placeholder-book-cover.jpg"
              alt={work.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          ) : (
            <div
              className="w-full h-48 bg-gradient-to-b from-secondary/20 via-secondary/10 to-secondary/20 rounded-md flex items-center justify-center"
            >
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Info */}
          <div className="mt-4">
            <p className="text-lg font-medium">{work.title}</p>
            {work.subtitle && (
              <p className="text-muted-foreground">{work.subtitle}</p>
            )}

            <p className="text-sm text-muted-foreground mt-2">
              by {work.creator.name}
            </p>

            {/* AI Provenance */}
            {work.aiProvenance && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary/80 text-xs">
                <span className="ai-badge">AI {work.aiProvenance.involvementType}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsBookmarked(true)}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Bookmark"
            >
              Save to Library
            </button>
            <button
              onClick={() => {/* Open reader */}}
              className="flex-1 rounded-md bg-secondary px-4 py-2 text-secondary hover:bg-secondary/10 transition-colors"
            >
              Read Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}