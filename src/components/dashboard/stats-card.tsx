"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  title: string;
  description: string;
  iconColorClass?: string;
  tooltip?: string;
}

export function StatsCard({
  icon: Icon,
  value,
  title,
  description,
  iconColorClass = "text-text-secondary bg-slate-50 dark:bg-slate-800/80 border border-border-theme",
  tooltip,
}: StatsCardProps) {
  return (
    <Card 
      className="flex flex-col justify-between h-full hover:border-accent/30 group cursor-help select-none"
      title={tooltip}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/80">
          {title}
        </span>
        <div className={cn("p-2 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110", iconColorClass)}>
          <Icon size={16} />
        </div>
      </div>
      <div>
        <h4 className="text-2xl font-extrabold tracking-tight text-text-primary font-sans">
          {value}
        </h4>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </Card>
  );
}
