"use client";

import React, { useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { DsaProblem } from "../types/study";
import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  ExternalLink,
  Star,
  Clock,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const difficultyColors = {
  Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Hard: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export function ProblemsTab() {
  const {
    dsaProblems,
    addDsaProblem,
    toggleDsaProblemSolved,
    toggleDsaProblemRevision,
  } = useStudyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal Form State
  const [newProblem, setNewProblem] = useState<Omit<DsaProblem, "id">>({
    name: "",
    platform: "LeetCode",
    url: "",
    topic: "Arrays & Strings",
    pattern: "Two Pointers",
    difficulty: "Easy",
    attempted: true,
    solved: true,
    timeTakenMinutes: 20,
    approach: "",
    mistakes: "",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    confidenceRating: 4,
    revisionDate: new Date().toISOString().split("T")[0],
    needsRevision: false,
  });

  const filteredProblems = dsaProblems.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchesStatus =
      selectedStatus === "All"
        ? true
        : selectedStatus === "Solved"
        ? p.solved
        : selectedStatus === "Unsolved"
        ? !p.solved
        : selectedStatus === "Needs Revision"
        ? p.needsRevision
        : true;

    return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblem.name.trim()) return;
    await addDsaProblem(newProblem);
    setIsAddModalOpen(false);
    setNewProblem({
      name: "",
      platform: "LeetCode",
      url: "",
      topic: "Arrays & Strings",
      pattern: "Two Pointers",
      difficulty: "Easy",
      attempted: true,
      solved: true,
      timeTakenMinutes: 20,
      approach: "",
      mistakes: "",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      confidenceRating: 4,
      revisionDate: new Date().toISOString().split("T")[0],
      needsRevision: false,
    });
  };

  const totalSolved = dsaProblems.filter((p) => p.solved).length;
  const totalNeedsRevision = dsaProblems.filter((p) => p.needsRevision).length;

  return (
    <div className="space-y-6">

      {/* Header & Stats Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card border border-border-theme/70 rounded-2xl p-5 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            DSA Problem Tracker ({dsaProblems.length} Logged)
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Focus on understanding patterns and space/time complexity rather than question volume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {totalSolved} Solved
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400">
            {totalNeedsRevision} Needs Revision
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Add Problem
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-text-secondary" />
          <input
            type="text"
            placeholder="Search problems, patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
          />
        </div>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Topic Filter */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
        >
          <option value="All">All Topics</option>
          <option value="Foundations">Foundations</option>
          <option value="Arrays & Strings">Arrays & Strings</option>
          <option value="Hashing">Hashing</option>
          <option value="Linked List">Linked List</option>
          <option value="Stack & Queue">Stack & Queue</option>
          <option value="Trees">Trees</option>
          <option value="Heap">Heap</option>
          <option value="Greedy">Greedy</option>
          <option value="Graphs">Graphs</option>
          <option value="Dynamic Programming">Dynamic Programming</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Solved</option>
          <option value="Unsolved">Unsolved</option>
          <option value="Needs Revision">Needs Revision</option>
        </select>
      </div>

      {/* Problems List Grid */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border-theme/60 rounded-2xl p-6 text-text-secondary text-xs">
            No problems found matching your current filters.
          </div>
        ) : (
          filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className={`bg-card border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                prob.solved ? "border-border-theme/60" : "border-amber-500/40 bg-amber-500/5"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider border ${difficultyColors[prob.difficulty]}`}>
                      {prob.difficulty}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-text-secondary border border-border-theme/60">
                      {prob.platform}
                    </span>
                    <span className="text-xs font-bold text-accent">
                      {prob.topic} ({prob.pattern})
                    </span>
                  </div>

                  <a
                    href={prob.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors group"
                  >
                    <span>{prob.name}</span>
                    <ExternalLink size={14} className="text-text-secondary group-hover:text-accent shrink-0" />
                  </a>
                </div>

                {/* Right Quick Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDsaProblemSolved(prob.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      prob.solved
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-card border-border-theme text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{prob.solved ? "Solved" : "Mark Solved"}</span>
                  </button>

                  <button
                    onClick={() => toggleDsaProblemRevision(prob.id)}
                    className={`p-1.5 rounded-xl text-xs font-bold transition-all border ${
                      prob.needsRevision
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400"
                        : "border-border-theme/60 text-text-secondary hover:text-text-primary"
                    }`}
                    title={prob.needsRevision ? "Marked for revision" : "Flag for revision"}
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              {/* Approach & Mistakes details */}
              {(prob.approach || prob.mistakes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  {prob.approach && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border-theme/40 space-y-1">
                      <span className="font-bold text-text-primary text-[11px] uppercase tracking-wider block">
                        Approach:
                      </span>
                      <p className="text-text-secondary">{prob.approach}</p>
                    </div>
                  )}

                  {prob.mistakes && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wider block">
                        Key Learnings / Mistakes:
                      </span>
                      <p className="text-text-secondary">{prob.mistakes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Metadata Badges */}
              <div className="flex flex-wrap items-center justify-between text-xs text-text-secondary pt-2 border-t border-border-theme/40 gap-2">
                <div className="flex items-center gap-3">
                  <span>Time Complexity: <strong className="text-text-primary">{prob.timeComplexity}</strong></span>
                  <span>Space Complexity: <strong className="text-text-primary">{prob.spaceComplexity}</strong></span>
                  <span>Time Spent: <strong className="text-text-primary">{prob.timeTakenMinutes}m</strong></span>
                </div>

                {/* Confidence Stars */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold">Confidence:</span>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= prob.confidenceRating ? "fill-amber-400" : "text-slate-300 dark:text-slate-700"}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal: Add Problem */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
          <div className="bg-card border border-border-theme rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-[fadeIn_200ms_ease]">
            <div className="flex items-center justify-between border-b border-border-theme pb-3">
              <h3 className="text-base font-bold text-text-primary">Add DSA Problem to Tracker</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Problem Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3Sum"
                  value={newProblem.name}
                  onChange={(e) => setNewProblem({ ...newProblem, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Platform</label>
                  <select
                    value={newProblem.platform}
                    onChange={(e) => setNewProblem({ ...newProblem, platform: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="CodeStudio">CodeStudio</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Arrays & Strings"
                    value={newProblem.topic}
                    onChange={(e) => setNewProblem({ ...newProblem, topic: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Pattern</label>
                  <input
                    type="text"
                    placeholder="e.g. Two Pointers"
                    value={newProblem.pattern}
                    onChange={(e) => setNewProblem({ ...newProblem, pattern: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Problem URL</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={newProblem.url}
                  onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Approach Summary</label>
                <textarea
                  placeholder="Explain how you solved it..."
                  value={newProblem.approach}
                  onChange={(e) => setNewProblem({ ...newProblem, approach: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Time Complexity</label>
                  <input
                    type="text"
                    placeholder="e.g. O(n log n)"
                    value={newProblem.timeComplexity}
                    onChange={(e) => setNewProblem({ ...newProblem, timeComplexity: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Space Complexity</label>
                  <input
                    type="text"
                    placeholder="e.g. O(1)"
                    value={newProblem.spaceComplexity}
                    onChange={(e) => setNewProblem({ ...newProblem, spaceComplexity: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-theme">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 text-xs font-bold rounded-xl border-border-theme"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent/90"
                >
                  Save Problem
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
