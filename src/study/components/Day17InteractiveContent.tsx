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
    id: "bubble-sort",
    name: "1. Implement Bubble Sort",
    statement: "Given an unsorted array `arr`, sort it in ascending order using Bubble Sort algorithm with early exit optimization. Return the sorted array.",
    example: {
      input: "arr = [64, 34, 25, 12, 22, 11, 90]",
      output: "[11, 12, 22, 25, 34, 64, 90]",
    },
    hint: "Iterate `n-1` passes. In each pass, compare adjacent elements `arr[j]` and `arr[j+1]`. If out of order, swap them and mark `swapped = true`. If no swaps occurred, break early!",
    expectedOutput: "[11,12,22,25,34,64,90]",
    complexity: {
      time: "O(N^2) Worst/Avg, O(N) Best (with early exit flag)",
      space: "O(1) In-place auxiliary space",
    },
    defaultCode: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

// Test call
bubbleSort([64, 34, 25, 12, 22, 11, 90]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return bubbleSort([64, 34, 25, 12, 22, 11, 90]);`);
        const res = fn();
        const expected = [11, 12, 22, 25, 34, 64, 90];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "selection-sort",
    name: "2. Implement Selection Sort",
    statement: "Given an unsorted array `arr`, sort it in ascending order using Selection Sort by repeatedly finding the minimum element from the unsorted sub-array and swapping it to the front.",
    example: {
      input: "arr = [29, 10, 14, 37, 14]",
      output: "[10, 14, 14, 29, 37]",
    },
    hint: "For each position `i` from `0` to `n-2`, locate index `minIdx` of the smallest element in `arr[i..n-1]`. Swap `arr[i]` with `arr[minIdx]`.",
    expectedOutput: "[10,14,14,29,37]",
    complexity: {
      time: "O(N^2) for all cases (Worst, Avg, Best)",
      space: "O(1) In-place auxiliary space",
    },
    defaultCode: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}

// Test call
selectionSort([29, 10, 14, 37, 14]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return selectionSort([29, 10, 14, 37, 14]);`);
        const res = fn();
        const expected = [10, 14, 14, 29, 37];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "insertion-sort",
    name: "3. Implement Insertion Sort",
    statement: "Given an unsorted array `arr`, sort it in ascending order using Insertion Sort by placing each element into its correct position in the sorted sub-array.",
    example: {
      input: "arr = [12, 11, 13, 5, 6]",
      output: "[5, 6, 11, 12, 13]",
    },
    hint: "Iterate `i` from `1` to `n-1`. Store `key = arr[i]`. Shift elements of `arr[0..i-1]` that are greater than `key` one position right, then place `key` in the gap.",
    expectedOutput: "[5,6,11,12,13]",
    complexity: {
      time: "O(N^2) Worst/Avg, O(N) Best (already sorted array)",
      space: "O(1) In-place auxiliary space",
    },
    defaultCode: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Test call
