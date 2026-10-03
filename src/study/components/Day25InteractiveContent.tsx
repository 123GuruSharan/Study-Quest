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
  Edit3,
  Filter,
  ArrowRight,
  ChevronRight,
  FileQuestion,
  Workflow,
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
    id: "queue-using-stacks",
    name: "1. Implement Queue using Two Stacks",
    statement: "Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support `push(x)`, `pop()`, `peek()`, and `empty()`.",
    example: {
      input: "push(1), push(2), peek(), pop(), empty()",
      output: "peek = 1, popped = 1, empty = false",
    },
    hint: "Use `instack` for push operations and `outstack` for pop/peek operations. When `outstack` is empty, transfer all elements from `instack` to `outstack`.",
    expectedOutput: "peek = 1, popped = 1, empty = false",
    complexity: { time: "O(1) Amortized", space: "O(N)" },
    defaultCode: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) {
    this.inStack.push(x);
  }
  pop() {
    this.peek();
    return this.outStack.pop();
  }
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack[this.outStack.length - 1];
  }
  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}

function testQueueUsingStacks() {
  const q = new MyQueue();
  q.push(1);
  q.push(2);
  const p1 = q.peek();
  const popped = q.pop();
  const isEmp = q.empty();
  return \`peek = \${p1}, popped = \${popped}, empty = \${isEmp}\`;
}

testQueueUsingStacks();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testQueueUsingStacks === 'function') {
            return testQueueUsingStacks();
          }
          return null;
        `);
        const res = runFn();
        if (res === "peek = 1, popped = 1, empty = false") {
          return {
            success: true,
            output: `peek = 1, popped = 1, empty = false (Correct! FIFO Queue created using two LIFO stacks with amortized O(1) operations)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "peek = 1, popped = 1, empty = false"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "stack-using-queues",
    name: "2. Implement Stack using Two Queues",
    statement: "Implement a last-in-first-out (LIFO) stack using queues. Supports `push(x)`, `pop()`, `top()`, and `empty()`.",
    example: {
      input: "push(10), push(20), top(), pop(), top()",
      output: "top = 20, popped = 20, top = 10",
    },
    hint: "On `push(x)`, add `x` to queue, then rotate `size - 1` elements from front to back of queue so `x` moves to the front.",
    expectedOutput: "top = 20, popped = 20, top = 10",
    complexity: { time: "O(N) Push, O(1) Pop", space: "O(N)" },
    defaultCode: `class MyStack {
  constructor() {
    this.queue = [];
  }
  push(x) {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift());
    }
  }
  pop() {
    return this.queue.shift();
  }
  top() {
    return this.queue[0];
  }
  empty() {
    return this.queue.length === 0;
  }
}

