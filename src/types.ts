export interface AIProvenance {
  provider: string;
  model: string;
  modelVersion?: string;
  involvementType: "fullyAI" | "aiAssisted" | "humanWithAI" | "other";
  humanEdited?: boolean;
  humanEditor?: string;
  generationDate?: string;
  disclosure?: string;
}

export interface ReadingProgress {
  chapterId?: string;
  totalChapters?: number;
  chapter?: number;
  percentage?: number;
  position?: number;
}

export interface Bookmark {
  id?: string;
  chapter?: number;
  position?: number;
  title?: string;
}

export interface Highlight {
  id?: string;
  chapter?: number;
  start?: number;
  end?: number;
  text?: string;
}

export interface Note {
  id?: string;
  chapter?: number;
  position?: number;
  text?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverUrl?: string;
  creatorId?: string;

  contentType?: "book" | "article" | "essay" | "other" | string;
  genre?: string;

  // Some parts of the app use tag objects rather than strings.
  tags?: string[] | { name: string }[];

  language?: string;
  status?: string;
  readingTime?: string;
  rating?: number;

  aiProvenance?: AIProvenance;

  chapters?: string[];

  readingProgress?: ReadingProgress;

  bookmarks?: Bookmark[];
  highlights?: Highlight[];
  notes?: Note[];
}