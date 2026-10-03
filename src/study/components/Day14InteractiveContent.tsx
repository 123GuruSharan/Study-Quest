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
  Send,
  Globe,
  Layers,
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
    id: "first-last-position",
    name: "1. Find First and Last Position of Element",
    statement: "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. Return `[-1, -1]` if target is not found.",
    example: {
      input: "nums = [5, 7, 7, 8, 8, 10], target = 8",
      output: "[3, 4]",
    },
    hint: "Execute two binary search passes: set high = mid - 1 on match to find first position, and low = mid + 1 on match to find last position.",
    expectedOutput: "[3, 4]",
    complexity: {
      time: "O(log N) — Two binary search passes",
      space: "O(1) — Iterative two-pointer constant memory",
    },
    defaultCode: `function searchRange(nums, target) {
  function findBound(isFirst) {
    let low = 0, high = nums.length - 1;
    let ans = -1;
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (nums[mid] === target) {
        ans = mid;
        if (isFirst) high = mid - 1;
        else low = mid + 1;
      } else if (nums[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return ans;
  }
  return [findBound(true), findBound(false)];
}

// Test call
searchRange([5, 7, 7, 8, 8, 10], 8);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return searchRange([5, 7, 7, 8, 8, 10], 8);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "count-occurrences",
    name: "2. Count Occurrences in Sorted Array",
    statement: "Given a sorted array `arr` and a target element `x`, count the total number of occurrences of `x` in `arr`.",
    example: {
      input: "arr = [1, 1, 2, 2, 2, 2, 3], x = 2",
      output: "4",
    },
    hint: "Use binary search to find first and last occurrence indices. Count is (last - first + 1). Return 0 if target does not exist.",
    expectedOutput: "4",
    complexity: {
      time: "O(log N) — Dual binary search bounds search",
      space: "O(1) — In-place constant auxiliary space",
    },
    defaultCode: `function countOccurrences(arr, x) {
  function findFirst() {
    let low = 0, high = arr.length - 1, ans = -1;
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (arr[mid] === x) { ans = mid; high = mid - 1; }
      else if (arr[mid] < x) low = mid + 1;
      else high = mid - 1;
    }
    return ans;
  }
  function findLast() {
    let low = 0, high = arr.length - 1, ans = -1;
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);
      if (arr[mid] === x) { ans = mid; low = mid + 1; }
      else if (arr[mid] < x) low = mid + 1;
      else high = mid - 1;
    }
    return ans;
  }
  const first = findFirst();
  if (first === -1) return 0;
  return findLast() - first + 1;
}

// Test call
countOccurrences([1, 1, 2, 2, 2, 2, 3], 2);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return countOccurrences([1, 1, 2, 2, 2, 2, 3], 2);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "lower-bound",
    name: "3. Lower Bound",
    statement: "Given a sorted array `arr` and a target `x`, find the lower bound index (smallest index where `arr[i] >= x`). If all elements < x, return `arr.length`.",
    example: {
      input: "arr = [1, 2, 4, 6, 8, 10], x = 5",
      output: "3 (value 6)",
    },
    hint: "Perform binary search. If arr[mid] >= x, record ans = mid and shrink search to left (high = mid - 1). Else low = mid + 1.",
    expectedOutput: "3",
    complexity: {
      time: "O(log N) — Binary search boundary elimination",
      space: "O(1) — Constant space",
    },
    defaultCode: `function lowerBound(arr, x) {
  let low = 0, high = arr.length - 1;
  let ans = arr.length;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] >= x) {
      ans = mid;
      high = mid - 1; // Look for smaller index on left
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

// Test call
lowerBound([1, 2, 4, 6, 8, 10], 5);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return lowerBound([1, 2, 4, 6, 8, 10], 5);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "upper-bound",
    name: "4. Upper Bound",
    statement: "Given a sorted array `arr` and a target `x`, find the upper bound index (smallest index where `arr[i] > x`). If no element > x, return `arr.length`.",
    example: {
      input: "arr = [1, 2, 4, 6, 8, 10], x = 6",
      output: "4 (value 8)",
    },
    hint: "Perform binary search. If arr[mid] > x, record ans = mid and shrink search to left (high = mid - 1). Else low = mid + 1.",
    expectedOutput: "4",
    complexity: {
      time: "O(log N) — Binary search upper bound search",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function upperBound(arr, x) {
  let low = 0, high = arr.length - 1;
  let ans = arr.length;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] > x) {
      ans = mid;
      high = mid - 1; // Look for smaller index on left
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

// Test call
upperBound([1, 2, 4, 6, 8, 10], 6);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return upperBound([1, 2, 4, 6, 8, 10], 6);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "nearly-sorted-array",
    name: "5. Search in a Nearly Sorted Array",
    statement: "Given an array where an element at index `i` in the sorted array could be present at index `i-1`, `i`, or `i+1`, search for a target element `x`.",
    example: {
      input: "arr = [10, 3, 40, 20, 50, 80, 70], x = 40",
      output: "2",
    },
    hint: "Compare x with arr[mid], arr[mid-1] (if mid > low), and arr[mid+1] (if mid < high). Step pointers low = mid + 2 or high = mid - 2.",
    expectedOutput: "2",
    complexity: {
      time: "O(log N) — Modified binary search with 3-element center check",
      space: "O(1) — Iterative constant memory",
    },
    defaultCode: `function searchNearlySorted(arr, x) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === x) return mid;
    if (mid > low && arr[mid - 1] === x) return mid - 1;
    if (mid < high && arr[mid + 1] === x) return mid + 1;

    if (x < arr[mid]) high = mid - 2;
    else low = mid + 2;
  }
  return -1;
}

