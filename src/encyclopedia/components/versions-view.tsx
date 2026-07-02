"use client";

import React from "react";
import { GitBranch, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { versionsData } from "../data";

export function VersionsView() {
  return (
    <div className="space-y-6 animate-[fadeIn_200ms_ease]">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-text-primary">
          Version History
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Review patch logs, system updates, and new gameplay features.
        </p>
      </div>

      <div className="relative border-l-2 border-border-theme/60 pl-6 ml-3.5 space-y-8">
        {versionsData.map((log) => (
          <div key={log.version} className="relative">
            {/* Timeline Marker */}
            <div className="absolute -left-[32px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-card bg-accent flex items-center justify-center shadow-sm shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-card" />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/25">
                  {log.version}
                </span>
                <span className="text-xs font-bold text-text-primary">
                  {log.title}
                </span>
                <span className="text-[10px] text-text-secondary flex items-center gap-1 ml-auto">
                  <Clock size={11} />
                  {log.date}
                </span>
              </div>

              <Card className="p-5 border-border-theme bg-card shadow-xs">
                <ul className="space-y-2">
                  {log.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                      <CheckCircle size={13} className="text-success mt-0.5 shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
