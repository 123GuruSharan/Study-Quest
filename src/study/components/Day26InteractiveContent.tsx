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
  Lock,
  Key,
  ShieldCheck,
  UserPlus,
  LogIn,
  LogOut,
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
    id: "design-circular-queue",
    name: "1. Design Circular Queue",
    statement: "Design your implementation of the circular queue. A circular queue is a linear data structure in which operations are performed based on FIFO principle and the last position is connected back to the first position.",
    example: {
      input: "capacity = 3, enq(1), enq(2), enq(3), enq(4) -> false, deq() -> true, enq(4) -> true",
      output: "Front = 2, Rear = 4",
    },
    hint: "Use modulo pointer wrapping `(ptr + 1) % capacity` for head and tail indices.",
    expectedOutput: "Front = 2, Rear = 4",
    complexity: { time: "O(1)", space: "O(K)" },
    defaultCode: `class MyCircularQueue {
  constructor(k) {
    this.capacity = k;
    this.queue = new Array(k);
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }
  enQueue(value) {
    if (this.isFull()) return false;
    this.queue[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return true;
  }
  Front() {
    return this.isEmpty() ? -1 : this.queue[this.head];
  }
  Rear() {
    if (this.isEmpty()) return -1;
    const prevTail = (this.tail - 1 + this.capacity) % this.capacity;
    return this.queue[prevTail];
  }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.capacity; }
}

function testCircularQueue() {
  const cq = new MyCircularQueue(3);
  cq.enQueue(1);
  cq.enQueue(2);
  cq.enQueue(3);
  cq.deQueue();
  cq.enQueue(4);
  return \`Front = \${cq.Front()}, Rear = \${cq.Rear()}\`;
}

testCircularQueue();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testCircularQueue === 'function') {
            return testCircularQueue();
          }
          return null;
        `);
        const res = runFn();
        if (res === "Front = 2, Rear = 4") {
          return {
            success: true,
            output: `Front = 2, Rear = 4 (Correct! Circular queue wrapped tail and head pointers using modulo arithmetic)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "Front = 2, Rear = 4"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "queue-using-stacks",
    name: "2. Implement Queue using Two Stacks",
    statement: "Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support `push(x)`, `pop()`, `peek()`, and `empty()`.",
    example: {
      input: "push(1), push(2), peek(), pop(), empty()",
      output: "peek = 1, popped = 1, empty = false",
    },
    hint: "Use `inStack` for push operations and `outStack` for pop/peek. Transfer elements from `inStack` to `outStack` when `outStack` is empty.",
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

function testQueue() {
  const q = new MyQueue();
  q.push(1);
  q.push(2);
  const p1 = q.peek();
  const popped = q.pop();
  const isEmp = q.empty();
  return \`peek = \${p1}, popped = \${popped}, empty = \${isEmp}\`;
}

testQueue();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testQueue === 'function') {
            return testQueue();
          }
          return null;
        `);
        const res = runFn();
        if (res === "peek = 1, popped = 1, empty = false") {
          return {
            success: true,
            output: `peek = 1, popped = 1, empty = false (Correct! Amortized O(1) FIFO Queue using two LIFO stacks)`,
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
    id: "sliding-window-max",
    name: "3. Sliding Window Maximum",
    statement: "You are given an array of integers `nums`, and a sliding window of size `k` moving from left to right. Return the max element in each sliding window.",
    example: {
      input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      output: "[3, 3, 5, 5, 6, 7]",
    },
    hint: "Use a Monotonic Deque storing indices. Maintain decreasing values. Pop out-of-window indices from front.",
    expectedOutput: "[3, 3, 5, 5, 6, 7]",
    complexity: { time: "O(N)", space: "O(K)" },
    defaultCode: `function maxSlidingWindow(nums, k) {
  const deque = [];
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
            output: `[3, 3, 5, 5, 6, 7] (Correct! Monotonic Deque computed sliding window maximum in linear O(N) time)`,
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
    id: "number-of-islands",
    name: "4. Number of Islands (BFS / Queue)",
    statement: "Given an `m x n` 2D binary grid `grid` representing a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
    example: {
      input: "grid = [['1','1','0'],['1','1','0'],['0','0','1']]",
      output: "2 (two connected land masses)",
    },
    hint: "Iterate cells. When grid[r][c] == '1', increment island count, mark grid[r][c] = '0', and run BFS using a queue to sink all connected land cells.",
    expectedOutput: "2",
    complexity: { time: "O(M*N)", space: "O(min(M, N))" },
    defaultCode: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        grid[r][c] = '0';
        const queue = [[r, c]];

        while (queue.length > 0) {
          const [currR, currC] = queue.shift();
          const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
          for (const [dr, dc] of dirs) {
            const nr = currR + dr, nc = currC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
              grid[nr][nc] = '0';
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return count;
}

numIslands([['1','1','0'],['1','1','0'],['0','0','1']]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof numIslands === 'function') {
            return numIslands([['1','1','0'],['1','1','0'],['0','0','1']]);
          }
          return null;
        `);
        const res = runFn();
        if (res === 2) {
          return {
            success: true,
            output: `2 (Correct! BFS Queue traversed and counted 2 connected islands)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${res}. Expected: 2`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "rotten-oranges",
    name: "5. Rotten Oranges",
    statement: "Given an `m x n` grid where `0` = empty, `1` = fresh orange, `2` = rotten orange. Every minute, any fresh orange adjacent to a rotten orange becomes rotten. Return minimum minutes until no fresh orange remains, or `-1` if impossible.",
    example: {
      input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
      output: "4",
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

export function Day26DsaProblemsWidget() {
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
              Day 26 DSA Practice: Queue Revision & Graph BFS Patterns
            </h3>
            <p className="text-xs text-text-secondary">
              5 Placement Problems: Circular Queue, Queue by Stacks, Sliding Window Max, Number of Islands, Rotten Oranges
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          BFS & Monotonic Deque
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
// 2. Queue & Authentication Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day26CheatSheetWidget() {
  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-border-theme/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Day 26 Queue Patterns & Authentication Cheat Sheet
          </h3>
          <p className="text-xs text-text-secondary">
            Quick Reference: FIFO Queues vs Monotonic Deque & Bcrypt Hashing, JWT Tokens & Middleware
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Workflow size={14} /> FIFO → Queue / BFS
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            First-In First-Out structure. Essential for level-order tree processing & BFS graph grid traversals (Rotten Oranges, Number of Islands).
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={14} /> Sliding Maximum → Deque
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Double-Ended Queue (Deque). Monotonic Deque maintains decreasing elements for linear O(N) Sliding Window Maximum bounds.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Lock size={14} /> Password Hashing (Bcrypt)
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            One-way cryptographic salt + hash (`bcrypt.hash(password, 10)`). Passwords must never be stored as plain text.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ShieldCheck size={14} /> JWT & Protected Routes
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Signed JSON Web Tokens sent via `Authorization: Bearer &lt;token&gt;` header. Verified by Express auth middleware before serving `/api/students`.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Auth & Protected API Gateway v5.0 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt simulation
  role: string;
}

export function Day26AsyncProjectWidget() {
  const [users, setUsers] = useState<AuthUser[]>([
    {
      id: "usr_1",
      name: "Admin User",
      email: "admin@studyquest.dev",
      passwordHash: "$2b$10$e8Z.uWjX/8.cZ1H4y2K5u.2mY4xZ7a8b9c0d1e2f3g4h5i6j7k8l",
      role: "Admin",
    },
  ]);

  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);

  // Form states
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [regName, setRegName] = useState("");
  const [emailInput, setEmailInput] = useState("admin@studyquest.dev");
  const [passwordInput, setPasswordInput] = useState("password123");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Protected route simulation output
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const [logs, setLogs] = useState<string[]>([
    "[AUTH] Bcrypt salt rounds initialized: 10",
    "[JWT] Secret loaded: 'JWT_SECRET_KEY_STUDYQUEST_2026'",
    "[EXPRESS] Auth Middleware active on protected routes: /api/students/*",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!regName.trim() || !emailInput.trim() || !passwordInput.trim()) {
      setAuthError("Name, Email, and Password are required for registration.");
      addLog("POST /api/auth/register -> 400 Bad Request (Missing fields)");
      return;
    }

    if (users.some((u) => u.email === emailInput.trim())) {
      setAuthError("User with this email already exists.");
      addLog(`POST /api/auth/register -> 400 Bad Request (Email ${emailInput} duplicate)`);
      return;
    }

    // Bcrypt hashing simulation
    const simulatedHash = `$2b$10$${Math.random().toString(36).slice(2)}${Date.now()}`;
    const newUsr: AuthUser = {
      id: `usr_${users.length + 1}`,
      name: regName.trim(),
      email: emailInput.trim(),
      passwordHash: simulatedHash,
      role: "Student",
    };

    setUsers((prev) => [...prev, newUsr]);
    setAuthSuccessMsg(`Registration successful! Password hashed with bcrypt: ${simulatedHash.slice(0, 20)}...`);
    addLog(`POST /api/auth/register -> bcrypt.hash() -> User created (_id: ${newUsr.id})`);
    setIsRegisterMode(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    const userMatch = users.find((u) => u.email === emailInput.trim());

    if (!userMatch) {
      setAuthError("Invalid credentials: User not found.");
      addLog(`POST /api/auth/login -> 401 Unauthorized (User not found)`);
      return;
    }

    // Generate JWT simulation token
    const tokenHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const tokenPayload = btoa(JSON.stringify({ id: userMatch.id, email: userMatch.email, name: userMatch.name, exp: Math.floor(Date.now() / 1000) + 3600 }));
    const tokenSignature = Math.random().toString(36).slice(2, 14);
    const jwtStr = `${tokenHeader}.${tokenPayload}.${tokenSignature}`;

    setActiveToken(jwtStr);
    setCurrentUser({ email: userMatch.email, name: userMatch.name });
    setAuthSuccessMsg(`Logged in successfully! JWT Token issued.`);
    addLog(`POST /api/auth/login -> bcrypt.compare() matched -> Issued JWT Token`);
  };

  const handleLogout = () => {
    setActiveToken(null);
    setCurrentUser(null);
    setApiResponse(null);
    addLog("User logged out -> JWT token cleared");
  };

  const handleTestProtectedEndpoint = () => {
    if (!activeToken) {
      setApiResponse(
        JSON.stringify(
          {
            status: 401,
            error: "Unauthorized",
            message: "Access denied. No Authorization Bearer JWT token provided in request headers.",
          },
          null,
          2
        )
      );
      addLog("GET /api/students -> Auth Middleware -> 401 Unauthorized (No token)");
    } else {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            message: "Access granted to protected student dataset.",
            user: currentUser,
            students: [
              { id: "std_1", name: "Aarav Sharma", course: "Computer Science", grade: "A+" },
              { id: "std_2", name: "Ananya Patel", course: "Information Tech", grade: "A" },
            ],
          },
          null,
          2
        )
      );
      addLog(`GET /api/students -> Auth Middleware verified JWT for '${currentUser?.email}' -> 200 OK`);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 26 Mini Project: Student Authentication & Protected REST API Gateway v5.0
            </h3>
            <p className="text-xs text-text-secondary">
              Bcrypt password hashing, JWT Token generation (`jwt.sign`), Express auth middleware & protected `/api/students`
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <ShieldCheck size={14} /> Auth: {currentUser.name}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
              <Lock size={14} /> Unauthenticated
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Login / Register Form */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4">
            <div className="flex items-center justify-between border-b border-border-theme/40 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {isRegisterMode ? "User Registration" : "User Authentication"}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError(null);
                  setAuthSuccessMsg(null);
                }}
                className="text-[11px] text-purple-400 font-bold hover:underline"
              >
                {isRegisterMode ? "Switch to Login" : "Switch to Register"}
              </button>
            </div>

            {authError && (
              <div className="mt-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[11px] text-rose-400">
                {authError}
              </div>
            )}

            {authSuccessMsg && (
              <div className="mt-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-[11px] text-emerald-400">
                {authSuccessMsg}
              </div>
            )}

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="mt-3 space-y-2.5">
              {isRegisterMode && (
                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Full Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Diya Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-text-secondary">Email Address:</label>
                <input
                  type="email"
                  placeholder="admin@studyquest.dev"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-secondary">Password:</label>
                <input
                  type="password"
                  placeholder="password123"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-1 flex gap-2">
                {currentUser ? (
                  <Button
                    type="button"
                    onClick={handleLogout}
                    size="sm"
                    variant="ghost"
                    className="w-full h-8 text-xs font-bold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10"
                  >
                    <LogOut size={13} className="mr-1" /> Logout Session
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full h-8 bg-purple-600 font-bold text-white hover:bg-purple-500"
                  >
                    {isRegisterMode ? <UserPlus size={13} className="mr-1" /> : <LogIn size={13} className="mr-1" />}
                    {isRegisterMode ? "POST /api/auth/register" : "POST /api/auth/login"}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Code Preview */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <FileCode2 size={13} className="text-purple-400" /> authMiddleware.js & authController.js
            </div>
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-purple-300">
{`// JWT Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};`}
            </pre>
          </div>
        </div>

        {/* Right: Protected Route Tester & JWT Inspector */}
        <div className="space-y-4 lg:col-span-7">
          {/* JWT Token Display */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Key size={14} className="text-amber-400" /> Active Session Authorization Header
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-amber-400 font-bold">
                Bearer Token
              </span>
            </div>

            <div className="mt-2 text-[11px]">
              {activeToken ? (
                <div className="break-all rounded bg-slate-900 p-2 text-emerald-400 font-mono">
                  <span className="text-slate-500 font-bold">Authorization: Bearer </span>
                  {activeToken}
                </div>
              ) : (
                <div className="py-2 text-center text-slate-500">
                  No active JWT token. Click Login to authenticate and receive token.
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                onClick={handleTestProtectedEndpoint}
                size="sm"
                className="bg-emerald-600 font-bold text-white hover:bg-emerald-500 h-8 text-xs"
              >
                <ShieldCheck size={13} className="mr-1" /> Test Protected GET /api/students
              </Button>
            </div>
          </div>

          {/* Protected Route Response Inspector */}
          {apiResponse && (
            <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 font-bold text-slate-400">
                  <Globe size={14} className="text-blue-400" /> API Gateway Response
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    apiResponse.includes('"status": 200')
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {apiResponse.includes('"status": 200') ? "200 OK" : "401 Unauthorized"}
                </span>
              </div>
              <pre className="mt-2 max-h-[160px] overflow-y-auto text-[11px] leading-relaxed text-emerald-300">
                {apiResponse}
              </pre>
            </div>
          )}

          {/* Live Server Log Stream */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Terminal size={13} className="text-amber-400" /> Express Auth Security Console
              </span>
              <span className="text-[10px] text-slate-500">Bcrypt & JWT Stream</span>
            </div>
            <div className="mt-2 max-h-[110px] space-y-1 overflow-y-auto text-[11px]">
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

export function Day26FinalChecklistWidget() {
  const { studyBlocks, updateBlockStatus } = useStudyStore();

  const d26Blocks = studyBlocks.filter((b) => b.id.startsWith("d26_"));

  const toggleBlock = (blockId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    updateBlockStatus(blockId, nextStatus as any);
  };

  const completedCount = d26Blocks.filter((b) => b.status === "Completed").length;
  const totalCount = d26Blocks.length;
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
              Day 26 Final Session Checklist & Curriculum Progress
            </h3>
            <p className="text-xs text-text-secondary">
              Track completion for all Day 26 sessions. Progress updates dynamically.
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
        {d26Blocks.map((block) => {
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
          Bottom of Day 26 Progress Summary
        </h4>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">DSA Progress:</span>
              <span className="font-mono font-bold text-blue-400">~87%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-blue-500" style={{ width: "87%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">WebDev / MERN Progress:</span>
              <span className="font-mono font-bold text-emerald-400">~87%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-emerald-500" style={{ width: "87%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Overall Completion:</span>
              <span className="font-mono font-bold text-purple-400">~87%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-purple-500" style={{ width: "87%" }} />
            </div>
          </div>

          {/* Requested Visual Progress Bar */}
          <div className="mt-3 rounded-lg bg-surface-card p-3 font-mono text-xs text-center text-text-primary">
            Progress bar: <span className="text-emerald-400 font-bold">█████████████████░░░</span> (~87%)
          </div>
        </div>
      </div>
    </div>
  );
}
