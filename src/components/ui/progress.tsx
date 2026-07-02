"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // percentage or current value
  max?: number;  // if custom max is provided, e.g. 6000 XP
  className?: string;
  barClassName?: string;
  animate?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  animate = true,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={cn(
        "h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-border-theme/10",
        className
      )}
    >
      {animate ? (
        <motion.div
          className={cn(
            "h-full bg-accent rounded-full relative overflow-hidden",
            barClassName
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle reflection shimmer for premium look */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
        </motion.div>
      ) : (
        <div
          className={cn("h-full bg-accent rounded-full", barClassName)}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  );
}
