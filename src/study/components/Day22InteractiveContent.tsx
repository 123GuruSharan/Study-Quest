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
    id: "next-greater-element",
    name: "1. Next Greater Element",
    statement: "Given an array `arr`, find the next greater element for each element. The Next Greater Element for an element `x` is the first greater element to the right of `x`. If no greater element exists, return `-1`.",
    example: {
      input: "arr = [4, 5, 2, 25]",
      output: "[5, 25, 25, -1]",
    },
    hint: "Use a monotonic decreasing stack. Iterate from right to left (or left to right maintaining candidate indices). Pop elements from stack that are smaller than or equal to current element.",
    expectedOutput: "[5, 25, 25, -1]",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function nextGreaterElement(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = []; // stores indices or values

  for (let i = 0; i < arr.length; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      const poppedIdx = stack.pop();
      result[poppedIdx] = arr[i];
    }
    stack.push(i);
  }

  return result;
}

// Test call:
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
            output: `[5, 25, 25, -1] (Correct! Monotonic stack resolved next greater element in linear O(N) time)`,
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
    id: "daily-temperatures",
    name: "2. Daily Temperatures",
    statement: "Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0`.",
    example: {
      input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
      output: "[1, 1, 4, 2, 1, 1, 0, 0]",
    },
    hint: "Use a monotonic stack storing indices of days. Pop indices when current temperature is higher than stack top day's temperature. Calculate wait distance as `currentIdx - stack.pop()`.",
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

// Test call:
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
            output: `[1, 1, 4, 2, 1, 1, 0, 0] (Correct! Distance calculation verified with monotonic stack)`,
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
    id: "remove-adjacent-duplicates",
    name: "3. Remove Adjacent Duplicates",
    statement: "You are given a string `s` consisting of lowercase English letters. A duplicate removal consists of choosing two adjacent and equal letters and removing them. Repeatedly make duplicate removals on `s` until no more can be made. Return the final string.",
    example: {
      input: "s = 'abbaca'",
      output: "'ca' (abbaca -> aaca -> ca)",
    },
    hint: "Push characters onto a stack. If the current character equals the top of the stack, pop the stack top instead of pushing. Join stack elements at the end.",
    expectedOutput: "'ca'",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function removeDuplicates(s) {
  const stack = [];
  for (const char of s) {
    if (stack.length > 0 && stack[stack.length - 1] === char) {
      stack.pop();
    } else {
      stack.push(char);
    }
  }
  return stack.join("");
}

