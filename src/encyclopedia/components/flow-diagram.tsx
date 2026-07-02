"use client";

import React, { useState } from "react";
import { ArrowRight, ChevronRight, Target, Lock, Clock, Zap, Swords, Trophy, Award, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FlowStep {
  id: string;
  name: string;
  icon: any;
  desc: string;
  color: string;
}

const steps: FlowStep[] = [
  {
    id: "create",
    name: "Create Mission",
    icon: Target,
    desc: "Define a task in draft state with titles, subject tags, dates, and rewards based on difficulty.",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
  {
    id: "lock",
    name: "Lock Mission",
    icon: Lock,
    desc: "Locking draft tasks moves them to your active study queue, preparing them to be logged.",
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    id: "timer",
    name: "Focus Timer",
    icon: Clock,
    desc: "Initiate the Pomodoro timer, linking it to your locked mission for active work intervals.",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  },
  {
    id: "damage",
    name: "Boss Damage",
    icon: Swords,
    desc: "Completing tasks inflicts damage to the weekly boss equal to the mission's XP reward.",
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  },
  {
    id: "payout",
    name: "Redeem Coins",
    icon: ShoppingBag,
    desc: "Collect XP, gold coins, and achievement progress to buy custom rewards in the shop.",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  }
];

export function FlowDiagram() {
  const [activeStepId, setActiveStepId] = useState<string>("create");

  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <div className="space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-border-theme">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id === activeStepId;
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStepId(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all transform hover:scale-105 cursor-pointer ${
                  isActive
                    ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                    : "bg-card border-border-theme text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={14} />
                <span>{step.name}</span>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight size={14} className="text-text-secondary/40 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <Card className="p-4 border-border-theme bg-card shadow-sm transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg border ${currentStep.color} shrink-0`}>
            <currentStep.icon size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              {currentStep.name} Details
            </h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              {currentStep.desc}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
