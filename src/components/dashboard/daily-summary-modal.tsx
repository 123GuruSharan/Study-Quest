"use client";

import React from "react";
import { X, Trophy, Coins, Zap, Clock, Smartphone, Star, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DailySummaryProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    xpEarned: number;
    coinsEarned: number;
    studyHours: number;
    phoneMinutes: number;
    missionsCount: number;
    bossDamage: number;
    streakDays: number;
  };
}

export function DailySummaryModal({ isOpen, onClose, data }: DailySummaryProps) {
  const tomorrowXPGoal = 450;

  const formatMins = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem} mins`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs select-none">
          {/* Modal Card Backdrop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-card border border-border-theme p-6 rounded-2xl shadow-2xl flex flex-col gap-5 overflow-hidden"
          >
            {/* Background Accent Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-indigo-500 to-emerald-500 pointer-events-none" />

            {/* Title / Close Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-accent" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-text-primary">
                  Today's Study Summary
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Main stats layout */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* XP */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-accent">
                  <Zap size={14} className="fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">XP Gained</span>
                  <span className="text-sm font-black text-text-primary font-mono">+{data.xpEarned} XP</span>
                </div>
              </div>

              {/* Coins */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Coins size={14} className="fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Gold Coins</span>
                  <span className="text-sm font-black text-text-primary font-mono">+{data.coinsEarned} c</span>
                </div>
              </div>

              {/* Hours Focused */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <Clock size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Duration</span>
                  <span className="text-sm font-black text-text-primary font-mono">{data.studyHours.toFixed(1)} hrs</span>
                </div>
              </div>

              {/* Phone Usage */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                  <Smartphone size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Phone Screen</span>
                  <span className="text-sm font-black text-text-primary font-mono">{formatMins(data.phoneMinutes)}</span>
                </div>
              </div>

              {/* Completed count */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-500">
                  <Star size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Missions Done</span>
                  <span className="text-sm font-black text-text-primary font-mono">{data.missionsCount} Completed</span>
                </div>
              </div>

              {/* Streak info */}
              <div className="p-3.5 rounded-xl border border-border-theme/40 bg-slate-50/50 dark:bg-slate-800/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
                  <Flame size={14} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Streak Flame</span>
                  <span className="text-sm font-black text-text-primary font-mono">{data.streakDays} Days</span>
                </div>
              </div>
            </div>

            {/* Boss Damage info panel */}
            <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 block mb-1">
                Boss Damage Disbursed
              </span>
              <span className="text-lg font-black text-red-600 dark:text-red-400 font-mono">
                -{data.bossDamage.toLocaleString()} HP Damage
              </span>
            </div>

            {/* Tomorrow's Goals preview details */}
            <div className="pt-3 border-t border-border-theme flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Tomorrow's XP Target:</span>
              <span className="font-extrabold text-accent">{tomorrowXPGoal} XP</span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="w-full text-xs font-semibold h-10 rounded-lg cursor-pointer"
            >
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