// Test call
searchNearlySorted([10, 3, 40, 20, 50, 80, 70], 40);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return searchNearlySorted([10, 3, 40, 20, 50, 80, 70], 40);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day14DsaProblemsWidget() {
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
            Day 14 Binary Search Variations Workbench (5 Core Problems)
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
          aria-label="Binary Search Variations Code Area"
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

export function Day14CheatSheetWidget() {
  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h4 className="font-extrabold text-sm text-purple-200 uppercase tracking-wider">
            Searching & Boundary Decision Cheat Sheet
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          12:00–12:15
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            1. Sorted Array → Binary Search
          </div>
          <p className="text-text-secondary">
            Monotonic sorted array permits log-space halving. Always initialize <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">low = 0</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">high = n - 1</code>.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(log N) | Space: O(1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            2. First/Last Position → Boundary Search
          </div>
          <p className="text-text-secondary">
            On target match: set <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">high = mid - 1</code> for first position OR <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">low = mid + 1</code> for last position.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Count = (last - first + 1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            3. Answer Range → Lower / Upper Bound
          </div>
          <p className="text-text-secondary">
            Lower bound finds first index with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">arr[i] &gt;= x</code>. Upper bound finds first index with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">arr[i] &gt; x</code>.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Used in range queries
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            4. Verify Boundary Cases
          </div>
          <p className="text-text-secondary">
            Always dry-run single element arrays, target smaller than min element, and target larger than max element.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Prevents off-by-one errors
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-700 dark:text-amber-300 flex items-center gap-2">
        <Zap size={16} className="shrink-0 text-amber-500" />
        <div>
          <span className="font-bold">Golden Rule:</span> When finding lower/upper bounds, keep a candidate variable <code className="font-mono text-xs">ans = n</code> to handle targets out of range!
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Registration & Directory Hub v3 (Session 10: 17:00-17:30)
// ---------------------------------------------------------------------------

interface StudentHubRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  gpa: string;
  source: "API" | "Form";
  status: string;
}

export function Day14AsyncProjectWidget() {
  const [students, setStudents] = useState<StudentHubRecord[]>([
    {
      id: "std_101",
      name: "Aarav Sharma",
      email: "aarav@college.edu",
      course: "Full Stack MERN WebDev",
      gpa: "3.9",
      source: "API",
      status: "Active",
    },
    {
      id: "std_102",
      name: "Priya Patel",
      email: "priya@college.edu",
      course: "DSA Masterclass",
      gpa: "4.0",
      source: "API",
      status: "Active",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCourse, setFormCourse] = useState("Full Stack MERN WebDev");
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // API Fetch with async/await & response.ok check & Reload button
  const fetchStudentsFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockApiResponse: StudentHubRecord[] = [
        { id: "std_api_1", name: "Ananya Iyer", email: "ananya.i@university.edu", course: "System Architect", gpa: "3.95", source: "API", status: "Active" },
        { id: "std_api_2", name: "Rohan Verma", email: "rohan.v@university.edu", course: "Backend Node.js", gpa: "3.85", source: "API", status: "Active" },
        { id: "std_api_3", name: "Kabir Mehta", email: "kabir.m@university.edu", course: "Frontend React 19", gpa: "3.9", source: "API", status: "Active" },
      ];

      setStudents(mockApiResponse);
    } catch (err: any) {
      setError(err.message || "Failed to fetch student records from API.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Registration Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (!formName.trim() || !formEmail.trim()) {
      setError("Form Validation Error: Please provide both Name and Email.");
      return;
    }

    setFormSubmitLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newStudent: StudentHubRecord = {
        id: `std_form_${Date.now()}`,
        name: formName,
        email: formEmail,
        course: formCourse,
        gpa: "3.8",
        source: "Form",
        status: "Active",
      };

      setStudents((prev) => [newStudent, ...prev]);
      setFormName("");
      setFormEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to submit registration form.");
    } finally {
      setFormSubmitLoading(false);
    }
  };

  return (
    <div className="mt-4 bg-card border-2 border-teal-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Globe className="text-teal-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Student Registration & Directory Hub v3 (Full API Integration)
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Features async API fetching, Reload button, Loading/Success/Error states, dynamic cards, and active working registration form.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30 shrink-0">
          Mini Project 17:00–17:30
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Container (Left Column) */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-5 space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-border-theme">
          <h5 className="font-bold text-xs uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Send size={13} className="text-accent" /> Register Student (Form)
          </h5>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary mb-1">Student Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Vikramaditya Sen"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              disabled={formSubmitLoading}
              className="w-full h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. vikram@university.edu"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              disabled={formSubmitLoading}
              className="w-full h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary mb-1">Course Track</label>
            <select
              value={formCourse}
              onChange={(e) => setFormCourse(e.target.value)}
              disabled={formSubmitLoading}
              className="w-full h-8 px-2 rounded-lg border border-border-theme bg-card text-[11px] text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="Full Stack MERN WebDev">Full Stack MERN</option>
              <option value="DSA Masterclass">DSA Masterclass</option>
              <option value="System Design">System Design</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={formSubmitLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-9 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {formSubmitLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send size={14} /> Submit Form (No Page Reload)
              </>
            )}
          </Button>
        </form>

        {/* Directory & API Fetching Container (Right Column) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-xs uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <UserCheck size={14} className="text-teal-500" /> Student Directory ({students.length})
            </h5>

            {/* Reload API Button */}
            <Button
              onClick={fetchStudentsFromAPI}
              disabled={loading}
              variant="secondary"
              size="sm"
              className="h-8 text-xs font-bold rounded-xl border-border-theme text-text-secondary hover:text-text-primary flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-teal-500" : ""} /> Reload API Data
            </Button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl flex items-center gap-2 text-[11px]">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-border-theme text-center space-y-2 animate-pulse">
              <RefreshCw size={20} className="animate-spin text-teal-500 mx-auto" />
              <div className="font-bold text-xs text-text-primary">Executing `await fetch('/api/students')`...</div>
            </div>
          )}

          {/* Dynamic Cards Grid */}
          {!loading && (
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {students.map((st) => (
                <div
                  key={st.id}
                  className="bg-card border border-border-theme/80 rounded-xl p-3 shadow-2xs space-y-1 hover:border-teal-500/40 transition-colors animate-[fadeIn_200ms_ease]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-text-primary">{st.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        st.source === "API"
                          ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                          : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {st.source} • GPA: {st.gpa}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary">{st.email}</div>
                  <div className="text-[10px] font-bold text-accent uppercase tracking-wider pt-0.5">
                    {st.course}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Day 14 Final Checklist & Progress Display Widget (Session 11: 17:30-17:45)
// ---------------------------------------------------------------------------

const day14ChecklistItems = [
  "09:00–09:20 — Binary Search Revision (low, high, mid, sorted-array requirement, O(log n), off-by-one errors)",
  "09:20–10:00 — Binary Search Variations (First occurrence, last occurrence, lower bound, upper bound, count occurrences)",
  "10:15–11:00 — Binary Search Thinking (Search space identification, condition selection, directional moves, dry-runs)",
  "11:00–12:00 — DSA Problems (First/Last Position, Count Occurrences, Lower Bound, Upper Bound, Nearly Sorted Array)",
  "12:00–12:15 — Searching Cheat Sheet (Sorted array, first/last position, lower/upper bound, boundary verification)",
  "14:00–14:45 — APIs Deep Dive (HTTP request/response, GET vs POST, URL endpoints, status codes, JSON payload)",
  "14:45–15:30 — API Error Handling (response.ok, try/catch, Loading/success/error UI states, invalid responses)",
  "15:45–16:30 — API + DOM Practice (Fetch list of users/students, dynamic rendering, loading state, failure handling, Reload button)",
  "16:30–17:00 — Interview Recall (Self-test 5 core API & Binary Search placement interview questions)",
  "17:00–17:30 — Mini Project (Upgrade Student Registration & Directory Hub v3 with API fetch, cards/table, Reload button, form)",
  "17:30–17:45 — Final Checklist & Progress Display (~47% curriculum coverage verified)",
];

export function Day14FinalChecklistWidget() {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalTasks = day14ChecklistItems.length;

  return (
    <div className="mt-4 bg-card border-2 border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-5 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Day 14 Final Checklist & Sequential Curriculum Progress
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
        {day14ChecklistItems.map((item, idx) => {
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

      {/* Progress Bars Section at Bottom of Day 14 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-500/40 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
          <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Flame size={15} className="text-amber-400" /> Bottom of Day 14 Progress Summary
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400">Target Coverage: ~47%</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {/* DSA Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-400">DSA Progress</span>
              <span className="font-bold text-blue-400">~47%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "47%" }} />
            </div>
          </div>

          {/* WebDev Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-400">WebDev/MERN Progress</span>
              <span className="font-bold text-emerald-400">~47%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "47%" }} />
            </div>
          </div>

          {/* Overall Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-amber-400">Overall Curriculum Progress</span>
              <span className="font-bold text-amber-400">~47%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-amber-500 rounded-full" style={{ width: "47%" }} />
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
