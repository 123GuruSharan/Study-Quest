"use client";

import React, { useState, useEffect } from "react";
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
  Atom,
  UserCheck,
  Plus,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  Award,
  ArrowUpDown,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudyStore } from "@/study/stores/studyStore";

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
    id: "merge-sort-final-revision",
    name: "1. Merge Sort Implementation",
    statement: "Given an unsorted array `arr`, sort it in ascending order using Merge Sort algorithm (Divide and Conquer). Return the sorted array.",
    example: {
      input: "arr = [38, 27, 43, 3, 9, 82, 10]",
      output: "[3, 9, 10, 27, 38, 43, 82]",
    },
    hint: "If `arr.length <= 1`, return `arr`. Mid is `Math.floor(arr.length / 2)`. Sort `left` and `right` recursively, then merge two sorted halves using two pointers.",
    expectedOutput: "[3,9,10,27,38,43,82]",
    complexity: {
      time: "O(N log N) for all cases (Worst, Avg, Best)",
      space: "O(N) Auxiliary space for arrays",
    },
    defaultCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  let res = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}

// Test call
mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return mergeSort([38, 27, 43, 3, 9, 82, 10]);`);
        const res = fn();
        const expected = [3, 9, 10, 27, 38, 43, 82];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "quick-sort-final-revision",
    name: "2. Quick Sort Implementation",
    statement: "Given an unsorted array `arr`, sort it in ascending order using Quick Sort algorithm (Lomuto Partition). Return the sorted array.",
    example: {
      input: "arr = [10, 7, 8, 9, 1, 5]",
      output: "[1, 5, 7, 8, 9, 10]",
    },
    hint: "Pick last element as pivot (`pivot = arr[high]`). Pointer `i = low - 1`. Loop `j` from `low` to `high - 1`. Swap `arr[i]` and `arr[j]` when `arr[j] < pivot`. Place pivot at `i+1`.",
    expectedOutput: "[1,5,7,8,9,10]",
    complexity: {
      time: "O(N log N) Average, O(N^2) Worst case",
      space: "O(log N) Auxiliary recursion stack space",
    },
    defaultCode: `function quickSort(arr) {
  function partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      let pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, arr.length - 1);
  return arr;
}

// Test call
quickSort([10, 7, 8, 9, 1, 5]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return quickSort([10, 7, 8, 9, 1, 5]);`);
        const res = fn();
        const expected = [1, 5, 7, 8, 9, 10];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sort-colors-d20",
    name: "3. Sort 0s, 1s and 2s",
    statement: "Given array `nums` containing only 0s, 1s, and 2s, sort the array in-place using Dutch National Flag 3-pointer algorithm.",
    example: {
      input: "nums = [2, 0, 1, 2, 1, 0]",
      output: "[0, 0, 1, 1, 2, 2]",
    },
    hint: "Maintain 3 pointers: `low = 0`, `mid = 0`, `high = n - 1`. If `nums[mid] === 0`, swap `nums[low]` & `nums[mid]`, low++, mid++. If 1, mid++. If 2, swap `nums[mid]` & `nums[high]`, high--.",
    expectedOutput: "[0,0,1,1,2,2]",
    complexity: {
      time: "O(N) Single pass",
      space: "O(1) In-place auxiliary memory",
    },
    defaultCode: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      let temp = nums[low];
      nums[low] = nums[mid];
      nums[mid] = temp;
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      let temp = nums[mid];
      nums[mid] = nums[high];
      nums[high] = temp;
      high--;
    }
  }
  return nums;
}

// Test call
sortColors([2, 0, 1, 2, 1, 0]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return sortColors([2, 0, 1, 2, 1, 0]);`);
        const res = fn();
        const expected = [0, 0, 1, 1, 2, 2];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "kth-largest-element-d20",
    name: "4. Kth Largest Element",
    statement: "Given an integer array `nums` and integer `k`, return the `k`th largest element in the array.",
    example: {
      input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
      output: "5",
    },
    hint: "Sort the array in descending order `nums.sort((a, b) => b - a)`. Return element at 0-indexed position `k - 1`.",
    expectedOutput: "5",
    complexity: {
      time: "O(N log N) Sorting time",
      space: "O(1) Auxiliary space",
    },
    defaultCode: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

