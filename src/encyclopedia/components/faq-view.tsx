"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { faqData } from "../data";

export function FaqView() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<string[]>(["faq_no_xp"]);

  const toggleOpen = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((x) => x !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const filtered = faqData.filter((item) => {
    return (
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-[fadeIn_200ms_ease]">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Find answers to common questions about rewards, leveling, boss combat, and streak rules.
        </p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus-visible:outline-none focus:border-accent transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center border-border-theme bg-card max-w-md mx-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border-theme flex items-center justify-center text-text-secondary mx-auto mb-3">
            <HelpCircle size={18} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            No FAQs found
          </h3>
          <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
            Try adjusting your search keywords to find the answers you need.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <Card
                key={item.id}
                className={`border-border-theme bg-card overflow-hidden transition-all duration-200 ${
                  isOpen ? "shadow-md border-accent/20" : ""
                }`}
              >
                <button
                  onClick={() => toggleOpen(item.id)}
                  className="w-full p-4 flex justify-between items-center text-left gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-text-primary leading-tight">
                      {item.question}
                    </h4>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-text-secondary/70 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-text-secondary/70 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-border-theme/40 bg-slate-50/30 dark:bg-slate-900/10 animate-[slideDown_150ms_ease]">
                    <p className="text-xs text-text-secondary leading-relaxed pl-1">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
