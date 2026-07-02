"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { gameConfig } from "@/config/game";
import { useMounted } from "@/hooks/use-mounted";
import { CalendarDays } from "lucide-react";

export function LifeCalendar() {
  const mounted = useMounted();
  const { historyLogs } = useStatisticsStore();

  if (!mounted) {
    return (
      <Card className="p-5 h-[200px] flex items-center justify-center border-border-theme">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-text-secondary">Loading study calendar...</p>
        </div>
      </Card>
    );
  }

  // Generate date array for the last 140 days (20 weeks)
  const daysToShow = 140;
  const today = new Date();
  const dates: Date[] = [];

  for (let i = daysToShow - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d);
  }

  // Helpers to fetch log details for specific dates
  const getLogForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateDay = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dateDay}`;
    return historyLogs.find((log) => log.date === dateStr);
  };

  const getCellColorClass = (date: Date) => {
    const log = getLogForDate(date);
    if (!log) return "bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-700/60";

    const phoneLimit = gameConfig.dailyTargets.phoneUsageLimitMinutes;
    
    // Red indicator on phone limit overuse
    if (log.phoneUsageMinutes > phoneLimit) {
      return "bg-red-500/30 dark:bg-red-950/40 border border-red-500/40 dark:border-red-900/40 hover:bg-red-500/45 dark:hover:bg-red-900/60";
    }

    if (log.minutesFocused === 0) {
      return "bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-700/60";
    }

    // Green heatmap based on focus duration
    if (log.minutesFocused >= 120) {
      return "bg-emerald-600 dark:bg-emerald-500 border border-emerald-700/20 text-white hover:bg-emerald-500 dark:hover:bg-emerald-400";
    } else if (log.minutesFocused >= 60) {
      return "bg-emerald-500/60 dark:bg-emerald-600/60 border border-emerald-500/20 hover:bg-emerald-500 dark:hover:bg-emerald-600";
    } else {
      return "bg-emerald-500/20 dark:bg-emerald-800/20 border border-emerald-500/10 hover:bg-emerald-500/35 dark:hover:bg-emerald-800/40";
    }
  };

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMins = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
  };

  return (
    <Card className="p-5 flex flex-col justify-between border-border-theme select-none shadow-md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <CalendarDays size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Study Heatmap
              </h3>
              <p className="text-[10px] text-text-secondary mt-0.5">
                GitHub-style contribution board mapping focus history
              </p>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-1.5 text-[9px] font-semibold text-text-secondary self-start sm:self-auto">
            <span>Missed</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span>Productive</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-1 pt-1.5 scrollbar-thin">
          <div className="flex flex-wrap gap-1 min-w-[500px]">
            {dates.map((date, idx) => {
              const log = getLogForDate(date);
              const colorClass = getCellColorClass(date);
              const formattedDate = formatDateLabel(date);

              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-sm transition-all duration-300 relative cursor-pointer group shrink-0 ${colorClass}`}
                >
                  {/* Tooltip Popup */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-30 bg-slate-900 text-white text-[9px] font-bold py-1.5 px-2.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none text-left space-y-0.5">
                    <p className="border-b border-white/20 pb-0.5 mb-0.5">{formattedDate}</p>
                    {log && (log.minutesFocused > 0 || log.missionsCompleted > 0 || log.xpEarned > 0) ? (
                      <>
                        <p>Focus: {formatMins(log.minutesFocused)}</p>
                        <p>XP: +{log.xpEarned} XP</p>
                        <p>Missions: {log.missionsCompleted}</p>
                      </>
                    ) : (
                      <p className="text-white/60 italic">No study logged.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