// Test call:
removeDuplicates("abbaca");`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof removeDuplicates === 'function') {
            return removeDuplicates("abbaca");
          }
          return null;
        `);
        const res = runFn();
        if (res === "ca") {
          return {
            success: true,
            output: `"ca" (Correct! Stack-based adjacent duplicate cancellation succeeded)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "ca"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "eval-rpn",
    name: "4. Evaluate Reverse Polish Notation",
    statement: "Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix). Valid operators are `+`, `-`, `*`, and `/`. Each operand may be an integer or another expression. Division between two integers truncates toward zero.",
    example: {
      input: "tokens = ['2', '1', '+', '3', '*']",
      output: "9 ((2 + 1) * 3 = 9)",
    },
    hint: "Iterate tokens. If token is a number, push to stack. If token is an operator, pop operand `b` then operand `a`, perform operation `a op b`, and push result back onto stack.",
    expectedOutput: "9",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const b = stack.pop();
      const a = stack.pop();
      if (token === "+") stack.push(a + b);
      else if (token === "-") stack.push(a - b);
      else if (token === "*") stack.push(a * b);
      else if (token === "/") stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop();
}

// Test call:
evalRPN(["2", "1", "+", "3", "*"]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof evalRPN === 'function') {
            return evalRPN(["2", "1", "+", "3", "*"]);
          }
          return null;
        `);
        const res = runFn();
        if (res === 9) {
          return {
            success: true,
            output: `9 (Correct! Postfix RPN evaluation parsed correctly via LIFO stack)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${res}. Expected: 9`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "largest-rectangle-histogram",
    name: "5. Largest Rectangle in Histogram",
    statement: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    example: {
      input: "heights = [2, 1, 5, 6, 2, 3]",
      output: "10 (bars at index 2 & 3 with height 5 and width 2)",
    },
    hint: "Maintain a monotonic increasing stack storing bar indices. When encountering a shorter bar height, pop top index `h = heights[popped]`, calculate width `i - stack.top - 1`, and update maxArea = max(maxArea, h * width).",
    expectedOutput: "10",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function largestRectangleArea(heights) {
  let maxArea = 0;
  const stack = []; // stores indices
  const extendedHeights = [...heights, 0]; // append 0 to flush remaining bars

  for (let i = 0; i < extendedHeights.length; i++) {
    while (stack.length > 0 && extendedHeights[i] < extendedHeights[stack[stack.length - 1]]) {
      const height = extendedHeights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }

  return maxArea;
}

// Test call:
largestRectangleArea([2, 1, 5, 6, 2, 3]);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof largestRectangleArea === 'function') {
            return largestRectangleArea([2, 1, 5, 6, 2, 3]);
          }
          return null;
        `);
        const res = runFn();
        if (res === 10) {
          return {
            success: true,
            output: `10 (Correct! Monotonic stack histogram algorithm calculated max area 10)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${res}. Expected: 10`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
];

export function Day22DsaProblemsWidget() {
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
              Day 22 DSA Practice: Stack Patterns & Monotonic Stack
            </h3>
            <p className="text-xs text-text-secondary">
              5 Placement Problems: Next Greater Element, Daily Temperatures, Remove Duplicates, RPN, Histogram
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          O(N) Monotonic Stack Solutions
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
// 2. Stack Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day22CheatSheetWidget() {
  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-border-theme/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Day 22 Stack Patterns & Node.js Cheat Sheet
          </h3>
          <p className="text-xs text-text-secondary">
            Quick Decision Matrix: Stack rules, Monotonic Stack & Node/Express backend fundamentals
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Layers size={14} /> LIFO → Stack
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Last-In, First-Out model. Use for reversing sequences, evaluating expressions (RPN), or nested undo operations.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={14} /> Next/Prev Greater → Monotonic
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Keep elements strictly increasing or decreasing. Resolves Next Greater Element & Daily Temperatures in O(N) linear time.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <CheckCircle2 size={14} /> Matching Pairs → Stack
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Push opening brackets or chars, pop matching closing brackets or adjacent duplicates. Guarantees linear validation.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Server size={14} /> Node.js + Express → Backend API
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            JS server runtime + HTTP Web Framework. Handles requests (`req`), sends responses (`res`), and exports REST JSON APIs.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Node.js & Express Backend Simulator (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface StudentBackend {
  id: string;
  name: string;
  course: string;
  grade: string;
  status: string;
}

const initialBackendStudents: StudentBackend[] = [
  { id: "std_101", name: "Aarav Sharma", course: "Computer Science", grade: "A+", status: "Active" },
  { id: "std_102", name: "Ananya Patel", course: "Information Tech", grade: "A", status: "Active" },
  { id: "std_103", name: "Rohan Verma", course: "Software Engineering", grade: "B+", status: "Active" },
  { id: "std_104", name: "Priya Nair", course: "Data Science", grade: "A+", status: "Graduated" },
];

export function Day22AsyncProjectWidget() {
  const [activeRoute, setActiveRoute] = useState<string>("GET /");
  const [serverStatus, setServerStatus] = useState<"running" | "stopped">("running");
  const [customStudentName, setCustomStudentName] = useState<string>("");
  const [studentList, setStudentList] = useState<StudentBackend[]>(initialBackendStudents);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Node.js v20.11.0 runtime initialized.",
    "[EXPRESS] app.listen(5000) - Server listening on http://localhost:5000",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleTestEndpoint = (endpoint: string) => {
    setActiveRoute(endpoint);
    addLog(`HTTP Request: ${endpoint} -> 200 OK (application/json)`);
  };

  const handleTest404 = () => {
    setActiveRoute("GET /api/unknown_route");
    addLog(`HTTP Request: GET /api/unknown_route -> 404 NOT FOUND`);
  };

  const handleAddStudentBackend = () => {
    if (!customStudentName.trim()) return;
    const newStd: StudentBackend = {
      id: `std_${101 + studentList.length}`,
      name: customStudentName.trim(),
      course: "Full Stack MERN",
      grade: "A",
      status: "Active",
    };
    setStudentList((prev) => [...prev, newStd]);
    setCustomStudentName("");
    addLog(`POST /api/students -> Created new student record "${newStd.name}" (201 Created)`);
  };

  const getResponseContent = () => {
    if (serverStatus === "stopped") {
      return JSON.stringify({ error: "ERR_CONNECTION_REFUSED", message: "Server is stopped" }, null, 2);
    }
    switch (activeRoute) {
      case "GET /":
        return JSON.stringify(
          {
            status: 200,
            message: "Welcome to Student API Gateway",
            version: "1.0.0",
            endpoints: ["GET /", "GET /api/students", "GET /api/students/:id"],
          },
          null,
          2
        );
      case "GET /api/students":
        return JSON.stringify(
          {
            status: 200,
            count: studentList.length,
            students: studentList,
          },
          null,
          2
        );
      case "GET /api/students/std_101":
        return JSON.stringify(
          {
            status: 200,
            student: studentList[0],
          },
          null,
          2
        );
      default:
        return JSON.stringify(
          {
            status: 404,
            error: "Not Found",
            message: "The requested route does not exist on this Express server.",
          },
          null,
          2
        );
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-theme/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Day 22 Mini Project: Node.js & Express Student Backend API v1.0
            </h3>
            <p className="text-xs text-text-secondary">
              Node runtime setup, Express REST endpoints (`GET /`, `GET /api/students`), 404 routing & HTTP req/res lifecycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              serverStatus === "running"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                serverStatus === "running" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            {serverStatus === "running" ? "Express Server Listening (Port 5000)" : "Server Offline"}
          </span>
          <Button
            onClick={() => {
              const nextState = serverStatus === "running" ? "stopped" : "running";
              setServerStatus(nextState);
              addLog(`Server state toggled to ${nextState.toUpperCase()}`);
            }}
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            {serverStatus === "running" ? "Stop Server" : "Start Server"}
          </Button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Route Tester & Inputs */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Test Express API Endpoints
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                onClick={() => handleTestEndpoint("GET /")}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeRoute === "GET /"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                GET /
              </Button>
              <Button
                onClick={() => handleTestEndpoint("GET /api/students")}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeRoute === "GET /api/students"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                GET /api/students
              </Button>
              <Button
                onClick={() => handleTestEndpoint("GET /api/students/std_101")}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeRoute === "GET /api/students/std_101"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                GET /students/:id
              </Button>
              <Button
                onClick={handleTest404}
                size="sm"
                variant="ghost"
                className={`h-8 text-xs font-bold rounded-lg border ${
                  activeRoute.includes("unknown")
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : "border-border-theme text-text-secondary hover:bg-surface-hover"
                }`}
              >
                Test 404 Handler
              </Button>
            </div>

            <div className="mt-4 border-t border-border-theme/40 pt-3">
              <label className="text-xs font-semibold text-text-secondary">
                Simulate POST /api/students (Add Record):
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter student name..."
                  value={customStudentName}
                  onChange={(e) => setCustomStudentName(e.target.value)}
                  className="h-8 flex-1 rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                />
                <Button
                  onClick={handleAddStudentBackend}
                  size="sm"
                  className="h-8 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  <Plus size={13} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* Express Code Snippet */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <FileCode2 size={13} className="text-emerald-400" /> server.js (Express Application)
            </div>
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Student API" });
});

app.get('/api/students', (req, res) => {
  res.json({ count: students.length, students });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(5000);`}
            </pre>
          </div>
        </div>

        {/* Right: Server Response & Terminal Logs */}
        <div className="space-y-4 lg:col-span-7">
          {/* HTTP JSON Response Inspector */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Globe size={14} className="text-blue-400" /> HTTP Response Payload
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                Headers: Content-Type: application/json
              </span>
            </div>
            <pre className="mt-2 max-h-[200px] overflow-y-auto text-[11px] leading-relaxed text-emerald-300">
              {getResponseContent()}
            </pre>
          </div>

          {/* Express Terminal Log Feed */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Terminal size={13} className="text-amber-400" /> Express Server Terminal Console
              </span>
              <span className="text-[10px] text-slate-500">Live HTTP Stream</span>
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

export function Day22FinalChecklistWidget() {
  const { studyBlocks, updateBlockStatus } = useStudyStore();

  const d22Blocks = studyBlocks.filter((b) => b.id.startsWith("d22_"));

  const toggleBlock = (blockId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    updateBlockStatus(blockId, nextStatus as any);
  };

  const completedCount = d22Blocks.filter((b) => b.status === "Completed").length;
  const totalCount = d22Blocks.length;
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
              Day 22 Final Session Checklist & Curriculum Progress
            </h3>
            <p className="text-xs text-text-secondary">
              Track completion for all Day 22 sessions. Progress updates dynamically.
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
        {d22Blocks.map((block) => {
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
          Bottom of Day 22 Progress Summary
        </h4>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">DSA Progress:</span>
              <span className="font-mono font-bold text-blue-400">~73%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-blue-500" style={{ width: "73%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">WebDev / MERN Progress:</span>
              <span className="font-mono font-bold text-emerald-400">~73%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-emerald-500" style={{ width: "73%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Overall Completion:</span>
              <span className="font-mono font-bold text-purple-400">~73%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-purple-500" style={{ width: "73%" }} />
            </div>
          </div>

          {/* Requested Visual Progress Bar */}
          <div className="mt-3 rounded-lg bg-surface-card p-3 font-mono text-xs text-center text-text-primary">
            Progress bar: <span className="text-emerald-400 font-bold">███████████████░░░░░</span> (~73%)
          </div>
        </div>
      </div>
    </div>
  );
}
