"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverElevation?: boolean;
}

export function Card({ children, className, hoverElevation = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-theme bg-card p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.15)]",
        hoverElevation && "glow-card",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
