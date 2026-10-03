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
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 1. DSA Mock Interview Widget (Session 5: 11:00–12:00)
// - 3 timed coding questions
// - Show hints only after user requests them
// - Require complexity explanation
// - Include a short self-review checklist
// ---------------------------------------------------------------------------

interface MockQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitMinutes: number;
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  hints: string[];
  optimalSolution: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
}

const mockQuestions: MockQuestion[] = [
  {
    id: "mq_1",
    title: "Question 1: Two Sum — Optimal Hash Map",
    difficulty: "Easy",
    timeLimitMinutes: 12,
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution.",
    exampleInput: "nums = [2, 7, 11, 15], target = 9",
    exampleOutput: "[0, 1]",
    hints: [
      "Brute force takes O(N²) by checking all pairs. Can you trade space for time?",
      "Use a hash map to store complement = target - nums[i] alongside index i as you iterate.",
      "In a single pass, check if nums[i] exists in the map. If yes, return [map.get(nums[i]), i]."
    ],
    optimalSolution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    expectedTimeComplexity: "O(N)",
    expectedSpaceComplexity: "O(N)",
  },
  {
    id: "mq_2",
    title: "Question 2: Binary Search in Rotated Sorted Array",
    difficulty: "Medium",
    timeLimitMinutes: 18,
    statement: "Given a sorted array of distinct integers nums rotated at an unknown pivot, write an O(log N) algorithm to find the index of target (-1 if not present).",
    exampleInput: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
    exampleOutput: "4",
    hints: [
      "Notice that at least one half of the array (left or right of mid) is always sorted!",
      "If nums[left] <= nums[mid], the left half is sorted. Check if target lies within [nums[left], nums[mid]].",
      "Otherwise, the right half is sorted. Adjust left and right boundaries accordingly."
    ],
    optimalSolution: `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    
    // Left half sorted
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else { // Right half sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
    expectedTimeComplexity: "O(log N)",
    expectedSpaceComplexity: "O(1)",
  },
  {
    id: "mq_3",
    title: "Question 3: Maximum Subarray — Kadane's Algorithm",
    difficulty: "Medium",
    timeLimitMinutes: 15,
    statement: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    exampleInput: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    exampleOutput: "6  (Subarray: [4, -1, 2, 1])",
    hints: [
      "Brute force checks O(N²) subarrays. Kadane's algorithm computes local max dynamically.",
      "At index i, max sum ending at i is max(nums[i], currentSum + nums[i]).",
      "If currentSum becomes negative, discard it and restart the subarray from nums[i]."
    ],
    optimalSolution: `function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentSum);
  }
  return maxSoFar;
}`,
    expectedTimeComplexity: "O(N)",
    expectedSpaceComplexity: "O(1)",
  },
];

export function Day27MockInterviewWidget() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showHintIndex, setShowHintIndex] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const [userSolutions, setUserSolutions] = useState<Record<number, string>>({
    0: `function twoSum(nums: number[], target: number): number[] {\n  // Write your O(N) hash map solution here...\n}`,
    1: `function search(nums: number[], target: number): number {\n  // Write your O(log N) binary search solution here...\n}`,
    2: `function maxSubArray(nums: number[]): number {\n  // Write your O(N) Kadane's algorithm solution here...\n}`,
  });
  const [userComplexityNotes, setUserComplexityNotes] = useState<Record<number, { time: string; space: string }>>({
    0: { time: "O(N)", space: "O(N)" },
    1: { time: "O(log N)", space: "O(1)" },
    2: { time: "O(N)", space: "O(1)" },
  });
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    explainedApproach: false,
    tracedDryRun: false,
    handledEdgeCases: false,
    statedTimeComplexity: false,
    statedSpaceComplexity: false,
  });
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  const q = mockQuestions[activeTab];

  const handleRevealNextHint = () => {
    const currentHintsRevealed = showHintIndex[activeTab] || 0;
    if (currentHintsRevealed < q.hints.length) {
      setShowHintIndex({ ...showHintIndex, [activeTab]: currentHintsRevealed + 1 });
    }
  };

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunMockCheck = () => {
    const completedItems = Object.values(checklist).filter(Boolean).length;
    if (completedItems === 5) {
      setEvaluationResult("🎉 Excellent Mock Interview Performance! All 5 interview communication criteria passed. Clear logic & optimal complexity verified!");
    } else {
      setEvaluationResult(`⚠️ Self-Review Progress: ${completedItems}/5 items completed. Make sure to state time/space complexity and dry run edge cases aloud before finishing.`);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <Award size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 27 DSA Mock Interview Arena</h3>
            <p className="text-xs text-text-secondary">
              3 Timed Questions • Requestable Hints • Mandatory Complexity & Self-Review Checklist
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock size={12} /> 60 Min Total Mock Window
          </span>
        </div>
      </div>

      {/* Question Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {mockQuestions.map((question, idx) => (
          <button
            key={question.id}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeTab === idx
                ? "bg-accent text-white border-accent shadow-md"
                : "bg-background/60 text-text-secondary border-border-theme hover:bg-background hover:text-text-primary"
            }`}
          >
            <Code2 size={14} />
            <span>{question.title.split(":")[0]}</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.5 rounded ${
                question.difficulty === "Easy"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {question.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Active Question Spec */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-background/50 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">{q.title}</h4>
          <span className="text-xs text-text-muted font-mono">Time Limit: {q.timeLimitMinutes} min</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">{q.statement}</p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-accent block">Example Input:</span>
            <span className="text-text-primary">{q.exampleInput}</span>
          </div>
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-emerald-400 block">Expected Output:</span>
            <span className="text-text-primary">{q.exampleOutput}</span>
          </div>
        </div>

        {/* Hint Request Section */}
        <div className="mt-4 pt-3 border-t border-border-theme/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles size={13} /> Interviewer Hints ({showHintIndex[activeTab] || 0}/{q.hints.length} Unlocked)
            </span>
            {(showHintIndex[activeTab] || 0) < q.hints.length && (
              <Button
                onClick={handleRevealNextHint}
                size="sm"
                variant="ghost"
                className="h-7 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <HelpCircle size={12} className="mr-1" /> Request Hint {(showHintIndex[activeTab] || 0) + 1}
              </Button>
            )}
          </div>
          {(showHintIndex[activeTab] || 0) > 0 && (
            <div className="mt-2 space-y-1.5">
              {q.hints.slice(0, showHintIndex[activeTab] || 0).map((h, i) => (
                <div key={i} className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-300">
                  <span className="font-bold">Hint {i + 1}:</span> {h}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor & Complexity Input */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="text-xs font-bold text-text-secondary flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5"><Terminal size={14} className="text-accent" /> Your Solution Code</span>
            <button
              onClick={() => setShowSolution({ ...showSolution, [activeTab]: !showSolution[activeTab] })}
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              <Eye size={12} /> {showSolution[activeTab] ? "Hide Optimal Reference" : "View Reference Solution"}
            </button>
          </label>
          {showSolution[activeTab] ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Optimal Reference Solution ({q.expectedTimeComplexity} Time, {q.expectedSpaceComplexity} Space):</div>
              <pre>{q.optimalSolution}</pre>
            </div>
          ) : (
            <textarea
              value={userSolutions[activeTab] || ""}
              onChange={(e) => setUserSolutions({ ...userSolutions, [activeTab]: e.target.value })}
              rows={8}
              className="w-full rounded-xl border border-border-theme bg-background/80 p-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          )}
        </div>

        {/* Complexity Explanation Panel */}
        <div className="rounded-xl border border-border-theme bg-background/40 p-3.5 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-2">
              <Zap size={14} className="text-amber-400" /> Stated Complexity
            </h5>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-text-secondary font-medium">Time Complexity:</label>
                <input
                  type="text"
                  value={userComplexityNotes[activeTab]?.time || ""}
                  onChange={(e) =>
                    setUserComplexityNotes({
                      ...userComplexityNotes,
                      [activeTab]: { ...userComplexityNotes[activeTab], time: e.target.value },
                    })
                  }
                  placeholder="e.g. O(N)"
                  className="mt-1 w-full rounded-lg border border-border-theme bg-background p-2 text-xs font-mono text-text-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-secondary font-medium">Space Complexity:</label>
                <input
                  type="text"
                  value={userComplexityNotes[activeTab]?.space || ""}
                  onChange={(e) =>
                    setUserComplexityNotes({
                      ...userComplexityNotes,
                      [activeTab]: { ...userComplexityNotes[activeTab], space: e.target.value },
                    })
                  }
                  placeholder="e.g. O(1)"
                  className="mt-1 w-full rounded-lg border border-border-theme bg-background p-2 text-xs font-mono text-text-primary"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border-theme/40 text-[11px] text-text-muted">
            <span className="font-bold text-accent">Target Bounds:</span> {q.expectedTimeComplexity} Time | {q.expectedSpaceComplexity} Space
          </div>
        </div>
      </div>

      {/* Interviewer Communication Self-Review Checklist */}
      <div className="mt-5 rounded-xl border border-border-theme/60 bg-card/60 p-4">
        <h4 className="text-xs font-bold text-text-primary flex items-center gap-2 mb-3">
          <UserCheck size={16} className="text-accent" /> Mock Interviewer Communication Checklist
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {[
            { key: "explainedApproach", label: "Explained brute force vs optimal approach before coding" },
            { key: "tracedDryRun", label: "Traced sample test case line-by-line with pencil/pointers" },
            { key: "handledEdgeCases", label: "Checked empty array, single element & boundary values" },
            { key: "statedTimeComplexity", label: "Stated precise Big-O Time Complexity (with justification)" },
            { key: "statedSpaceComplexity", label: "Stated precise Big-O Auxiliary Space Complexity" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => toggleChecklist(item.key)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                checklist[item.key]
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-background/40 border-border-theme text-text-secondary hover:border-border-theme/80"
              }`}
            >
              {checklist[item.key] ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Square size={16} className="text-text-muted shrink-0" />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-theme/40">
          <Button
            onClick={handleRunMockCheck}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl"
          >
            <CheckCircle size={14} className="mr-1.5" /> Submit Mock Review
          </Button>
          {evaluationResult && (
            <p className="text-xs font-medium text-amber-400 animate-fade-in">{evaluationResult}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. DSA Final Cheat Sheet Widget (Session 6: 12:00–12:15)
// - Pattern → when to use → complexity
// - Common mistakes
// ---------------------------------------------------------------------------

interface CheatSheetPattern {
  pattern: string;
  category: string;
  whenToUse: string;
  timeComplexity: string;
  spaceComplexity: string;
  commonMistakes: string[];
}

const finalDsaPatterns: CheatSheetPattern[] = [
  {
    pattern: "Two Pointers",
    category: "Arrays & Strings",
    whenToUse: "Sorted arrays, pair target sums, reversal, palindrome verification, partition.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    commonMistakes: [
      "Forgetting array must be sorted for two-sum range narrowing",
      "Off-by-one errors on boundary conditions (while left < right vs left <= right)",
    ],
  },
  {
    pattern: "Sliding Window",
    category: "Arrays & Strings",
    whenToUse: "Contiguous subarray/substring queries (max sum, max len, min window, distinct K).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K) or O(1)",
    commonMistakes: [
      "Not shrinking left boundary when condition becomes invalid",
      "Forgetting to update global result inside the expansion loop",
    ],
  },
  {
    pattern: "Prefix Sum",
    category: "Arrays & Range Queries",
    whenToUse: "Multiple range sum queries Q, sub-array sum equals K.",
    timeComplexity: "O(1) per query",
    spaceComplexity: "O(N)",
    commonMistakes: [
      "Offset errors: prefix[R] - prefix[L-1] requires 1-indexed prefix array or map initialize with {0: 1}",
      "Overflow on large sub-array sums",
    ],
  },
  {
    pattern: "Kadane's Algorithm",
    category: "Dynamic Programming",
    whenToUse: "Maximum contiguous subarray sum in 1D array.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    commonMistakes: [
      "Initializing maxSoFar to 0 instead of nums[0] when all array numbers are negative",
    ],
  },
  {
    pattern: "Binary Search",
    category: "Searching & Optimization",
    whenToUse: "Sorted arrays, search in rotated sorted array, monotonic function optimization (Search on Answer).",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    commonMistakes: [
      "Integer overflow in (left + right)/2 -> use left + Math.floor((right - left)/2)",
      "Infinite loop when left = mid instead of mid + 1",
    ],
  },
  {
    pattern: "Monotonic Stack / Deque",
    category: "Stacks & Queues",
    whenToUse: "Next greater/smaller element, largest rectangle in histogram, sliding window max.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    commonMistakes: [
      "Storing raw values instead of element indices in the stack/deque",
      "Using strictly less vs less-than-or-equal pop conditions causing duplicate handling bugs",
    ],
  },
];

export function Day27CheatSheetWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Arrays & Strings", "Arrays & Range Queries", "Searching & Optimization", "Stacks & Queues", "Dynamic Programming"];

  const filtered = selectedCategory === "All"
    ? finalDsaPatterns
    : finalDsaPatterns.filter((p) => p.category === selectedCategory);

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">DSA Final Cheat Sheet & Pattern Matrix</h3>
            <p className="text-xs text-text-secondary">
              Pattern → Optimal Use Case → Complexity Bounds → Common Pitfalls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-purple-500 text-white font-bold"
                  : "bg-background/60 text-text-secondary hover:text-text-primary border border-border-theme"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border-theme/60 bg-background/50 p-4 transition-all hover:border-purple-500/40">
            <div className="flex items-center justify-between border-b border-border-theme/40 pb-2">
              <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" /> {item.pattern}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {item.category}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="font-bold text-accent">When to Use:</span>{" "}
                <span className="text-text-secondary">{item.whenToUse}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="text-emerald-400">Time: {item.timeComplexity}</span>
                <span className="text-blue-400">Space: {item.spaceComplexity}</span>
              </div>
              <div className="mt-2 rounded-lg bg-amber-500/5 border border-amber-500/20 p-2.5">
                <span className="font-bold text-amber-400 text-[11px] block mb-1">Common Mistakes to Avoid:</span>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-text-muted">
                  {item.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Full MERN Student Manager Simulator (Session 13: 17:00–17:30)
// Upgrade existing Student project into connected MERN app:
// - React frontend
// - Express/Node backend
// - MongoDB/Mongoose simulation
// - Register/login auth
// - Protected CRUD student management
// - Search/filter
// - Loading/error/empty states
// ---------------------------------------------------------------------------

interface MernStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  gpa: number;
  enrolledDate: string;
}

export function Day27AsyncProjectWidget() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMSIsInJvbGUiOiJhZG1pbiJ9...");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "admin@studyquest.edu", password: "password123" });

  // MERN Data State
  const [students, setStudents] = useState<MernStudent[]>([
    { id: "std_101", name: "Aarav Sharma", email: "aarav@studyquest.edu", course: "Computer Science", gpa: 3.9, enrolledDate: "2024-08-15" },
    { id: "std_102", name: "Ananya Patel", email: "ananya@studyquest.edu", course: "Data Science", gpa: 3.8, enrolledDate: "2024-09-01" },
    { id: "std_103", name: "Rohan Verma", email: "rohan@studyquest.edu", course: "Software Engineering", gpa: 3.6, enrolledDate: "2024-09-10" },
  ]);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("All");

  // Form State
  const [newStudent, setNewStudent] = useState({ name: "", email: "", course: "Computer Science", gpa: 3.5 });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Status & Network simulation
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkLog, setNetworkLog] = useState<string>("Connected to Express backend http://localhost:5000/api/students (Protected by JWT)");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const simulateNetworkLatency = (action: () => void) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      action();
      setIsLoading(false);
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) return;
    simulateNetworkLatency(() => {
      setIsAuthenticated(true);
      const token = `jwt_mock_${Date.now()}`;
      setAuthToken(token);
      setNetworkLog(`POST /api/auth/login HTTP 200 OK -> Issued Token: ${token.slice(0, 24)}...`);
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.name || !authForm.email || !authForm.password) return;
    simulateNetworkLatency(() => {
      setIsAuthenticated(true);
      const token = `jwt_mock_${Date.now()}`;
      setAuthToken(token);
      setNetworkLog(`POST /api/auth/register HTTP 201 Created -> User registered & authenticated`);
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken("");
    setNetworkLog("User logged out -> JWT token cleared from auth state");
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) {
      setErrorMessage("Please fill all required student fields.");
      return;
    }
    if (!isAuthenticated) {
      setErrorMessage("401 Unauthorized: JWT token missing or expired.");
      return;
    }

    simulateNetworkLatency(() => {
      const created: MernStudent = {
        id: `std_${Date.now()}`,
        name: newStudent.name,
        email: newStudent.email,
        course: newStudent.course,
        gpa: Number(newStudent.gpa),
        enrolledDate: new Date().toISOString().split("T")[0],
      };
      setStudents([...students, created]);
      setNewStudent({ name: "", email: "", course: "Computer Science", gpa: 3.5 });
      setNetworkLog(`POST /api/students HTTP 201 Created -> Student ${created.id} inserted into MongoDB`);
    });
  };

  const handleDeleteStudent = (id: string) => {
    if (!isAuthenticated) {
      setErrorMessage("401 Unauthorized: Bearer Token required to delete.");
      return;
    }
    simulateNetworkLatency(() => {
      setStudents(students.filter((s) => s.id !== id));
      setNetworkLog(`DELETE /api/students/${id} HTTP 200 OK -> Document removed from MongoDB`);
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseFilter === "All" || s.course === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <Server size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Full MERN Student Manager Portal</h3>
            <p className="text-xs text-text-secondary">
              React Frontend ↔ Express REST Gateway ↔ MongoDB Document Persistence
            </p>
          </div>
        </div>

        {/* Auth Status Pill */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} /> JWT Auth Active
              </span>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="ghost"
                className="h-7 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={12} className="mr-1" /> Logout
              </Button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock size={12} /> Unauthenticated Mode
            </span>
          )}
        </div>
      </div>

      {/* Network / REST Console Output */}
      <div className="mt-3 rounded-xl border border-border-theme/60 bg-black/60 p-2.5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Terminal size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">{networkLog}</span>
        </div>
        {isLoading && <RefreshCw size={12} className="animate-spin text-accent shrink-0 ml-2" />}
      </div>

      {errorMessage && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Content: Authentication Screen or Full Connected Dashboard */}
      {!isAuthenticated ? (
        <div className="mt-4 rounded-xl border border-border-theme/60 bg-background/50 p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4 border-b border-border-theme/40 pb-3">
            <button
              onClick={() => setAuthMode("login")}
              className={`text-xs font-bold transition-all ${
                authMode === "login" ? "text-accent border-b-2 border-accent pb-1" : "text-text-muted"
              }`}
            >
              Express JWT Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={`text-xs font-bold transition-all ${
                authMode === "register" ? "text-accent border-b-2 border-accent pb-1" : "text-text-muted"
              }`}
            >
              New Account Register
            </button>
          </div>

          <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-3">
            {authMode === "register" && (
              <div>
                <label className="text-[11px] font-medium text-text-secondary block mb-1">Full Name</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="Enter student manager name"
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                />
              </div>
            )}
            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Email Address</label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Password (hashed with bcrypt)</label>
              <input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-9 text-xs rounded-xl mt-2">
              {isLoading ? "Authenticating..." : authMode === "login" ? "Authenticate & Issue JWT" : "Create Account & Sign JWT"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Create / Edit Form Panel */}
          <div className="rounded-xl border border-border-theme/60 bg-background/50 p-4">
            <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-3">
              <Plus size={14} className="text-emerald-400" /> Express API POST /api/students
            </h4>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="text-[11px] text-text-secondary font-medium block mb-1">Student Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Diya Sharma"
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-secondary font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="e.g. diya@studyquest.edu"
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-text-secondary font-medium block mb-1">Course</label>
                  <select
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
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
                    value={newStudent.gpa}
                    onChange={(e) => setNewStudent({ ...newStudent, gpa: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-xs rounded-xl mt-2"
              >
                <Send size={13} className="mr-1.5" /> POST to /api/students
              </Button>
            </form>
          </div>

          {/* Student List & Search/Filter Controls */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={13} className="absolute left-2.5 top-2.5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-background text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter size={13} className="text-text-muted" />
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="rounded-lg border border-border-theme bg-background px-2.5 py-1.5 text-xs text-text-primary"
                >
                  <option value="All">All Courses</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>
            </div>

            {/* List Table / Cards */}
            <div className="rounded-xl border border-border-theme/60 bg-background/40 overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">
                  <Database size={24} className="mx-auto text-text-muted/60 mb-2" />
                  No student records matched the query. Express API returned 200 OK [Empty Array].
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
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            GPA: {std.gpa}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-secondary mt-0.5 font-mono">{std.email}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          onClick={() => handleDeleteStudent(std.id)}
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist Widget (Session 14: 17:30–17:45)
// Bottom progress:
// DSA: ~90%
// WebDev/MERN: ~90%
// Overall: ~90%
// Visual bar: ██████████████████░░
// ---------------------------------------------------------------------------

export function Day27FinalChecklistWidget() {
  const [tasks, setTasks] = useState<Record<string, boolean>>({
    s1: false, // 09:00–09:20 — DSA Full Revision
    s2: false, // 09:20–10:00 — DSA Pattern Recognition
    s3: false, // 10:15–11:00 — DSA Interview Practice
    s4: false, // 11:00–12:00 — DSA Mock Interview
    s5: false, // 12:00–12:15 — DSA Final Cheat Sheet
    s6: false, // 14:00–14:45 — MERN Integration
    s7: false, // 14:45–15:30 — Connect Frontend + Backend
    s8: false, // 15:45–16:30 — Authentication Integration
    s9: false, // 16:30–17:00 — MERN Interview Recall
    s10: false, // 17:00–17:30 — Mini Project: Full MERN Student Manager
  });

  const [confidence, setConfidence] = useState<number>(4);
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
            <h3 className="text-base font-bold text-text-primary">Day 27 Final Verification Checklist</h3>
            <p className="text-xs text-text-secondary">
              Review all sessions, confirm completion status, and record curriculum milestone progress
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
          { id: "s1", label: "09:00–09:20 — DSA Full Revision (Arrays, Strings, Stacks, Queues)" },
          { id: "s2", label: "09:20–10:00 — DSA Pattern Recognition (Two Pointers, Binary Search, Kadane)" },
          { id: "s3", label: "10:15–11:00 — DSA Interview Practice (Two Sum, Anagram, Subarray)" },
          { id: "s4", label: "11:00–12:00 — DSA Mock Interview (3 Timed Questions & Self-Review)" },
          { id: "s5", label: "12:00–12:15 — DSA Final Cheat Sheet (Pattern Matrix & Pitfalls)" },
          { id: "s6", label: "14:00–14:45 — MERN Integration (REST API, Axios/Fetch, CORS)" },
          { id: "s7", label: "14:45–15:30 — Connect Frontend + Backend (GET, POST, PUT, DELETE)" },
          { id: "s8", label: "15:45–16:30 — Authentication Integration (Forms, JWT State, Protected Routes)" },
          { id: "s9", label: "16:30–17:00 — MERN Interview Recall (7 Core Full-Stack Concepts)" },
          { id: "s10", label: "17:00–17:30 — Mini Project: Full MERN Student Manager System" },
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
            Day 27 Mastery Confidence Rating:
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
          <CheckCircle2 size={14} className="mr-1.5" /> Submit Day 27 Verification
        </Button>
      </div>

      {submitted && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-medium flex items-center gap-2 animate-fade-in">
          <Sparkles size={15} className="text-emerald-400 shrink-0" />
          <span>Day 27 verification recorded successfully! Curriculum progress updated to ~90%. Keep pushing forward!</span>
        </div>
      )}

      {/* Visual Curriculum Milestone Progress Bar */}
      <div className="mt-6 rounded-xl border border-border-theme/60 bg-background/60 p-4">
        <div className="text-xs font-bold text-text-primary mb-2 flex items-center justify-between">
          <span>Curriculum Coverage Benchmark (Approximate)</span>
          <span className="text-accent font-mono font-bold">~90%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 font-mono">
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">DSA Coverage</span>
            <span className="font-bold text-blue-400">~90%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">WebDev / MERN Coverage</span>
            <span className="font-bold text-emerald-400">~90%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">Overall Progress</span>
            <span className="font-bold text-amber-400">~90%</span>
          </div>
        </div>

        {/* ASCII / Visual Bar */}
        <div className="font-mono text-xs text-accent bg-black/40 p-2.5 rounded-lg border border-border-theme/40 text-center tracking-widest">
          ██████████████████░░ (90%)
        </div>
      </div>
    </div>
  );
}
