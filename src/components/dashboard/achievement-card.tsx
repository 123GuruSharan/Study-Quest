"use client";

import React from "react";
import { Trophy, Star, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AchievementProps {
  title: string;
  description: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  progress?: number; // e.g. 100 for completed, 40 for 40%
  completed?: boolean;
}

export function AchievementCard({
  title,
  description,
  tier,
  progress = 100,
  completed = true,
}: AchievementProps) {
  const getTierStyles = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return {
          ring: "border-amber-700/30 bg-amber-500/10 text-amber-700 dark:text-amber-500",
          glow: "bg-amber-500/5",
        };
      case "Silver":
        return {
          ring: "border-slate-400/30 bg-slate-400/10 text-slate-500 dark:text-slate-400",
          glow: "bg-slate-400/5",
        };
      case "Gold":
        return {
          ring: "border-amber-400/35 bg-amber-400/10 text-amber-500 dark:text-amber-400",
          glow: "bg-amber-400/5",
        };
      case "Platinum":
        return {
          ring: "border-sky-400/30 bg-sky-400/10 text-sky-500 dark:text-sky-400",
          glow: "bg-sky-400/5",
        };
      default:
        return {
          ring: "border-slate-350 bg-slate-100 text-slate-500",
          glow: "bg-slate-200/5",
        };
    }
  };

  const styles = getTierStyles(tier);

  return (
    <Card className="flex items-center gap-4 p-4 hover:border-accent/20 group relative overflow-hidden select-none">
      {/* Subtle tier background glow */}
      <div className={cn("absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl pointer-events-none", styles.glow)} />

      {/* Metallic Badge Emblem */}
      <div
        className={cn(
          "w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
          styles.ring
        )}
      >
        <Trophy size={20} className={completed ? "fill-current/10" : ""} />
      </div>

      {/* Meta Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-bold text-text-primary truncate">
            {title}
          </h5>
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-secondary/70 shrink-0">
            {tier}
          </span>
        </div>
        <p className="text-[11px] text-text-secondary truncate mt-0.5">
          {description}
        </p>

        {/* Progress tracker if incomplete */}
        {!completed && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-text-secondary">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
