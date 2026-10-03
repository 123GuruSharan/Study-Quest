"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  CheckCircle2,
  Sparkles,
  Search,
  HelpCircle,
  Clock,
  RefreshCw,
  CheckSquare,
  Square,
  Flame,
  Zap,
  Layers,
  Database,
  Server,
  UserCheck,
  Plus,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  Award,
  Terminal,
  FileCode2,
  Globe,
  Trash2,
  Edit2,
  ShieldCheck,
  Lock,
  Key,
  LogOut,
  Send,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  User,
  Activity,
  AlertTriangle,
  FileText,
  Sliders,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 1. DSA Timed Challenge Widget (Session 5: 11:00–12:00)
// - 2 medium problems
// - 30 min each
// - Show hints only when requested
// - Require final time/space complexity
// - Add self-review after each problem
// ---------------------------------------------------------------------------

interface TimedChallengeProblem {
  id: string;
  title: string;
  difficulty: "Medium";
  topic: string;
  timeLimitMinutes: number;
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  hints: string[];
  optimalSolution: string;
  targetTimeComplexity: string;
  targetSpaceComplexity: string;
}

const timedProblems: TimedChallengeProblem[] = [
  {
    id: "tp_1",
    title: "Challenge 1: Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window & Hash Set",
    timeLimitMinutes: 30,
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    exampleInput: "s = 'abcabcbb'",
    exampleOutput: "3 (Substring: 'abc')",
    hints: [
      "Use a dynamic sliding window [left, right] alongside a Set or Hash Map to store character frequencies.",
      "As you expand right, if s[right] is already in the set, increment left and remove s[left] until s[right] is unique.",
      "Track max window size = Math.max(maxLen, right - left + 1) at each step."
    ],
    optimalSolution: `function lengthOfLongestSubstring(s: string): number {
  const set = new Set<string>();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    targetTimeComplexity: "O(N)",
    targetSpaceComplexity: "O(min(N, M))",
  },
  {
    id: "tp_2",
    title: "Challenge 2: Container With Most Water",
    difficulty: "Medium",
    topic: "Two Pointers",
    timeLimitMinutes: 30,
    statement: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with x-axis form a container containing the most water.",
    exampleInput: "height = [1,8,6,2,5,4,8,3,7]",
    exampleOutput: "49 (Lines at index 1 & 8: min(8,7) * (8-1) = 49)",
    hints: [
      "Initialize two pointers: left = 0, right = height.length - 1.",
      "The area is limited by min(height[left], height[right]) * (right - left).",
      "To maximize area, move the pointer pointing to the shorter line inward."
    ],
    optimalSolution: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    const minH = Math.min(height[left], height[right]);
    const currentWater = minH * (right - left);
    maxWater = Math.max(maxWater, currentWater);
    
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
    targetTimeComplexity: "O(N)",
    targetSpaceComplexity: "O(1)",
  },
];

export function Day29DsaTimedChallengeWidget() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hintsUnlocked, setHintsUnlocked] = useState<Record<number, number>>({ 0: 0, 1: 0 });
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [userCode, setUserCode] = useState<Record<number, string>>({
    0: timedProblems[0].optimalSolution,
    1: timedProblems[1].optimalSolution,
  });
  const [complexityStated, setComplexityStated] = useState<Record<number, { time: string; space: string }>>({
    0: { time: "O(N)", space: "O(N)" },
    1: { time: "O(N)", space: "O(1)" },
  });
  const [selfReviewCheck, setSelfReviewCheck] = useState<Record<string, boolean>>({
    p0_bounds: false,
    p0_edge: false,
    p0_complexity: false,
    p1_bounds: false,
    p1_edge: false,
    p1_complexity: false,
  });
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  const prob = timedProblems[activeTab];

  const handleUnlockHint = () => {
    const current = hintsUnlocked[activeTab] || 0;
    if (current < prob.hints.length) {
      setHintsUnlocked({ ...hintsUnlocked, [activeTab]: current + 1 });
    }
  };

  const toggleReview = (key: string) => {
    setSelfReviewCheck((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunEvaluation = () => {
    const keyPrefix = `p${activeTab}_`;
    const passed = Object.keys(selfReviewCheck)
      .filter((k) => k.startsWith(keyPrefix))
      .every((k) => selfReviewCheck[k]);

    if (passed) {
      setSubmissionFeedback(`🎉 Timed Challenge ${activeTab + 1} Cleared! Verified optimal ${prob.targetTimeComplexity} time and ${prob.targetSpaceComplexity} space bounds.`);
    } else {
      setSubmissionFeedback(`⚠️ Review Checklist: Complete all self-review items for Challenge ${activeTab + 1} before submitting.`);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 29 DSA Timed Challenge Arena</h3>
            <p className="text-xs text-text-secondary">
              2 Medium Problems • 30 Min Limit Each • Strategic Hints & Self-Review Checklist
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          60 Min Total Timed Session
        </span>
      </div>

      {/* Problem Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {timedProblems.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setActiveTab(idx);
              setSubmissionFeedback(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              activeTab === idx
                ? "bg-accent text-white border-accent shadow-md"
                : "bg-background/60 text-text-secondary border-border-theme hover:bg-background hover:text-text-primary"
            }`}
          >
            <Code2 size={14} />
            <span>{p.title.split(": ")[1]}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
              30 Min
            </span>
          </button>
        ))}
      </div>

      {/* Problem Details */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-background/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">{prob.title}</h4>
          <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
            {prob.topic}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{prob.statement}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-accent block">Example Input:</span>
            <span className="text-text-primary">{prob.exampleInput}</span>
          </div>
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-emerald-400 block">Expected Output:</span>
            <span className="text-text-primary">{prob.exampleOutput}</span>
          </div>
        </div>

        {/* Hint System */}
        <div className="pt-2 flex items-center justify-between border-t border-border-theme/40">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles size={13} /> Hints ({hintsUnlocked[activeTab] || 0}/{prob.hints.length} Unlocked)
          </span>
          {(hintsUnlocked[activeTab] || 0) < prob.hints.length && (
            <Button
              onClick={handleUnlockHint}
              size="sm"
              variant="ghost"
              className="h-7 text-xs border border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <HelpCircle size={12} className="mr-1" /> Request Hint {(hintsUnlocked[activeTab] || 0) + 1}
            </Button>
          )}
        </div>

        {(hintsUnlocked[activeTab] || 0) > 0 && (
          <div className="space-y-1.5">
            {prob.hints.slice(0, hintsUnlocked[activeTab] || 0).map((h, i) => (
              <div key={i} className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-300">
                <span className="font-bold">Hint {i + 1}:</span> {h}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor & Complexity Panel */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Terminal size={14} className="text-accent" /> Solution Editor
            </label>
            <button
              onClick={() => setShowSolution({ ...showSolution, [activeTab]: !showSolution[activeTab] })}
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              <Eye size={12} /> {showSolution[activeTab] ? "Hide Reference" : "Show Reference"}
            </button>
          </div>
          {showSolution[activeTab] ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto">
              <pre>{prob.optimalSolution}</pre>
            </div>
          ) : (
            <textarea
              value={userCode[activeTab] || ""}
              onChange={(e) => setUserCode({ ...userCode, [activeTab]: e.target.value })}
              rows={7}
              className="w-full rounded-xl border border-border-theme bg-background/80 p-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          )}
        </div>

        {/* Complexity & Self-Review */}
        <div className="rounded-xl border border-border-theme bg-background/40 p-3.5 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-text-primary mb-2 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" /> Stated Complexity
            </h5>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-text-secondary block mb-1">Time Complexity:</label>
                <input
                  type="text"
                  value={complexityStated[activeTab]?.time || ""}
                  onChange={(e) =>
                    setComplexityStated({
                      ...complexityStated,
                      [activeTab]: { ...complexityStated[activeTab], time: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-border-theme bg-background p-2 font-mono text-xs text-text-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-secondary block mb-1">Space Complexity:</label>
                <input
                  type="text"
                  value={complexityStated[activeTab]?.space || ""}
                  onChange={(e) =>
                    setComplexityStated({
                      ...complexityStated,
                      [activeTab]: { ...complexityStated[activeTab], space: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-border-theme bg-background p-2 font-mono text-xs text-text-primary"
                />
              </div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-text-muted font-mono border-t border-border-theme/40">
            Target: {prob.targetTimeComplexity} Time | {prob.targetSpaceComplexity} Space
          </div>
        </div>
      </div>

      {/* Post-Problem Self-Review Checklist */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-card/60 p-4">
        <h5 className="text-xs font-bold text-text-primary flex items-center gap-2 mb-2.5">
          <UserCheck size={15} className="text-accent" /> Challenge {activeTab + 1} Post-Problem Self-Review
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            { key: `p${activeTab}_bounds`, label: "Verified array & window boundary conditions" },
            { key: `p${activeTab}_edge`, label: "Tested empty inputs & single element cases" },
            { key: `p${activeTab}_complexity`, label: "Justified final Time & Space complexity bounds" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => toggleReview(item.key)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                selfReviewCheck[item.key]
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-background/40 border-border-theme text-text-secondary"
              }`}
            >
              {selfReviewCheck[item.key] ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Square size={16} className="text-text-muted shrink-0" />
              )}
              <span className="text-[11px]">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border-theme/40">
          <Button
            onClick={handleRunEvaluation}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl"
          >
            <CheckCircle size={14} className="mr-1.5" /> Submit Challenge {activeTab + 1} Review
          </Button>
          {submissionFeedback && (
            <p className="text-xs text-amber-400 font-medium animate-fade-in">{submissionFeedback}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. DSA Final Mistake Review Widget (Session 6: 12:00–12:15)
// - Off-by-one errors
// - Wrong boundaries
// - Unnecessary nested loops
// - Incorrect data structure choice
// - Edge cases
// ---------------------------------------------------------------------------

interface MistakeCategory {
  category: string;
  description: string;
  bugExample: string;
  fixExample: string;
  preventionTip: string;
}

const mistakeCategories: MistakeCategory[] = [
  {
    category: "Off-by-One Errors",
    description: "Incorrect array index bounds (e.g. accessing arr[N] or looping while i <= arr.length).",
    bugExample: "for (let i = 0; i <= arr.length; i++) { ... }",
    fixExample: "for (let i = 0; i < arr.length; i++) { ... }",
    preventionTip: "Always double-check array length comparison: 0-indexed arrays run from 0 to N-1.",
  },
  {
    category: "Wrong Boundaries in Search",
    description: "Infinite loops in Binary Search caused by improper mid calculation or boundary movement.",
    bugExample: "while (left < right) { const mid = Math.floor((left+right)/2); left = mid; }",
    fixExample: "while (left <= right) { const mid = left + Math.floor((right-left)/2); left = mid + 1; }",
    preventionTip: "Use `left = mid + 1` and `right = mid - 1` to strictly shrink the search space.",
  },
  {
    category: "Unnecessary Nested Loops",
    description: "O(N²) brute force loops when a Hash Map, Two Pointers, or Monotonic Stack yields O(N).",
    bugExample: "for(i) for(j) if (arr[i] + arr[j] === target) return [i, j];",
    fixExample: "const map = new Map(); if (map.has(target - arr[i])) return [map.get(target-arr[i]), i];",
    preventionTip: "Before writing nested loops, ask: 'Can a Hash Map or Sort reduce time to linear or O(N log N)?'",
  },
  {
    category: "Incorrect Data Structure Choice",
    description: "Using raw Arrays for dynamic range extremes instead of Monotonic Deques or Heaps.",
    bugExample: "const max = Math.max(...windowArray); // O(K) inside sliding window loop -> O(N*K)",
    fixExample: "Maintain Monotonic Deque of indices for O(1) window maximum -> total O(N)",
    preventionTip: "Match problem constraints: Window extremes -> Monotonic Deque; Priority -> Heap; Lookup -> Map.",
  },
  {
    category: "Unhandled Edge Cases",
    description: "Code crashes on empty input [], single element [1], duplicate values, or all negative numbers.",
    bugExample: "let max = 0; // Fails when array contains only negative numbers e.g. [-5, -2]",
    fixExample: "let max = nums[0]; // Initialize with first array element",
    preventionTip: "Test your logic against 3 edge cases before coding: empty/null, N=1, and boundary values.",
  },
];

export function Day29CheatSheetWidget() {
  const [checkedMistakes, setCheckedMistakes] = useState<Record<number, boolean>>({});

  const toggleMistake = (idx: number) => {
    setCheckedMistakes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const reviewedCount = Object.values(checkedMistakes).filter(Boolean).length;

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">DSA Final Mistake & Edge Case Audit</h3>
            <p className="text-xs text-text-secondary">
              Review top 5 interview failure modes & error-prevention checklist
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {reviewedCount} / {mistakeCategories.length} Audited
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {mistakeCategories.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border-theme/60 bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border-theme/40 pb-2">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <AlertCircle size={14} className="text-red-400" /> {item.category}
              </span>
              <button
                onClick={() => toggleMistake(idx)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                  checkedMistakes[idx]
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-background/80 text-text-muted border border-border-theme"
                }`}
              >
                {checkedMistakes[idx] ? "✓ Audited" : "Mark Audited"}
              </button>
            </div>

            <p className="text-xs text-text-secondary">{item.description}</p>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-red-300">
                <span className="font-bold text-red-400 block mb-0.5">Bug Pattern:</span>
                <code>{item.bugExample}</code>
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-emerald-300">
                <span className="font-bold text-emerald-400 block mb-0.5">Correct Fix:</span>
                <code>{item.fixExample}</code>
              </div>
            </div>

            <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <span className="font-bold">Prevention Rule:</span> {item.preventionTip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: MERN Student Manager v3 (Session 13: 17:00–17:30)
// Presentation-ready full-stack dashboard with:
// - Responsive dashboard
// - Complete authentication
// - Full CRUD
// - Search/filter
// - Proper loading/error/empty states
// - Clean reusable components
// - Working MongoDB persistence
// ---------------------------------------------------------------------------

interface PresentationStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  gpa: number;
  status: "Active" | "Graduated" | "On Leave";
}

export function Day29AsyncProjectWidget() {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [students, setStudents] = useState<PresentationStudent[]>([
    { id: "std_101", name: "Aarav Sharma", email: "aarav@studyquest.edu", course: "Computer Science", gpa: 3.9, status: "Active" },
    { id: "std_102", name: "Ananya Patel", email: "ananya@studyquest.edu", course: "Data Science", gpa: 3.8, status: "Active" },
    { id: "std_103", name: "Rohan Verma", email: "rohan@studyquest.edu", course: "Software Engineering", gpa: 3.6, status: "On Leave" },
    { id: "std_104", name: "Diya Gupta", email: "diya@studyquest.edu", course: "AI & ML", gpa: 4.0, status: "Graduated" },
  ]);

  const [search, setSearch] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    course: string;
    gpa: number;
    status: "Active" | "Graduated" | "On Leave";
  }>({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverLog, setServerLog] = useState<string>("Production MERN Server Ready | Express ↔ MongoDB Replica set connected");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const executeApi = (log: string, action: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      action();
      setServerLog(log);
      setIsLoading(false);
    }, 300);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      executeApi(`PUT /api/students/${editingId} HTTP 200 OK -> Document updated in MongoDB`, () => {
        setStudents(
          students.map((s) =>
            s.id === editingId ? { ...s, ...formData, gpa: Number(formData.gpa) } : s
          )
        );
        setEditingId(null);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("Student record updated!");
      });
    } else {
      executeApi(`POST /api/students HTTP 201 Created -> Inserted into MongoDB collection`, () => {
        const created: PresentationStudent = {
          id: `std_${Date.now().toString().slice(-4)}`,
          ...formData,
          gpa: Number(formData.gpa),
        };
        setStudents([...students, created]);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("Student registered!");
      });
    }
  };

  const handleEdit = (s: PresentationStudent) => {
    setEditingId(s.id);
    setFormData({ name: s.name, email: s.email, course: s.course, gpa: s.gpa, status: s.status });
  };

  const handleDelete = (id: string) => {
    executeApi(`DELETE /api/students/${id} HTTP 200 OK -> Removed from MongoDB`, () => {
      setStudents(students.filter((s) => s.id !== id));
      setToastMessage("Student record removed.");
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">MERN Student Manager v3 (Presentation-Ready)</h3>
            <p className="text-xs text-text-secondary">
              Polished UI Components • Complete Auth • MongoDB Persistence • Full REST CRUD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={12} /> JWT Auth Active
          </span>
        </div>
      </div>

      {/* Network / REST Console Output */}
      <div className="mt-3 rounded-xl border border-border-theme/60 bg-black/60 p-2.5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Terminal size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">{serverLog}</span>
        </div>
        {isLoading && <RefreshCw size={12} className="animate-spin text-accent shrink-0 ml-2" />}
      </div>

      {toastMessage && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><CheckCircle size={14} /> {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white text-xs font-bold">×</button>
        </div>
      )}

      {/* Responsive Dashboard Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Component */}
        <div className="rounded-xl border border-border-theme/60 bg-background/50 p-4">
          <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-3">
            {editingId ? <Edit2 size={14} className="text-amber-400" /> : <Plus size={14} className="text-emerald-400" />}
            {editingId ? "Update Student Document" : "Add Student Record (POST)"}
          </h4>

          <form onSubmit={handleSaveStudent} className="space-y-3">
            <div>
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Priya Rai"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. priya@studyquest.edu"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-text-secondary font-medium block mb-1">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="AI & ML">AI & ML</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-text-secondary font-medium block mb-1">GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-xs rounded-xl"
              >
                {editingId ? "Save Changes" : "Create Record"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
                  }}
                  variant="ghost"
                  className="h-8 text-xs text-text-muted"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Student Records List Component */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-2.5 top-2.5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-background text-xs text-text-primary"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-text-muted" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="rounded-lg border border-border-theme bg-background px-2.5 py-1.5 text-xs text-text-primary"
              >
                <option value="All">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI & ML">AI & ML</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border-theme/60 bg-background/40 overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                <Database size={24} className="mx-auto text-text-muted/60 mb-2" />
                No matching student documents in MongoDB collection.
              </div>
            ) : (
              <div className="divide-y divide-border-theme/40">
                {filteredStudents.map((std) => (
                  <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-background/60 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">{std.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {std.course}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            std.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : std.status === "Graduated"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {std.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5 font-mono">{std.email} • GPA: {std.gpa}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => handleEdit(std)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(std.id)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist Widget (Session 14: 17:30–17:45)
// Bottom progress:
// DSA: ~97%
// WebDev/MERN: ~97%
// Overall: ~97%
// Visual bar: ███████████████████░░
// ---------------------------------------------------------------------------

export function Day29FinalChecklistWidget() {
  const [tasks, setTasks] = useState<Record<string, boolean>>({
    s1: false, // 09:00–09:20 — DSA Final Revision
    s2: false, // 09:20–10:00 — Pattern Recognition
    s3: false, // 10:15–11:00 — DSA Mock Interview
    s4: false, // 11:00–12:00 — DSA Timed Challenge
    s5: false, // 12:00–12:15 — DSA Final Mistake Review
    s6: false, // 14:00–14:45 — MERN Project Polish
    s7: false, // 14:45–15:30 — Error Handling & UX
    s8: false, // 15:45–16:30 — Project Testing
    s9: false, // 16:30–17:00 — MERN Interview Questions
    s10: false, // 17:00–17:30 — Mini Project: MERN Student Manager v3
  });

  const [confidence, setConfidence] = useState<number>(5);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleTask = (id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <CheckSquare size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 29 Final Verification Checklist</h3>
            <p className="text-xs text-text-secondary">
              Verify all testing, fix bugs, review interview answers, and record ~97% curriculum progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-accent font-mono">
            {completedCount}/{totalTasks} Sessions Completed
          </span>
        </div>
      </div>

      {/* Task Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {[
          { id: "s1", label: "09:00–09:20 — DSA Final Revision (All Major Patterns & Complexities)" },
          { id: "s2", label: "09:20–10:00 — Pattern Recognition (8 Core Problem Patterns Reviewed)" },
          { id: "s3", label: "10:15–11:00 — DSA Mock Interview (Longest Substring, Stock, Rotated Search)" },
          { id: "s4", label: "11:00–12:00 — DSA Timed Challenge (2 Medium Problems, 30 Min Each)" },
          { id: "s5", label: "12:00–12:15 — DSA Final Mistake Review (Off-by-One, Boundaries, Edge Cases)" },
          { id: "s6", label: "14:00–14:45 — MERN Project Polish (Clean Architecture & Reusable Components)" },
          { id: "s7", label: "14:45–15:30 — Error Handling & UX (Validation, Loading, Error States)" },
          { id: "s8", label: "15:45–16:30 — Project Testing (Auth, CRUD, Search/Filter, Persistence)" },
          { id: "s9", label: "16:30–17:00 — MERN Interview Questions (Architecture, JWT, MongoDB, REST)" },
          { id: "s10", label: "17:00–17:30 — Mini Project: MERN Student Manager v3 Presentation-Ready" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
              tasks[item.id]
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                : "bg-background/40 border-border-theme text-text-secondary hover:border-border-theme/80"
            }`}
          >
            {tasks[item.id] ? (
              <CheckSquare size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square size={16} className="text-text-muted shrink-0 mt-0.5" />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Confidence Rating */}
      <div className="mt-5 pt-4 border-t border-border-theme/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-text-primary block mb-1">
            Day 29 Mastery Confidence Rating:
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setConfidence(star)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  confidence >= star
                    ? "bg-amber-500 text-white"
                    : "bg-background/60 text-text-muted border border-border-theme"
                }`}
              >
                {star}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setSubmitted(true)}
          size="sm"
          className="bg-accent hover:bg-accent/90 text-white font-bold h-9 text-xs rounded-xl px-5"
        >
          <CheckCircle2 size={14} className="mr-1.5" /> Submit Day 29 Verification
        </Button>
      </div>

      {submitted && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-medium flex items-center gap-2 animate-fade-in">
          <Sparkles size={15} className="text-emerald-400 shrink-0" />
          <span>Day 29 verification recorded successfully! Curriculum progress benchmark updated to ~97%. Almost at final milestone!</span>
        </div>
      )}

      {/* Visual Curriculum Benchmark Bar */}
      <div className="mt-6 rounded-xl border border-border-theme/60 bg-background/60 p-4">
        <div className="text-xs font-bold text-text-primary mb-2 flex items-center justify-between">
          <span>Curriculum Coverage Benchmark (Approximate)</span>
          <span className="text-accent font-mono font-bold">~97%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 font-mono">
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">DSA Coverage</span>
            <span className="font-bold text-blue-400">~97%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">WebDev / MERN Coverage</span>
            <span className="font-bold text-emerald-400">~97%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">Overall Progress</span>
            <span className="font-bold text-amber-400">~97%</span>
          </div>
        </div>

        {/* ASCII / Visual Bar */}
        <div className="font-mono text-xs text-accent bg-black/40 p-2.5 rounded-lg border border-border-theme/40 text-center tracking-widest">
          ███████████████████░░ (97%)
        </div>
      </div>
    </div>
  );
}
