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
    id: "implement-queue-array",
    name: "1. Implement Queue using Array",
    statement: "Implement a Queue data structure using an array supporting `enqueue(x)`, `dequeue()`, `front()`, and `isEmpty()`. All operations must run in O(1) amortized time.",
    example: {
      input: "enqueue(10), enqueue(20), front(), dequeue(), front()",
      output: "front = 10, dequeued = 10, front = 20",
    },
    hint: "Maintain `front` and `rear` pointers (or head index) so dequeue can increment `head` without shifting array elements.",
    expectedOutput: "front = 10, dequeued = 10, front = 20",
    complexity: { time: "O(1)", space: "O(N)" },
    defaultCode: `class ArrayQueue {
  constructor() {
    this.items = [];
    this.head = 0;
  }
  enqueue(val) {
    this.items.push(val);
  }
  dequeue() {
    if (this.isEmpty()) return null;
    const val = this.items[this.head];
    this.head++;
    return val;
  }
  front() {
    if (this.isEmpty()) return null;
    return this.items[this.head];
  }
  isEmpty() {
    return this.head >= this.items.length;
  }
}

function testQueue() {
  const q = new ArrayQueue();
  q.enqueue(10);
  q.enqueue(20);
  const f1 = q.front();
  const d1 = q.dequeue();
  const f2 = q.front();
  return \`front = \${f1}, dequeued = \${d1}, front = \${f2}\`;
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
        if (res === "front = 10, dequeued = 10, front = 20") {
          return {
            success: true,
            output: `front = 10, dequeued = 10, front = 20 (Correct! Array-backed FIFO Queue implemented with O(1) operations)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "front = 10, dequeued = 10, front = 20"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "circular-queue",
    name: "2. Implement Circular Queue",
    statement: "Design your implementation of the circular queue. A circular queue is a linear data structure in which operations are performed based on FIFO principle and the last position is connected back to the first position.",
    example: {
      input: "capacity = 3, enq(1), enq(2), enq(3), enq(4) -> false, deq() -> true, enq(4) -> true",
      output: "[1, 2, 3] -> full, after pop & push 4 -> front is 2",
    },
    hint: "Use modular arithmetic `(pointer + 1) % capacity` to wrap pointers back to zero when reaching end of array.",
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
            output: `Front = 2, Rear = 4 (Correct! Circular queue wrapped head and tail pointers using modulo indexing)`,
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
    id: "generate-binary-numbers",
    name: "3. Generate Binary Numbers using Queue",
    statement: "Given a number `N`, generate all binary numbers from `1` to `N` using a Queue. Return an array of strings.",
    example: {
      input: "N = 5",
      output: "['1', '10', '11', '100', '101']",
    },
    hint: "Enqueue '1'. For each iteration from 1 to N, dequeue current string `s`, add `s` to result, then enqueue `s + '0'` and `s + '1'`.",
    expectedOutput: "['1', '10', '11', '100', '101']",
    complexity: { time: "O(N)", space: "O(N)" },
    defaultCode: `function generateBinaryNumbers(n) {
  const result = [];
  const queue = ["1"];

  for (let i = 0; i < n; i++) {
    const curr = queue.shift();
    result.push(curr);
    queue.push(curr + "0");
    queue.push(curr + "1");
  }

  return result;
}

generateBinaryNumbers(5);`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof generateBinaryNumbers === 'function') {
            return generateBinaryNumbers(5);
          }
          return null;
        `);
        const res = runFn();
        const jsonRes = JSON.stringify(res);
        if (jsonRes === '["1","10","11","100","101"]') {
          return {
            success: true,
            output: `['1', '10', '11', '100', '101'] (Correct! BFS queue pattern generated binary numbers in sequence)`,
          };
        }
        return {
          success: false,
          output: `Returned: ${jsonRes}. Expected: ["1","10","11","100","101"]`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "first-non-repeating-stream",
    name: "4. First Non-Repeating Character in Stream",
    statement: "Given a string `A` representing a stream of characters, find the first non-repeating character at each point. If no non-repeating character exists, append '#' to result.",
    example: {
      input: "A = 'aabc'",
      output: "'a#bb'",
    },
    hint: "Use a frequency hash map and a queue storing character order. Dequeue characters from queue front if frequency > 1.",
    expectedOutput: "'a#bb'",
    complexity: { time: "O(N)", space: "O(26)" },
    defaultCode: `function firstNonRepeating(stream) {
  const freq = {};
  const queue = [];
  let result = "";

  for (const char of stream) {
    freq[char] = (freq[char] || 0) + 1;
    queue.push(char);

    while (queue.length > 0 && freq[queue[0]] > 1) {
      queue.shift();
    }

    if (queue.length === 0) {
      result += "#";
    } else {
      result += queue[0];
    }
  }

  return result;
}

