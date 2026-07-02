"use client";

import React from "react";
import { Sparkles, Swords, BookOpen, Flame, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { loreData } from "../data";

export function LoreView() {
  const getIcon = (char?: string) => {
    switch (char) {
      case "Procrastination Dragon":
        return Swords;
      case "Distraction Goblin":
        return Flame;
      case "Social Media Kraken":
        return Compass;
      default:
        return BookOpen;
      case undefined:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_200ms_ease]">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
          StudyQuest Lore
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Explore the lore, entities, and background stories of the Valley of Focus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loreData.map((item) => {
          const Icon = getIcon(item.character);
          return (
            <Card key={item.id} className="p-6 border border-border-theme bg-card hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors pointer-events-none -mr-10 -mt-10" />

              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 rounded-2xl bg-accent/15 border border-accent/20 text-accent flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="inline-block text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full mt-1.5 border border-accent/20">
                        🏆 Unlock Badge: {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