insertionSort([12, 11, 13, 5, 6]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return insertionSort([12, 11, 13, 5, 6]);`);
        const res = fn();
        const expected = [5, 6, 11, 12, 13];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sort-colors",
    name: "4. Sort an Array of 0s, 1s and 2s",
    statement: "Given array `nums` containing only 0s, 1s, and 2s, sort the array in-place so that 0s, 1s, and 2s are grouped in ascending order (Dutch National Flag Algorithm).",
    example: {
      input: "nums = [2, 0, 2, 1, 1, 0]",
      output: "[0, 0, 1, 1, 2, 2]",
    },
    hint: "Maintain 3 pointers: `low = 0`, `mid = 0`, `high = n - 1`. If `nums[mid] === 0`, swap `nums[low]` & `nums[mid]`, low++, mid++. If `nums[mid] === 1`, mid++. If `nums[mid] === 2`, swap `nums[mid]` & `nums[high]`, high--.",
    expectedOutput: "[0,0,1,1,2,2]",
    complexity: {
      time: "O(N) Single-pass Dutch National Flag algorithm",
      space: "O(1) Constant auxiliary space",
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
sortColors([2, 0, 2, 1, 1, 0]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return sortColors([2, 0, 2, 1, 1, 0]);`);
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
    id: "check-if-array-is-sorted",
    name: "5. Check if an Array is Sorted",
    statement: "Given an array `arr` of size `n`, return `true` if array is sorted in non-decreasing order, otherwise return `false`.",
    example: {
      input: "arr = [1, 2, 3, 4, 5]",
      output: "true",
    },
    hint: "Single-pass linear scan from `i = 0` to `n - 2`. If `arr[i] > arr[i + 1]`, return `false`. If loop finishes completely, return `true`.",
    expectedOutput: "true",
    complexity: {
      time: "O(N) Linear pass",
      space: "O(1) Constant memory",
    },
    defaultCode: `function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

// Test call
isSorted([1, 2, 3, 4, 5]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return isSorted([1, 2, 3, 4, 5]);`);
        const res = fn();
        return { success: res === true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day17DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("bubble-sort");
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
            Day 17 — Sorting Fundamentals & Elementary Algorithms Sandbox
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
// 2. Sorting & React State Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day17CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 17 — Sorting & React State/Events Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Sorting Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <ArrowUpDown size={14} /> Elementary Sorting Guidelines
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>Bubble Sort → Adjacent Swaps:</strong> Compare pairs and bubble max to right. Best $O(N)$ with early exit flag.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Selection Sort → Select Minimum:</strong> Repeatedly swap minimum element to unsorted front. Always $O(N^2)$.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Insertion Sort → Insert into Portion:</strong> Shift elements to insert key into sorted left sub-array. Best $O(N)$.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Dutch National Flag:</strong> Sort 0s, 1s, 2s in $O(N)$ single pass using 3 pointers (<code>low</code>, <code>mid</code>, <code>high</code>).</span>
            </li>
          </ul>
        </div>

        {/* React State & Events Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Atom size={14} /> React State & Events Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>useState Hook:</strong> Component state changes trigger re-renders. Always use functional updates for async states (<code>setVal(prev =&gt; prev + 1)</code>).</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Event Handlers:</strong> Attach camelCase handlers (<code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>). Prevent default on forms.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Controlled Inputs:</strong> Bind input value to React state (<code>value={"{searchTerm}"}</code>) and update via <code>onChange</code>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Dynamic Filtering:</strong> Compute filtered data on the fly based on search term state without mutating original array.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Project React Upgrade (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  course: string;
  marks: number;
}

// Reusable StudentCard component receiving props & toggle handler
function StudentCard({
  student,
  onToggleStatus,
}: {
  student: Student;
  onToggleStatus: (id: number) => void;
}) {
  const isPass = student.marks >= 50;

  return (
    <div className="p-3.5 rounded-xl bg-card border border-border-theme hover:border-accent/40 transition-all shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-text-primary text-sm">{student.name}</h5>
        <span
          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
            isPass
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          }`}
        >
          {isPass ? "Pass" : "Needs Improvement"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs text-text-secondary">
        <div>Course: <span className="font-semibold text-text-primary">{student.course}</span></div>
        <div>Score: <span className={`font-bold ${isPass ? "text-emerald-500" : "text-amber-500"}`}>{student.marks}%</span></div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border-theme/40 text-[11px]">
        <span className="text-text-secondary font-mono">ID: #{student.id}</span>
        <button
          onClick={() => onToggleStatus(student.id)}
          className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-accent hover:bg-accent hover:text-white font-semibold transition-all text-[11px]"
        >
          Toggle Score ({isPass ? "Fail" : "Pass"})
        </button>
      </div>
    </div>
  );
}

// Reusable StudentList component
function StudentList({
  students,
  onToggleStatus,
}: {
  students: Student[];
  onToggleStatus: (id: number) => void;
}) {
  if (students.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-text-secondary rounded-xl border border-dashed border-border-theme">
        No matching students found. Try adjusting your search query or filter.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} onToggleStatus={onToggleStatus} />
      ))}
    </div>
  );
}

export function Day17AsyncProjectWidget() {
  const [students, setStudents] = useState<Student[]>([
    { id: 101, name: "Rahul Sharma", course: "Data Structures", marks: 88 },
    { id: 102, name: "Priya Patel", course: "React & Next.js", marks: 92 },
    { id: 103, name: "Aman Verma", course: "Node.js & Express", marks: 42 },
    { id: 104, name: "Ananya Gupta", course: "Algorithms", marks: 76 },
    { id: 105, name: "Siddharth Rao", course: "System Design", marks: 48 },
    { id: 106, name: "Kavya Singh", course: "Full Stack MERN", marks: 95 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pass" | "improvement">("all");

  const handleToggleStatus = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          // If passing, set to 40 (Needs Improvement); if failing, set to 80 (Pass)
          const newMarks = s.marks >= 50 ? 40 : 80;
          return { ...s, marks: newMarks };
        }
        return s;
      })
    );
  };

  // Filter students dynamically based on controlled search input & status filter state
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.course.toLowerCase().includes(searchTerm.toLowerCase());
    const isPass = s.marks >= 50;
    if (filterStatus === "pass") return matchesSearch && isPass;
    if (filterStatus === "improvement") return matchesSearch && !isPass;
    return matchesSearch;
  });

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-accent w-5 h-5" />
          <div>
            <h3 className="font-bold text-text-primary text-base">
              React Mini Project: Student Search & State Filter Hub v6
            </h3>
            <p className="text-xs text-text-secondary">
              Controlled UI (`useState` + `onChange`), Live Search, Status Toggles & Component Composition
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          Interactive State Demo
        </span>
      </div>

      {/* Controlled Search Bar & Filters */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-text-secondary" />
            <input
              type="text"
              placeholder="Search students by name or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-1.5">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1">
              <Filter size={12} className="text-accent" /> Filter:
            </span>
            {(["all", "pass", "improvement"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 text-xs rounded-lg capitalize font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-accent text-white shadow-xs"
                    : "bg-card border border-border-theme text-text-secondary hover:text-text-primary"
                }`}
              >
                {status === "improvement" ? "Needs Imp." : status}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Display */}
        <div className="flex items-center justify-between text-xs text-text-secondary pt-1 border-t border-border-theme/40">
          <span>
            Showing <strong className="text-accent font-bold">{filteredStudents.length}</strong> of <strong className="text-text-primary">{students.length}</strong> students
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-accent hover:underline text-[11px] font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Student List Component */}
      <StudentList students={filteredStudents} onToggleStatus={handleToggleStatus} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 14: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day17FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day17Blocks = studyBlocksByDay[17] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d17_block_1", label: "09:00–09:20 — Sorting Fundamentals (Definitions, stability, in-place vs extra space)" },
    { id: "d17_block_2", label: "09:20–10:00 — Bubble Sort (Adjacent swaps, early exit flag, complexity, dry-run)" },
    { id: "d17_block_4", label: "10:15–11:00 — Selection & Insertion Sort (Min selection vs Insertion into sorted sub-array)" },
    { id: "d17_block_5", label: "11:00–12:00 — DSA Problems (Bubble, Selection, Insertion, Sort 0s 1s 2s, Check Sorted)" },
    { id: "d17_block_6", label: "12:00–12:15 — Sorting Cheat Sheet (Bubble, Selection, Insertion rules & complexity)" },
    { id: "d17_block_8", label: "14:00–14:45 — React State Deep Dive (useState, re-renders, functional state updates)" },
    { id: "d17_block_9", label: "14:45–15:30 — React Events (onClick, onChange, onSubmit, event arguments)" },
    { id: "d17_block_11", label: "15:45–16:30 — React Practice (Student Search, input state, dynamic filtering)" },
    { id: "d17_block_12", label: "16:30–17:00 — Interview Recall (5 Core React State & Event interview questions)" },
    { id: "d17_block_13", label: "17:00–17:30 — Mini Project (Student Search, State Filter & Pass/Fail Toggle)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day17Blocks.find((b) => b.id === id);
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
            Day 17 — Final Checklist & Progress Summary
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
            <Award size={14} /> Day 17 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~57% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~57%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~57%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~57%</span>
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-slate-400 mb-1">Progress Bar:</div>
            <div className="font-mono text-emerald-400 font-bold tracking-widest text-sm bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              ███████████░░░░░░░░░
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
