"use client";

import React, { useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { WebDevTopic } from "../types/study";
import {
  Code2,
  CheckCircle2,
  Circle,
  Layers,
  ArrowRight,
  Database,
  Server,
  Globe,
  Terminal,
  Cpu,
} from "lucide-react";

const categories = ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "MERN"];

export function WebDevTab() {
  const { webdevTopics, toggleWebDevTopic } = useStudyStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredTopics = selectedCategory === "All"
    ? webdevTopics
    : webdevTopics.filter((t) => t.category === selectedCategory);

  const completedCount = webdevTopics.filter((t) => t.completed).length;
  const totalCount = webdevTopics.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* MERN Stack Architectural Flow Visualizer */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-emerald-500" size={20} />
            <h3 className="text-base font-extrabold text-text-primary">
              MERN Fullstack Request / Response Architecture Flow
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full">
            {completedCount}/{totalCount} Topics Mastered ({completionPct}%)
          </span>
        </div>

        {/* Visual Pipeline Flow Diagram */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 select-none">
          <div className="flex items-center gap-2 bg-card border border-border-theme px-3 py-2 rounded-xl text-xs font-bold text-text-primary shadow-2xs">
            <Globe size={16} className="text-blue-500" />
            <span>Frontend (React)</span>
          </div>
          <ArrowRight size={16} className="text-text-secondary shrink-0" />

          <div className="flex items-center gap-2 bg-card border border-border-theme px-3 py-2 rounded-xl text-xs font-bold text-text-primary shadow-2xs">
            <Terminal size={16} className="text-purple-500" />
            <span>API Request</span>
          </div>
          <ArrowRight size={16} className="text-text-secondary shrink-0" />

          <div className="flex items-center gap-2 bg-card border border-border-theme px-3 py-2 rounded-xl text-xs font-bold text-text-primary shadow-2xs">
            <Server size={16} className="text-emerald-500" />
            <span>Express Route & Controller</span>
          </div>
          <ArrowRight size={16} className="text-text-secondary shrink-0" />

          <div className="flex items-center gap-2 bg-card border border-border-theme px-3 py-2 rounded-xl text-xs font-bold text-text-primary shadow-2xs">
            <Database size={16} className="text-amber-500" />
            <span>Mongoose & MongoDB</span>
          </div>
          <ArrowRight size={16} className="text-text-secondary shrink-0" />

          <div className="flex items-center gap-2 bg-card border border-border-theme px-3 py-2 rounded-xl text-xs font-bold text-text-primary shadow-2xs">
            <Cpu size={16} className="text-teal-500" />
            <span>Response -&gt; React State Update</span>
          </div>
        </div>
      </div>

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
          All Topics ({webdevTopics.length})
        </button>
        {categories.map((cat) => {
          const count = webdevTopics.filter((t) => t.category === cat).length;
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
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`bg-card border rounded-2xl p-5 shadow-xs transition-all space-y-3.5 ${
              topic.completed ? "border-emerald-500/40 bg-emerald-500/5" : "border-border-theme/70 hover:border-border-theme"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {topic.category}
                </span>
                <h3 className="text-base font-bold text-text-primary">
                  {topic.title}
                </h3>
                <p className="text-xs text-text-secondary">
                  {topic.description}
                </p>
              </div>

              {/* Completion Checkbox */}
              <button
                onClick={() => toggleWebDevTopic(topic.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  topic.completed
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-card border-border-theme text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {topic.completed ? (
                  <>
                    <CheckCircle2 size={14} /> Completed
                  </>
                ) : (
                  <>
                    <Circle size={14} /> Mark Done
                  </>
                )}
              </button>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-1 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-border-theme/40 text-xs">
              <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block mb-1">
                Key Concepts & Takeaways:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                {topic.keyTakeaways.map((takeaway, i) => (
                  <li key={i}>{takeaway}</li>
                ))}
              </ul>
            </div>

            {/* Code Snippet if present */}
            {topic.codeSnippet && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Code Example:
                </span>
                <pre className="p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto select-text">
                  <code>{topic.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
