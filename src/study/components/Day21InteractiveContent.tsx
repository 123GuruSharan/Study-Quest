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
  Layers3,
  Navigation,
  Home,
  Users,
  Info,
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
    id: "implement-stack-array",
    name: "1. Implement Stack using Array",
    statement: "Implement a Stack data structure using an array supporting `push(x)`, `pop()`, `top()`, and `isEmpty()`. All operations must run in O(1) time.",
    example: {
      input: "push(10), push(20), top(), pop(), top()",
      output: "top = 20, popped = 20, top = 10",
    },
    hint: "Maintain internal array `this.items = []`. `push(x)` calls `items.push(x)`, `pop()` calls `items.pop()`, `top()` returns `items[items.length - 1]`.",
    expectedOutput: "{\"popped\":20,\"top\":10}",
    complexity: {
      time: "O(1) for push, pop, top, isEmpty",
      space: "O(N) Auxiliary space for items array",
    },
    defaultCode: `class MyStack {
  constructor() {
    this.items = [];
  }
  push(x) {
    this.items.push(x);
  }
  pop() {
    return this.items.pop();
  }
  top() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

function testMyStack() {
  const stack = new MyStack();
  stack.push(10);
  stack.push(20);
  const popped = stack.pop();
  const top = stack.top();
  return { popped, top };
}

// Test call
testMyStack();`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return testMyStack();`);
        const res = fn();
        const isMatch = res && res.popped === 20 && res.top === 10;
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "valid-parentheses",
    name: "2. Valid Parentheses",
    statement: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.",
    example: {
      input: "s = '()[]{}'",
      output: "true",
    },
    hint: "Use a stack. Push opening brackets `'('`, `'{'`, `'['`. For closing brackets, check if stack is non-empty and top element matches corresponding opening bracket.",
    expectedOutput: "true",
    complexity: {
      time: "O(N) Single linear pass",
      space: "O(N) Stack space for opening brackets",
    },
    defaultCode: `function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

// Test call
isValidParentheses("()[]{}");`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return isValidParentheses("()[]{}");`);
        const res = fn();
        return { success: res === true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "reverse-string-stack",
    name: "3. Reverse a String using Stack",
    statement: "Given a string `s`, reverse it using a Stack data structure (LIFO principle).",
    example: {
      input: "s = 'Hello'",
      output: "'olleH'",
    },
    hint: "Push each character of `s` onto a stack array. Pop elements one by one from the stack and concatenate into result string.",
    expectedOutput: "\"olleH\"",
    complexity: {
      time: "O(N) Linear push & pop passes",
      space: "O(N) Stack auxiliary space",
    },
    defaultCode: `function reverseStringStack(s) {
  const stack = [];
  for (let char of s) {
    stack.push(char);
  }
  let reversed = "";
  while (stack.length > 0) {
    reversed += stack.pop();
  }
  return reversed;
}

// Test call
reverseStringStack("Hello");`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return reverseStringStack("Hello");`);
        const res = fn();
        return { success: res === "olleH", output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "min-stack",
    name: "4. Min Stack",
    statement: "Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element `getMin()` in constant O(1) time.",
    example: {
      input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
      output: "min1 = -3, top = 0, min2 = -2",
    },
    hint: "Maintain two stacks: `stack` and `minStack`. When pushing `x`, push `Math.min(x, currentMin)` to `minStack`. When popping, pop from both stacks.",
    expectedOutput: "{\"min1\":-3,\"top\":0,\"min2\":-2}",
    complexity: {
      time: "O(1) Constant time for all operations",
      space: "O(N) Auxiliary minStack space",
    },
    defaultCode: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

function testMinStack() {
  const ms = new MinStack();
  ms.push(-2);
  ms.push(0);
  ms.push(-3);
  const min1 = ms.getMin();
  ms.pop();
  const top = ms.top();
  const min2 = ms.getMin();
  return { min1, top, min2 };
}

// Test call
testMinStack();`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return testMinStack();`);
        const res = fn();
        const isMatch = res && res.min1 === -3 && res.top === 0 && res.min2 === -2;
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "next-greater-element",
    name: "5. Next Greater Element",
    statement: "Given an array `arr`, find the Next Greater Element (NGE) for every element using a Monotonic Stack. If non-existent, output `-1`.",
    example: {
      input: "arr = [4, 5, 2, 25]",
      output: "[5, 25, 25, -1]",
    },
    hint: "Traverse array from right to left (`i = n - 1` to `0`). While `stack` is non-empty and `stack[top] <= arr[i]`, pop. If stack empty, `res[i] = -1`, else `res[i] = stack[top]`. Push `arr[i]`.",
    expectedOutput: "[5,25,25,-1]",
    complexity: {
      time: "O(N) Monotonic stack pass",
      space: "O(N) Stack & result array space",
    },
    defaultCode: `function nextGreaterElement(arr) {
  const n = arr.length;
  const res = new Array(n).fill(-1);
  const stack = [];

  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && stack[stack.length - 1] <= arr[i]) {
      stack.pop();
    }
    if (stack.length > 0) {
      res[i] = stack[stack.length - 1];
    }
    stack.push(arr[i]);
  }
  return res;
}