firstNonRepeating("aabc");`,
    testRunner: (code: string) => {
      try {
        const cleanCode = code.replace(/\/\/#.*$/gm, "").trim();
        const runFn = new Function(`
          ${cleanCode}
          if (typeof firstNonRepeating === 'function') {
            return firstNonRepeating("aabc");
          }
          return null;
        `);
        const res = runFn();
        if (res === "a#bb") {
          return {
            success: true,
            output: `"a#bb" (Correct! Queue + Frequency map tracked first non-repeating character in stream)`,
          };
        }
        return {
          success: false,
          output: `Returned: "${res}". Expected: "a#bb"`,
        };
      } catch (err: any) {
        return { success: false, output: `Runtime Error: ${err.message}` };
      }
    },
  },
  {
    id: "sliding-window-max",
    name: "5. Sliding Window Maximum",
    statement: "You are given an array of integers `nums`, and a sliding window of size `k` moving from left to right. Return the max element in each sliding window.",
    example: {
      input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
      output: "[3, 3, 5, 5, 6, 7]",
    },
    hint: "Use a Monotonic Deque (double-ended queue) storing indices. Maintain decreasing order of elements. Pop smaller elements from back, pop out-of-window elements from front.",
    expectedOutput: "[3, 3, 5, 5, 6, 7]",
    complexity: { time: "O(N)", space: "O(K)" },
    defaultCode: `function maxSlidingWindow(nums, k) {
  const deque = []; // stores indices
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1. Remove indices out of current window
    if (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }

    // 2. Remove indices with smaller values from back
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // 3. Record max when window reaches size k
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
];

