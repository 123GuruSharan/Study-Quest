"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Search,
  Star,
  Printer,
  ChevronRight,
  BookMarked,
  Maximize2,
  Minimize2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Award,
  Zap,
  Coins,
  Swords,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Compass,
  Target,
  Flame,
  Trophy,
  ShoppingBag,
  Sun,
  Moon
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { getBossForDefeatedCount } from "@/config/bosses";

import { chapters, glossaryData, faqData, loreData, versionsData, EncyclopediaChapter } from "../data";
import { FlowDiagram } from "./flow-diagram";
import { FormulaPlayground } from "./formula-playground";
import { BossSimulator } from "./boss-simulator";
import { GlossaryView } from "./glossary-view";
import { FaqView } from "./faq-view";
import { LoreView } from "./lore-view";
import { VersionsView } from "./versions-view";

const topSearches = ["XP", "Boss", "Mission", "Coins", "Penalty", "Streak"];

export function RuleBookView() {
  const { user } = useUserStore();
  const { missions } = useMissionStore();
  const xp = user?.xp ?? 0;
  const coins = user?.coins ?? 0;
  const { historyLogs } = useStatisticsStore();
  const { theme, toggleTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const searchParams = useSearchParams();

  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"book" | "glossary" | "faq" | "lore" | "versions">("book");

  // Core states
  const [activeChapterId, setActiveChapterId] = useState<string>("welcome");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readChapters, setReadChapters] = useState<string[]>([]);
  const [readingMode, setReadingMode] = useState<boolean>(false);
  
  // Feedback states
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "yes" | "no">>({});
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [showFeedbackInput, setShowFeedbackInput] = useState<Record<string, boolean>>({});

  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Load local settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBookmarked = localStorage.getItem("studyquest_bookmarked_chapters");
      if (savedBookmarked) setBookmarks(JSON.parse(savedBookmarked));

      const savedRead = localStorage.getItem("studyquest_read_chapters");
      if (savedRead) setReadChapters(JSON.parse(savedRead));

      const savedVotes = localStorage.getItem("studyquest_helpful_votes");
      if (savedVotes) setHelpfulVotes(JSON.parse(savedVotes));
    }
  }, []);

  // Handle deep-linking query parameters
  useEffect(() => {
    const chapterParam = searchParams.get("chapter");
    if (chapterParam) {
      setActiveSubTab("book");
      const found = chapters.find((c) => c.id === chapterParam);
      if (found) {
        setActiveChapterId(found.id);
        setTimeout(() => {
          scrollToChapter(found.id);
        }, 300);
      }
    }
  }, [searchParams]);

  // Click listener to dismiss search autocomplete suggestions dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Check locks status based on level
  const isChapterLocked = (chapter: EncyclopediaChapter) => {
    if (!chapter.unlockedAtLevel) return false;
    const currentLevel = user?.level || 1;
    return currentLevel < chapter.unlockedAtLevel;
  };

  const toggleBookmark = (chapterId: string) => {
    let next: string[];
    if (bookmarks.includes(chapterId)) {
      next = bookmarks.filter((id) => id !== chapterId);
    } else {
      next = [...bookmarks, chapterId];
    }
    setBookmarks(next);
    localStorage.setItem("studyquest_bookmarked_chapters", JSON.stringify(next));
  };

  const toggleReadStatus = (chapterId: string) => {
    let next: string[];
    if (readChapters.includes(chapterId)) {
      next = readChapters.filter((id) => id !== chapterId);
    } else {
      next = [...readChapters, chapterId];
    }
    setReadChapters(next);
    localStorage.setItem("studyquest_read_chapters", JSON.stringify(next));
  };

  const handleVote = (chapterId: string, vote: "yes" | "no") => {
    const next = { ...helpfulVotes, [chapterId]: vote };
    setHelpfulVotes(next);
    localStorage.setItem("studyquest_helpful_votes", JSON.stringify(next));

    if (vote === "no") {
      setShowFeedbackInput((prev) => ({ ...prev, [chapterId]: true }));
    } else {
      setShowFeedbackInput((prev) => ({ ...prev, [chapterId]: false }));
    }
  };

  const submitFeedback = (chapterId: string) => {
    setShowFeedbackInput((prev) => ({ ...prev, [chapterId]: false }));
    alert("Thank you for your feedback! We will use it to refine the encyclopedia.");
  };

  // Search filtering
  const getFilteredChapters = () => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase().trim();
    return chapters.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchKeywords = c.keywords.some((k) => k.toLowerCase().includes(q));
      const matchSections = c.sections.some((s) => s.content?.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchKeywords || matchSections;
    });
  };

  const filteredChapters = getFilteredChapters();

  // Search suggestions calculations
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const suggestions: string[] = [];

    chapters.forEach((c) => {
      if (c.title.toLowerCase().includes(q) && !suggestions.includes(c.title)) {
        suggestions.push(c.title);
      }
      c.keywords.forEach((k) => {
        if (k.toLowerCase().includes(q) && !suggestions.includes(k)) {
          suggestions.push(k);
        }
      });
    });

    return suggestions.slice(0, 5);
  };

  const searchSuggestions = getSearchSuggestions();

  // Reading progress stats
  const progressPercent = Math.round((readChapters.length / chapters.length) * 100);
  const remainingChapters = chapters.filter((c) => !readChapters.includes(c.id));
  const estimatedTimeLeft = remainingChapters.reduce((acc, c) => acc + c.readingTime, 0);

  const handleContinueReading = () => {
    const firstUnread = chapters.find((c) => !readChapters.includes(c.id));
    if (firstUnread) {
      setActiveChapterId(firstUnread.id);
      scrollToChapter(firstUnread.id);
    }
  };

  const scrollToChapter = (chapterId: string) => {
    const el = chapterRefs.current[chapterId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Get active chapter details for Reading Mode
  const activeChapterForReading = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  // Helper renderer to fetch Lucide icons dynamically
  const renderIcon = (name: string, size = 16, className = "") => {
    switch (name) {
      case "Sparkles": return <Sparkles size={size} className={className} />;
      case "RotateCw": return <BookOpen size={size} className={className} />;
      case "Zap": return <Zap size={size} className={className} />;
      case "Coins": return <Coins size={size} className={className} />;
      case "Target": return <Target size={size} className={className} />;
      case "Star": return <Star size={size} className={className} />;
      case "Compass": return <Compass size={size} className={className} />;
      case "Clock": return <Clock size={size} className={className} />;
      case "Flame": return <Flame size={size} className={className} />;
      case "TrendingUp": return <TrendingUp size={size} className={className} />;
      case "Swords": return <Swords size={size} className={className} />;
      case "Gift": return <BookOpen size={size} className={className} />;
      case "Trophy": return <Trophy size={size} className={className} />;
      case "ShoppingBag": return <ShoppingBag size={size} className={className} />;
      case "BarChart3": return <TrendingUp size={size} className={className} />;
      case "Calendar": return <Compass size={size} className={className} />;
      case "AlertTriangle": return <AlertCircle size={size} className={className} />;
      case "Award": return <Award size={size} className={className} />;
      case "ShieldAlert": return <AlertCircle size={size} className={className} />;
      default: return <BookOpen size={size} className={className} />;
    }
  };

  // Live status cards content resolver
  const renderLiveStatusCard = (chapterId: string) => {
    switch (chapterId) {
      case "xp":
        return (
          <Card className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-2 select-none">
            <h5 className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1">
              <Zap size={11} />
              Your Progress
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Current Level</span>
                <span className="font-bold text-text-primary">Level {user?.level || 1} ({user?.rankName || "Novice Mind"})</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Total XP</span>
                <span className="font-bold text-text-primary">{(user?.xp || 0).toLocaleString()} XP</span>
              </div>
            </div>
          </Card>
        );
      case "coins":
        return (
          <Card className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2 select-none">
            <h5 className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Coins size={11} />
              Your Progress
            </h5>
            <div>
              <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Current Gold Balance</span>
              <span className="text-base font-black text-text-primary">{(coins || 0).toLocaleString()} Coins</span>
            </div>
          </Card>
        );
      case "missions":
        const total = missions.length;
        const comp = missions.filter((m) => m.status === "Completed").length;
        const locked = missions.filter((m) => m.status === "Locked").length;
        return (
          <Card className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl space-y-2 select-none">
            <h5 className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1">
              <Target size={11} />
              Your Progress
            </h5>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Total</span>
                <span className="font-bold text-text-primary">{total}</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Completed</span>
                <span className="font-bold text-text-primary">{comp}</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Locked</span>
                <span className="font-bold text-text-primary">{locked}</span>
              </div>
            </div>
          </Card>
        );
      case "boss":
        const activeBoss = getBossForDefeatedCount(user?.bossesDefeatedCount || 0);
        return (
          <Card className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2 select-none">
            <h5 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <Swords size={11} />
              Your Progress
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Defeated count</span>
                <span className="font-bold text-text-primary">{user?.bossesDefeatedCount || 0} Bosses</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Active Boss HP</span>
                <span className="font-bold text-rose-500">
                  {(user?.bossHp !== undefined ? Math.min(user.bossHp, activeBoss.maxHp) : activeBoss.maxHp).toLocaleString()} / {activeBoss.maxHp.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        );
      case "streak":
        return (
          <Card className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-2 select-none">
            <h5 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-1">
              <Flame size={11} />
              Your Progress
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Current Streak</span>
                <span className="font-bold text-text-primary">{user?.streak || 0} Days</span>
              </div>
              <div>
                <span className="text-text-secondary/70 block text-[9px] uppercase font-bold">Active Multiplier</span>
                <span className="font-bold text-text-primary">{user?.comboMultiplier || 1.0}x Boost</span>
              </div>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  // Full Screen Focus Reading Mode Overlay
  if (readingMode) {
    const handleNextChapter = () => {
      const idx = chapters.findIndex((c) => c.id === activeChapterId);
      if (idx !== -1 && idx < chapters.length - 1) {
        setActiveChapterId(chapters[idx + 1].id);
      }
    };

    const handlePrevChapter = () => {
      const idx = chapters.findIndex((c) => c.id === activeChapterId);
      if (idx > 0) {
        setActiveChapterId(chapters[idx - 1].id);
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-background text-text-primary overflow-y-auto p-6 md:p-12 animate-[fadeIn_200ms_ease] select-text">
        <div className="max-w-2xl mx-auto space-y-8 relative">
          {/* Header Progress and Exit Buttons */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full">
                Chapter {activeChapterForReading.chapterNumber} / 20
              </span>
              <span className="text-xs font-bold text-text-secondary">
                {progressPercent}% Read
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 rounded-xl border border-border-theme hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-primary cursor-pointer"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReadingMode(false)}
                className="text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-border-theme text-text-primary hover:text-accent"
              >
                <Minimize2 size={13} />
                <span>Exit Focus Reading</span>
              </Button>
            </div>
          </div>

          {/* Reading Mode Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-2">
              {renderIcon(activeChapterForReading.icon, 24, "text-accent")}
              {activeChapterForReading.title}
            </h1>
            <p className="text-xs text-text-secondary italic">
              Estimated reading time: {activeChapterForReading.readingTime} min
            </p>
          </div>

          {/* Reading Mode Content */}
          <div className="space-y-6">
            {activeChapterForReading.sections.map((section, idx) => {
              if (section.type === "text") {
                return (
                  <p key={idx} className="text-sm text-text-secondary leading-relaxed">
                    {section.content}
                  </p>
                );
              }
              if (section.type === "list") {
                return (
                  <div key={idx} className="space-y-2">
                    {section.title && (
                      <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        {section.title}
                      </h4>
                    )}
                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-secondary leading-relaxed">
                      {section.items?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (section.type === "tip") {
                return (
                  <div key={idx} className="p-4 bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl flex gap-3 text-xs text-text-secondary leading-relaxed">
                    <CheckCircle size={15} className="text-success mt-0.5 shrink-0" />
                    <span>{section.content}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Bottom Navigation controls */}
          <div className="flex justify-between items-center pt-8 border-t border-border-theme">
            <Button
              variant="secondary"
              size="sm"
              disabled={activeChapterForReading.chapterNumber === 1}
              onClick={handlePrevChapter}
              className="text-xs font-bold rounded-xl cursor-pointer border border-border-theme text-text-primary hover:text-accent"
            >
              Previous Chapter
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={activeChapterForReading.chapterNumber === 20}
              onClick={handleNextChapter}
              className="text-xs font-bold rounded-xl cursor-pointer"
            >
              Next Chapter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative select-text print:p-0 print:m-0 print:border-none print:shadow-none animate-[fadeIn_200ms_ease]">
      
      {/* 1. Header Hero section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-border-theme/60 print:hidden">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary flex items-center gap-2.5">
            📖 StudyQuest Game Encyclopedia
          </h1>
          <p className="text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
            Everything you need to master your productivity journey. Learn every multiplier, calculation formula, chest probability, and gameplay systems.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-border-theme"
          >
            <Printer size={13} />
            <span>Print / Export PDF</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setReadingMode(true)}
            className="text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Maximize2 size={13} />
            <span>Focus Reading Mode</span>
          </Button>
        </div>
      </div>

      {/* 2. Top-level Encyclopedia sub-tabs */}
      <div className="flex gap-2 border-b border-border-theme pb-2 overflow-x-auto print:hidden">
        {[
          { id: "book", label: "Rule Book", icon: BookOpen },
          { id: "glossary", label: "Glossary", icon: BookMarked },
          { id: "faq", label: "FAQs", icon: HelpCircle },
          { id: "lore", label: "Game Lore", icon: Swords },
          { id: "versions", label: "Version History", icon: Award }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === tab.id
                  ? "bg-accent/15 text-accent border border-accent/25"
                  : "bg-card border border-border-theme text-text-secondary hover:text-text-primary"
              }`}
            >
              <TabIcon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Conditional Tab views rendering */}
      {activeSubTab === "book" && (
        <>
          {/* E-book Kindle-style progress header */}
          <Card className="p-4 border border-border-theme bg-card grid grid-cols-1 sm:grid-cols-3 items-center gap-4 print:hidden select-none">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary/70 uppercase font-bold tracking-wider">
                Reading Progress
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
                <span className="text-xs font-black text-text-primary">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            <div className="text-xs text-text-secondary sm:text-center">
              <span className="text-[10px] text-text-secondary/70 uppercase font-bold tracking-wider block">
                Estimated Time Left
              </span>
              <span className="font-bold text-text-primary">{estimatedTimeLeft} minutes</span>
            </div>

            <div className="flex justify-start sm:justify-end">
              {progressPercent === 100 ? (
                <div className="px-3.5 py-1.5 rounded-xl bg-success/15 border border-success/20 text-success text-[10px] font-black flex items-center gap-1.5 select-none animate-[fadeIn_300ms_ease]">
                  <Trophy size={13} />
                  <span>🏆 Rule Master Active Badge</span>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleContinueReading}
                  className="text-xs font-bold rounded-xl cursor-pointer border border-border-theme"
                >
                  Continue Reading →
                </Button>
              )}
            </div>
          </Card>

          {/* Search container & autocomplete dropdown */}
          <div ref={searchContainerRef} className="relative print:hidden">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 animate-pulse" />
            <input
              type="text"
              placeholder="Search Encyclopedia contents..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus-visible:outline-none focus:border-accent transition-colors"
            />

            {showSuggestions && (
              <Card className="absolute left-0 right-0 top-11 z-30 border-border-theme bg-card shadow-lg p-2.5 space-y-2 divide-y divide-border-theme/40 animate-[slideDown_150ms_ease] select-none">
                {/* Suggestions List */}
                {searchQuery.trim() && searchSuggestions.length > 0 && (
                  <div className="space-y-1 pb-2">
                    <span className="text-[9px] font-bold text-text-secondary/60 uppercase tracking-wider block px-2">Suggestions</span>
                    {searchSuggestions.map((sug) => (
                      <button
                        key={sug}
                        onClick={() => {
                          setSearchQuery(sug);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-2 py-1 text-xs text-text-secondary hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Top Searches / Empty Suggestions fallback */}
                {(!searchQuery.trim() || searchSuggestions.length === 0) && (
                  <div className="pt-2">
                    <span className="text-[9px] font-bold text-text-secondary/60 uppercase tracking-wider block px-2 mb-1.5">Top Searches</span>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {topSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setShowSuggestions(false);
                          }}
                          className="px-2 py-1 text-[10px] font-semibold bg-slate-50 dark:bg-slate-900 border border-border-theme rounded-lg text-text-secondary hover:text-accent cursor-pointer transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Bookmarks bar */}
          {bookmarks.length > 0 && (
            <Card className="p-3 border border-accent/15 bg-accent/[0.02] flex items-center gap-2 overflow-x-auto print:hidden select-none animate-[fadeIn_200ms_ease]">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1 shrink-0">
                <BookMarked size={12} />
                Bookmarks ({bookmarks.length}):
              </span>
              <div className="flex gap-1.5">
                {bookmarks.map((bId) => {
                  const ch = chapters.find((c) => c.id === bId);
                  if (!ch) return null;
                  return (
                    <button
                      key={bId}
                      onClick={() => scrollToChapter(bId)}
                      className="px-2.5 py-1 bg-card border border-border-theme hover:border-accent hover:text-accent text-[10px] font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      {ch.title}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Main layout split: left sticky nav, right scrolling chapters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative select-text">
            
            {/* Left side navigation (desktop only) */}
            <aside className="lg:col-span-1 sticky top-6 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 hidden lg:block print:hidden select-none">
              <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-3 mb-2.5">
                Chapters Index
              </h3>
              {filteredChapters.map((ch) => {
                const isActive = activeChapterId === ch.id;
                const isRead = readChapters.includes(ch.id);
                const isLocked = isChapterLocked(ch);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveChapterId(ch.id);
                        scrollToChapter(ch.id);
                      }
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                      isLocked
                        ? "opacity-40 cursor-not-allowed border-transparent text-text-secondary/60"
                        : isActive
                          ? "bg-accent/10 border-accent/20 text-accent font-bold"
                          : "bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {renderIcon(ch.icon, 13, isActive ? "text-accent" : "text-text-secondary")}
                    <span className="truncate flex-1">
                      {ch.chapterNumber}. {ch.title}
                    </span>
                    {isRead && !isLocked && <CheckCircle size={11} className="text-success shrink-0" />}
                  </button>
                );
              })}
            </aside>

            {/* Right side chapters stack */}
            <div className="lg:col-span-3 space-y-8 select-text">
              {filteredChapters.length === 0 ? (
                <Card className="p-8 text-center border-border-theme bg-card max-w-md mx-auto">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border-theme flex items-center justify-center text-text-secondary mx-auto mb-3">
                    <Search size={18} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    No chapters matched
                  </h3>
                  <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
                    Try deleting your search queries or typing general keywords like 'XP' or 'Boss'.
                  </p>
                </Card>
              ) : (
                filteredChapters.map((ch) => {
                  const isRead = readChapters.includes(ch.id);
                  const isBookmarked = bookmarks.includes(ch.id);
                  const isLocked = isChapterLocked(ch);

                  return (
                    <div
                      key={ch.id}
                      ref={(el) => {
                        chapterRefs.current[ch.id] = el;
                      }}
                      className="scroll-mt-6 border-b border-border-theme/40 pb-8 last:border-none select-text"
                    >
                      {isLocked ? (
                        <Card className="p-6 border border-amber-500/20 bg-amber-500/[0.01] flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden select-none">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <AlertCircle size={18} />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                            🔒 Chapter {ch.chapterNumber}: {ch.title}
                          </h4>
                          <p className="text-[10px] text-text-secondary leading-relaxed max-w-xs">
                            This chapter is locked under game progression rules. Reached **Level {ch.unlockedAtLevel}** to unlock this compendium entry.
                          </p>
                        </Card>
                      ) : (
                        <Card className="p-6 border-border-theme bg-card shadow-sm hover:shadow-md transition-shadow relative select-text overflow-hidden">
                          {/* Top Actions bar */}
                          <div className="flex justify-between items-start gap-4 mb-4 pb-2 border-b border-border-theme/40 print:hidden select-none">
                            <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                              Chapter {ch.chapterNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Read checkpoint toggle */}
                              <button
                                onClick={() => toggleReadStatus(ch.id)}
                                className={`p-1.5 rounded-lg border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800/40 text-text-secondary cursor-pointer transition-colors ${
                                  isRead ? "text-success bg-success/5 border-success/20 hover:bg-success/10" : ""
                                }`}
                                title={isRead ? "Mark as Unread" : "Mark as Read"}
                              >
                                <CheckCircle size={13} />
                              </button>

                              {/* Bookmark star */}
                              <button
                                onClick={() => toggleBookmark(ch.id)}
                                className={`p-1.5 rounded-lg border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800/40 text-text-secondary cursor-pointer transition-colors ${
                                  isBookmarked ? "text-amber-500 bg-amber-500/5 border-amber-500/20" : ""
                                }`}
                                title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                              >
                                <Star size={13} className={isBookmarked ? "fill-amber-500" : ""} />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-black text-text-primary flex items-center gap-2.5 select-text mb-2">
                            {renderIcon(ch.icon, 20, "text-accent")}
                            {ch.title}
                          </h3>

                          {/* Live progression cards (If applicable) */}
                          <div className="my-4 print:hidden">
                            {renderLiveStatusCard(ch.id)}
                          </div>

                          {/* Sections stack */}
                          <div className="space-y-4 select-text">
                            {ch.sections.map((section, sIdx) => {
                              if (section.type === "text") {
                                return (
                                  <p key={sIdx} className="text-xs text-text-secondary leading-relaxed">
                                    {section.content}
                                  </p>
                                );
                              }
                              if (section.type === "list") {
                                return (
                                  <div key={sIdx} className="space-y-1.5 pt-1">
                                    {section.title && (
                                      <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                                        {section.title}
                                      </h5>
                                    )}
                                    <ul className="list-disc pl-4 space-y-1 text-xs text-text-secondary leading-relaxed">
                                      {section.items?.map((item, i) => (
                                        <li key={i}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }
                              if (section.type === "tip") {
                                return (
                                  <div key={sIdx} className="p-3.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3 text-xs text-text-secondary leading-relaxed my-2 select-none">
                                    <CheckCircle size={14} className="text-success mt-0.5 shrink-0" />
                                    <span>{section.content}</span>
                                  </div>
                                );
                              }
                              if (section.type === "warning") {
                                return (
                                  <div key={sIdx} className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl flex gap-3 text-xs text-text-secondary leading-relaxed my-2 select-none">
                                    <AlertCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                                    <span>{section.content}</span>
                                  </div>
                                );
                              }
                              if (section.type === "formula" && section.formula) {
                                return (
                                  <div key={sIdx} className="p-4 bg-slate-50 dark:bg-slate-900/35 border border-border-theme/60 rounded-xl space-y-2 select-text font-sans my-3">
                                    {section.title && (
                                      <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
                                        🧮 {section.title}
                                      </h5>
                                    )}
                                    <div className="p-2.5 rounded-lg bg-card border border-border-theme font-mono text-xs text-accent font-bold text-center">
                                      {section.formula.expression}
                                    </div>
                                    <div className="space-y-1 pl-1 text-[11px]">
                                      {section.formula.variables.map((v, vIdx) => (
                                        <div key={vIdx} className="flex gap-1.5 text-text-secondary">
                                          <strong className="text-text-primary shrink-0">{v.name}:</strong>
                                          <span>{v.desc}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="pt-2 text-[10px] text-text-secondary/70 italic pl-1 border-t border-border-theme/40">
                                      <strong>Example:</strong> {section.formula.example}
                                    </div>
                                  </div>
                                );
                              }
                              if (section.type === "table" && section.table) {
                                return (
                                  <div key={sIdx} className="overflow-x-auto my-3 select-none">
                                    <table className="w-full text-[11px] text-left border-collapse border border-border-theme">
                                      <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/40 border-b border-border-theme">
                                          {section.table.headers.map((h, hIdx) => (
                                            <th key={hIdx} className="p-2 font-bold text-text-primary">{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {section.table.rows.map((row, rIdx) => (
                                          <tr key={rIdx} className="border-b border-border-theme/40 hover:bg-slate-50/20">
                                            {row.map((cell, cIdx) => (
                                              <td key={cIdx} className="p-2 text-text-secondary">{cell}</td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>

                          {/* Simulators / Flow Injection (If applicable) */}
                          {ch.id === "loop" && <FlowDiagram />}
                          {ch.id === "xp" && <FormulaPlayground />}
                          {ch.id === "boss" && <BossSimulator />}

                          {/* "Did You Know?" Callout */}
                          {ch.didYouKnow && (
                            <div className="mt-4 pt-3 border-t border-border-theme/45 text-[10px] text-text-secondary/80 flex items-start gap-2 select-none">
                              <Sparkles size={12} className="text-accent mt-0.5 shrink-0" />
                              <span>
                                <strong>Did you know?</strong> {ch.didYouKnow}
                              </span>
                            </div>
                          )}

                          {/* Related Chapters (Wikipedia style) */}
                          {ch.related && ch.related.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border-theme/40 flex flex-wrap items-center gap-1.5 text-[10px] print:hidden select-none">
                              <span className="text-text-secondary font-bold mr-1">Related:</span>
                              {ch.related.map((rId) => {
                                const relCh = chapters.find((c) => c.id === rId);
                                if (!relCh) return null;
                                return (
                                  <button
                                    key={rId}
                                    onClick={() => scrollToChapter(rId)}
                                    className="px-2 py-0.5 rounded-md border border-border-theme hover:border-accent hover:text-accent text-text-secondary font-semibold transition-colors cursor-pointer"
                                  >
                                    {relCh.title} →
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Helpfulness Survey */}
                          <div className="mt-6 pt-4 border-t border-border-theme/45 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 print:hidden select-none">
                            <div className="flex items-center gap-2 text-[10px] text-text-secondary font-semibold">
                              <span>Was this chapter helpful?</span>
                              <button
                                onClick={() => handleVote(ch.id, "yes")}
                                className={`p-1 rounded-md border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                                  helpfulVotes[ch.id] === "yes" ? "text-success bg-success/5 border-success/20" : ""
                                }`}
                              >
                                <ThumbsUp size={11} />
                              </button>
                              <button
                                onClick={() => handleVote(ch.id, "no")}
                                className={`p-1 rounded-md border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                                  helpfulVotes[ch.id] === "no" ? "text-danger bg-danger/5 border-danger/20" : ""
                                }`}
                              >
                                <ThumbsDown size={11} />
                              </button>
                            </div>

                            {showFeedbackInput[ch.id] && (
                              <div className="flex items-center gap-2 flex-1 max-w-sm">
                                <input
                                  type="text"
                                  placeholder="How can we improve this chapter?"
                                  value={feedbackText[ch.id] || ""}
                                  onChange={(e) => setFeedbackText((prev) => ({ ...prev, [ch.id]: e.target.value }))}
                                  className="w-full h-7 px-2 rounded-lg border border-border-theme bg-card text-[10px] focus-visible:outline-none"
                                />
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="h-7 px-3 text-[9px] font-bold rounded-lg cursor-pointer"
                                  onClick={() => submitFeedback(ch.id)}
                                >
                                  Submit
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </>
      )}

      {activeSubTab === "glossary" && <GlossaryView />}
      {activeSubTab === "faq" && <FaqView />}
      {activeSubTab === "lore" && <LoreView />}
      {activeSubTab === "versions" && <VersionsView />}

    </div>
  );
}
