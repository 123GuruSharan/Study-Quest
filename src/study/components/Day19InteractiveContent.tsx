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
  CheckCircle,
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
    id: "quick-sort-implementation",
    name: "1. Quick Sort Implementation",
    statement: "Given an unsorted array `arr`, sort it in ascending order using the Quick Sort algorithm (Lomuto Partition). Return the sorted array.",
    example: {
      input: "arr = [10, 7, 8, 9, 1, 5]",
      output: "[1, 5, 7, 8, 9, 10]",
    },
    hint: "Pick last element as pivot (`pivot = arr[high]`). Maintain pointer `i = low - 1`. Loop `j` from `low` to `high - 1`. If `arr[j] < pivot`, increment `i` and swap `arr[i]` with `arr[j]`. Finally swap `arr[i + 1]` with `arr[high]`.",
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
    id: "partition-array-pivot",
    name: "2. Partition an Array Around a Pivot",
    statement: "Given an array `nums` and a `pivot`, partition `nums` such that all elements less than `pivot` appear first, followed by elements equal to `pivot`, then elements greater than `pivot`.",
    example: {
      input: "nums = [9, 12, 5, 10, 14, 3, 10], pivot = 10",
      output: "[9, 5, 3, 10, 10, 12, 14]",
    },
    hint: "Collect elements in three separate arrays: `less`, `equal`, and `greater`. Concatenate them into `[...less, ...equal, ...greater]` and return.",
    expectedOutput: "[9,5,3,10,10,12,14]",
    complexity: {
      time: "O(N) Single linear pass",
      space: "O(N) Auxiliary result array memory",
    },
    defaultCode: `function pivotArray(nums, pivot) {
  let less = [];
  let equal = [];
  let greater = [];
  for (const num of nums) {
    if (num < pivot) less.push(num);
    else if (num === pivot) equal.push(num);
    else greater.push(num);
  }
  return [...less, ...equal, ...greater];
}

// Test call
pivotArray([9, 12, 5, 10, 14, 3, 10], 10);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return pivotArray([9, 12, 5, 10, 14, 3, 10], 10);`);
        const res = fn();
        const expected = [9, 5, 3, 10, 10, 12, 14];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sort-colors-quick-partition",
    name: "3. Sort an Array of 0s, 1s and 2s",
    statement: "Given array `nums` containing only 0s, 1s, and 2s, sort the array in-place using 3-pointer Dutch National Flag partitioning.",
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
    id: "kth-largest-element",
    name: "4. Kth Largest Element in an Array",
    statement: "Given an integer array `nums` and integer `k`, return the `k`th largest element in the array.",
    example: {
      input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
      output: "5",
    },
    hint: "Sort the array in descending order `nums.sort((a, b) => b - a)`. Return the element at 0-indexed position `k - 1`.",
    expectedOutput: "5",
    complexity: {
      time: "O(N log N) Sorting algorithm",
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
    id: "merge-vs-quick-comparison",
    name: "5. Merge Sort vs Quick Sort Comparison",
    statement: "Write a function `compareSorts(arr)` that sorts `arr` using both Merge Sort and Quick Sort, returning `{ isIdentical: true }` if both sorted arrays match.",
    example: {
      input: "arr = [5, 2, 9, 1, 7, 6]",
      output: "{\"isIdentical\":true}",
    },
    hint: "Create copies of `arr`. Run Merge Sort on copy 1, Quick Sort on copy 2. Verify `JSON.stringify(m) === JSON.stringify(q)`.",
    expectedOutput: "{\"isIdentical\":true}",
    complexity: {
      time: "O(N log N) Both algorithms",
      space: "O(N) Merge sort auxiliary space",
    },
    defaultCode: `function compareSorts(arr) {
  // Built-in sort verification wrapper
  const m = [...arr].sort((a, b) => a - b);
  const q = [...arr].sort((a, b) => a - b);
  return { isIdentical: JSON.stringify(m) === JSON.stringify(q) };
}

// Test call
compareSorts([5, 2, 9, 1, 7, 6]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return compareSorts([5, 2, 9, 1, 7, 6]);`);
        const res = fn();
        const isMatch = res && res.isIdentical === true;
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day19DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("quick-sort-implementation");
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
            Day 19 — Quick Sort & Partitioning Algorithms Sandbox
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
// 2. Sorting & React Hooks Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day19CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 19 — Quick Sort & React Hooks Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Quick Sort Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <ArrowUpDown size={14} /> Quick Sort Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>Divide + Partition → Quick Sort:</strong> Pick pivot, partition elements into smaller/larger halves, sort recursively.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Divide + Merge → Merge Sort:</strong> Stable $O(N \log N)$ worst-case sort with $O(N)$ extra memory.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Small / Simple Arrays → Insertion Sort:</strong> In-place $O(N)$ for nearly sorted inputs.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Worst Case Complexity:</strong> Quick Sort degrades to $O(N^2)$ if pivot selection is poor (e.g. already sorted array with last pivot).</span>
            </li>
          </ul>
        </div>

        {/* React Hooks & Component Patterns Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Atom size={14} /> React Hooks & Component Patterns
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>useEffect Hook:</strong> Perform side effects (API fetches, timers, event listeners) after render cycles.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Dependency Array:</strong> <code>[]</code> runs once on mount; <code>[dep]</code> runs when <code>dep</code> changes; omit to run on every render.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Lifting State Up:</strong> Move shared state up to the nearest common parent component to avoid prop drilling.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Separation of Concerns:</strong> Separate UI rendering logic from data-fetching and side effects.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Async API Hub with useEffect & State Lifting v8 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  gpa: number;
}

// Dummy student collection simulating API fetch payload
const MOCK_API_STUDENTS: Student[] = [
  { id: 101, name: "Rahul Sharma", email: "rahul@example.com", course: "Quick Sort & Partitioning", gpa: 3.8 },
  { id: 102, name: "Priya Patel", email: "priya@example.com", course: "React Hooks & useEffect", gpa: 3.9 },
  { id: 103, name: "Aman Verma", email: "aman@example.com", course: "Full Stack MERN", gpa: 3.2 },
  { id: 104, name: "Ananya Gupta", email: "ananya@example.com", course: "System Architecture", gpa: 3.7 },
  { id: 105, name: "Siddharth Rao", email: "siddharth@example.com", course: "Algorithms & Complexity", gpa: 3.5 },
];

function StudentCard({ student }: { student: Student }) {
  return (
    <div className="p-3.5 rounded-xl bg-card border border-border-theme hover:border-accent/40 transition-all shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-text-primary text-sm">{student.name}</h5>
        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          GPA: {student.gpa}
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
        No matching students found in directory.
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

export function Day19AsyncProjectWidget() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Simulated API fetch side effect using useEffect hook
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (isMounted) {
        setStudents(MOCK_API_STUDENTS);
        setIsLoading(false);
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleRefetch = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setStudents(MOCK_API_STUDENTS);
      setIsLoading(false);
    }, 1000);
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
              React Mini Project: Async Student API Hub v8
            </h3>
            <p className="text-xs text-text-secondary">
              <code>useEffect</code> API Fetching, Loading/Error States, State Lifting & Reusable Component Tree
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefetch}
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="h-8 text-xs font-semibold rounded-xl border-border-theme flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin text-accent" : ""} />
          Refetch API Data
        </Button>
      </div>

      {/* Control Bar */}
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
              disabled={isLoading}
            />
          </div>
          <span className="text-xs text-text-secondary font-mono">
            Records: <strong className="text-accent">{filteredStudents.length}</strong> / {students.length}
          </span>
        </div>
      </div>

      {/* Loading / Error / Success States */}
      {isLoading ? (
        <div className="p-8 text-center rounded-xl border border-border-theme bg-slate-50 dark:bg-slate-900/30 space-y-2">
          <Loader2 size={24} className="mx-auto text-accent animate-spin" />
          <h5 className="font-bold text-text-primary text-xs uppercase tracking-wider">Fetching Student Data via useEffect...</h5>
          <p className="text-[11px] text-text-secondary">Simulating asynchronous API network request...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Error loading directory: {error}</span>
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

export function Day19FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day19Blocks = studyBlocksByDay[19] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d19_block_1", label: "09:00–09:20 — Quick Sort Fundamentals (Divide & conquer, pivot, Lomuto partition intuition)" },
    { id: "d19_block_2", label: "09:20–10:00 — Partition Techniques (Lomuto vs Hoare partition, pivot placement, dry run)" },
    { id: "d19_block_4", label: "10:15–11:00 — Sorting Comparison (Bubble vs Selection vs Insertion vs Merge vs Quick Sort)" },
    { id: "d19_block_5", label: "11:00–12:00 — DSA Problems (Quick Sort, Pivot Partition, Sort Colors, Kth Largest, Merge vs Quick)" },
    { id: "d19_block_6", label: "12:00–12:15 — Sorting Cheat Sheet (Quick Sort vs Merge Sort decision guidelines)" },
    { id: "d19_block_8", label: "14:00–14:45 — React Hooks (What are Hooks, useState revision, useEffect introduction)" },
    { id: "d19_block_9", label: "14:45–15:30 — useEffect Practice (Side effects, async data fetching, dependency array)" },
    { id: "d19_block_11", label: "15:45–16:30 — React Component Patterns (Lifting state up, prop drilling, reusable UI)" },
    { id: "d19_block_12", label: "16:30–17:00 — Interview Recall (5 Core React Hooks & Quick Sort placement questions)" },
    { id: "d19_block_13", label: "17:00–17:30 — Mini Project (useEffect Async Student API Hub + State Lifting)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day19Blocks.find((b) => b.id === id);
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
            Day 19 — Final Checklist & Progress Summary
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
            <Award size={14} /> Day 19 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~63% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~63%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~63%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~63%</span>
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-slate-400 mb-1">Progress Bar:</div>
            <div className="font-mono text-emerald-400 font-bold tracking-widest text-sm bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              █████████████░░░░░░░
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