export function Day24DsaProblemsWidget() {
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
              Day 24 DSA Practice: Queue Fundamentals & Deque Patterns
            </h3>
            <p className="text-xs text-text-secondary">
              5 Placement Problems: Queue Array, Circular Queue, Binary Numbers, Non-Repeating Stream, Sliding Window Max
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          FIFO & Deque Patterns
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
// 2. Queue & Mongoose Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day24CheatSheetWidget() {
  return (
    <div className="my-6 rounded-2xl border border-border-theme bg-surface-card p-5 shadow-md">
      <div className="flex items-center gap-2.5 border-b border-border-theme/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Day 24 Queue Patterns & Mongoose ODM Cheat Sheet
          </h3>
          <p className="text-xs text-text-secondary">
            Quick Reference: FIFO Queues vs LIFO Stacks, Monotonic Deque & Mongoose CRUD methods
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Workflow size={14} /> FIFO → Queue
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            First-In, First-Out sequence policy. Used for task scheduling, stream processing, and BFS graph traversals.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={14} /> Sliding Window → Deque
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Double-Ended Queue (Deque). Push/pop at both ends in O(1) time. Solves Sliding Window Maximum in linear O(N) time.
          </p>
        </div>

        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Database size={14} /> Mongoose ODM
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Object Data Modeling library. Enforces strong Schema structure, type casting, validation rules, and middleware hooks.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Server size={14} /> Mongoose Methods
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            `Student.create()`, `Student.find()`, `Student.findById(id)`, `findByIdAndUpdate()`, `findByIdAndDelete()`.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Mongoose ODM Full API Gateway v3.0 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface MongooseStudent {
  _id: string;
  name: string;
  email: string;
  course: string;
  grade: string;
  isActive: boolean;
  createdAt: string;
}

const initialMongooseStudents: MongooseStudent[] = [
  { _id: "65f9b202a1b2c3d4e5f60001", name: "Aarav Sharma", email: "aarav@example.com", course: "Computer Science", grade: "A+", isActive: true, createdAt: "2026-10-01" },
  { _id: "65f9b202a1b2c3d4e5f60002", name: "Ananya Patel", email: "ananya@example.com", course: "Information Tech", grade: "A", isActive: true, createdAt: "2026-10-02" },
  { _id: "65f9b202a1b2c3d4e5f60003", name: "Rohan Verma", email: "rohan@example.com", course: "Software Engineering", grade: "B+", isActive: true, createdAt: "2026-10-03" },
];

export function Day24AsyncProjectWidget() {
  const [students, setStudents] = useState<MongooseStudent[]>(initialMongooseStudents);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialMongooseStudents[0]._id);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [courseInput, setCourseInput] = useState("Computer Science");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"get_all" | "get_by_id" | "post" | "delete">("get_all");
  const [logs, setLogs] = useState<string[]>([
    "[MONGOOSE] Connecting to mongodb://127.0.0.1:27017/student_db ...",
    "[MONGOOSE] Schema compiled: StudentModel -> mongoose.model('Student', StudentSchema)",
    "[EXPRESS] app.listen(5000) - Student Mongoose API Server Online",
  ]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handlePostStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Mongoose Schema Validation Simulation
    if (!nameInput.trim()) {
      setValidationError("ValidationError: Student 'name' is required.");
      addLog("POST /api/students -> 400 Bad Request (ValidationError: name is required)");
      return;
    }
    if (!emailInput.trim() || !emailInput.includes("@")) {
      setValidationError("ValidationError: Valid 'email' address is required.");
      addLog("POST /api/students -> 400 Bad Request (ValidationError: invalid email)");
      return;
    }

    const newHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newStd: MongooseStudent = {
      _id: newHex,
      name: nameInput.trim(),
      email: emailInput.trim(),
      course: courseInput,
      grade: "A",
      isActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setStudents((prev) => [newStd, ...prev]);
    setSelectedStudentId(newStd._id);
    setNameInput("");
    setEmailInput("");
    addLog(`POST /api/students -> Student.create({ name: '${newStd.name}' }) -> 201 Created (_id: ${newStd._id})`);
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s._id !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter((s) => s._id !== id);
      if (remaining.length > 0) setSelectedStudentId(remaining[0]._id);
    }
    addLog(`DELETE /api/students/${id} -> Student.findByIdAndDelete('${id}') -> 200 OK`);
  };

  const getTargetStudent = () => {
    return students.find((s) => s._id === selectedStudentId) || null;
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
              Day 24 Mini Project: Student Mongoose ODM Full REST API Gateway v3.0
            </h3>
            <p className="text-xs text-text-secondary">
              Mongoose Schema validation, `findById()`, `create()`, `findByIdAndDelete()`, status codes & error handling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Mongoose ODM Driver Active
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Endpoint Tester & Form */}
        <div className="space-y-4 lg:col-span-5">
          {/* API Route Selector */}
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Test Express + Mongoose REST Endpoints
            </h4>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setActiveTab("get_all");
                  addLog("GET /api/students -> Student.find() -> 200 OK");
                }}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeTab === "get_all"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                GET /api/students
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("get_by_id");
                  addLog(`GET /api/students/${selectedStudentId} -> Student.findById() -> 200 OK`);
                }}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeTab === "get_by_id"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                GET /students/:id
              </Button>
              <Button
                onClick={() => setActiveTab("post")}
                size="sm"
                className={`h-8 text-xs font-bold rounded-lg ${
                  activeTab === "post"
                    ? "bg-emerald-600 text-white"
                    : "bg-surface-card text-text-secondary hover:bg-surface-hover"
                }`}
              >
                POST /students
              </Button>
            </div>

            {/* Form for POST Request */}
            {activeTab === "post" && (
              <form onSubmit={handlePostStudent} className="mt-4 border-t border-border-theme/40 pt-3 space-y-2.5">
                <div className="text-xs font-bold text-emerald-400">
                  POST /api/students (Create with Mongoose Validation):
                </div>

                {validationError && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[11px] text-rose-400">
                    {validationError}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Name (Required):</label>
                  <input
                    type="text"
                    placeholder="e.g. Diya Sharma"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Email (Required):</label>
                  <input
                    type="email"
                    placeholder="e.g. diya@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2.5 text-xs text-text-primary outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-secondary">Course:</label>
                  <select
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    className="mt-0.5 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs text-text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Full Stack MERN">Full Stack MERN</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                >
                  <Plus size={13} className="mr-1" /> Student.create(req.body)
                </Button>
              </form>
            )}

            {/* Selector for GET by ID */}
            {activeTab === "get_by_id" && (
              <div className="mt-4 border-t border-border-theme/40 pt-3">
                <label className="text-xs font-semibold text-text-secondary">Select Student ID for `findById()`:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="mt-1 h-8 w-full rounded-lg border border-border-theme bg-surface-card px-2 text-xs font-mono text-text-primary outline-none focus:border-emerald-500"
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s._id.slice(0, 10)}...)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Mongoose Schema Code */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <FileCode2 size={13} className="text-emerald-400" /> StudentSchema.js (Validation Rules)
            </div>
            <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
{`const studentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name required'] },
  email: { type: String, required: true, unique: true },
  course: { type: String, default: 'General' },
  grade: { type: String, enum: ['A+', 'A', 'B+', 'B'] },
  isActive: { type: Boolean, default: true }
});`}
            </pre>
          </div>
        </div>

        {/* Right: Response Payload & Mongoose Log Stream */}
        <div className="space-y-4 lg:col-span-7">
          {/* Response Payload */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 font-bold text-slate-400">
                <Globe size={14} className="text-blue-400" /> Response JSON Payload
              </span>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
                HTTP 200 OK
              </span>
            </div>

            <pre className="mt-2 max-h-[220px] overflow-y-auto text-[11px] leading-relaxed text-emerald-300">
              {activeTab === "get_all" &&
                JSON.stringify({ status: 200, count: students.length, data: students }, null, 2)}
              {activeTab === "get_by_id" &&
                JSON.stringify({ status: 200, student: getTargetStudent() }, null, 2)}
              {activeTab === "post" &&
                JSON.stringify({ status: 201, message: "Student document created", student: getTargetStudent() }, null, 2)}
              {activeTab === "delete" &&
                JSON.stringify({ status: 200, message: "Student document deleted" }, null, 2)}
            </pre>
          </div>

          {/* Student Document List with Delete Buttons */}
          <div className="rounded-xl border border-border-theme/60 bg-surface-elevated p-3 text-xs">
            <h4 className="font-bold text-text-primary">
              Mongoose Database Collection Records (`Student.find()`)
            </h4>
            <div className="mt-2 max-h-[140px] space-y-1.5 overflow-y-auto pr-1">
              {students.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-lg border border-border-theme/60 bg-surface-card p-2 text-[11px]"
                >
                  <div>
                    <span className="font-bold text-text-primary">{s.name}</span>{" "}
                    <span className="text-text-tertiary">({s.email})</span> —{" "}
                    <span className="text-emerald-500 font-medium">{s.course}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-text-tertiary hover:text-rose-400 transition-colors"
                    title="Student.findByIdAndDelete(id)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mongoose Driver Log Stream */}
          <div className="rounded-xl border border-border-theme/60 bg-slate-950 p-3 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Terminal size={13} className="text-amber-400" /> Mongoose ODM Live Driver Console
              </span>
              <span className="text-[10px] text-slate-500">Mongoose Query Stream</span>
            </div>
            <div className="mt-2 max-h-[120px] space-y-1 overflow-y-auto text-[11px]">
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

export function Day24FinalChecklistWidget() {
  const { studyBlocks, updateBlockStatus } = useStudyStore();

  const d24Blocks = studyBlocks.filter((b) => b.id.startsWith("d24_"));

  const toggleBlock = (blockId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Not Started" : "Completed";
    updateBlockStatus(blockId, nextStatus as any);
  };

  const completedCount = d24Blocks.filter((b) => b.status === "Completed").length;
  const totalCount = d24Blocks.length;
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
              Day 24 Final Session Checklist & Curriculum Progress
            </h3>
            <p className="text-xs text-text-secondary">
              Track completion for all Day 24 sessions. Progress updates dynamically.
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
        {d24Blocks.map((block) => {
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
          Bottom of Day 24 Progress Summary
        </h4>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">DSA Progress:</span>
              <span className="font-mono font-bold text-blue-400">~80%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-blue-500" style={{ width: "80%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">WebDev / MERN Progress:</span>
              <span className="font-mono font-bold text-emerald-400">~80%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-emerald-500" style={{ width: "80%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Overall Completion:</span>
              <span className="font-mono font-bold text-purple-400">~80%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-card">
              <div className="h-full bg-purple-500" style={{ width: "80%" }} />
            </div>
          </div>

          {/* Requested Visual Progress Bar */}
          <div className="mt-3 rounded-lg bg-surface-card p-3 font-mono text-xs text-center text-text-primary">
            Progress bar: <span className="text-emerald-400 font-bold">████████████████░░░░</span> (~80%)
          </div>
        </div>
      </div>
    </div>
  );
}
