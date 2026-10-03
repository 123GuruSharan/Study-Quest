"use client";

import React, { useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { DsaMasteryLevel, DsaTopic } from "../types/study";
import {
  Code,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
  Star,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const masteryLabels: Record<DsaMasteryLevel, { label: string; badge: string }> = {
  1: { label: "1. Familiar", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  2: { label: "2. Can Implement", badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  3: { label: "3. Can Solve", badge: "bg-purple-500/15 text-purple-600 dark:text-purple-400" },
  4: { label: "4. Interview Ready", badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  5: { label: "5. Mastered", badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
};

const categories = [
  "Foundations",
  "Arrays & Strings",
  "Hashing",
  "Linked List",
  "Stack & Queue",
  "Trees",
  "Heap",
  "Greedy",
  "Graphs",
  "Dynamic Programming",
  "Trie",
];

export function DsaTab() {
  const { dsaTopics, updateDsaTopicMastery, updateDsaTopicNotes } = useStudyStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  const filteredTopics = selectedCategory === "All"
    ? dsaTopics
    : dsaTopics.filter((t) => t.category === selectedCategory);

  const totalMastered = dsaTopics.filter((t) => t.masteryLevel >= 4).length;
  const overallMasteryPct = Math.round(
    (dsaTopics.reduce((acc, t) => acc + t.masteryLevel, 0) / (dsaTopics.length * 5)) * 100
  );

  return (
    <div className="space-y-6">
      
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
            selectedCategory === "All"
              ? "bg-accent text-white border-accent shadow-xs"
              : "bg-card border-border-theme text-text-secondary hover:text-text-primary"
          }`}
        >
          All Topics ({dsaTopics.length})
        </button>
        {categories.map((cat) => {
          const count = dsaTopics.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat
                  ? "bg-accent text-white border-accent shadow-xs"
                  : "bg-card border-border-theme text-text-secondary hover:text-text-primary"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;

          return (
            <div
              key={topic.id}
              className="bg-card border border-border-theme/70 rounded-2xl p-5 shadow-xs transition-all hover:border-border-theme space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {topic.category}
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {topic.description}
                  </p>
                </div>

                {/* Mastery Level Badge */}
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 ${masteryLabels[topic.masteryLevel].badge}`}>
                  {masteryLabels[topic.masteryLevel].label}
                </span>
              </div>

              {/* Mastery Level Selector Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-border-theme/40">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Mastery Level:
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {([1, 2, 3, 4, 5] as DsaMasteryLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateDsaTopicMastery(topic.id, lvl)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        topic.masteryLevel === lvl
                          ? "bg-accent text-white border-accent shadow-xs"
                          : "bg-slate-50 dark:bg-slate-900 border-border-theme/60 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Lvl {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Concepts List */}
              <div className="space-y-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-border-theme/40 text-xs">
                <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block">
                  Key Concepts:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                  {topic.keyConcepts.map((concept, i) => (
                    <li key={i}>{concept}</li>
                  ))}
                </ul>
              </div>

              {/* Expand Toggle for Code Snippet & Notes */}
              <div className="pt-1">
                <button
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={14} /> Hide Code & Notes
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> View Sample Code & Notes
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-border-theme/40 animate-[fadeIn_200ms_ease]">
                    {topic.sampleCode && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                          Reference Code:
                        </span>
                        <pre className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto select-text">
                          <code>{topic.sampleCode}</code>
                        </pre>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                        Personal Study Notes:
                      </span>
                      <textarea
                        value={topic.notes || ""}
                        onChange={(e) => updateDsaTopicNotes(topic.id, e.target.value)}
                        placeholder="Add revision notes, common traps, or approach summaries..."
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
