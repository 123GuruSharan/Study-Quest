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
  Download,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 1. DSA Problems Interactive Sandbox (Session 4: 11:00-12:00)
// ---------------------------------------------------------------------------

interface DsaProblemDetail {
  id: string;
  name: string;
  statement: string;
  example: { input: string; output: string };
  hint: string;
  expectedOutput: string;
  complexity: { time: string; space: string };
  defaultCode: string;
  testRunner: (code: string) => { success: boolean; output: string };
}

const dsaProblemsData: DsaProblemDetail[] = [
  {
    id: "linear-search",
    name: "1. Linear Search",
    statement: "Given an array `arr` and a `target` element, return the 0-based index of `target` if present, or `-1` if not found.",
    example: {
      input: "arr = [4, 2, 7, 1, 9], target = 7",
      output: "2",
    },
    hint: "Iterate sequentially through the array from index 0 to arr.length - 1 and compare each item with target.",
    expectedOutput: "2",
    complexity: {
      time: "Best: O(1) [First item], Worst/Avg: O(N) [Full traversal]",
      space: "O(1) [In-place constant extra memory]",
    },
    defaultCode: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Test call
linearSearch([4, 2, 7, 1, 9], 7);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return linearSearch([4, 2, 7, 1, 9], 7);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "binary-search",
    name: "2. Binary Search",
    statement: "Given a sorted integer array `nums` and a `target` value, return the index of `target` if present, or `-1`.",
    example: {
      input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
      output: "4",
    },
    hint: "Maintain low = 0 and high = nums.length - 1. Calculate overflow-safe mid = low + Math.floor((high - low) / 2) and eliminate half the search space.",
    expectedOutput: "4",
    complexity: {
      time: "O(log N) — Halving search space at each iteration",
      space: "O(1) — Iterative two-pointer constant memory",
    },
    defaultCode: `function binarySearch(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// Test call
binarySearch([-1, 0, 3, 5, 9, 12], 9);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return binarySearch([-1, 0, 3, 5, 9, 12], 9);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "first-occurrence",
    name: "3. First Occurrence of Target",
    statement: "Given a sorted array `nums` with duplicate elements and a `target`, find the index of the first occurrence of `target`.",
    example: {
      input: "nums = [1, 2, 2, 2, 3, 4], target = 2",
      output: "1",
    },
    hint: "When nums[mid] === target, store ans = mid and continue searching in left half by setting high = mid - 1.",
    expectedOutput: "1",
    complexity: {
      time: "O(log N) — Binary search modified for first match",
      space: "O(1) — Iterative constant space",
    },
    defaultCode: `function findFirstOccurrence(nums, target) {
  let low = 0, high = nums.length - 1;
  let ans = -1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) {
      ans = mid;
      high = mid - 1; // Keep searching left for earlier occurrence
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}

// Test call
findFirstOccurrence([1, 2, 2, 2, 3, 4], 2);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findFirstOccurrence([1, 2, 2, 2, 3, 4], 2);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "last-occurrence",
    name: "4. Last Occurrence of Target",
    statement: "Given a sorted array `nums` with duplicate elements and a `target`, find the index of the last occurrence of `target`.",
    example: {
      input: "nums = [1, 2, 2, 2, 3, 4], target = 2",
      output: "3",
    },
    hint: "When nums[mid] === target, store ans = mid and continue searching in right half by setting low = mid + 1.",
    expectedOutput: "3",
    complexity: {
      time: "O(log N) — Binary search modified for last match",
      space: "O(1) — Iterative constant space",
    },
    defaultCode: `function findLastOccurrence(nums, target) {
  let low = 0, high = nums.length - 1;
  let ans = -1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) {
      ans = mid;
      low = mid + 1; // Keep searching right for later occurrence
    } else if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}

// Test call
findLastOccurrence([1, 2, 2, 2, 3, 4], 2);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findLastOccurrence([1, 2, 2, 2, 3, 4], 2);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "search-insert-position",
    name: "5. Search Insert Position",
    statement: "Given a sorted array of distinct integers and a target value, return the index if target is found. If not, return the index where it would be if inserted in order.",
    example: {
      input: "nums = [1, 3, 5, 6], target = 5",
      output: "2 (or target = 2 -> output: 1)",
    },
    hint: "Perform standard binary search. If target is not found, the low pointer will point to the exact insertion index.",
    expectedOutput: "2",
    complexity: {
      time: "O(log N) — Logarithmic binary search search space halving",
      space: "O(1) — Auxiliary memory",
    },
    defaultCode: `function searchInsert(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return low; // low is insertion index
}

// Test call
searchInsert([1, 3, 5, 6], 5);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return searchInsert([1, 3, 5, 6], 5);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day13DsaProblemsWidget() {
  const [activeTab, setActiveTab] = useState(0);
  const currentProblem = dsaProblemsData[activeTab];
  const [code, setCode] = useState(currentProblem.defaultCode);
  const [runResult, setRunResult] = useState<{ success: boolean; output: string } | null>(null);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setCode(dsaProblemsData[index].defaultCode);
    setRunResult(null);
  };

  const handleRun = () => {
    const res = currentProblem.testRunner(code);
    setRunResult(res);
  };

  return (
    <div className="mt-4 bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Search className="text-accent shrink-0" size={18} />
          <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Day 13 Searching Algorithms Workbench (5 Core Problems)
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
          DSA Session 11:00–12:00
        </span>
      </div>

      {/* Problem Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {dsaProblemsData.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleTabChange(idx)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
              activeTab === idx
                ? "bg-accent text-white shadow-xs"
                : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            P{idx + 1}: {p.name.split(". ")[1] || p.name}
          </button>
        ))}
      </div>

      {/* Problem Specification Card */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-3">
        <h5 className="font-bold text-sm text-amber-400 flex items-center gap-1.5">
          <span>{currentProblem.name}</span>
        </h5>

        <div className="space-y-1.5 text-slate-300">
          <p><span className="font-bold text-slate-100">Statement:</span> {currentProblem.statement}</p>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
            <div><span className="text-slate-400">Example Input:</span> {currentProblem.example.input}</div>
            <div><span className="text-slate-400">Expected Output:</span> {currentProblem.example.output}</div>
          </div>
          <p className="text-blue-300"><span className="font-bold text-blue-400">Hint:</span> {currentProblem.hint}</p>
        </div>

        {/* Complexity Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span className="font-bold text-blue-400">Time Complexity:</span> {currentProblem.complexity.time}
          </div>
          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
            <span className="font-bold text-purple-400">Space Complexity:</span> {currentProblem.complexity.space}
          </div>
        </div>
      </div>

      {/* Interactive Code Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Code2 size={13} className="text-accent" /> Interactive Coding Area:
          </span>
          <Button
            onClick={handleRun}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-7 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Play size={12} /> Run Code & Test
          </Button>
        </div>

        <textarea
          aria-label="Searching Code Area"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
          className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:border-accent focus:outline-none resize-y"
        />

        {/* Output Window */}
        {runResult && (
          <div
            className={`p-3 rounded-xl border font-mono text-xs ${
              runResult.success
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/40 border-rose-500/40 text-rose-300"
            }`}
          >
            <div className="font-bold text-[10px] uppercase tracking-wider mb-1 text-slate-400">
              Execution Output:
            </div>
            <div>{runResult.output}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Searching Cheat Sheet Widget (Session 5: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day13CheatSheetWidget() {
  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h4 className="font-extrabold text-sm text-purple-200 uppercase tracking-wider">
            Searching Cheat Sheet & Pointer Rules
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          12:00–12:15
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            1. Unsorted Array → Linear Search
          </div>
          <p className="text-text-secondary">
            Traverse sequentially from index 0 to N-1. Use when data is unsorted or for small array sizes.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N) | Space: O(1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            2. Sorted Array → Binary Search
          </div>
          <p className="text-text-secondary">
            Monotonic sorted order allows eliminating 50% of candidate items at every step by checking mid.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(log N) | Space: O(1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            3. Binary Search Efficiency: O(log N)
          </div>
          <p className="text-text-secondary">
            Logarithmic growth halves search space at each iteration (e.g. 1,000,000 items searched in ~20 steps).
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            2^20 ≈ 1,048,576
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            4. Overflow-Safe Mid Pointer Rule
          </div>
          <p className="text-text-secondary">
            Always calculate mid safely using <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">low + Math.floor((high - low) / 2)</code> to prevent integer overflow.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Avoids (low + high) overflow bug
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-700 dark:text-amber-300 flex items-center gap-2">
        <Zap size={16} className="shrink-0 text-amber-500" />
        <div>
          <span className="font-bold">Golden Rule:</span> Always verify if the array is sorted before choosing Binary Search over Linear Search!
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Directory App (Async/Await Fetch Upgrade) (Session 10: 17:00-17:30)
// ---------------------------------------------------------------------------

interface StudentDirectoryItem {
  id: string;
  name: string;
  email: string;
  role: string;
  gpa: string;
  status: string;
}

export function Day13AsyncProjectWidget() {
  const [students, setStudents] = useState<StudentDirectoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const loadStudentsAsync = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate fetch + async/await request with artificial delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Mock sample student response data
      const sampleData: StudentDirectoryItem[] = [
        { id: "std_1", name: "Aarav Sharma", email: "aarav.s@college.edu", role: "Full Stack Dev", gpa: "3.9", status: "Active" },
        { id: "std_2", name: "Priya Patel", email: "priya.p@college.edu", role: "DSA Champion", gpa: "3.95", status: "Active" },
        { id: "std_3", name: "Rohan Verma", email: "rohan.v@college.edu", role: "Backend Engineer", gpa: "3.8", status: "Active" },
        { id: "std_4", name: "Ananya Iyer", email: "ananya.i@college.edu", role: "System Architect", gpa: "4.0", status: "Active" },
        { id: "std_5", name: "Kabir Mehta", email: "kabir.m@college.edu", role: "Frontend Specialist", gpa: "3.85", status: "Active" },
      ];

      setStudents(sampleData);
    } catch (err: any) {
      setError(err.message || "Failed to load student directory via async/await fetch.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="mt-4 bg-card border-2 border-emerald-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="text-emerald-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Student Directory App — Async/Await Fetch Upgrade
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Features "Load Students" button, fetch() + async/await simulation, Loading → Data → Error states, and dynamic DOM rendering.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
          Mini Project 17:00–17:30
        </span>
      </div>

      {/* Control Strip & Load Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          onClick={loadStudentsAsync}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Fetching via async/await...
            </>
          ) : (
            <>
              <Download size={14} /> Load Students (Async Fetch)
            </>
          )}
        </Button>

        {students.length > 0 && (
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search loaded students by name or role..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* State Rendering Container */}
      {/* 1. Loading State */}
      {loading && (
        <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-xl border border-border-theme text-center space-y-2 animate-pulse">
          <RefreshCw size={24} className="animate-spin text-emerald-500 mx-auto" />
          <div className="font-bold text-xs text-text-primary uppercase tracking-wider">
            Loading Student Directory Data...
          </div>
          <p className="text-[11px] text-text-secondary">
            Executing `const response = await fetch('/api/students')` and parsing JSON response...
          </p>
        </div>
      )}

      {/* 2. Error State */}
      {error && !loading && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <div>
            <div className="font-bold text-xs">Failed to Fetch Student Directory</div>
            <div className="text-[11px]">{error}</div>
          </div>
        </div>
      )}

      {/* 3. Empty / Initial Idle State */}
      {!loading && !error && students.length === 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-xl border border-dashed border-border-theme text-center space-y-2">
          <Download size={24} className="text-text-secondary mx-auto" />
          <div className="font-bold text-xs text-text-primary">No Student Directory Loaded Yet</div>
          <p className="text-[11px] text-text-secondary">
            Click the "Load Students (Async Fetch)" button above to simulate async/await REST API fetch.
          </p>
        </div>
      )}

      {/* 4. Loaded Data Grid (Dynamic DOM Render) */}
      {!loading && !error && students.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-text-secondary font-bold px-1">
            <span>Showing {filtered.length} of {students.length} students</span>
            <span className="text-emerald-500 font-mono font-black">Status: 200 OK (JSON Rendered)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((st) => (
              <div
                key={st.id}
                className="bg-card border border-border-theme/80 rounded-xl p-3.5 shadow-2xs space-y-1.5 hover:border-emerald-500/40 transition-colors animate-[fadeIn_200ms_ease]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-text-primary">{st.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                    GPA: {st.gpa}
                  </span>
                </div>
                <div className="text-[11px] text-text-secondary">{st.email}</div>
                <div className="flex items-center justify-between text-[10px] font-bold pt-1 border-t border-border-theme/40">
                  <span className="text-purple-600 dark:text-purple-400 uppercase tracking-wider">{st.role}</span>
                  <span className="text-emerald-500">{st.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Day 13 Final Checklist & Progress Display Widget (Session 11: 17:30-17:45)
// ---------------------------------------------------------------------------

const day13ChecklistItems = [
  "09:00–09:20 — Searching Fundamentals (What is searching?, Linear search, traversal, complexity, best use cases)",
  "09:20–10:00 — Binary Search Intro (Sorted array requirement, low/high/mid pointers, halving search space, O(log n))",
  "10:15–11:00 — Binary Search Patterns (Standard search, lower bound/first occurrence, upper bound/last occurrence, overflow-safe mid)",
  "11:00–12:00 — DSA Problems (Linear Search, Binary Search, First Occurrence, Last Occurrence, Search Insert Position)",
  "12:00–12:15 — Searching Cheat Sheet (Unsorted vs sorted array triggers, logarithmic scale, overflow-safe mid calculation)",
  "14:00–14:45 — Async/Await (async functions, await keyword, Promise relationship, try/catch error handling)",
  "14:45–15:30 — Fetch + Async/Await (fetch(), await response, await response.json(), try/catch, Loading/Error UI states)",
  "15:45–16:30 — API Practice (Fetch public API, display loading message, render JSON data, handle failures)",
  "16:30–17:00 — Interview Recall (Self-test 5 core Searching & Async/Await placement interview questions)",
  "17:00–17:30 — Mini Project (Upgrade Student Directory App with 'Load Students' button, fetch + async/await, Loading/Data/Error states)",
  "17:30–17:45 — Final Checklist & Progress Display (~43% curriculum coverage verified)",
];

export function Day13FinalChecklistWidget() {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalTasks = day13ChecklistItems.length;

  return (
    <div className="mt-4 bg-card border-2 border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-5 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Day 13 Final Checklist & Sequential Curriculum Progress
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Check off each session/task as you complete it. Use the existing completion/progress system.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
          {completedCount} / {totalTasks} Completed
        </span>
      </div>

      {/* Interactive Checkboxes List */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-border-theme">
        {day13ChecklistItems.map((item, idx) => {
          const isChecked = !!checkedState[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                isChecked
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
                  : "hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-text-secondary"
              }`}
            >
              <button type="button" className="mt-0.5 shrink-0 text-accent">
                {isChecked ? (
                  <CheckSquare size={16} className="text-emerald-500" />
                ) : (
                  <Square size={16} className="text-text-secondary" />
                )}
              </button>
              <span className={`text-[11px] ${isChecked ? "line-through opacity-80" : ""}`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bars Section at Bottom of Day 13 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-500/40 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
          <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Flame size={15} className="text-amber-400" /> Bottom of Day 13 Progress Summary
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400">Target Coverage: ~43%</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {/* DSA Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-400">DSA Progress</span>
              <span className="font-bold text-blue-400">~43%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "43%" }} />
            </div>
          </div>

          {/* WebDev Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-400">WebDev/MERN Progress</span>
              <span className="font-bold text-emerald-400">~43%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "43%" }} />
            </div>
          </div>

          {/* Overall Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-amber-400">Overall Curriculum Progress</span>
              <span className="font-bold text-amber-400">~43%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-amber-500 rounded-full" style={{ width: "43%" }} />
            </div>
          </div>

          {/* Prompt Requested ASCII Progress Bar */}
          <div className="pt-2 text-center text-xs font-mono tracking-widest text-amber-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            Progress bar: <span className="font-bold">█████████░░░░░░░░░░░</span>
          </div>
        </div>
      </div>
    </div>
  );
}
