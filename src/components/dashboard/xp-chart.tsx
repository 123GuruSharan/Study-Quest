"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Card } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";
import { TrendingUp, Award, Clock, Sparkles } from "lucide-react";

import { useStatisticsStore } from "@/stores/statisticsStore";
import { useMissionStore } from "@/stores/missionStore";
import { useFocusStore } from "@/stores/focusStore";
import { statisticsEngine } from "@/game/systems/statisticsEngine";

export function XPChart() {
  const mounted = useMounted();
  const [activeType, setActiveType] = useState<"xp" | "hours" | "missions" | "coins">("xp");
  const [daysRange, setDaysRange] = useState<7 | 30 | 90>(7);
  
  const { historyLogs } = useStatisticsStore();
  const { missions } = useMissionStore();
  const { history } = useFocusStore();

  if (!mounted) {
    return (
      <Card className="h-[360px] flex items-center justify-center bg-card border-border-theme">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-xs text-text-secondary">Loading study analytics...</p>
        </div>
      </Card>
    );
  }

  // Generate graph dataset dynamically via statistics engine
  const dataset = statisticsEngine.getGraphDataset(
    historyLogs,
    daysRange,
    activeType,
    missions,
    history
  );

  // Compute category focus distribution
  const categoryData = statisticsEngine.getCategoryDistribution(missions);

  const categoryColors: { [key: string]: string } = {
    Algorithms: "#2563EB",
    Languages: "#10B981",
    "Deep Work": "#F59E0B",
    Reading: "#EF4444",
    Math: "#A855F7",
    "Systems Programming": "#06B6D4",
    "Database Systems": "#EC4899",
  };

  const getFormatLabel = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = parseFloat((mins / 60).toFixed(1));
    return `${hrs}h`;
  };

  // Check if any study activity actually exists
  const hasData = historyLogs.some((l) => l.minutesFocused > 0 || l.xpEarned > 0) || history.length > 0;

  if (!hasData) {
    return (
      <Card className="flex flex-col h-full bg-card border-border-theme p-6 select-none min-h-[350px] justify-center items-center text-center">
        <div className="max-w-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              No study history yet
            </h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Complete your first focus session or study mission to unlock your real-time analytics dashboard.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const weeklyHoursTotal = parseFloat(
    (historyLogs.reduce((acc, log) => acc + log.minutesFocused, 0) / 60).toFixed(1)
  );

  return (
    <Card className="flex flex-col h-full bg-card border-border-theme p-5">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 mb-6 border-b border-border-theme/40 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <TrendingUp size={14} className="text-accent" />
              Real-Time Study Analytics
            </h3>
            <p className="text-[10px] text-text-secondary mt-0.5">
              Multi-dimensional activity tracking and category focus intensity
            </p>
          </div>

          {/* Range Control Tabs (7d / 30d / 90d) */}
          <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-border-theme self-start md:self-auto">
            {([7, 30, 90] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDaysRange(r)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  daysRange === r
                    ? "bg-card text-text-primary shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {r} Days
              </button>
            ))}
          </div>
        </div>

        {/* Metric Type Filters */}
        <div className="flex flex-wrap gap-1.5">
          {(["xp", "hours", "missions", "coins"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                activeType === type
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "border-border-theme/60 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {type === "xp" && "XP Gained"}
              {type === "hours" && "Study Hours"}
              {type === "missions" && "Missions Completed"}
              {type === "coins" && "Coins Earned"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[260px]">
        {/* Graph Display Area (2/3 columns) */}
        <div className="lg:col-span-2 h-[260px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataset} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-theme)" opacity={0.5} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-secondary)", fontSize: 10, fontWeight: 550 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-secondary)", fontSize: 10, fontWeight: 550 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-card/95 border border-border-theme px-3 py-2.5 rounded-xl shadow-lg backdrop-blur-md text-left space-y-1">
                        <p className="text-[10px] font-bold text-text-secondary">
                          {item.day} Activity
                        </p>
                        <div className="space-y-0.5 text-[10px] font-medium text-text-secondary">
                          <p className="flex justify-between gap-4">
                            <span>Focus XP:</span>
                            <span className="font-extrabold text-accent font-mono">+{item.xp} XP</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span>Focus Hours:</span>
                            <span className="font-extrabold text-text-primary font-mono">{item.hours}h</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span>Missions:</span>
                            <span className="font-extrabold text-purple-500 font-mono">{item.missions}</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span>Coins:</span>
                            <span className="font-extrabold text-amber-500 font-mono">+{item.coins}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--accent)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetric)"
                activeDot={{ r: 5, strokeWidth: 0, fill: "var(--accent)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Categories list (1/3 column) */}
        <div className="flex flex-col justify-between border-t border-border-theme pt-5 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <Award size={14} className="text-accent" />
              Category Focus
            </h4>

            <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1 scrollbar-thin">
              {categoryData.length === 0 ? (
                <p className="text-[10px] text-text-secondary italic">
                  No categories studied yet.
                </p>
              ) : (
                categoryData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-text-secondary">{item.name}</span>
                      <div className="space-x-1.5">
                        <span className="text-text-secondary/60 font-mono">({getFormatLabel(item.minutes)})</span>
                        <span className="text-text-primary">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: categoryColors[item.name] || "#64748B",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border-theme flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Clock size={13} />
              <span>Total Focused Time</span>
            </div>
            <span className="font-extrabold text-text-primary font-mono">{weeklyHoursTotal} Hours</span>
          </div>
        </div>

      </div>
    </Card>
  );
}
