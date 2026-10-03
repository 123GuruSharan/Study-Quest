"use client";

import React, { useEffect } from "react";
import { useStudyStore, StudyTab } from "@/study/stores/studyStore";
import { TodayTab } from "@/study/components/TodayTab";
import { DsaTab } from "@/study/components/DsaTab";
import { WebDevTab } from "@/study/components/WebDevTab";
import { ProblemsTab } from "@/study/components/ProblemsTab";
import { ProjectsTab } from "@/study/components/ProjectsTab";
import { ProgressTab } from "@/study/components/ProgressTab";
import { DailyReviewModal } from "@/study/components/DailyReviewModal";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Brain,
  Code2,
  FolderGit2,
  BarChart3,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function StudyPage() {
  const {
    activeTab,
    setActiveTab,
    currentDay,
    setCurrentDay,
    studyBlocks,
    dsaTopics,
    dsaProblems,
    webdevTopics,
    loadFromStorage,
  } = useStudyStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Compute Stat Metrics
  const completedBlocks = studyBlocks.filter((b) => b.status === "Completed").length;
  const todayCompletionPct = studyBlocks.length > 0 ? Math.round((completedBlocks / studyBlocks.length) * 100) : 0;

  const totalTodayTimeMins = Math.round(
    studyBlocks.reduce(
      (acc, b) => acc + (b.actualTimeSpentSeconds || (b.status === "Completed" ? b.durationMinutes * 60 : 0)),
      0
    ) / 60
  );

  const dsaMasteredCount = dsaTopics.filter((t) => t.masteryLevel >= 4).length;
  const dsaProgressPct = dsaTopics.length > 0 ? Math.round((dsaMasteredCount / dsaTopics.length) * 100) : 0;

  const webdevCompletedCount = webdevTopics.filter((t) => t.completed).length;
  const webdevProgressPct = webdevTopics.length > 0 ? Math.round((webdevCompletedCount / webdevTopics.length) * 100) : 0;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const tabs: { id: StudyTab; label: string; icon: any }[] = [
    { id: "today", label: "Today", icon: Calendar },
    { id: "dsa", label: "DSA", icon: Brain },
    { id: "webdev", label: "WebDev", icon: Code2 },
    { id: "problems", label: "Problems", icon: BookOpen },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 pb-12 select-none">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-theme/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-accent/10 text-accent font-bold">
              <Sparkles size={20} />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-text-primary uppercase">
              STUDY
            </h1>
          </div>
          <p className="text-xs text-text-secondary font-bold tracking-widest uppercase mt-1">
            &quot;Plan. Learn. Practice. Master.&quot;
          </p>

          {/* Day 1 – Day 30 Dropdown Selector */}
          <div className="mt-3">
            <select
              aria-label="Select Study Day"
              value={currentDay}
              onChange={(e) => setCurrentDay(Number(e.target.value))}
              className="h-9 px-3.5 rounded-xl border border-border-theme bg-card text-xs font-bold text-text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-hidden transition-all shadow-2xs cursor-pointer"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => (
                <option key={dayNum} value={dayNum}>
                  Day {dayNum}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header Quick Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full md:w-auto">
          {/* Today Date */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">Today</div>
            <div className="text-xs font-extrabold text-text-primary truncate">{formattedDate}</div>
          </div>

          {/* Current Day */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">Current Day</div>
            <div className="text-xs font-black text-accent">Day {currentDay}</div>
          </div>

          {/* Today Completion % */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">Today Completion</div>
            <div className="text-xs font-black text-emerald-500">{todayCompletionPct}%</div>
          </div>

          {/* Today Study Time */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">Today Time</div>
            <div className="text-xs font-black text-text-primary">{totalTodayTimeMins}m</div>
          </div>

          {/* DSA Progress */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">DSA Progress</div>
            <div className="text-xs font-black text-blue-500">{dsaProgressPct}%</div>
          </div>

          {/* WebDev Progress */}
          <div className="bg-card border border-border-theme/70 rounded-xl p-2.5 shadow-2xs">
            <div className="text-[10px] font-bold text-text-secondary uppercase">WebDev Progress</div>
            <div className="text-xs font-black text-teal-500">{webdevProgressPct}%</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="flex items-center gap-1.5 border-b border-border-theme/60 overflow-x-auto scrollbar-none pb-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-accent text-accent bg-accent/5 dark:bg-accent/10"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Panel */}
      <div className="pt-2">
        {activeTab === "today" && <TodayTab />}
        {activeTab === "dsa" && <DsaTab />}
        {activeTab === "webdev" && <WebDevTab />}
        {activeTab === "problems" && <ProblemsTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "progress" && <ProgressTab />}
      </div>

      {/* End-of-Day Review Modal */}
      <DailyReviewModal />

    </div>
  );
}
