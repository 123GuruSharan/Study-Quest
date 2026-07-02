"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useMissionStore } from "@/stores/missionStore";
import { statisticsEngine } from "@/game/systems/statisticsEngine";
import { Brain, Star, Award, Zap, Clock, Bookmark } from "lucide-react";

export function SubjectIntelligenceCard() {
  const { missions } = useMissionStore();

  const intel = statisticsEngine.getSubjectIntelligence(missions);

  return (
    <Card className="p-5 border-border-theme h-full flex flex-col justify-between select-none">
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Brain size={14} className="text-accent" />
            Subject Intelligence
          </h3>
          <p className="text-[10px] text-text-secondary mt-0.5">
            AI-driven stats computed directly from completed missions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40 space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <Bookmark size={11} className="text-accent" />
              <span>Most Studied Subject</span>
            </div>
            <span className="text-sm font-black text-text-primary block">{intel.mostStudiedSubject}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40 space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <Clock size={11} className="text-emerald-500" />
              <span>Average Completion Time</span>
            </div>
            <span className="text-sm font-black text-text-primary block">{intel.averageCompletionTime}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40 space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <Zap size={11} className="text-amber-500" />
              <span>Fastest Completed</span>
            </div>
            <span className="text-sm font-black text-text-primary block">{intel.fastestCompletedSubject}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/35 border border-border-theme/40 space-y-1">
            <div className="flex items-center gap-1 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <Award size={11} className="text-purple-500" />
              <span>Hardest Subject</span>
            </div>
            <span className="text-sm font-black text-text-primary block">{intel.hardestSubject}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-theme flex items-center justify-between text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <Star size={13} className="text-amber-500 fill-amber-500" />
          Favorite Difficulty Tier:
        </span>
        <span className="font-extrabold text-text-primary uppercase tracking-wider">{intel.favoriteDifficulty}</span>
      </div>
    </Card>
  );
}