function testStackUsingQueues() {
  const st = new MyStack();
  st.push(10);
  st.push(20);
  const t1 = st.top();
  const p1 = st.pop();
  const t2 = st.top();
  return \`top = \${t1}, popped = \${p1}, top = \${t2}\`;
}

testStackUsingQueues();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testStackUsingQueues === 'function') {
            return testStackUsingQueues();
          }
          return null;
        `);
        const res = runFn();
        if (res === "top = 20, popped = 20, top = 10") {
          return {
            success: true,
            output: `top = 20, popped = 20, top = 10 (Correct! LIFO Stack created using queue rotation)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "top = 20, popped = 20, top = 10"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "sliding-window-max",
    name: "3. Sliding Window Maximum",
    statement: "You are given an array of integers `nums`, and a sliding window of size `k` moving from left to right. Return the max element in each sliding window.",
    example: {
      input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      output: "[3, 3, 5, 5, 6, 7]",
    },
    hint: "Maintain a monotonic decreasing deque storing indices. Remove out-of-window indices from front and smaller values from back.",
    expectedOutput: "[3, 3, 5, 5, 6, 7]",
    complexity: { time: "O(N)", space: "O(K)" },
    defaultCode: `function maxSlidingWindow(nums, k) {
  const deque = []; // stores indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    if (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}

maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof maxSlidingWindow === 'function') {
            return maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3);
          }
          return null;
        `);
        const res = runFn();
        const jsonRes = JSON.stringify(res);
        if (jsonRes === "[3,3,5,5,6,7]") {
          return {
            success: true,
            output: `[3, 3, 5, 5, 6, 7] (Correct! Monotonic Deque calculated sliding window maximum in linear time)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${jsonRes}. Expected: [3, 3, 5, 5, 6, 7]`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "number-recent-calls",
    name: "4. Number of Recent Calls",
    statement: "Design a `RecentCounter` class which counts the number of recent requests within a 3000 millisecond time frame: `[t - 3000, t]`.",
    example: {
      input: "ping(1), ping(100), ping(3001), ping(3002)",
      output: "[1, 2, 3, 3]",
    },
    hint: "Enqueue timestamps into a queue. Shift timestamps out of queue while `queue[0] < t - 3000`. Return `queue.length`.",
    expectedOutput: "[1, 2, 3, 3]",
    complexity: { time: "O(1) Amortized", space: "O(3000)" },
    defaultCode: `class RecentCounter {
  constructor() {
    this.queue = [];
  }
  ping(t) {
    this.queue.push(t);
    while (this.queue[0] < t - 3000) {
      this.queue.shift();
    }
    return this.queue.length;
  }
}

function testRecentCounter() {
  const rc = new RecentCounter();
  return [rc.ping(1), rc.ping(100), rc.ping(3001), rc.ping(3002)];
}

testRecentCounter();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testRecentCounter === 'function') {
            return testRecentCounter();
          }
          return null;
        `);
        const res = runFn();
        const jsonRes = JSON.stringify(res);
        if (jsonRes === "[1,2,3,3]") {
          return {
            success: true,
            output: `[1, 2, 3, 3] (Correct! Queue evicted timestamps older than t-3000ms)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${jsonRes}. Expected: [1, 2, 3, 3]`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "rotten-oranges",
    name: "5. Rotten Oranges (BFS / Queue)",
    statement: "Given an `m x n` grid where `0` = empty, `1` = fresh orange, `2` = rotten orange. Every minute, any fresh orange adjacent to a rotten orange becomes rotten. Return minimum minutes until no fresh orange remains, or `-1` if impossible.",
    example: {
      input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
      output: "4 (4 minutes to rot all fresh oranges via multi-source BFS)",
    },
    hint: "Use multi-source BFS with a FIFO queue. Enqueue all initial rotten oranges `(r, c)`. Track fresh count and increment minutes per BFS level.",
    expectedOutput: "4",
    complexity: { time: "O(M*N)", space: "O(M*N)" },
    defaultCode: `function orangesRotting(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) freshCount++;
    }
  }

  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  while (queue.length > 0 && freshCount > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}

