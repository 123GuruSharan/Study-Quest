"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
  children: React.ReactNode;
}

export function Badge({ children, className, variant = "secondary", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium select-none transition-colors border";

  const variants = {
    primary: "bg-accent/10 border-accent/20 text-accent dark:text-blue-400",
    secondary: "bg-slate-100 dark:bg-slate-800 border-border-theme text-text-secondary dark:text-slate-400",
    success: "bg-success/10 border-success/20 text-success dark:text-emerald-400",
    warning: "bg-warning/10 border-warning/20 text-warning dark:text-amber-400",
    danger: "bg-danger/10 border-danger/20 text-danger dark:text-red-400",
    outline: "bg-transparent border-border-theme text-text-secondary dark:text-slate-400",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
