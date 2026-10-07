"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Sun, Moon } from "lucide-react";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [themeMode, setThemeMode] = React.useState<"light" | "dark">(
    "light"
  );

  return (
    <header
      className={`border-b border-border bg-card/90 backdrop-blur-sm shadow-sm ${
        className ?? ""
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">
              ReadIt Library
            </span>
          </Link>

          {/* Mobile menu button would go here */}
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/explore"
            className="hover:text-primary transition-colors"
          >
            Explore
          </Link>

          <Link
            href="/books"
            className="hover:text-primary transition-colors"
          >
            Books
          </Link>

          <Link
            href="/articles"
            className="hover:text-primary transition-colors"
          >
            Articles
          </Link>

          <Link
            href="/collections"
            className="hover:text-primary transition-colors"
          >
            Collections
          </Link>

          <Link
            href="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>

          <Link
            href="/creator/dashboard"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() =>
              setThemeMode((mode) =>
                mode === "dark" ? "light" : "dark"
              )
            }
            className="rounded-md p-2 hover:bg-secondary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 rounded-md px-3 py-2 border border-input"
          />
        </div>
      </div>
    </header>
  );
};