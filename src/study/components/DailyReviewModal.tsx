"use client";

import React, { useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { Star, Sparkles, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyReviewModal() {
  const {
    isReviewModalOpen,
    setReviewModalOpen,
    studyBlocks,
    dsaProblems,
    webdevTopics,
    currentDay,
    submitDailyReview,
  } = useStudyStore();

  const totalMinsCalculated = Math.round(
    studyBlocks.reduce((acc, b) => acc + (b.actualTimeSpentSeconds || (b.status === "Completed" ? b.durationMinutes * 60 : 0)), 0) / 60
  );

  const dsaAttemptedCount = dsaProblems.filter((p) => p.attempted).length;
  const dsaSolvedCount = dsaProblems.filter((p) => p.solved).length;
  const webdevCompletedCount = webdevTopics.filter((t) => t.completed).length;

  const [confidenceRating, setConfidenceRating] = useState<number>(4);
  const [strugglesText, setStrugglesText] = useState<string>("");
  const [selectedRevisionTopics, setSelectedRevisionTopics] = useState<string[]>([]);

  if (!isReviewModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDailyReview({
      studyTimeMinutes: totalMinsCalculated || 240,
      dsaAttempted: dsaAttemptedCount,
      dsaSolved: dsaSolvedCount,
      webdevTopicsCompleted: webdevCompletedCount,
      confidenceRating,
      strugglesText,
      revisionTopicIds: selectedRevisionTopics,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-card border border-border-theme rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-[fadeIn_200ms_ease]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border-theme pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-text-primary tracking-tight">
                DAY {currentDay} REVIEW &amp; REFLECTION
              </h3>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                Log your study performance and advance to Day {currentDay + 1}
              </p>
            </div>
          </div>

          <button
            onClick={() => setReviewModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Performance Summary Badges */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-border-theme/40 text-center">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase block">Study Time</span>
              <span className="text-base font-black text-text-primary">{totalMinsCalculated || 240}m</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase block">DSA Solved</span>
              <span className="text-base font-black text-blue-500">{dsaSolvedCount} / {dsaAttemptedCount}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase block">WebDev Topics</span>
              <span className="text-base font-black text-emerald-500">{webdevCompletedCount}</span>
            </div>
          </div>

          {/* Confidence Rating (1 - 5 Stars) */}
          <div className="space-y-1.5">
            <label className="font-bold text-text-secondary uppercase text-[10px]">
              How confident do you feel about today's concepts?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setConfidenceRating(star)}
                  className={`p-2 rounded-xl border transition-all ${
                    star <= confidenceRating
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                      : "bg-card border-border-theme text-slate-300 dark:text-slate-700"
                  }`}
                >
                  <Star size={20} className={star <= confidenceRating ? "fill-amber-400" : ""} />
                </button>
              ))}
              <span className="text-xs font-bold text-text-primary ml-2">{confidenceRating} / 5 Stars</span>
            </div>
          </div>

          {/* Struggles & Doubts Notes */}
          <div className="space-y-1">
            <label className="font-bold text-text-secondary uppercase text-[10px]">
              What did you struggle with today? (Confusing logic, bugs, traps)
            </label>
            <textarea
              placeholder="e.g. Struggled with two-pointer edge case when elements are equal..."
              value={strugglesText}
              onChange={(e) => setStrugglesText(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-border-theme">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> +100 XP Bonus for finishing day!
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setReviewModalOpen(false)}
                className="h-9 px-4 text-xs font-bold rounded-xl border-border-theme"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-accent to-purple-600 text-white shadow-xs hover:opacity-95"
              >
                Finish Day &amp; Advance
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
