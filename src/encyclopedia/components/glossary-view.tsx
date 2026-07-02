"use client";

import React, { useState } from "react";
import { Search, Sparkles, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { glossaryData } from "../data";

export function GlossaryView() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(glossaryData.map((item) => item.category)))];

  const filtered = glossaryData.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.definition.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === "All" || item.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_200ms_ease]">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
          StudyQuest Glossary
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Look up definitions of core game terminology, abbreviations, and variables.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" />
          <input
            type="text"
            placeholder="Search glossary terms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus-visible:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Category select filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 h-10 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                category === cat
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "bg-card border border-border-theme text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center border-border-theme bg-card max-w-md mx-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border-theme flex items-center justify-center text-text-secondary mx-auto mb-3">
            <BookOpen size={18} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            No terms found
          </h3>
          <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
            We couldn't find any terms matching your criteria. Try adjusting your query or category filters.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Card key={item.term} className="p-5 border-border-theme bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                  {item.term}
                </h4>
                <span className="text-[9px] font-bold text-text-secondary/70 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {item.definition}
              </p>
              {item.symbol && (
                <div className="absolute right-3 bottom-2 text-[18px] font-black text-slate-100 dark:text-slate-900 pointer-events-none select-none opacity-40 font-mono">
                  {item.symbol}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
