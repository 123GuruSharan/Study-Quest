"use client";

import React from "react";
import { useStudyStore } from "../stores/studyStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Trophy,
  Brain,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Star,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export function ProgressTab() {
  const { studyBlocks, dsaTopics, dsaProblems, webdevTopics, dailyReviews } = useStudyStore();

  const totalStudyMinutes = studyBlocks.reduce((acc, b) => acc + (b.actualTimeSpentSeconds || (b.status === "Completed" ? b.durationMinutes * 60 : 0)), 0) / 60;
  const dsaSolvedCount = dsaProblems.filter((p) => p.solved).length;
  const webdevCompletedCount = webdevTopics.filter((t) => t.completed).length;
  const topicsNeedingRevision = dsaProblems.filter((p) => p.needsRevision);

  // Subject breakdown for chart
  const subjectDistribution = [
    { name: "DSA", minutes: Math.round(studyBlocks.filter((b) => b.subject === "DSA" && b.status === "Completed").reduce((acc, b) => acc + b.durationMinutes, 0)) || 165 },
    { name: "WebDev", minutes: Math.round(studyBlocks.filter((b) => b.subject === "WEBDEV" && b.status === "Completed").reduce((acc, b) => acc + b.durationMinutes, 0)) || 135 },
    { name: "Interview Prep", minutes: Math.round(studyBlocks.filter((b) => b.subject === "INTERVIEW" && b.status === "Completed").reduce((acc, b) => acc + b.durationMinutes, 0)) || 30 },
    { name: "Projects", minutes: Math.round(studyBlocks.filter((b) => b.subject === "PROJECT" && b.status === "Completed").reduce((acc, b) => acc + b.durationMinutes, 0)) || 30 },
  ];

  // Weekly study hours mock/history
  const weeklyData = [
    { day: "Mon", dsaHours: 2.5, webdevHours: 2.0 },
    { day: "Tue", dsaHours: 3.0, webdevHours: 1.5 },
    { day: "Wed", dsaHours: 2.0, webdevHours: 2.5 },
    { day: "Thu", dsaHours: 3.5, webdevHours: 2.0 },
    { day: "Fri", dsaHours: 4.0, webdevHours: 3.0 },
    { day: "Sat", dsaHours: 3.0, webdevHours: 3.5 },
    { day: "Sun", dsaHours: 2.0, webdevHours: 2.0 },
  ];

  // DSA Mastery Levels Breakdown
  const masteryBreakdown = [1, 2, 3, 4, 5].map((lvl) => ({
    level: `Lvl ${lvl}`,
    count: dsaTopics.filter((t) => t.masteryLevel === lvl).length,
  }));

  return (
    <div className="space-y-6">

      {/* Quick Overview Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border-theme/70 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
            <Clock size={16} className="text-blue-500" /> Total Study Time
          </div>
          <div className="text-2xl font-black text-text-primary">
            {Math.round(totalStudyMinutes)} <span className="text-xs font-medium text-text-secondary">mins</span>
          </div>
        </div>

        <div className="bg-card border border-border-theme/70 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
            <Brain size={16} className="text-purple-500" /> Problems Solved
          </div>
          <div className="text-2xl font-black text-text-primary">
            {dsaSolvedCount} <span className="text-xs font-medium text-text-secondary">problems</span>
          </div>
        </div>

        <div className="bg-card border border-border-theme/70 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
            <Code2 size={16} className="text-emerald-500" /> WebDev Topics
          </div>
          <div className="text-2xl font-black text-text-primary">
            {webdevCompletedCount} <span className="text-xs font-medium text-text-secondary">topics</span>
          </div>
        </div>

        <div className="bg-card border border-border-theme/70 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-text-secondary text-xs font-bold">
            <AlertCircle size={16} className="text-amber-500" /> Revisions Needed
          </div>
          <div className="text-2xl font-black text-text-primary">
            {topicsNeedingRevision.length} <span className="text-xs font-medium text-text-secondary">flagged</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weekly Study Hours Breakdown */}
        <div className="bg-card border border-border-theme/70 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            Weekly Study Hours (DSA vs WebDev)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="dsaHours" name="DSA (hrs)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="webdevHours" name="WebDev (hrs)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Time Distribution */}
        <div className="bg-card border border-border-theme/70 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-text-primary tracking-tight">
            Subject Time Distribution (Mins)
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="minutes"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
            {subjectDistribution.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{entry.name}: {entry.minutes}m</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Flagged Topics Needing Revision List */}
      <div className="bg-card border border-amber-500/30 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-500" />
          Flagged Topics &amp; Problems Needing Revision ({topicsNeedingRevision.length})
        </h3>
        {topicsNeedingRevision.length === 0 ? (
          <p className="text-xs text-text-secondary italic">No topics flagged for revision yet. Great job!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {topicsNeedingRevision.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="font-bold text-text-primary truncate">{p.name}</div>
                <div className="text-[11px] text-text-secondary">{p.topic} • {p.pattern}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
