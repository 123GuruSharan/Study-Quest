export interface EncyclopediaSection {
  title?: string;
  type: "text" | "list" | "formula" | "table" | "tip" | "warning" | "progression" | "simulator";
  content?: string;
  items?: string[];
  formula?: {
    expression: string;
    variables: { name: string; desc: string }[];
    example: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface EncyclopediaChapter {
  id: string;
  chapterNumber: number;
  title: string;
  icon: string;
  description: string;
  readingTime: number; // in minutes
  unlockedAtLevel?: number;
  keywords: string[];
  sections: EncyclopediaSection[];
  didYouKnow?: string;
  related?: string[]; // list of chapter IDs
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  symbol?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  character?: string;
  badge?: string;
}

export interface VersionLog {
  version: string;
  date: string;
  title: string;
  changes: string[];
}
