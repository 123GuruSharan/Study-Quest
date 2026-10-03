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
    id: "search-rotated-sorted-array",
    name: "1. Search in Rotated Sorted Array",
    statement: "Given integer array `nums` sorted in ascending order (with distinct values) and rotated at an unknown pivot index, and a `target` value, return index of `target` if it is in `nums`, or `-1` if it is not.",
    example: {
      input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
      output: "4",
    },
    hint: "Identify which half of the array is sorted (`nums[low] <= nums[mid]`). If target lies within the range of the sorted half, narrow search to that half; otherwise search the unsorted half.",
    expectedOutput: "4",
    complexity: {
      time: "O(log N) — Binary search halves search space each iteration",
      space: "O(1) — Auxiliary space",
    },
    defaultCode: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;

    // Check if left half is sorted
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // Right half is sorted
      if (nums[mid] < target && target <= nums[high]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
  return -1;
}

// Test call
search([4, 5, 6, 7, 0, 1, 2], 0);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return search([4, 5, 6, 7, 0, 1, 2], 0);`);
        const res = fn();
        return { success: res === 4, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "find-minimum-rotated-sorted-array",
    name: "2. Find Minimum in Rotated Sorted Array",
    statement: "Suppose an array of length `n` sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.",
    example: {
      input: "nums = [3, 4, 5, 1, 2]",
      output: "1",
    },
    hint: "Compare `nums[mid]` with `nums[high]`. If `nums[mid] > nums[high]`, the minimum lies in the right unsorted part (`low = mid + 1`). Otherwise `high = mid`.",
    expectedOutput: "1",
    complexity: {
      time: "O(log N) — Logarithmic binary search",
      space: "O(1) — Constant space",
    },
    defaultCode: `function findMin(nums) {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] > nums[high]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return nums[low];
}

