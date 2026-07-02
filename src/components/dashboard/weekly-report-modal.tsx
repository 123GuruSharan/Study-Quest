"use client";

import React from "react";
import { X, Award, BarChart3, TrendingUp, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeeklyReportProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    totalHours: number;
    completionRate: number;
    bestSubject: string;
    weakestSubject: string;
    consistencyScore: number;
  };
}

export function WeeklyReportModal({ isOpen, onClose, data }: WeeklyReportProps) {
  const consistencyRank = data.consistencyScore >= 90 ? "S-Tier Focus" : "A-Tier Focus";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs select-none">
          {/* Modal Panel Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-card border border-border-theme p-6 rounded-2xl shadow-2xl flex flex-col gap-5 overflow-hidden"
          >
            {/* Background Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-accent to-blue-500 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-accent" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-text-primary">
                  Sunday Weekly Recap
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Main Recap Grid */}
            <div className="space-y-4">
              
              {/* Overall Consistency Meter */}
              <Card className="p-4 bg-slate-50/50 dark:bg-slate-850/10 border-border-theme/40 text-center">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">
                  Consistency Grade
                </span>
                <h4 className="text-2xl font-black text-accent tracking-tight">
                  {data.consistencyScore}% ({consistencyRank})
                </h4>
                <p className="text-[10px] text-text-secondary mt-1">
                  Based on daily target thresholds achieved this week.
                </p>
              </Card>

              {/* Weekly metrics list */}
              <div className="space-y-3">
                {/* Total Study Hours */}
                <div className="flex items-center justify-between text-xs py-1 border-b border-border-theme/40">
                  <span className="text-text-secondary font-medium">Weekly Focus Hours:</span>
                  <span className="font-extrabold text-text-primary">{data.totalHours.toFixed(1)} Hours</span>
                </div>

                {/* Completion rate */}
                <div className="flex items-center justify-between text-xs py-1 border-b border-border-theme/40">
                  <span className="text-text-secondary font-medium">Missions Completion rate:</span>
                  <span className="font-extrabold text-emerald-500">{data.completionRate}%</span>
                </div>

                {/* Best subject */}
                <div className="flex items-center justify-between text-xs py-1 border-b border-border-theme/40">
                  <span className="text-text-secondary font-medium">Dominant Subject:</span>
                  <span className="font-extrabold text-text-primary">{data.bestSubject}</span>
                </div>

                {/* Weakest subject */}
                <div className="flex items-center justify-between text-xs py-1 border-b border-border-theme/40">
                  <span className="text-text-secondary font-medium">Neglected Node:</span>
                  <span className="font-extrabold text-text-primary">{data.weakestSubject}</span>
                </div>
              </div>
            </div>

            {/* Weekly Rewards Bonus details */}
            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-start gap-3">
              <Award size={16} className="text-purple-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  Weekly Loot Chest Unlocked!
                </span>
                <p className="text-[9px] text-text-secondary leading-normal mt-0.5">
                  Your consistency index qualified you for a **Weekly Loot Chest**. Claim it in the surprise chest view!
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full text-xs font-semibold h-10 rounded-lg cursor-pointer"
            >
              Acknowledge Recap
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
