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
    id: "sqrt-x",
    name: "1. Square Root of a Number (Sqrt(x))",
    statement: "Given a non-negative integer `x`, compute and return the square root of `x` rounded down to the nearest integer.",
    example: {
      input: "x = 8",
      output: "2 (since 2^2 = 4 <= 8 and 3^2 = 9 > 8)",
    },
    hint: "Binary search answer range [0, x]. If mid * mid <= x, store ans = mid and search right (low = mid + 1). Else search left (high = mid - 1).",
    expectedOutput: "2",
    complexity: {
      time: "O(log X) — Binary search over answer range [0, x]",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function mySqrt(x) {
  if (x < 2) return x;
  let low = 1, high = x;
  let ans = 0;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (mid * mid <= x) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}

// Test call
mySqrt(8);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return mySqrt(8);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "koko-eating-bananas",
    name: "2. Koko Eating Bananas",
    statement: "Given piles of bananas `piles` and `h` hours, return the minimum integer eating speed `k` (bananas/hour) such that Koko can eat all bananas within `h` hours.",
    example: {
      input: "piles = [3, 6, 7, 11], h = 8",
      output: "4",
    },
    hint: "Binary search speed k in range [1, max(piles)]. Feasibility helper canEat(k) sums Math.ceil(p / k) hours. If total hours <= h, save ans = k and try smaller speed (high = mid - 1).",
    expectedOutput: "4",
    complexity: {
      time: "O(N * log(max(piles))) — Binary search speed range",
      space: "O(1) — Constant auxiliary memory",
    },
    defaultCode: `function minEatingSpeed(piles, h) {
  let low = 1, high = Math.max(...piles);
  let ans = high;

  function canEat(k) {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / k);
    }
    return hours <= h;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canEat(mid)) {
      ans = mid;
      high = mid - 1; // Try smaller speed
    } else {
      low = mid + 1; // Need faster speed
    }
  }
  return ans;
}

// Test call
minEatingSpeed([3, 6, 7, 11], 8);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return minEatingSpeed([3, 6, 7, 11], 8);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "ship-within-d-days",
    name: "3. Capacity to Ship Packages Within D Days",
    statement: "Return the least weight capacity of a ship that will result in all packages `weights` being shipped within `days` days.",
    example: {
      input: "weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], days = 5",
      output: "15",
    },
    hint: "Binary search ship capacity in range [max(weights), sum(weights)]. Helper iterates packages, creating a new day whenever cumulative weight exceeds candidate capacity.",
    expectedOutput: "15",
    complexity: {
      time: "O(N * log(sum(weights))) — Capacity binary search",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function shipWithinDays(weights, days) {
  let low = Math.max(...weights);
  let high = weights.reduce((a, b) => a + b, 0);
  let ans = high;

  function isFeasible(cap) {
    let countDays = 1, currentWeight = 0;
    for (const w of weights) {
      if (currentWeight + w > cap) {
        countDays++;
        currentWeight = 0;
      }
      currentWeight += w;
    }
    return countDays <= days;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (isFeasible(mid)) {
      ans = mid;
      high = mid - 1; // Try smaller capacity
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

// Test call
shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "m-bouquets",
    name: "4. Minimum Days to Make M Bouquets",
    statement: "Return the minimum number of days to wait to be able to make `m` bouquets of `k` adjacent bloomed flowers from `bloomDay`. Return `-1` if impossible.",
    example: {
      input: "bloomDay = [1, 10, 3, 10, 2], m = 3, k = 1",
      output: "3",
    },
    hint: "If total required flowers (m * k) > bloomDay.length, return -1. Binary search days in range [min(bloomDay), max(bloomDay)]. Helper counts consecutive bloomed flowers >= k.",
    expectedOutput: "3",
    complexity: {
      time: "O(N * log(max(bloomDay))) — Day range binary search",
      space: "O(1) — Constant space",
    },
    defaultCode: `function minDays(bloomDay, m, k) {
  if (m * k > bloomDay.length) return -1;
  let low = Math.min(...bloomDay);
  let high = Math.max(...bloomDay);
  let ans = -1;

  function canMake(day) {
    let bouquets = 0, count = 0;
    for (const b of bloomDay) {
      if (b <= day) {
        count++;
        if (count === k) {
          bouquets++;
          count = 0;
        }
      } else {
        count = 0;
      }
    }
    return bouquets >= m;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (canMake(mid)) {
      ans = mid;
      high = mid - 1; // Try fewer days
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

// Test call
minDays([1, 10, 3, 10, 2], 3, 1);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return minDays([1, 10, 3, 10, 2], 3, 1);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "allocate-books",
    name: "5. Allocate Minimum Pages (Understand Approach)",
    statement: "Given `N` books with page counts `pages[i]` and `m` students, allocate books such that maximum pages assigned to a student is minimized.",
    example: {
      input: "pages = [12, 34, 67, 90], m = 2",
      output: "113 (Student 1: 12+34+67=113, Student 2: 90)",
    },
    hint: "If m > pages.length return -1. Binary search max pages limit in range [max(pages), sum(pages)]. Helper counts required students for page limit mid.",
    expectedOutput: "113",
    complexity: {
      time: "O(N * log(sum(pages))) — Binary search on pages allocation",
      space: "O(1) — Constant memory",
    },
    defaultCode: `function findPages(pages, m) {
  if (m > pages.length) return -1;
  let low = Math.max(...pages);
  let high = pages.reduce((a, b) => a + b, 0);
  let ans = high;

  function countStudents(maxPages) {
    let students = 1, currentPages = 0;
    for (const p of pages) {
      if (currentPages + p > maxPages) {
        students++;
        currentPages = p;
      } else {
        currentPages += p;
      }
    }
    return students;
  }

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (countStudents(mid) <= m) {
      ans = mid;
      high = mid - 1; // Try smaller max pages
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

// Test call
findPages([12, 34, 67, 90], 2);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return findPages([12, 34, 67, 90], 2);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day15DsaProblemsWidget() {
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
            Day 15 Binary Search on Answer Workbench (5 Core Problems)
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
            P{idx + 1}: {p.name.split(". ")[1]?.split(" (")[0] || p.name}
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
          aria-label="Binary Search on Answer Code Area"
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

export function Day15CheatSheetWidget() {
  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h4 className="font-extrabold text-sm text-purple-200 uppercase tracking-wider">
            Binary Search on Answer Cheat Sheet
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
            Use standard binary search over array index range <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">[0, n - 1]</code> for direct element searches.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(log N) | Space: O(1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            2. Monotonic Answer Range → BS on Answer
          </div>
          <p className="text-text-secondary">
            Search over potential answer range <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">[low, high]</code> when feasibility function <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">can(mid)</code> is monotonic.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N * log(range))
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            3. Define Search Space First
          </div>
          <p className="text-text-secondary">
            Determine absolute min value (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">low</code>) and max possible value (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">high</code>) before looping.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            e.g. [max(weights), sum(weights)]
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            4. Verify Feasibility Condition `can(mid)`
          </div>
          <p className="text-text-secondary">
            Ensure `can(mid)` returns boolean indicating if candidate answer `mid` satisfies problem constraints.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Shrink search space accordingly
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-700 dark:text-amber-300 flex items-center gap-2">
        <Zap size={16} className="shrink-0 text-amber-500" />
        <div>
          <span className="font-bold">Golden Rule:</span> If a problem asks to "minimize the maximum" or "maximize the minimum", it is almost always Binary Search on Answer!
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Project React Conversion (v4 StudentCard Component) (Session 10: 17:00-17:30)
// ---------------------------------------------------------------------------

interface StudentCardProps {
  id: string;
  name: string;
  age: number;
  course: string;
  initialStatus?: string;
  initialAttendance?: number;
}

// Reusable React Component
function StudentCard({ id, name, age, course, initialStatus = "Active", initialAttendance = 12 }: StudentCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [attendance, setAttendance] = useState(initialAttendance);

  const toggleStatus = () => {
    setStatus((prev) => (prev === "Active" ? "On Leave" : "Active"));
  };

  const incrementAttendance = () => {
    setAttendance((prev) => prev + 1);
  };

  return (
    <div className="bg-card border border-border-theme rounded-2xl p-4 shadow-xs space-y-3 hover:border-cyan-500/40 transition-colors">
      <div className="flex items-center justify-between border-b border-border-theme/60 pb-2">
        <div>
          <h6 className="font-extrabold text-xs text-text-primary">{name}</h6>
          <span className="text-[10px] text-text-secondary">Age: {age} yrs</span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            status === "Active"
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="text-[11px] text-text-secondary">
        <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">Course Track:</span>
        <span>{course}</span>
      </div>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-border-theme/60 text-[11px]">
        <span className="font-bold text-text-primary">Attendance Count:</span>
        <span className="font-mono font-black text-accent">{attendance} Days</span>
      </div>

      {/* Interactive State Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          onClick={incrementAttendance}
          size="sm"
          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-7 text-[11px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus size={12} /> +1 Day
        </Button>
        <Button
          onClick={toggleStatus}
          variant="secondary"
          size="sm"
          className="h-7 text-[11px] font-bold rounded-lg border-border-theme text-text-secondary hover:text-text-primary cursor-pointer"
        >
          Toggle Status
        </Button>
      </div>
    </div>
  );
}

export function Day15AsyncProjectWidget() {
  const [studentList, setStudentList] = useState<StudentCardProps[]>([
    { id: "s1", name: "Aarav Sharma", age: 21, course: "Full Stack MERN WebDev", initialStatus: "Active", initialAttendance: 15 },
    { id: "s2", name: "Priya Patel", age: 22, course: "DSA & System Design", initialStatus: "Active", initialAttendance: 14 },
    { id: "s3", name: "Rohan Verma", age: 20, course: "React 19 & Next.js", initialStatus: "Active", initialAttendance: 11 },
  ]);

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("21");
  const [newCourse, setNewCourse] = useState("Full Stack MERN WebDev");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: StudentCardProps = {
      id: `s_${Date.now()}`,
      name: newName,
      age: Number(newAge) || 20,
      course: newCourse,
      initialStatus: "Active",
      initialAttendance: 1,
    };

    setStudentList((prev) => [newStudent, ...prev]);
    setNewName("");
  };

  return (
    <div className="mt-4 bg-card border-2 border-cyan-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Atom className="text-cyan-500 shrink-0 animate-spin" style={{ animationDuration: "12s" }} size={20} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Student Project React Conversion — Reusable StudentCard Components
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Demonstrates React Functional Components, props passing, local `useState` for status & counter, and re-rendering.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shrink-0">
          Mini Project 17:00–17:30
        </span>
      </div>

      {/* Add New Student Form (React Component State Demo) */}
      <form onSubmit={handleAddStudent} className="bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-border-theme space-y-2">
        <span className="font-bold text-xs uppercase tracking-wider text-text-primary block mb-1">
          Add New Student Component
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Student Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-cyan-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Age"
            value={newAge}
            onChange={(e) => setNewAge(e.target.value)}
            className="h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-cyan-500 focus:outline-none"
          />
          <select
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="h-8 px-2 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-cyan-500 focus:outline-none"
          >
            <option value="Full Stack MERN WebDev">Full Stack MERN</option>
            <option value="DSA Masterclass">DSA Masterclass</option>
            <option value="React 19 & Next.js">React 19 & Next.js</option>
          </select>
        </div>
        <Button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-8 text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <Plus size={14} /> Render New &lt;StudentCard /&gt;
        </Button>
      </form>

      {/* Rendered React Component Tree Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-text-secondary px-1">
          <span>React Component Tree ({studentList.length} &lt;StudentCard /&gt; instances)</span>
          <span className="text-cyan-500 font-mono">Isolated Component State</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {studentList.map((st) => (
            <StudentCard key={st.id} {...st} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Day 15 Final Checklist & Progress Display Widget (Session 11: 17:30-17:45)
// ---------------------------------------------------------------------------

const day15ChecklistItems = [
  "09:00–09:20 — Binary Search Revision (Standard binary search, first/last occurrence, lower/upper bound, boundary conditions)",
  "09:20–10:00 — Binary Search on Answer (Search a range of possible answers, feasibility function can(mid), monotonic property, O(log range))",
  "10:15–11:00 — Pattern Practice (Identify search space range [low, high], define can(mid), move left/right based on feasibility, dry-run)",
  "11:00–12:00 — DSA Problems (Sqrt(x), Koko Eating Bananas, Capacity to Ship Packages, Minimum Days for M Bouquets, Allocate Minimum Pages)",
  "12:00–12:15 — Searching Cheat Sheet (Sorted data, answer range + monotonic condition, search space definition, feasibility verification)",
  "14:00–14:45 — React Fundamentals (Why React?, components, JSX, functional components, props, component tree)",
  "14:45–15:30 — React State (useState hook, state vs normal variables, updating state, re-rendering cycle, event handling)",
  "15:45–16:30 — React Practice (Build simple StudentCard component with props, display student info, add button, useState counter/status)",
  "16:30–17:00 — Interview Recall (Self-test 5 core React & Binary Search on Answer placement interview questions)",
  "17:00–17:30 — Mini Project (Start converting Student project into React: create StudentCard component, pass props, add useState status/counter)",
  "17:30–17:45 — Final Checklist & Progress Display (~50% curriculum coverage verified)",
];

export function Day15FinalChecklistWidget() {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalTasks = day15ChecklistItems.length;

  return (
    <div className="mt-4 bg-card border-2 border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-5 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Day 15 Final Checklist & Sequential Curriculum Progress
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
        {day15ChecklistItems.map((item, idx) => {
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

      {/* Progress Bars Section at Bottom of Day 15 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-500/40 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
          <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Flame size={15} className="text-amber-400" /> Bottom of Day 15 Progress Summary
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400">Target Coverage: ~50%</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {/* DSA Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-400">DSA Progress</span>
              <span className="font-bold text-blue-400">~50%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>

          {/* WebDev Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-400">WebDev/MERN Progress</span>
              <span className="font-bold text-emerald-400">~50%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>

          {/* Overall Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-amber-400">Overall Curriculum Progress</span>
              <span className="font-bold text-amber-400">~50%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-amber-500 rounded-full" style={{ width: "50%" }} />
            </div>
          </div>

          {/* Prompt Requested ASCII Progress Bar */}
          <div className="pt-2 text-center text-xs font-mono tracking-widest text-amber-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            Progress bar: <span className="font-bold">██████████░░░░░░░░░░</span>
          </div>
        </div>
      </div>
    </div>
  );
}