// Test call
findKthLargest([3, 2, 1, 5, 6, 4], 2);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findKthLargest([3, 2, 1, 5, 6, 4], 2);`);
        const res = fn();
        return { success: res === 5, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "merge-overlapping-intervals",
    name: "5. Merge Overlapping Intervals",
    statement: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of non-overlapping intervals.",
    example: {
      input: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
      output: "[[1, 6], [8, 10], [15, 18]]",
    },
    hint: "Sort intervals by start time: `intervals.sort((a, b) => a[0] - b[0])`. Iterate through intervals; if `res` is empty or current `start` > `lastEnd`, push interval. Else merge by setting `lastEnd = Math.max(lastEnd, currentEnd)`.",
    expectedOutput: "[[1,6],[8,10],[15,18]]",
    complexity: {
      time: "O(N log N) Sorting initial interval start times",
      space: "O(N) Result intervals array space",
    },
    defaultCode: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  let merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    let current = intervals[i];
    let last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

// Test call
mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]);`);
        const res = fn();
        const expected = [[1, 6], [8, 10], [15, 18]];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day20DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("merge-sort-final-revision");
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    dsaProblemsData.forEach((p) => {
      initial[p.id] = p.defaultCode;
    });
    return initial;
  });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; output?: string } | null>(null);

  const currentProblem = dsaProblemsData.find((p) => p.id === selectedProblemId) || dsaProblemsData[0];

  const handleRunCode = () => {
    const code = codes[currentProblem.id];
    const res = currentProblem.testRunner(code);
    setTestResult(res);
  };

  const handleResetCode = () => {
    setCodes((prev) => ({ ...prev, [currentProblem.id]: currentProblem.defaultCode }));
    setTestResult(null);
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="text-accent w-5 h-5" />
          <h3 className="font-bold text-text-primary text-base">
            Day 20 — Sorting Final Revision & Interval Sorting Sandbox
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-accent/10 text-accent border border-accent/20">
          5 Core Algorithms
        </span>
      </div>

      {/* Problem Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border-theme/40">
        {dsaProblemsData.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedProblemId(p.id);
              setShowHint(false);
              setTestResult(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedProblemId === p.id
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            P{idx + 1}: {p.name.split(". ")[1] || p.name}
          </button>
        ))}
      </div>

      {/* Selected Problem Description */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 space-y-2">
        <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
          <span>{currentProblem.name}</span>
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed">{currentProblem.statement}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2 rounded-lg bg-card border border-border-theme font-mono">
            <span className="text-accent font-semibold block text-[11px] uppercase">Sample Input & Output:</span>
            <div className="text-text-primary mt-0.5">Input: {currentProblem.example.input}</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Output: {currentProblem.example.output}</div>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border-theme">
            <span className="text-purple-600 dark:text-purple-400 font-semibold block text-[11px] uppercase">Complexity Target:</span>
            <div className="text-text-secondary text-[11px] mt-0.5">Time: {currentProblem.complexity.time}</div>
            <div className="text-text-secondary text-[11px]">Space: {currentProblem.complexity.space}</div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-accent hover:text-accent/80 h-7 px-2 flex items-center gap-1"
          >
            <HelpCircle size={13} />
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <span className="text-[11px] text-text-secondary">Expected: <code className="text-accent font-mono">{currentProblem.expectedOutput}</code></span>
        </div>

        {showHint && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            💡 <strong>Hint:</strong> {currentProblem.hint}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <Code2 size={14} className="text-accent" /> Solution Editor (JavaScript)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetCode}
            className="text-xs h-7 text-text-secondary hover:text-text-primary flex items-center gap-1"
          >
            <RotateCcw size={12} /> Reset Code
          </Button>
        </div>

        <textarea
          value={codes[currentProblem.id]}
          onChange={(e) => {
            const val = e.target.value;
            setCodes((prev) => ({ ...prev, [currentProblem.id]: val }));
          }}
          rows={10}
          className="w-full p-3 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs border border-border-theme focus:ring-2 focus:ring-accent focus:outline-none leading-relaxed"
          spellCheck={false}
        />

        <div className="flex items-center justify-between">
          <Button
            onClick={handleRunCode}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl flex items-center gap-1.5"
          >
            <Play size={13} /> Run & Test Solution
          </Button>

          {testResult && (
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold ${
                testResult.success
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
              }`}
            >
              {testResult.success ? (
                <>
                  <CheckCircle2 size={14} /> Passed! Output: {testResult.output}
                </>
              ) : (
                <>
                  <AlertCircle size={14} /> Result: {testResult.output}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Sorting & React API Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day20CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 20 — Sorting Final & React API Integration Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Sorting Final Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <ArrowUpDown size={14} /> Complete Sorting Decision Matrix
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>Simple Swaps → Bubble Sort:</strong> $O(N^2)$ worst, $O(N)$ best with swapped flag.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Minimum Selection → Selection Sort:</strong> $O(N^2)$ always, $O(N)$ swaps.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Sorted Prefix → Insertion Sort:</strong> Adaptive $O(N)$ for nearly sorted data.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Divide + Merge → Merge Sort:</strong> Stable $O(N \log N)$ worst case time, $O(N)$ space.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">5.</span>
              <span><strong>Divide + Partition → Quick Sort:</strong> In-place $O(N \log N)$ avg time, unstable.</span>
            </li>
          </ul>
        </div>

        {/* React API Integration Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Atom size={14} /> React API Integration & useEffect Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>Loading / Success / Error States:</strong> Maintain distinct state flags (`isLoading`, `error`, `data`).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Async Fetch in useEffect:</strong> Define async inner helper function inside `useEffect` callback.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Dependency Guarding:</strong> Include primitive dependencies in `[dep]` to re-fetch automatically on param changes.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Reload Button:</strong> Provide explicit manual Refetch trigger button that re-runs state update fetch function.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Async API Integration Hub v9 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
}

const MOCK_API_STUDENT_RESPONSE: Student[] = [
  { id: 201, name: "Rahul Sharma", email: "rahul.sharma@studyquest.io", course: "Merge Overlapping Intervals", status: "Active" },
  { id: 202, name: "Priya Patel", email: "priya.patel@studyquest.io", course: "React Effects & API Fetching", status: "Active" },
  { id: 203, name: "Aman Verma", email: "aman.verma@studyquest.io", course: "Quick & Merge Sort Synthesis", status: "On Leave" },
  { id: 204, name: "Ananya Gupta", email: "ananya.gupta@studyquest.io", course: "Full Stack MERN Architecture", status: "Active" },
  { id: 205, name: "Siddharth Rao", email: "siddharth.rao@studyquest.io", course: "Algorithms & Partitioning", status: "Active" },
];

function StudentCard({ student }: { student: Student }) {
  return (
    <div className="p-3.5 rounded-xl bg-card border border-border-theme hover:border-accent/40 transition-all shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-text-primary text-sm">{student.name}</h5>
        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
            student.status === "Active"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          }`}
        >
          {student.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs text-text-secondary">
        <div>Email: <span className="font-mono text-text-primary text-[11px] truncate block">{student.email}</span></div>
        <div>Course: <span className="font-semibold text-text-primary truncate block">{student.course}</span></div>
      </div>
    </div>
  );
}

function StudentList({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-text-secondary rounded-xl border border-dashed border-border-theme">
        No students matched your search query.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export function Day20AsyncProjectWidget() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadToken, setReloadToken] = useState<number>(0);

  // Simulated API fetch side effect inside useEffect with dependencies
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchTimer = setTimeout(() => {
      if (!isCancelled) {
        // 90% success rate simulation
        if (Math.random() < 0.95) {
          setStudents(MOCK_API_STUDENT_RESPONSE);
          setIsLoading(false);
        } else {
          setError("Failed to reach Remote StudyQuest API. HTTP 503 Server Error.");
          setIsLoading(false);
        }
      }
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(fetchTimer);
    };
  }, [reloadToken]);

  const handleReload = () => {
    setReloadToken((prev) => prev + 1);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-accent w-5 h-5" />
          <div>
            <h3 className="font-bold text-text-primary text-base">
              React Mini Project: Async API Integration Hub v9
            </h3>
            <p className="text-xs text-text-secondary">
              <code>useEffect</code> API Fetching + Loading / Success / Error States + Reload Data Button + Dynamic Search Filter
            </p>
          </div>
        </div>
        <Button
          onClick={handleReload}
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="h-8 text-xs font-bold rounded-xl border border-border-theme flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin text-accent" : ""} />
          Reload Data
        </Button>
      </div>

      {/* Control Search Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-2.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search fetched directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isLoading || !!error}
            />
          </div>
          <span className="text-xs text-text-secondary font-mono">
            Records: <strong className="text-accent font-bold">{filteredStudents.length}</strong> / {students.length}
          </span>
        </div>
      </div>

      {/* UI State Renderers: Loading / Error / Success */}
      {isLoading ? (
        <div className="p-8 text-center rounded-xl border border-border-theme bg-slate-50 dark:bg-slate-900/30 space-y-2">
          <Loader2 size={24} className="mx-auto text-accent animate-spin" />
          <h5 className="font-bold text-text-primary text-xs uppercase tracking-wider">Fetching Student Data from Server...</h5>
          <p className="text-[11px] text-text-secondary">Simulating network fetch inside useEffect...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>API Error: {error}</span>
          </div>
          <Button onClick={handleReload} size="sm" className="h-7 text-xs bg-rose-600 text-white font-bold rounded-lg">
            Retry Connection
          </Button>
        </div>
      ) : (
        <StudentList students={filteredStudents} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 14: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day20FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day20Blocks = studyBlocksByDay[20] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d20_block_1", label: "09:00–09:20 — Sorting Revision (Bubble, Selection, Insertion, Merge, Quick Sort comparison)" },
    { id: "d20_block_2", label: "09:20–10:00 — Sorting Patterns (Divide & conquer, partitioning, custom comparators)" },
    { id: "d20_block_4", label: "10:15–11:00 — Sorting Problem Solving (Complexity analysis, dry-run, brute force vs optimized)" },
    { id: "d20_block_5", label: "11:00–12:00 — DSA Problems (Merge Sort, Quick Sort, Sort 0s 1s 2s, Kth Largest, Merge Intervals)" },
    { id: "d20_block_6", label: "12:00–12:15 — Sorting Cheat Sheet (Complete sorting decision matrix)" },
    { id: "d20_block_8", label: "14:00–14:45 — useEffect Deep Dive (Execution lifecycle, dependency array, cleanup, infinite loops)" },
    { id: "d20_block_9", label: "14:45–15:30 — React API Integration (Loading/Success/Error states, state storage, re-fetching)" },
    { id: "d20_block_11", label: "15:45–16:30 — React Practice (Fetch user data, loading state, error alert, reload button)" },
    { id: "d20_block_12", label: "16:30–17:00 — Interview Recall (5 Core React Effects & API Integration placement questions)" },
    { id: "d20_block_13", label: "17:00–17:30 — Mini Project (Async API Integration Hub + Reload Button + Reusable Components)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day20Blocks.find((b) => b.id === id);
    return found ? found.status === "Completed" : false;
  };

  const completedCount = tasksList.filter((t) => getBlockDone(t.id)).length;
  const progressPercent = Math.round((completedCount / tasksList.length) * 100);

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-emerald-500 w-5 h-5" />
          <h3 className="font-bold text-text-primary text-base">
            Day 20 — Final Checklist & Progress Summary
          </h3>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          {completedCount} / {tasksList.length} Tasks Completed ({progressPercent}%)
        </span>
      </div>

      {/* Checkbox List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {tasksList.map((task) => {
          const isDone = getBlockDone(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-text-primary"
                  : "bg-slate-50 dark:bg-slate-900/40 border-border-theme/60 text-text-secondary hover:border-accent/40"
              }`}
            >
              {isDone ? (
                <CheckSquare size={16} className="text-emerald-500 shrink-0" />
              ) : (
                <Square size={16} className="text-text-secondary shrink-0" />
              )}
              <span className={`text-xs font-medium ${isDone ? "line-through text-text-secondary" : ""}`}>
                {task.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Curriculum Coverage Summary Block */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 border border-border-theme">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
            <Award size={14} /> Day 20 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~67% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~67%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~67%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~67%</span>
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-slate-400 mb-1">Progress Bar:</div>
            <div className="font-mono text-emerald-400 font-bold tracking-widest text-sm bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              ██████████████░░░░░░
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