// Test call
findMin([3, 4, 5, 1, 2]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findMin([3, 4, 5, 1, 2]);`);
        const res = fn();
        return { success: res === 1, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "find-peak-element",
    name: "3. Find Peak Element",
    statement: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element and return its index.",
    example: {
      input: "nums = [1, 2, 3, 1]",
      output: "2 (Value 3 at index 2)",
    },
    hint: "If `nums[mid] < nums[mid + 1]`, there must be at least one peak on the right side (`low = mid + 1`). Otherwise a peak exists on the left side including `mid` (`high = mid`).",
    expectedOutput: "2",
    complexity: {
      time: "O(log N) — Reduces search space by half",
      space: "O(1) — In-place binary search",
    },
    defaultCode: `function findPeakElement(nums) {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] < nums[mid + 1]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

// Test call
findPeakElement([1, 2, 3, 1]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findPeakElement([1, 2, 3, 1]);`);
        const res = fn();
        return { success: res === 2, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "floor-and-ceiling",
    name: "4. Find Floor and Ceiling of a Number",
    statement: "Given a sorted array `arr` and integer `x`, find the floor (largest element <= x) and ceiling (smallest element >= x) of `x`. Return `[floor, ceiling]`, or `-1` if not present.",
    example: {
      input: "arr = [1, 2, 8, 10, 10, 12, 19], x = 5",
      output: "[2, 8]",
    },
    hint: "Use binary search: for floor, if `arr[mid] <= x`, save `arr[mid]` and move `low = mid + 1`. For ceiling, if `arr[mid] >= x`, save `arr[mid]` and move `high = mid - 1`.",
    expectedOutput: "[2,8]",
    complexity: {
      time: "O(log N) — Two binary searches of O(log N)",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function getFloorAndCeil(arr, x) {
  let floor = -1, ceil = -1;

  // Find floor
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] <= x) {
      floor = arr[mid];
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Find ceiling
  low = 0; high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] >= x) {
      ceil = arr[mid];
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return [floor, ceil];
}

// Test call
getFloorAndCeil([1, 2, 8, 10, 10, 12, 19], 5);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return getFloorAndCeil([1, 2, 8, 10, 10, 12, 19], 5);`);
        const res = fn();
        return {
          success: Array.isArray(res) && res[0] === 2 && res[1] === 8,
          output: JSON.stringify(res),
        };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sqrt-binary-search",
    name: "5. Square Root using Binary Search",
    statement: "Given integer `n`, compute floor integer square root of `n` using Binary Search without using built-in `Math.sqrt()`.",
    example: {
      input: "n = 28",
      output: "5 (since 5*5 = 25 <= 28 and 6*6 = 36 > 28)",
    },
    hint: "Search space is `[1, n]`. If `mid * mid <= n`, save `ans = mid` and search right (`low = mid + 1`), else search left (`high = mid - 1`).",
    expectedOutput: "5",
    complexity: {
      time: "O(log N) — Halves candidate range [1, N]",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function sqrtBS(n) {
  if (n < 2) return n;
  let low = 1, high = n;
  let ans = 0;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (mid * mid <= n) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}

// Test call
sqrtBS(28);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return sqrtBS(28);`);
        const res = fn();
        return { success: res === 5, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day16DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("search-rotated-sorted-array");
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
            Day 16 — Binary Search Variations & Rotated Problems Sandbox
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
// 2. Searching & React Cheat Sheet (Session 5: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day16CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 16 — Searching & React Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Searching Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Search size={14} /> Searching Guidelines
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>Sorted Array → Binary Search:</strong> Always think $O(\log N)$ before $O(N)$ linear scans.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Rotated Sorted Array:</strong> Identify which half is sorted using <code>nums[low] &lt;= nums[mid]</code>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Min / Max Answer:</strong> Frame search space $[low, high]$ and construct monotonic predicate <code>can(mid)</code>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Boundary Guarding:</strong> Watch out for off-by-one errors (<code>low &lt;= high</code> vs <code>low &lt; high</code>).</span>
            </li>
          </ul>
        </div>

        {/* React Components & Props Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Atom size={14} /> React Components & Props Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>Functional Components:</strong> Pure JS functions returning JSX markup.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Props Deep Dive:</strong> Read-only immutable data passed top-down from parent to child.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Destructuring:</strong> Cleanly unpack props <code>{`const StudentCard = ({ name, grade }) => ...`}</code>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Unique Keys in map():</strong> Always pass a unique <code>key</code> prop to help React reconcile lists efficiently.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Project React Upgrade (Session 10: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  course: string;
  marks: number;
}

// Child Component: StudentCard receiving props
function StudentCard({ student, onDelete }: { student: Student; onDelete: (id: number) => void }) {
  const isPass = student.marks >= 50;

  return (
    <div className="p-3.5 rounded-xl bg-card border border-border-theme hover:border-accent/40 transition-all shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-text-primary text-sm">{student.name}</h5>
        <span
          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
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
        <span className="text-text-secondary font-mono">Key: student-{student.id}</span>
        <button
          onClick={() => onDelete(student.id)}
          className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// Parent Component: StudentList rendering multiple cards via map()
function StudentList({
  students,
  onDeleteStudent,
}: {
  students: Student[];
  onDeleteStudent: (id: number) => void;
}) {
  if (students.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-text-secondary rounded-xl border border-dashed border-border-theme">
        No students found. Add one above!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} onDelete={onDeleteStudent} />
      ))}
    </div>
  );
}

export function Day16AsyncProjectWidget() {
  const [students, setStudents] = useState<Student[]>([
    { id: 101, name: "Rahul Sharma", course: "React & Next.js", marks: 88 },
    { id: 102, name: "Priya Patel", course: "Data Structures", marks: 92 },
    { id: 103, name: "Aman Verma", course: "Node.js & MERN", marks: 42 },
    { id: 104, name: "Ananya Gupta", course: "Full Stack Development", marks: 76 },
  ]);

  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("React & Next.js");
  const [newMarks, setNewMarks] = useState("75");
  const [filter, setFilter] = useState<"all" | "pass" | "improvement">("all");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: Date.now(),
      name: newName.trim(),
      course: newCourse,
      marks: parseInt(newMarks) || 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
    setNewName("");
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((s) => {
    if (filter === "pass") return s.marks >= 50;
    if (filter === "improvement") return s.marks < 50;
    return true;
  });

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-accent w-5 h-5" />
          <div>
            <h3 className="font-bold text-text-primary text-base">
              React Mini Project: Student Directory Hub v5
            </h3>
            <p className="text-xs text-text-secondary">
              Component Composition (<code>StudentList</code> + <code>StudentCard</code>), Props Flow & Dynamic <code>map()</code>
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Interactive Component Demo
        </span>
      </div>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 space-y-3">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider block flex items-center gap-1.5">
          <Plus size={14} className="text-accent" /> Add New Student Card (Props Target)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Student Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            required
          />
          <input
            type="text"
            placeholder="Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Marks %"
              value={newMarks}
              onChange={(e) => setNewMarks(e.target.value)}
              className="p-2 w-24 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              min="0"
              max="100"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-accent hover:bg-accent/90 text-white font-bold h-full text-xs rounded-lg flex-1"
            >
              Add Card
            </Button>
          </div>
        </div>
      </form>

      {/* Controls & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-text-primary">Filter:</span>
          {(["all", "pass", "improvement"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-xs rounded-lg capitalize font-semibold transition-all ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-text-secondary hover:text-text-primary"
              }`}
            >
              {f === "improvement" ? "Needs Improvement" : f}
            </button>
          ))}
        </div>
        <div className="text-xs text-text-secondary font-mono">
          Total Cards: <span className="font-bold text-accent">{students.length}</span>
        </div>
      </div>

      {/* Student List Rendered Component */}
      <StudentList students={filteredStudents} onDeleteStudent={handleDeleteStudent} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 11: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day16FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day16Blocks = studyBlocksByDay[16] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d16_block_1", label: "09:00–09:20 — Searching Revision (Linear vs Binary, Bounds, Complexity)" },
    { id: "d16_block_2", label: "09:20–10:00 — Binary Search Practice (Search space, condition, dry-runs)" },
    { id: "d16_block_4", label: "10:15–11:00 — Searching Patterns (Rotated sorted array, search space reduction)" },
    { id: "d16_block_5", label: "11:00–12:00 — DSA Problems (Rotated Search, Min Element, Peak, Floor/Ceil, Sqrt)" },
    { id: "d16_block_6", label: "12:00–12:15 — Searching Cheat Sheet (Rotated search & React props rules)" },
    { id: "d16_block_8", label: "14:00–14:45 — React Components (Functional components, composition, JSX)" },
    { id: "d16_block_9", label: "14:45–15:30 — Props Deep Dive (Passing props, destructuring, read-only data flow)" },
    { id: "d16_block_11", label: "15:45–16:30 — React Practice (StudentCard upgrade with map() and keys)" },
    { id: "d16_block_12", label: "16:30–17:00 — Interview Recall (5 Core React & Searching questions)" },
    { id: "d16_block_13", label: "17:00–17:30 — Mini Project (StudentList + StudentCard Component Composition)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day16Blocks.find((b) => b.id === id);
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
            Day 16 — Final Checklist & Progress Summary
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
            <Award size={14} /> Day 16 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~53% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~53%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~53%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~53%</span>
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
