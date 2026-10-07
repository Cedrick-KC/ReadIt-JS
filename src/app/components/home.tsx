"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock3,
  Compass,
  Moon,
  Search,
  Sparkles,
  Sun,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/components/library/book-card";

interface HomeProps {
  className?: string;
}

const featuredBooks = [
  {
    id: "1",
    title: "The Last Archive",
    subtitle: "A Science Fiction Novel",
    author: "A. Matthews",
    genre: "Science Fiction",
    readingTime: "4.5 hours",
    rating: 4.5,
  },
  {
    id: "2",
    title: "Letters from Tomorrow",
    subtitle: "Literary Fiction",
    author: "J. Chen",
    genre: "Literary Fiction",
    readingTime: "3.2 hours",
    rating: 4.2,
  },
  {
    id: "3",
    title: "Machines That Learned to Dream",
    subtitle: "Technology Guide",
    author: "R. Chen",
    genre: "Technology",
    readingTime: "2.8 hours",
    rating: 4.7,
  },
];

const categories = [
  { name: "Fiction", icon: BookOpen },
  { name: "Science", icon: Sparkles },
  { name: "Technology", icon: Brain },
  { name: "Philosophy", icon: Compass },
  { name: "History", icon: Clock3 },
  { name: "Education", icon: BookOpen },
  { name: "Business", icon: TrendingUp },
  { name: "Self-development", icon: Sparkles },
  { name: "Culture", icon: Compass },
  { name: "Poetry", icon: BookOpen },
  { name: "Essays", icon: BookOpen },
  { name: "Research", icon: Brain },
];

export const Home = ({ className }: HomeProps) => {
  const router = useRouter();

  const [themeMode, setThemeMode] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const storedMode = localStorage.getItem("readit-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedMode === "light" || storedMode === "dark") {
      setThemeMode(storedMode);
    } else if (prefersDark) {
      setThemeMode("dark");
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      themeMode === "dark"
    );

    localStorage.setItem("readit-theme", themeMode);
  }, [themeMode]);

  return (
    <main className={className}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
            aria-label="ReadIt home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
              R
            </span>

            <span className="text-xl font-bold tracking-tight">
              ReadIt
            </span>
          </button>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <button
              onClick={() => router.push("/explore")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Categories
            </button>

            <button className="text-muted-foreground transition-colors hover:text-foreground">
              About
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setThemeMode(themeMode === "light" ? "dark" : "light")
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {themeMode === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => router.push("/explore")}
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:block"
            >
              Browse library
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              A library for the age of AI
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Discover ideas worth{" "}
              <span className="text-primary">reading.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore stories, essays, research, and books created with
              the world's most interesting AI models.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/explore")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore the library
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => router.push("/explore")}
                className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-3 font-semibold transition-colors hover:bg-secondary"
              >
                <Search className="h-4 w-4" />
                Find something
              </button>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative hidden min-h-[300px] md:block">
            <div className="absolute right-0 top-1/2 w-full max-w-md -translate-y-1/2">
              <div className="rotate-[-4deg] rounded-3xl border bg-card p-5 shadow-2xl">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-7 text-white">
                  <BookOpen className="mb-12 h-7 w-7 opacity-80" />
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                    ReadIt collection
                  </p>
                  <h2 className="mt-2 text-3xl font-black leading-tight">
                    Stories for curious minds.
                  </h2>
                  <p className="mt-4 text-sm text-white/75">
                    Books, ideas and research in one place.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 rounded-2xl border bg-card px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      AI-powered collection
                    </p>
                    <p className="text-sm font-bold">
                      New ideas every day
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-primary">
              Curated for you
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured this week
            </h2>
          </div>

          <button
            onClick={() => router.push("/explore")}
            className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={{
                id: book.id,
                title: book.title,
                subtitle: book.subtitle,
                creatorId: book.author,
                genre: book.genre,
                readingTime: book.readingTime,
                rating: book.rating,
              }}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-7">
            <p className="mb-1 text-sm font-semibold text-primary">
              Explore by topic
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Find your next rabbit hole
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => router.push("/explore")}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="text-sm font-semibold">{name}</span>

                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              What's popular
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Trending now
            </h2>
          </div>

          <button
            onClick={() => router.push("/explore")}
            className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex"
          >
            Explore more
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredBooks.map((book, index) => (
            <div
              key={`trend-${book.id}`}
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <span className="text-3xl font-black text-primary/20">
                0{index + 1}
              </span>

              <div className="min-w-0">
                <h3 className="truncate font-bold">{book.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {book.genre}
                </p>
              </div>

              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground">
              R
            </span>
            ReadIt
          </div>

          <p>Stories, ideas and research for the age of AI.</p>
        </div>
      </footer>
    </main>
  );
};