// Test call
nextGreaterElement([4, 5, 2, 25]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return nextGreaterElement([4, 5, 2, 25]);`);
        const res = fn();
        const expected = [5, 25, 25, -1];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day21DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("implement-stack-array");
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
            Day 21 — Stack Fundamentals & Monotonic Stack Sandbox
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
// 2. Stack & React Routing Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day21CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 21 — Stack Fundamentals & React Routing Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Stack Fundamentals Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Layers3 size={14} /> Stack Operations & Patterns
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>LIFO Principle → Stack:</strong> Last-In, First-Out memory model. Push, Pop, Peek run in $O(1)$ time.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Matching Brackets → Stack:</strong> Push opening brackets; pop and verify match for closing brackets.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Monotonic Stack:</strong> Maintain elements in strictly increasing/decreasing order for $O(N)$ Next Greater Element problems.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Min Stack:</strong> Maintain auxiliary minimum stack parallel to primary stack for $O(1)$ minimum retrieval.</span>
            </li>
          </ul>
        </div>

        {/* React Routing Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Navigation size={14} /> React Client-Side Routing Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>Client-Side Routing:</strong> Changes URL and switches UI components without requesting full HTML page reloads.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Link vs {`<a>`}:</strong> <code>Link</code> updates URL in SPA history without triggering full document reload.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Dynamic Route Parameters:</strong> Define dynamic parameters (<code>/students/:id</code>) to render detailed views.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Not Found (404) Route:</strong> Include catch-all route (<code>path="*"</code>) to gracefully handle invalid URLs.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student React Router Directory Hub v10 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  bio: string;
  gpa: number;
}

const ROUTER_STUDENT_DATA: Student[] = [
  { id: 301, name: "Rahul Sharma", email: "rahul@studyquest.io", course: "Stack Fundamentals & LIFO", bio: "Passionate about data structures and monotonic stacks.", gpa: 3.8 },
  { id: 302, name: "Priya Patel", email: "priya@studyquest.io", course: "React Client-Side Routing", bio: "Building responsive single-page web applications.", gpa: 3.9 },
  { id: 303, name: "Aman Verma", email: "aman@studyquest.io", course: "Full Stack Architecture", bio: "Exploring backend API integration and state management.", gpa: 3.5 },
];

export function Day21AsyncProjectWidget() {
  const [currentRoute, setCurrentRoute] = useState<string>("home");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const selectedStudent = ROUTER_STUDENT_DATA.find((s) => s.id === selectedStudentId);

  const navigateTo = (route: string, studentId: number | null = null) => {
    setCurrentRoute(route);
    if (studentId !== null) {
      setSelectedStudentId(studentId);
    }
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-accent w-5 h-5" />
          <div>
            <h3 className="font-bold text-text-primary text-base">
              React Mini Project: Student Client-Side Router Directory v10
            </h3>
            <p className="text-xs text-text-secondary">
              Client-Side Navigation (Home, Students, Student Details, About, 404 Not Found) without Page Reloads
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          Interactive Router Demo
        </span>
      </div>

      {/* Simulated Router Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border-theme/40">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateTo("home")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentRoute === "home"
                ? "bg-accent text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Home size={13} /> Home
          </button>
          <button
            onClick={() => navigateTo("students")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentRoute === "students" || currentRoute === "student-detail"
                ? "bg-accent text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Users size={13} /> Students Directory
          </button>
          <button
            onClick={() => navigateTo("about")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentRoute === "about"
                ? "bg-accent text-white shadow-xs"
                : "text-text-secondary hover:text-text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Info size={13} /> About
          </button>
          <button
            onClick={() => navigateTo("404-test")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
              currentRoute === "404-test"
                ? "bg-rose-500 text-white shadow-xs"
                : "text-rose-500 hover:bg-rose-500/10"
            }`}
          >
            <FileQuestion size={13} /> Test 404
          </button>
        </div>

        <div className="text-[11px] font-mono text-text-secondary px-2 py-1 bg-card rounded-md border border-border-theme">
          URL Path: <span className="text-accent font-bold">
            {currentRoute === "home" && "/"}
            {currentRoute === "students" && "/students"}
            {currentRoute === "student-detail" && `/students/${selectedStudentId}`}
            {currentRoute === "about" && "/about"}
            {currentRoute === "404-test" && "/unknown-route-path"}
          </span>
        </div>
      </div>

      {/* Dynamic Route View Containers */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 min-h-[160px]">
        {currentRoute === "home" && (
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary text-base flex items-center gap-2">
              <Home size={18} className="text-accent" /> Welcome to Student Portal Home
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              This client-side router enables smooth single-page application navigation between pages without requesting full server reloads. Click on <strong>Students Directory</strong> above to view enrolled students!
            </p>
            <Button
              onClick={() => navigateTo("students")}
              size="sm"
              className="mt-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              Browse Students Directory <ChevronRight size={14} />
            </Button>
          </div>
        )}

        {currentRoute === "students" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border-theme pb-2">
              <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
                <Users size={16} className="text-accent" /> Enrolled Students List
              </h4>
              <span className="text-xs text-text-secondary font-mono">3 Registered Students</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROUTER_STUDENT_DATA.map((student) => (
                <div key={student.id} className="p-3 rounded-xl bg-card border border-border-theme space-y-2">
                  <h5 className="font-bold text-text-primary text-xs">{student.name}</h5>
                  <p className="text-[11px] text-text-secondary truncate">{student.course}</p>
                  <Button
                    onClick={() => navigateTo("student-detail", student.id)}
                    size="sm"
                    variant="ghost"
                    className="w-full h-7 text-[11px] font-semibold text-accent hover:bg-accent/10 rounded-lg justify-between"
                  >
                    View Details <ChevronRight size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentRoute === "student-detail" && selectedStudent && (
          <div className="space-y-3">
            <button
              onClick={() => navigateTo("students")}
              className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
            >
              ← Back to Students Directory
            </button>

            <div className="p-4 rounded-xl bg-card border border-border-theme space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text-primary text-base">{selectedStudent.name}</h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Student ID: #{selectedStudent.id}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{selectedStudent.bio}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-border-theme/40 text-text-secondary">
                <div>Email: <span className="font-mono text-text-primary">{selectedStudent.email}</span></div>
                <div>Enrolled Course: <span className="font-semibold text-text-primary">{selectedStudent.course}</span></div>
                <div>Academic GPA: <span className="font-bold text-emerald-500">{selectedStudent.gpa}</span></div>
              </div>
            </div>
          </div>
        )}

        {currentRoute === "about" && (
          <div className="space-y-2">
            <h4 className="font-bold text-text-primary text-sm flex items-center gap-2">
              <Info size={16} className="text-accent" /> About Student Portal SPA
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Demonstrating React Client-Side Routing concepts: <code>BrowserRouter</code>, <code>Routes</code>, <code>Route</code> dynamic parameters (<code>/students/:id</code>), and active <code>NavLink</code> states.
            </p>
          </div>
        )}

        {currentRoute === "404-test" && (
          <div className="space-y-2 text-center py-4">
            <FileQuestion size={32} className="mx-auto text-rose-500" />
            <h4 className="font-bold text-rose-500 text-sm">404 — Route Not Found</h4>
            <p className="text-xs text-text-secondary">
              The requested path <code>/unknown-route-path</code> does not match any registered application routes.
            </p>
            <Button
              onClick={() => navigateTo("home")}
              size="sm"
              className="mt-2 bg-accent text-white text-xs font-bold rounded-lg"
            >
              Return Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 14: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day21FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day21Blocks = studyBlocksByDay[21] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d21_block_1", label: "09:00–09:20 — Stack Fundamentals (LIFO principle, push, pop, peek/top, O(1) operations)" },
    { id: "d21_block_2", label: "09:20–10:00 — Stack Implementation (Scratch stack implementation, overflow/underflow, dry-run)" },
    { id: "d21_block_4", label: "10:15–11:00 — Stack Patterns (Matching pairs, reverse string, undo/redo, monotonic stack)" },
    { id: "d21_block_5", label: "11:00–12:00 — DSA Problems (Array Stack, Valid Parentheses, Reverse String, Min Stack, Next Greater)" },
    { id: "d21_block_6", label: "12:00–12:15 — Stack Cheat Sheet (LIFO, matching brackets, monotonic stack decision rules)" },
    { id: "d21_block_8", label: "14:00–14:45 — React Routing (Why client-side routing, React Router, BrowserRouter, Route, Link)" },
    { id: "d21_block_9", label: "14:45–15:30 — Routing Practice (Home, Students, About pages, NavLink active state, route params)" },
    { id: "d21_block_11", label: "15:45–16:30 — React Practice (Home page, Students page, Details route, About page, Navigation)" },
    { id: "d21_block_12", label: "16:30–17:00 — Interview Recall (5 Core React Routing & Stack placement questions)" },
    { id: "d21_block_13", label: "17:00–17:30 — Mini Project (Student Client-Side Router Directory v10 + Details Route + 404)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day21Blocks.find((b) => b.id === id);
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
            Day 21 — Final Checklist & Progress Summary
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
            <Award size={14} /> Day 21 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~70% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~70%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~70%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~70%</span>
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
