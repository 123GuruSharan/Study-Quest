"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { Calendar, Target, Trophy, Award, Flame, Star, Sparkles, Gift } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

export function JourneyTimeline() {
  const mounted = useMounted();
  const { journeyLog } = useUserStore();

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-secondary select-none">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mb-2" />
        <span className="text-xs">Loading study memories...</span>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mission":
        return <Target size={14} className="text-accent" />;
      case "achievement":
        return <Trophy size={14} className="text-purple-500" />;
      case "level":
        return <Award size={14} className="text-blue-500" />;
      case "streak":
        return <Flame size={14} className="text-amber-500" />;
      case "boss":
        return <Sparkles size={14} className="text-red-500" />;
      case "reward":
        return <Gift size={14} className="text-emerald-500" />;
      default:
        return <Star size={14} className="text-slate-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="p-6 border-border-theme select-none">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Journey Timeline
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Your digital memory — a chronological history of major milestones
          </p>
        </div>

        {journeyLog.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border-theme rounded-xl text-xs text-text-secondary">
            No milestones registered yet. Lock targets and complete focus logs to start tracking history!
          </div>
        ) : (
          <div className="relative border-l border-border-theme pl-5 ml-2.5 space-y-6 pt-2">
            {journeyLog.map((entry, idx) => (
              <div key={entry.id || idx} className="relative group animate-[fadeIn_200ms_ease]">
                {/* Visual Timeline Node */}
                <div className="absolute -left-7.5 top-0.5 w-5 h-5 rounded-full bg-card border border-border-theme flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200">
                  {getCategoryIcon(entry.category)}
                </div>

                {/* Entry content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                      {entry.title}
                    </h4>
                    <span className="text-[9px] font-bold text-text-secondary bg-slate-50 dark:bg-slate-800/40 border border-border-theme/40 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      {entry.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-normal max-w-lg">
                    {entry.description}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-text-secondary/70 pt-0.5">
                    <Calendar size={10} />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
