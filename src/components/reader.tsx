"use client";

import * as React from "react";
import { Book } from "@/types";
import {
  Search,
  Bookmark,
  Highlighter,
  Sun,
  Moon,
  Sliders,
  Layout,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReaderProps {
  book: Book;
  onClose: () => void;
  className?: string;
}

interface ReaderHighlight {
  id: string;
  text: string;
  start: number;
  end: number;
  color: string;
  bookId: string;
}

interface ReaderNote {
  id: string;
  text: string;
  chapter: number;
  bookId: string;
}

export const Reader = ({
  book,
  onClose,
  className,
}: ReaderProps) => {
  const [themeMode, setThemeMode] = React.useState<"light" | "dark">(
    "light"
  );
  const [fontSize, setFontSize] = React.useState(16);
  const [lineHeight, setLineHeight] = React.useState(1.6);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentChapter, setCurrentChapter] = React.useState(1);

  const [bookmarks, setBookmarks] = React.useState<number[]>([]);

  const [highlights, setHighlights] = React.useState<
    ReaderHighlight[]
  >([]);

  const [notes, setNotes] = React.useState<ReaderNote[]>([]);

  const [position, setPosition] = React.useState(0);

  // Book chapters data (would come from database)
  const chapters = book.chapters || [
    "Chapter 1: The Beginning",
    "Chapter 2: Awakening",
    "Chapter 3: The Journey",
    "Chapter 4: The Challenge",
    "Chapter 5: The Resolution",
    "Chapter 6: Epilogue",
  ];

  // Initialize progress and reader data from book
  React.useEffect(() => {
    const initialProgress = book.readingProgress?.percentage || 0;
    const initialChapter = book.readingProgress?.chapter || 1;

    setProgress(initialProgress);
    setCurrentChapter(initialChapter);
    setPosition(book.readingProgress?.position || 0);

    // Convert stored Bookmark objects into chapter numbers
    if (book.bookmarks) {
      const bookmarkChapters = book.bookmarks
        .map((bookmark) => bookmark.chapter ?? bookmark.position)
        .filter((chapter): chapter is number => chapter !== undefined);

      setBookmarks(bookmarkChapters);
    }

    // Convert stored highlights into the reader's internal shape
    if (book.highlights) {
      const readerHighlights: ReaderHighlight[] = book.highlights.map(
        (highlight) => ({
          id:
            highlight.id ||
            `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          text: highlight.text || "",
          start: highlight.start || 0,
          end: highlight.end || 0,
          color: "yellow",
          bookId: book.id,
        })
      );

      setHighlights(readerHighlights);
    }

    // Convert stored notes into the reader's internal shape
    if (book.notes) {
      const readerNotes: ReaderNote[] = book.notes.map((note) => ({
        id:
          note.id ||
          `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: note.text || "",
        chapter: note.chapter ?? initialChapter,
        bookId: book.id,
      }));

      setNotes(readerNotes);
    }
  }, [book]);

  // Update progress when chapter changes
  React.useEffect(() => {
    if (chapters.length <= 1) {
      setProgress(0);
      setPosition(0);
      return;
    }

    const chapterProgress =
      ((currentChapter - 1) / (chapters.length - 1)) * 100;

    setProgress(chapterProgress);
    setPosition(chapterProgress);
  }, [currentChapter, chapters.length]);

  // Debounced progress save
  const debounce = (
    func: (...args: any[]) => void,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };

  const saveProgress = debounce(() => {
    // TODO: Save progress to database
    // Would call API:
    // POST /api/progress with
    // { workId, percentage, position, chapterId }

    console.log("Saving progress:", {
      percentage: progress,
      position,
      chapter: currentChapter,
    });
  }, 1000);

  // Update progress on scroll/position change
  React.useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;

      if (scrollHeight <= 0) {
        return;
      }

      const scrolledPercentage = Math.round(
        (scrollTop / scrollHeight) * 100
      );

      setProgress(scrolledPercentage);
      setPosition(scrolledPercentage);
      saveProgress();
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [saveProgress]);

  const addBookmark = () => {
    const bookmarkExists = bookmarks.includes(currentChapter);

    const newBookmarks = bookmarkExists
      ? bookmarks.filter((chapter) => chapter !== currentChapter)
      : [...bookmarks, currentChapter];

    setBookmarks(newBookmarks);
    saveProgress();
  };

  const addHighlight = (
    selectedText: string,
    start: number,
    end: number,
    color: string
  ) => {
    const newHighlight: ReaderHighlight = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: selectedText,
      start,
      end,
      color,
      bookId: book.id,
    };

    setHighlights((prev) => [
      newHighlight,
      ...prev,
    ]);

    saveProgress();
  };

  const addNote = (
    highlightId: string,
    content: string
  ) => {
    const newNote: ReaderNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: content,
      chapter: currentChapter,
      bookId: book.id,
    };

    setNotes((prev) => [newNote, ...prev]);
    saveProgress();

    // TODO: Associate note with highlightId when notes are persisted
    void highlightId;
  };

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);

    if (chapters.length <= 1) {
      setProgress(0);
      return;
    }

    setProgress(
      ((chapter - 1) / (chapters.length - 1)) * 100
    );
  };

  const chaptersData =
    book.chapters?.map(
      (chapter: string, index: number) => ({
        id: `${book.id}-chapter-${index}`,
        title: chapter,
        position: index,
      })
    ) ||
    chapters.map((title: string, index: number) => ({
      id: `${book.id}-chapter-${index}`,
      title,
      position: index,
    }));

  return (
    <section
      className={cn(
        "min-h-screen bg-background",
        themeMode === "dark" && "bg-gray-900",
        className
      )}
    >
      {/* Toolbar */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 py-3">
        {/* Left toolbar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
            aria-label="Close reader"
          >
            <X className="h-5 w-5" />
          </button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Fullscreen"
            onClick={() =>
              setIsFullscreen((fullscreen) => !fullscreen)
            }
          >
            {isFullscreen ? (
              <X className="h-4 w-4" />
            ) : (
              <Layout className="h-4 w-4" />
            )}
          </Button>

          <button
            type="button"
            onClick={() =>
              setThemeMode((mode) =>
                mode === "dark" ? "light" : "dark"
              )
            }
            className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Right toolbar */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => {
              /* Search modal */
            }}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Bookmarks"
            onClick={addBookmark}
          >
            <Bookmark className="h-4 w-4" />

            {bookmarks.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-primary/10 text-primary rounded px-2 py-0.5 text-xs">
                {bookmarks.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Highlights and notes"
            onClick={() => {
              /* Modal */
            }}
          >
            <Highlighter className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            onClick={() => {
              /* Open settings panel */
            }}
          >
            <Sliders className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="prose max-w-none lg:prose-lg px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 leading-tight">
          {book.title}{" "}
          {book.subtitle && (
            <span className="text-muted-foreground">
              : {book.subtitle}
            </span>
          )}
        </h1>

        {/* Chapter navigation */}
        {chapters.length > 1 && (
          <div className="border-t border-border/50 pt-6 mb-8">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Chapter
            </h2>

            <div className="flex gap-2">
              {chaptersData.map((chapter) => (
                <button
                  type="button"
                  key={chapter.id}
                  onClick={() =>
                    handleChapterChange(
                      chapter.position + 1
                    )
                  }
                  className={cn(
                    "flex-1 rounded-md border border-primary/20 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors",
                    currentChapter ===
                      chapter.position + 1 &&
                      "bg-primary/10 text-primary"
                  )}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reading content */}
        <div className="text-lg leading-relaxed text-gray-900 dark:text-gray-100">
          <p>
            This is where the book content would be
            rendered. The reading experience would
            prioritize optimal line length, comfortable
            typography, and seamless page navigation.
            Users can adjust font size, line height, and
            other reading settings to customize their
            experience.
          </p>

          <p>
            The reader automatically saves progress, so
            when you return to this book, you'll continue
            from exactly where you stopped. Bookmarks and
            highlights are saved locally and can be
            accessed through the toolbar.
          </p>
        </div>
      </div>

      {/* Reading settings panel (mobile) */}
      {(!isFullscreen || window.innerWidth < 768) && (
        <div className="fixed bottom-0 left-0 right-0 bg-background px-4 py-3 border-t border-border flex items-center justify-center gap-4">
          <Button
            size="sm"
            onClick={() =>
              setFontSize((size) =>
                Math.max(12, size - 2)
              )
            }
            aria-label="Decrease font size"
          >
            A-
          </Button>

          <span className="text-sm text-muted-foreground mr-4">
            {fontSize}px
          </span>

          <Button
            size="sm"
            onClick={() =>
              setFontSize((size) => size + 2)
            }
            aria-label="Increase font size"
          >
            A+
          </Button>

          <Button
            size="sm"
            onClick={() =>
              setLineHeight((height) =>
                Math.max(1.2, height - 0.1)
              )
            }
            aria-label="Decrease line height"
          >
            -
          </Button>

          <span className="text-sm text-muted-foreground mx-3">
            {lineHeight.toFixed(1)}
          </span>

          <Button
            size="sm"
            onClick={() =>
              setLineHeight((height) =>
                Math.min(2, height + 0.1)
              )
            }
            aria-label="Increase line height"
          >
            +
          </Button>
        </div>
      )}

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="prose lg:prose-xl max-w-none text-white">
            <h1 className="text-4xl font-bold mb-8">
              {book.title}
            </h1>

            {/* Content would fill the screen */}
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 rounded-full p-1 bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Exit fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
};