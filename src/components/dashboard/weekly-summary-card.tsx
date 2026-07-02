"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { useFocusStore } from "@/stores/focusStore";
import { statisticsEngine } from "@/game/systems/statisticsEngine";
import { Zap, Coins, Clock, CheckSquare, Flame, Sparkles, TrendingUp } from "lucide-react";

export function WeeklySummaryCard() {
  const { user } = useUserStore();
  const { missions } = useMissionStore();
  const { historyLogs } = useStatisticsStore();
  const { history } = useFocusStore();

  const userStreak = user?.streak ?? 0;
  const summary = statisticsEngine.getWeeklySummary(
    historyLogs,
    missions,
    history,
    userStreak
  );

  return (
    <Card className="p-5 border-border-theme h-full flex flex-col justify-between select-none">
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <TrendingUp size={14} className="text-accent" />
            Weekly Summary
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            Dynamic performance stats over the last 7 days
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Zap size={14} className="text-accent fill-current" />
              <span>Weekly XP</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">+{summary.weeklyXP} XP</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Coins size={14} className="text-amber-500 fill-current" />
              <span>Weekly Coins</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">+{summary.weeklyCoins}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={14} className="text-emerald-500" />
              <span>Focus Hours</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">{summary.weeklyFocusHours} hrs</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckSquare size={14} className="text-purple-500" />
              <span>Completed Missions</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">{summary.weeklyMissions}</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={14} className="text-blue-500" />
              <span>Avg Daily Focus</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">{summary.averageDailyFocusMinutes} mins</span>
          </div>

          <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <Flame size={14} className="text-amber-500 fill-current" />
              <span>Current Streak</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">{summary.streak} Days</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-theme flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Sparkles size={14} className="text-amber-500" />
          <span>Productivity Score:</span>
        </div>
        <div className="text-right">
          <span className="font-black text-accent font-mono block text-sm">{summary.productivityScore} / 100</span>
          <span className="text-[9px] uppercase font-bold text-text-secondary">{summary.productivityTier}</span>
        </div>
      </div>
    </Card>
  );
}
