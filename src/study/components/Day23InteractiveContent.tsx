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
  ArrowRight,
  ChevronRight,
  FileQuestion,
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
    id: "min-stack",
    name: "1. Min Stack",
    statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1). Implement `push(val)`, `pop()`, `top()`, and `getMin()`.",
    example: {
      input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
      output: "min = -3, top = 0, min = -2",
    },
    hint: "Use an auxiliary stack (or store pairs `[val, minSoFar]`) to track the minimum element at every stack height.",
    expectedOutput: "min = -3, top = 0, min = -2",
    complexity: { time: "O(1)", space: "O(N)" },
    defaultCode: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
      this.minStack.push(val);
    }
  }
  pop() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    return val;
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// Test harness
function testMinStack() {
  const ms = new MinStack();
  ms.push(-2);
  ms.push(0);
  ms.push(-3);
  const m1 = ms.getMin();
  ms.pop();
  const t1 = ms.top();
  const m2 = ms.getMin();
  return \`min = \${m1}, top = \${t1}, min = \${m2}\`;
}

testMinStack();`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof testMinStack === 'function') {
            return testMinStack();
          }
          return null;
        `);
        const res = runFn();
        if (res === "min = -3, top = 0, min = -2") {
          return {
            success: true,
            output: `min = -3, top = 0, min = -2 (Correct! MinStack returned O(1) minimum values successfully)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "min = -3, top = 0, min = -2"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "daily-temperatures",
    name: "2. Daily Temperatures",
    statement: "Given an array of temperatures `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If no future day is warmer, `answer[i] == 0`.",
    example: {
      input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
      output: "[1, 1, 4, 2, 1, 1, 0, 0]",
    },
    hint: "Maintain a monotonic decreasing stack of day indices. Pop day indices when encountering a warmer temperature.",
    expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // stores indices

  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop();
      answer[prevIdx] = i - prevIdx;
    }
    stack.push(i);
  }

  return answer;
}

dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof dailyTemperatures === 'function') {
            return dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]);
          }
          return null;
        `);
        const res = runFn();
        const jsonRes = JSON.stringify(res);
        if (jsonRes === "[1,1,4,2,1,1,0,0]") {
          return {
            success: true,
            output: `[1, 1, 4, 2, 1, 1, 0, 0] (Correct! Monotonic stack calculated wait days in O(N) linear time)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${jsonRes}. Expected: [1, 1, 4, 2, 1, 1, 0, 0]`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "next-greater-element",
    name: "3. Next Greater Element",
    statement: "Given an array `arr`, find the next greater element for each element. The Next Greater Element for an element `x` is the first greater element to the right of `x`. Return `-1` if no greater element exists.",
    example: {
      input: "arr = [4, 5, 2, 25]",
      output: "[5, 25, 25, -1]",
    },
    hint: "Use a monotonic stack storing candidate indices. Traverse from left to right and pop indices when a larger number is found.",
    expectedOutput: "[5, 25, 25, -1]",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function nextGreaterElement(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];

  for (let i = 0; i < arr.length; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      const idx = stack.pop();
      result[idx] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

nextGreaterElement([4, 5, 2, 25]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof nextGreaterElement === 'function') {
            return nextGreaterElement([4, 5, 2, 25]);
          }
          return null;
        `);
        const res = runFn();
        const jsonRes = JSON.stringify(res);
        if (jsonRes === "[5,25,25,-1]") {
          return {
            success: true,
            output: `[5, 25, 25, -1] (Correct! Next greater element resolved using monotonic stack)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${jsonRes}. Expected: [5, 25, 25, -1]`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "remove-k-digits",
    name: "4. Remove K Digits",
    statement: "Given string `num` representing a non-negative integer, and integer `k`, return the smallest possible integer after removing `k` digits from `num`. Strip leading zeros.",
    example: {
      input: "num = '1432219', k = 3",
      output: "'1219' (remove 4, 3, 2)",
    },
    hint: "Use a monotonic increasing stack of digits. If current digit is smaller than stack top and k > 0, pop stack top and decrement k.",
    expectedOutput: "'1219'",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function removeKdigits(num, k) {
  const stack = [];
  for (const digit of num) {
    while (stack.length > 0 && k > 0 && stack[stack.length - 1] > digit) {
      stack.pop();
      k--;
    }
    stack.push(digit);
  }
  
  // Pop remaining if k > 0
  while (k > 0) {
    stack.pop();
    k--;
  }

  // Remove leading zeros
  let res = stack.join("").replace(/^0+/, "");
  return res.length === 0 ? "0" : res;
}

removeKdigits("1432219", 3);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof removeKdigits === 'function') {
            return removeKdigits("1432219", 3);
          }
          return null;
        `);
        const res = runFn();
        if (res === "1219") {
          return {
            success: true,
            output: `"1219" (Correct! Greedy monotonic stack digit removal yielded smallest number)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "1219"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "simplify-path",
    name: "5. Simplify Path",
    statement: "Given an absolute Unix path for a file or directory, simplify it to its canonical path format (handling '.', '..', multiple slashes).",
    example: {
      input: "path = '/a/./b/../../c/'",
      output: "'/c'",
    },
    hint: "Split path by '/'. Iterate components: ignore '' and '.', pop from stack if component is '..', otherwise push folder name to stack.",
    expectedOutput: "'/c'",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function simplifyPath(path) {
  const stack = [];
  const parts = path.split("/");

  for (const part of parts) {
    if (part === "" || part === ".") {
      continue;
    } else if (part === "..") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
}

simplifyPath("/a/./b/../../c/");`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof simplifyPath === 'function') {
            return simplifyPath("/a/./b/../../c/");
          }
          return null;
        `);
        const res = runFn();
        if (res === "/c") {
          return {
            success: true,
            output: `"/c" (Correct! Unix path simplified using stack folder traversal)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "/c"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
];

export function Day23DsaProblemsWidget() {
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
              Day 23 DSA Practice: Advanced Stack Problems
            </h3>
            <p className="text-xs text-text-secondary">
              5 Placement Problems: Min Stack, Daily Temperatures, Next Greater Element, Remove K Digits, Simplify Path
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          O(N) Stack Patterns
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
// 2. Stack & MongoDB Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day23CheatSheetWidget() {
  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-border-theme/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Day 23 Stack Patterns & MongoDB Cheat Sheet
          </h3>
          <p className="text-xs text-text-secondary">
            Decision Matrix: Stack algorithms & MongoDB NoSQL CRUD operations
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Layers size={14} /> LIFO → Stack
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Last-In, First-Out sequence policy. Push/pop/peek run in O(1) constant time. Used for path simplification & MinStack.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={14} /> Next/Prev Greater → Monotonic
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Strictly increasing/decreasing stack. Solves Daily Temperatures & Remove K Digits in linear O(N) time complexity.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Database size={14} /> NoSQL Document Store
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Flexible JSON/BSON schema. Database → Collections → Documents. Key-value fields with automatic `_id` ObjectIDs.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Server size={14} /> MongoDB CRUD Operations
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Create (`insertOne`/`insertMany`), Read (`find`), Update (`updateOne` with `$set`), Delete (`deleteOne`/`deleteMany`).
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Express + MongoDB Full CRUD Backend Simulator (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface MongoStudent {
  _id: string;
  name: string;
  course: string;
  grade: string;
  createdAt: string;
}

const initialMongoStudents: MongoStudent[] = [
  { _id: "65f8a101b2a3c4d5e6f70001", name: "Aarav Sharma", course: "Computer Science", grade: "A+", createdAt: "2026-10-01" },
  { _id: "65f8a101b2a3c4d5e6f70002", name: "Ananya Patel", course: "Information Tech", grade: "A", createdAt: "2026-10-02" },
  { _id: "65f8a101b2a3c4d5e6f70003", name: "Rohan Verma", course: "Software Engineering", grade: "B+", createdAt: "2026-10-03" },
];

export function Day23AsyncProjectWidget() {
  const [students, setStudents] = useState<MongoStudent[]>(initialMongoStudents);
  const [nameInput, setNameInput] = useState("");
  const [courseInput, setCourseInput] = useState("Computer Science");
  const [gradeInput, setGradeInput] = useState("A+");
  const [dbStatus, setDbStatus] = useState<"connected" | "disconnected">("connected");
  const [logs, setLogs] = useState<string[]>([
    "[MONGODB] Connecting to mongodb://localhost:27017/studentdb ...",
    "[MONGODB] Mongoose connected to database 'studentdb' successfully.",
    "[EXPRESS] app.listen(5000) - Express server active on port 5000",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    if (dbStatus === "disconnected") {
      addLog("POST /api/students -> 500 Internal Server Error (MongoNetworkError)");
      return;
    }

    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newStudent: MongoStudent = {
      _id: randomHex,
      name: nameInput.trim(),
      course: courseInput,
      grade: gradeInput,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setStudents((prev) => [newStudent, ...prev]);
    setNameInput("");
    addLog(`POST /api/students -> db.students.insertOne() -> 201 Created (_id: ${newStudent._id})`);
  };

  const handleDeleteStudent = (id: string) => {
    if (dbStatus === "disconnected") {
      addLog(`DELETE /api/students/${id} -> 500 Internal Server Error`);
      return;
    }
    setStudents((prev) => prev.filter((s) => s._id !== id));
    addLog(`DELETE /api/students/${id} -> db.students.deleteOne({ _id: ObjectId('${id}') }) -> 200 OK`);
  };

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 23 Mini Project: Express + MongoDB Student CRUD Backend v2.0
            </h3>
            <p className="text-xs text-text-secondary">
              Real MongoDB Mongoose connection simulation, `students` collection, GET/POST/DELETE API endpoints & BSON documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              dbStatus === "connected"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dbStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            {dbStatus === "connected" ? "MongoDB Connected (mongodb://127.0.0.1:27017)" : "Database Disconnected"}
          </span>
          <Button
            onClick={() => {
              const next = dbStatus === "connected" ? "disconnected" : "connected";
              setDbStatus(next);
              addLog(`MongoDB Connection state changed to: ${next.toUpperCase()}`);
            }}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            {dbStatus === "connected" ? "Disconnect DB" : "Connect DB"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: POST Form & Express Mongoose Code */}
        <div className="space-y-4 lg:col-span-5">
          <form
            onSubmit={handleCreateStudent}
            className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              POST /api/students (Insert MongoDB Document)
            </h4>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-text-secondary">Student Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Singh"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Course:</label>
                  <select
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    className="mt-1 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Full Stack MERN">Full Stack MERN</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Grade:</label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="mt-1 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-emerald-500"
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
                className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                <Plus size={14} className="mr-1" /> Insert Document into MongoDB
              </Button>
            </div>
          </form>

          {/* Express Mongoose Code Preview */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <FileCode2 size={13} className="text-emerald-400" /> studentModel.js & server.js
            </div>
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/studentdb');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: String,
  grade: String,
  createdAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});`}
            </pre>
          </div>
        </div>

        {/* Right: MongoDB Document Inspector & Terminal Stream */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Database size={14} className="text-emerald-400" /> MongoDB Collection: `db.students` ({students.length} BSON Documents)
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                BSON / JSON Data Store
              </span>
            </div>

            <div className="mt-2 max-h-[220px] space-y-2 overflow-y-auto pr-1">
              {students.map((std) => (
                <div
                  key={std._id}
                  className="group flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-[11px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400">{std.name}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                        _id: {std._id}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      Course: <span className="text-slate-200">{std.course}</span> | Grade:{" "}
                      <span className="text-emerald-300 font-bold">{std.grade}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteStudent(std._id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* MongoDB Logs Console */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Terminal size={13} className="text-amber-400" /> MongoDB & Express Live Log Console
              </span>
              <span className="text-[10px] text-slate-500">Mongoose Driver Stream</span>
            </div>
            <div className="mt-2 max-h-[140px] space-y-1 overflow-y-auto text-[11px]">
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

export function Day23FinalChecklistWidget() {
  const { studyBlocks, updateBlockStatus } = useStudyStore();

  const d23Blocks = studyBlocks.filter((b) => b.id.startsWith("d23_"));

  const toggleBlock = (blockId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    updateBlockStatus(blockId, nextStatus as any);
  };

  const completedCount = d23Blocks.filter((b) => b.status === "Completed").length;
  const totalCount = d23Blocks.length;
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
              Day 23 Final Session Checklist & Curriculum Progress
            </h3>
            <p className="text-xs text-text-secondary">
              Track completion for all Day 23 sessions. Progress updates dynamically.
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
        {d23Blocks.map((block) => {
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
          Bottom of Day 23 Progress Summary
        </h4>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">DSA Progress:</span>
              <span className="font-mono font-bold text-blue-400">~77%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-blue-500" style={{ width: "77%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">WebDev / MERN Progress:</span>
              <span className="font-mono font-bold text-emerald-400">~77%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-emerald-500" style={{ width: "77%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Overall Completion:</span>
              <span className="font-mono font-bold text-purple-400">~77%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-purple-500" style={{ width: "77%" }} />
            </div>
          </div>

          {/* Requested Visual Progress Bar */}
          <div className="mt-3 rounded-lg bg-surface-card p-3 font-mono text-xs text-center text-text-primary">
            Progress bar: <span className="text-emerald-400 font-bold">███████████████░░░░░</span> (~77%)
          </div>
        </div>
      </div>
    </div>
  );
}