orangesRotting([[2,1,1],[1,1,0],[0,1,1]]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof orangesRotting === 'function') {
            return orangesRotting([[2,1,1],[1,1,0],[0,1,1]]);
          }
          return null;
        `);
        const res = runFn();
        if (res === 4) {
          return {
            success: true,
            output: `4 (Correct! Multi-source BFS queue rotted all oranges in 4 minutes)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${res}. Expected: 4`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
];

export function Day25DsaProblemsWidget() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [userCodes, setUserCodes] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    dsaProblemsData.forEach((p) => {
      init[p.id] = p.defaultCode;
    });
    return init;
  });
  const [testResults, setTestResults] = useState<
    Record<string, { success: boolean; output: string } | null>
  >({});

  const prob = dsaProblemsData[selectedIdx];
  const currentCode = userCodes[prob.id] || prob.defaultCode;
  const currentResult = testResults[prob.id] || null;

  const handleRun = () => {
    const res = prob.testRunner(currentCode);
    setTestResults((prev) => ({ ...prev, [prob.id]: res }));
  };

  const handleReset = () => {
    setUserCodes((prev) => ({ ...prev, [prob.id]: prob.defaultCode }));
    setTestResults((prev) => ({ ...prev, [prob.id]: null }));
  };

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 25 DSA Practice: Queue Patterns, Deque & Multi-Source BFS
            </h3>
            <p className="text-xs text-text-secondary">
              5 Placement Problems: Queue by 2 Stacks, Stack by 2 Queues, Sliding Window Max, Recent Calls, Rotten Oranges
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          Advanced Queue & BFS
        </span>
      </div>

      {/* Problem Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {dsaProblemsData.map((p, idx) => {
          const isSolved = testResults[p.id]?.success;
          const isActive = idx === selectedIdx;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedIdx(idx)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-surface-elevated text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {isSolved ? (
                <CheckCircle2 size={13} className="text-emerald-300" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Problem Details */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4">
            <h4 className="text-sm font-bold text-text-primary">{prob.name}</h4>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {prob.statement}
            </p>

            <div className="mt-3 rounded-lg bg-surface-card p-2.5 text-xs">
              <span className="font-semibold text-blue-400">Example:</span>
              <div className="mt-1 font-mono text-[11px] text-text-primary">
                Input: {prob.example.input}
              </div>
              <div className="font-mono text-[11px] text-emerald-400">
                Output: {prob.example.output}
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-500 dark:text-amber-400">
              <span className="font-bold">💡 Hint:</span> {prob.hint}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Expected Output:</span>
              <span className="font-mono font-bold text-emerald-500">
                {prob.expectedOutput}
              </span>
            </div>

            <div className="mt-2 flex gap-2">
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                Time: {prob.complexity.time}
              </span>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                Space: {prob.complexity.space}
              </span>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex flex-col lg:col-span-7">
          <div className="flex flex-1 flex-col rounded-xl border border-border-theme/60 bg-slate-950 p-3 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Code2 size={14} className="text-blue-400" /> JavaScript Solution Playground
              </span>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <RotateCcw size={12} className="mr-1" /> Reset
              </Button>
            </div>

            <textarea
              value={currentCode}
              onChange={(e) =>
                setUserCodes((prev) => ({ ...prev, [prob.id]: e.target.value }))
              }
              className="mt-2 min-h-[220px] flex-1 resize-none bg-transparent font-mono text-xs leading-relaxed text-slate-100 outline-none"
              spellCheck={false}
            />

            <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2">
              <span className="text-[11px] text-slate-400">
                Click Run to execute solution against target test case
              </span>
              <Button
                onClick={handleRun}
                size="sm"
                className="bg-blue-600 font-bold text-white hover:bg-blue-500"
              >
                <Play size={13} className="mr-1 fill-white" /> Run Code
              </Button>
            </div>
          </div>

          {/* Execution Output */}
          {currentResult && (
            <div
              className={`mt-3 rounded-xl border p-3 text-xs font-mono transition-all ${
                currentResult.success
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {currentResult.success ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {currentResult.success ? "Test Passed!" : "Test Failed"}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{currentResult.output}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Queue & Mongoose Advanced Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day25CheatSheetWidget() {
  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-border-theme/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Day 25 Queue Patterns & Mongoose Advanced Cheat Sheet
          </h3>
          <p className="text-xs text-text-secondary">
            Quick Decision Matrix: Deque rules, BFS queues & Mongoose query operators, validation & middleware
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Workflow size={14} /> FIFO → Queue
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            First-In First-Out structure. Used for task scheduling, recent requests tracking, and level-by-level BFS traversal.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={14} /> Both Ends → Deque
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Double-Ended Queue. Monotonic Deque maintains decreasing elements for linear O(N) Sliding Window Maximum calculations.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Database size={14} /> Advanced Filtering & Sort
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            <code className="text-purple-300">{"Student.find({ course }).sort({ grade: -1 }).limit(10)"}</code> for optimized query performance.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Server size={14} /> Validation & Middleware
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Schema required/enum validators + Mongoose `pre('save')` & `post('save')` middleware hooks for lifecycle logic.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Mongoose Advanced REST API Gateway v4.0 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface AdvancedStudent {
  _id: string;
  name: string;
  email: string;
  course: string;
  grade: string;
  isActive: boolean;
  createdAt: string;
}

const initialAdvStudents: AdvancedStudent[] = [
  { _id: "65fa0001a1b2c3d4e5f60001", name: "Aarav Sharma", email: "aarav@example.com", course: "Computer Science", grade: "A+", isActive: true, createdAt: "2026-10-01" },
  { _id: "65fa0001a1b2c3d4e5f60002", name: "Ananya Patel", email: "ananya@example.com", course: "Information Tech", grade: "A", isActive: true, createdAt: "2026-10-02" },
  { _id: "65fa0001a1b2c3d4e5f60003", name: "Rohan Verma", email: "rohan@example.com", course: "Software Engineering", grade: "B+", isActive: true, createdAt: "2026-10-03" },
];

export function Day25AsyncProjectWidget() {
  const [students, setStudents] = useState<AdvancedStudent[]>(initialAdvStudents);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [editingStudent, setEditingStudent] = useState<AdvancedStudent | null>(null);

  // Form inputs
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [courseInput, setCourseInput] = useState("Computer Science");
  const [gradeInput, setGradeInput] = useState("A+");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [logs, setLogs] = useState<string[]>([
    "[MONGOOSE] Database initialized: mongodb://127.0.0.1:27017/student_app",
    "[MONGOOSE] Middleware active: pre('save') & post('save') hooks bound to StudentSchema",
    "[EXPRESS] app.listen(5000) - Full REST API Server (GET, POST, PUT, DELETE) active",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Mongoose Validation Simulation
    if (!nameInput.trim()) {
      setValidationError("ValidationError: Path `name` is required.");
      addLog("API Error: 400 Bad Request (ValidationError: name required)");
      return;
    }
    if (!emailInput.trim() || !emailInput.includes("@")) {
      setValidationError("ValidationError: Path `email` must be a valid email string.");
      addLog("API Error: 400 Bad Request (ValidationError: invalid email format)");
      return;
    }

    if (editingStudent) {
      // PUT /api/students/:id
      setStudents((prev) =>
        prev.map((s) =>
          s._id === editingStudent._id
            ? { ...s, name: nameInput.trim(), email: emailInput.trim(), course: courseInput, grade: gradeInput }
            : s
        )
      );
      addLog(`PUT /api/students/${editingStudent._id} -> Student.findByIdAndUpdate() -> 200 OK`);
      setEditingStudent(null);
    } else {
      // POST /api/students
      const newId = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const newStd: AdvancedStudent = {
        _id: newId,
        name: nameInput.trim(),
        email: emailInput.trim(),
        course: courseInput,
        grade: gradeInput,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setStudents((prev) => [newStd, ...prev]);
      addLog(`POST /api/students -> Student.create({ name: '${newStd.name}' }) -> 201 Created`);
    }

    setNameInput("");
    setEmailInput("");
  };

  const handleStartEdit = (std: AdvancedStudent) => {
    setEditingStudent(std);
    setNameInput(std.name);
    setEmailInput(std.email);
    setCourseInput(std.course);
    setGradeInput(std.grade);
    addLog(`GET /api/students/${std._id} -> Student.findById('${std._id}') -> Loaded for editing`);
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s._id !== id));
    addLog(`DELETE /api/students/${id} -> Student.findByIdAndDelete('${id}') -> 200 OK`);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "ALL" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 25 Mini Project: Student Mongoose Advanced REST API Gateway v4.0
            </h3>
            <p className="text-xs text-text-secondary">
              Full CRUD (GET, POST, PUT, DELETE), Mongoose validation, query search/filtering & middleware hooks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Express + Mongoose Production REST API
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Form & Code Preview */}
        <div className="space-y-4 lg:col-span-5">
          <form
            onSubmit={handleCreateOrUpdate}
            className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {editingStudent ? `PUT /api/students/${editingStudent._id.slice(0, 8)}...` : "POST /api/students"}
              </h4>
              {editingStudent && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setNameInput("");
                    setEmailInput("");
                  }}
                  className="text-[10px] text-amber-400 underline font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {validationError && (
              <div className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[11px] text-rose-400 font-mono">
                {validationError}
              </div>
            )}

            <div className="mt-3 space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-text-secondary">Student Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Diya Sharma"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary">Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. diya@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Course:</label>
                  <select
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Software Engineering">Software Eng</option>
                    <option value="Full Stack MERN">Full Stack MERN</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Grade:</label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                size="sm"
                className={`w-full font-bold text-white ${
                  editingStudent ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {editingStudent ? <Edit3 size={13} className="mr-1" /> : <Plus size={13} className="mr-1" />}
                {editingStudent ? "PUT /api/students/:id (Update Record)" : "POST /api/students (Create Record)"}
              </Button>
            </div>
          </form>

          {/* Mongoose Middleware Preview */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <FileCode2 size={13} className="text-emerald-400" /> Mongoose Controller & Middleware
            </div>
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`// PUT update route with validators
app.put('/api/students/:id', async (req, res) => {
  try {
    const std = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!std) return res.status(404).json({ error: 'Not Found' });
    res.json(std);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});`}
            </pre>
          </div>
        </div>

        {/* Right: Search / Filter & Document Explorer */}
        <div className="space-y-4 lg:col-span-7">
          {/* Query Filter & Search Bar */}
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme/40 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-text-primary">
                <Filter size={14} className="text-blue-400" /> Mongoose Query Filter (`Student.find(query)`)
              </span>
              <span className="text-[11px] text-text-tertiary font-mono">
                Found {filteredStudents.length} of {students.length} documents
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[140px]">
                <Search size={13} className="absolute left-2.5 top-2.5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-full rounded-lg border border-border-theme bg-surface-card pl-8 pr-2 text-xs text-text-primary outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="h-8 rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-blue-500"
              >
                <option value="ALL">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Tech">Information Tech</option>
                <option value="Software Engineering">Software Eng</option>
                <option value="Full Stack MERN">Full Stack MERN</option>
              </select>
            </div>
          </div>

          {/* Records List */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Database size={14} className="text-emerald-400" /> MongoDB Document Collection
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                BSON Records
              </span>
            </div>

            <div className="mt-2 max-h-[160px] space-y-2 overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="py-4 text-center text-slate-500">No matching MongoDB documents found.</div>
              ) : (
                filteredStudents.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-[11px]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{s.name}</span>
                        <span className="text-[10px] text-slate-500">({s.email})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Course: <span className="text-slate-200">{s.course}</span> | Grade:{" "}
                        <span className="text-emerald-300 font-bold">{s.grade}</span> | ID:{" "}
                        <span className="text-slate-500">{s._id.slice(0, 10)}...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(s)}
                        className="text-slate-400 hover:text-amber-400 transition-colors"
                        title="Edit Student (PUT)"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete Student (DELETE)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log Feed */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Terminal size={13} className="text-amber-400" /> Express REST API Log Stream
              </span>
              <span className="text-[10px] text-slate-500">Live Server Console</span>
            </div>
            <div className="mt-2 max-h-[100px] space-y-1 overflow-y-auto text-[11px]">
              {logs.map((log, i) => (
                <div key={i} className="text-slate-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 14: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day25FinalChecklistWidget() {
  const { studyBlocks, updateBlockStatus } = useStudyStore();

  const d25Blocks = studyBlocks.filter((b) => b.id.startsWith("d25_"));

  const toggleBlock = (blockId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    updateBlockStatus(blockId, nextStatus as any);
  };

  const completedCount = d25Blocks.filter((b) => b.status === "Completed").length;
  const totalCount = d25Blocks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckSquare size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 25 Final Session Checklist & Curriculum Progress
            </h3>
            <p className="text-xs text-text-secondary">
              Track completion for all Day 25 sessions. Progress updates dynamically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
            Completed: {completedCount} / {totalCount} ({percent}%)
          </span>
        </div>
      </div>

      {/* Task Checkboxes */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {d25Blocks.map((block) => {
          const isDone = block.status === "Completed";
          return (
            <div
              key={block.id}
              onClick={() => toggleBlock(block.id, block.status)}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 text-text-primary"
                  : "border-border-theme/60 bg-surface-elevated text-text-secondary hover:bg-surface-hover"
              }`}
            >
              <button className="mt-0.5 text-emerald-500 outline-none">
                {isDone ? (
                  <CheckSquare size={18} className="fill-emerald-500 text-white" />
                ) : (
                  <Square size={18} className="text-text-tertiary" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{block.title}</span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    {block.startTime}–{block.endTime}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] line-clamp-1 text-text-tertiary">
                  {block.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Curriculum Coverage Summary */}
      <div className="mt-6 rounded-xl border border-border-theme/60 bg-surface-elevated p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
          Bottom of Day 25 Progress Summary
        </h4>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">DSA Progress:</span>
              <span className="font-mono font-bold text-blue-400">~83%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-blue-500" style={{ width: "83%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">WebDev / MERN Progress:</span>
              <span className="font-mono font-bold text-emerald-400">~83%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-emerald-500" style={{ width: "83%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Overall Completion:</span>
              <span className="font-mono font-bold text-purple-400">~83%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-purple-500" style={{ width: "83%" }} />
            </div>
          </div>

          {/* Requested Visual Progress Bar */}
          <div className="mt-3 rounded-lg bg-surface-card p-3 font-mono text-xs text-center text-text-primary">
            Progress bar: <span className="text-emerald-400 font-bold">█████████████████░░░</span> (~83%)
          </div>
        </div>
      </div>
    </div>
  );
}
