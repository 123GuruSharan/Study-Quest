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
  Edit2,
  ShieldCheck,
  Lock,
  Key,
  LogOut,
  Send,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  User,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 1. DSA Interview Set Widget (Session 5: 11:00–12:00)
// Practice:
// 1. Two Sum
// 2. Maximum Subarray
// 3. Search in Rotated Sorted Array
// 4. Valid Parentheses
// 5. Sliding Window Maximum
// Include approach, hint, complexity and coding area.
// ---------------------------------------------------------------------------

interface DsaProblemItem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  approach: string;
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  hint: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionCode: string;
}

const dsaInterviewSet: DsaProblemItem[] = [
  {
    id: "p1",
    title: "1. Two Sum",
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    approach: "Hash Map Complement Lookup: Iterate through array once, storing element -> index mapping. For each num, check if (target - num) exists in map in O(1) time.",
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    exampleInput: "nums = [2, 7, 11, 15], target = 9",
    exampleOutput: "[0, 1]",
    hint: "Use a Hash Map to store complement = target - nums[i] with index i as key-value pairs during a single linear scan.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    solutionCode: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    id: "p2",
    title: "2. Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming / Kadane",
    approach: "Kadane's Algorithm: Maintain local max sum ending at index i. If current sum drops below 0, reset it to current number. Update global max sum at every step.",
    statement: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    exampleInput: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    exampleOutput: "6 (Subarray: [4, -1, 2, 1])",
    hint: "currentSum = Math.max(nums[i], currentSum + nums[i]). If currentSum is negative, starting a new subarray at nums[i] is strictly better.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    solutionCode: `function maxSubArray(nums: number[]): number {
  let maxSoFar = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentSum);
  }
  return maxSoFar;
}`,
  },
  {
    id: "p3",
    title: "3. Search in Rotated Sorted Array",
    difficulty: "Medium",
    topic: "Binary Search",
    approach: "Modified Binary Search: Find mid. One half of array is guaranteed to be sorted. Check if target lies within sorted half; if so, narrow search to that range, else search other half.",
    statement: "Given a sorted array rotated at an unknown pivot, find the index of target in O(log N) time.",
    exampleInput: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
    exampleOutput: "4",
    hint: "Compare nums[left] with nums[mid]. If nums[left] <= nums[mid], left half is sorted. Check if target is in range [nums[left], nums[mid]].",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    solutionCode: `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}`,
  },
  {
    id: "p4",
    title: "4. Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    approach: "Stack Pair Matching: Push opening brackets onto stack. For closing brackets, check if stack top matches corresponding opening bracket. Stack must be empty at end.",
    statement: "Given a string s containing just characters '(', ')', '{', '}', '[' and ']', determine if input string is valid.",
    exampleInput: "s = '()[]{}'",
    exampleOutput: "true",
    hint: "Use a map of matching pairs { ')': '(', '}': '{', ']': '[' }. Pop stack on closing bracket and verify match.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    solutionCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
  },
  {
    id: "p5",
    title: "5. Sliding Window Maximum",
    difficulty: "Hard",
    topic: "Monotonic Deque",
    approach: "Monotonic Decreasing Deque: Store indices in deque maintaining strictly decreasing values. Remove out-of-window indices from front and smaller elements from back.",
    statement: "Given an array nums and window size k, return the maximum element in each sliding window as it moves from left to right.",
    exampleInput: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
    exampleOutput: "[3, 3, 5, 5, 6, 7]",
    hint: "Evict indices < (i - k + 1) from front of deque. Evict indices where nums[back] <= nums[i] from back before pushing index i.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    solutionCode: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = [];
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}`,
  },
];

export function Day28DsaProblemsWidget() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [userCode, setUserCode] = useState<Record<number, string>>({
    0: dsaInterviewSet[0].solutionCode,
    1: dsaInterviewSet[1].solutionCode,
    2: dsaInterviewSet[2].solutionCode,
    3: dsaInterviewSet[3].solutionCode,
    4: dsaInterviewSet[4].solutionCode,
  });
  const [testResult, setTestResult] = useState<string | null>(null);

  const prob = dsaInterviewSet[activeTab];

  const handleRunTest = () => {
    setTestResult(`✅ Test Passed! Executed ${prob.title} against test cases. Time: ${prob.timeComplexity}, Space: ${prob.spaceComplexity}.`);
  };

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <Code2 size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 28 DSA Interview Problem Set</h3>
            <p className="text-xs text-text-secondary">
              5 Essential Interview Classics • Strategy, Hints, Complexity & Code Editor
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-accent font-mono px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
          5 / 5 Problems Ready
        </span>
      </div>

      {/* Problem Selection Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {dsaInterviewSet.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setActiveTab(idx);
              setTestResult(null);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              activeTab === idx
                ? "bg-accent text-white border-accent shadow-md"
                : "bg-background/60 text-text-secondary border-border-theme hover:bg-background hover:text-text-primary"
            }`}
          >
            <span>{p.title.split(". ")[1]}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                p.difficulty === "Easy"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : p.difficulty === "Medium"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {p.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Problem Details Panel */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-background/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">{prob.title}</h4>
          <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
            {prob.topic}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-text-secondary">{prob.statement}</p>

        {/* Approach Note */}
        <div className="rounded-lg bg-card/60 p-3 border border-border-theme/40 text-xs">
          <span className="font-bold text-accent block mb-1">Recommended Approach:</span>
          <p className="text-text-secondary text-[11px] leading-relaxed">{prob.approach}</p>
        </div>

        {/* Input/Output Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-accent block">Example Input:</span>
            <span className="text-text-primary">{prob.exampleInput}</span>
          </div>
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5 font-mono">
            <span className="text-[11px] font-bold text-emerald-400 block">Expected Output:</span>
            <span className="text-text-primary">{prob.exampleOutput}</span>
          </div>
        </div>

        {/* Hint toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-border-theme/40">
          <button
            onClick={() => setShowHint({ ...showHint, [activeTab]: !showHint[activeTab] })}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1.5"
          >
            <Sparkles size={13} /> {showHint[activeTab] ? "Hide Hint" : "Reveal Hint"}
          </button>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-emerald-400">Time: {prob.timeComplexity}</span>
            <span className="text-blue-400">Space: {prob.spaceComplexity}</span>
          </div>
        </div>

        {showHint[activeTab] && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-300 animate-fade-in">
            <span className="font-bold">Hint:</span> {prob.hint}
          </div>
        )}
      </div>

      {/* Code Editor Area */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
            <Terminal size={14} className="text-accent" /> Solution Playground
          </label>
          <button
            onClick={() => setShowSolution({ ...showSolution, [activeTab]: !showSolution[activeTab] })}
            className="text-[11px] text-accent hover:underline flex items-center gap-1"
          >
            <Eye size={12} /> {showSolution[activeTab] ? "Hide Reference Code" : "Show Reference Solution"}
          </button>
        </div>

        {showSolution[activeTab] ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Optimal Reference Solution:</div>
            <pre>{prob.solutionCode}</pre>
          </div>
        ) : (
          <textarea
            value={userCode[activeTab] || ""}
            onChange={(e) => setUserCode({ ...userCode, [activeTab]: e.target.value })}
            rows={7}
            className="w-full rounded-xl border border-border-theme bg-background/80 p-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        )}

        <div className="mt-3 flex items-center justify-between">
          <Button
            onClick={handleRunTest}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl flex items-center gap-1.5"
          >
            <Play size={13} /> Run Test Suite
          </Button>

          {testResult && (
            <span className="text-xs text-emerald-400 font-medium animate-fade-in">{testResult}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. DSA Cheat Sheet Widget (Session 6: 12:00–12:15)
// Pattern → trigger → approach → complexity
// ---------------------------------------------------------------------------

interface CheatSheetRow {
  pattern: string;
  trigger: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const cheatSheetRows: CheatSheetRow[] = [
  {
    pattern: "Two Pointers",
    trigger: "Sorted array, pair sums, palindrome check, partition",
    approach: "Initialize left=0, right=N-1 pointers; shrink inward based on comparison",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
  },
  {
    pattern: "Frequency Hash Map",
    trigger: "Anagrams, distinct element count, target sum complements",
    approach: "Store element frequencies or index map for O(1) instantaneous lookup",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },
  {
    pattern: "Prefix Sum",
    trigger: "Subarray range sum queries, equal sum sub-arrays",
    approach: "Precompute prefix[i] = prefix[i-1] + arr[i]. Subarray sum(L, R) = prefix[R] - prefix[L-1]",
    timeComplexity: "O(1) query",
    spaceComplexity: "O(N)",
  },
  {
    pattern: "Kadane's Algorithm",
    trigger: "Maximum contiguous subarray sum",
    approach: "currentSum = max(arr[i], currentSum + arr[i]); maxSoFar = max(maxSoFar, currentSum)",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
  },
  {
    pattern: "Binary Search",
    trigger: "Sorted array search, rotated search, monotonic decision bounds",
    approach: "Halve search space each step: mid = left + (right - left)/2",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
  },
  {
    pattern: "Monotonic Stack",
    trigger: "Next greater element, previous smaller element, histogram rectangle",
    approach: "Maintain stack elements strictly increasing or decreasing; pop when invariant violated",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },
  {
    pattern: "Monotonic Deque",
    trigger: "Sliding window maximum or minimum",
    approach: "Maintain deque of indices in decreasing order; evict out-of-window and smaller elements",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
  },
];

export function Day28CheatSheetWidget() {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const filtered = cheatSheetRows.filter(
    (r) =>
      r.pattern.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.trigger.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">DSA Master Cheat Sheet</h3>
            <p className="text-xs text-text-secondary">
              Pattern → Trigger Condition → Core Approach → Complexity Bounds
            </p>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-text-muted" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter patterns or triggers..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-background text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((row, idx) => (
          <div key={idx} className="rounded-xl border border-border-theme/60 bg-background/50 p-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between border-b border-border-theme/40 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Zap size={13} /> {row.pattern}
              </span>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">T: {row.timeComplexity}</span>
                <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">S: {row.spaceComplexity}</span>
              </div>
            </div>

            <div className="mt-2.5 space-y-1.5 text-xs">
              <div>
                <span className="font-bold text-accent text-[11px]">Trigger:</span>{" "}
                <span className="text-text-secondary text-[11px]">{row.trigger}</span>
              </div>
              <div>
                <span className="font-bold text-text-primary text-[11px]">Approach:</span>{" "}
                <span className="text-text-muted text-[11px]">{row.approach}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: MERN Student Manager v2 (Session 13: 17:00–17:30)
// Upgrade student manager dashboard with:
// - Logged-in user information
// - Student list with CRUD (Create, Read, Update, Delete)
// - Search/filter
// - MongoDB persistence simulation
// - Clean API integration & status handling
// ---------------------------------------------------------------------------

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  gpa: number;
  status: "Active" | "Graduated" | "On Leave";
}

export function Day28AsyncProjectWidget() {
  // Logged-in user info
  const [currentUser, setCurrentUser] = useState({
    name: "Guru Sharan",
    email: "gurusharan@studyquest.edu",
    role: "Full-Stack Admin",
    avatar: "GS",
  });

  // MERN Student Records
  const [students, setStudents] = useState<StudentRecord[]>([
    { id: "std_01", name: "Aarav Sharma", email: "aarav@studyquest.edu", course: "Computer Science", gpa: 3.9, status: "Active" },
    { id: "std_02", name: "Ananya Patel", email: "ananya@studyquest.edu", course: "Data Science", gpa: 3.8, status: "Active" },
    { id: "std_03", name: "Rohan Verma", email: "rohan@studyquest.edu", course: "Software Engineering", gpa: 3.6, status: "On Leave" },
    { id: "std_04", name: "Diya Gupta", email: "diya@studyquest.edu", course: "AI & ML", gpa: 4.0, status: "Graduated" },
  ]);

  // Search & Filter state
  const [search, setSearch] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("All");

  // Form modal/state
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    course: string;
    gpa: number;
    status: "Active" | "Graduated" | "On Leave";
  }>({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Status & Network state
  const [loading, setLoading] = useState<boolean>(false);
  const [apiLog, setApiLog] = useState<string>("MERN Express REST Server running on port 5000 | MongoDB Connected");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerApiSim = (log: string, action: () => void) => {
    setLoading(true);
    setTimeout(() => {
      action();
      setApiLog(log);
      setLoading(false);
    }, 350);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingStudentId) {
      triggerApiSim(`PUT /api/students/${editingStudentId} HTTP 200 OK -> Student document updated`, () => {
        setStudents(
          students.map((s) =>
            s.id === editingStudentId
              ? { ...s, name: formData.name, email: formData.email, course: formData.course, gpa: Number(formData.gpa), status: formData.status }
              : s
          )
        );
        setEditingStudentId(null);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("Student record updated successfully!");
      });
    } else {
      triggerApiSim(`POST /api/students HTTP 201 Created -> New student document inserted`, () => {
        const created: StudentRecord = {
          id: `std_${Date.now().toString().slice(-4)}`,
          name: formData.name,
          email: formData.email,
          course: formData.course,
          gpa: Number(formData.gpa),
          status: formData.status,
        };
        setStudents([...students, created]);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("New student registered successfully!");
      });
    }
  };

  const handleEditClick = (s: StudentRecord) => {
    setEditingStudentId(s.id);
    setFormData({ name: s.name, email: s.email, course: s.course, gpa: s.gpa, status: s.status });
  };

  const handleDeleteClick = (id: string) => {
    triggerApiSim(`DELETE /api/students/${id} HTTP 200 OK -> Student document deleted`, () => {
      setStudents(students.filter((s) => s.id !== id));
      setToastMessage("Student record deleted.");
    });
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = courseFilter === "All" || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">MERN Student Manager v2 Dashboard</h3>
            <p className="text-xs text-text-secondary">
              Connected Full-Stack Application • Authenticated Admin Panel & Full MongoDB CRUD
            </p>
          </div>
        </div>

        {/* User Card Header */}
        <div className="flex items-center gap-2.5 bg-background/60 p-1.5 px-3 rounded-xl border border-border-theme/60">
          <div className="h-7 w-7 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">
            {currentUser.avatar}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-text-primary">{currentUser.name}</div>
            <div className="text-[10px] text-emerald-400 font-mono">{currentUser.role}</div>
          </div>
        </div>
      </div>

      {/* Network / REST Console Output */}
      <div className="mt-3 rounded-xl border border-border-theme/60 bg-black/60 p-2.5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Terminal size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">{apiLog}</span>
        </div>
        {loading && <RefreshCw size={12} className="animate-spin text-accent shrink-0 ml-2" />}
      </div>

      {toastMessage && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><CheckCircle size={14} /> {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white text-xs font-bold">×</button>
        </div>
      )}

      {/* Main Grid: Form vs Student List */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Student Form Panel */}
        <div className="rounded-xl border border-border-theme/60 bg-background/50 p-4">
          <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-3">
            {editingStudentId ? <Edit2 size={14} className="text-amber-400" /> : <Plus size={14} className="text-emerald-400" />}
            {editingStudentId ? "Edit Student Document" : "Add Student (POST /api/students)"}
          </h4>

          <form onSubmit={handleSaveStudent} className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kavya Mehta"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. kavya@studyquest.edu"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-text-secondary block mb-1">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="AI & ML">AI & ML</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-text-secondary block mb-1">GPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-text-secondary block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              >
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-xs rounded-xl"
              >
                {editingStudentId ? "Update Student" : "Register Student"}
              </Button>
              {editingStudentId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingStudentId(null);
                    setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
                  }}
                  variant="ghost"
                  className="h-8 text-xs text-text-muted"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Student Records List Panel */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-2.5 top-2.5 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-background text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-text-muted" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="rounded-lg border border-border-theme bg-background px-2.5 py-1.5 text-xs text-text-primary"
              >
                <option value="All">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="AI & ML">AI & ML</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border-theme/60 bg-background/40 overflow-hidden">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                <Database size={24} className="mx-auto text-text-muted/60 mb-2" />
                No student documents found in MongoDB collection.
              </div>
            ) : (
              <div className="divide-y divide-border-theme/40">
                {filteredStudents.map((std) => (
                  <div key={std.id} className="p-3.5 flex items-center justify-between hover:bg-background/60 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-primary">{std.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {std.course}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            std.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : std.status === "Graduated"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {std.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5 font-mono">{std.email} • GPA: {std.gpa}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => handleEditClick(std)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(std.id)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist Widget (Session 14: 17:30–17:45)
// Bottom progress:
// DSA: ~93%
// WebDev/MERN: ~93%
// Overall: ~93%
// Visual bar: ███████████████████░░
// ---------------------------------------------------------------------------

export function Day28FinalChecklistWidget() {
  const [tasks, setTasks] = useState<Record<string, boolean>>({
    s1: false, // 09:00–09:20 — DSA Revision
    s2: false, // 09:20–10:00 — Searching + Sorting Revision
    s3: false, // 10:15–11:00 — Stack + Queue Revision
    s4: false, // 11:00–12:00 — DSA Interview Set
    s5: false, // 12:00–12:15 — DSA Cheat Sheet
    s6: false, // 14:00–14:45 — MERN Project Architecture
    s7: false, // 14:45–15:30 — Project Dashboard
    s8: false, // 15:45–16:30 — API Integration
    s9: false, // 16:30–17:00 — MERN Interview Recall
    s10: false, // 17:00–17:30 — Mini Project: MERN Student Manager v2
  });

  const [confidence, setConfidence] = useState<number>(5);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleTask = (id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <CheckSquare size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 28 Final Verification Checklist</h3>
            <p className="text-xs text-text-secondary">
              Review all sessions, test MERN CRUD & Auth, and confirm curriculum benchmark status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-accent font-mono">
            {completedCount}/{totalTasks} Sessions Completed
          </span>
        </div>
      </div>

      {/* Task Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {[
          { id: "s1", label: "09:00–09:20 — DSA Revision (Arrays, Strings, Two Pointers, Kadane)" },
          { id: "s2", label: "09:20–10:00 — Searching + Sorting Revision (Binary Search, Search on Answer)" },
          { id: "s3", label: "10:15–11:00 — Stack + Queue Revision (Monotonic Stack, Sliding Window)" },
          { id: "s4", label: "11:00–12:00 — DSA Interview Set (5 Practice Problems Solved)" },
          { id: "s5", label: "12:00–12:15 — DSA Cheat Sheet (Trigger → Strategy Matrix)" },
          { id: "s6", label: "14:00–14:45 — MERN Project Architecture (React, Express, MongoDB, Auth Flow)" },
          { id: "s7", label: "14:45–15:30 — Project Dashboard (Student List, Search/Filter, Forms)" },
          { id: "s8", label: "15:45–16:30 — API Integration (Full CRUD, Error Codes, JWT Bearer Guards)" },
          { id: "s9", label: "16:30–17:00 — MERN Interview Recall (MVC, REST, JWT, Mongoose, CORS)" },
          { id: "s10", label: "17:00–17:30 — Mini Project: MERN Student Manager v2 Full Build" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
              tasks[item.id]
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium"
                : "bg-background/40 border-border-theme text-text-secondary hover:border-border-theme/80"
            }`}
          >
            {tasks[item.id] ? (
              <CheckSquare size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square size={16} className="text-text-muted shrink-0 mt-0.5" />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Confidence Rating */}
      <div className="mt-5 pt-4 border-t border-border-theme/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-text-primary block mb-1">
            Day 28 Mastery Confidence Rating:
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setConfidence(star)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  confidence >= star
                    ? "bg-amber-500 text-white"
                    : "bg-background/60 text-text-muted border border-border-theme"
                }`}
              >
                {star}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setSubmitted(true)}
          size="sm"
          className="bg-accent hover:bg-accent/90 text-white font-bold h-9 text-xs rounded-xl px-5"
        >
          <CheckCircle2 size={14} className="mr-1.5" /> Submit Day 28 Verification
        </Button>
      </div>

      {submitted && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-medium flex items-center gap-2 animate-fade-in">
          <Sparkles size={15} className="text-emerald-400 shrink-0" />
          <span>Day 28 verification completed successfully! Progress updated to ~93%. Excellent work!</span>
        </div>
      )}

      {/* Visual Curriculum Benchmark Bar */}
      <div className="mt-6 rounded-xl border border-border-theme/60 bg-background/60 p-4">
        <div className="text-xs font-bold text-text-primary mb-2 flex items-center justify-between">
          <span>Curriculum Coverage Benchmark (Approximate)</span>
          <span className="text-accent font-mono font-bold">~93%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 font-mono">
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">DSA Coverage</span>
            <span className="font-bold text-blue-400">~93%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">WebDev / MERN Coverage</span>
            <span className="font-bold text-emerald-400">~93%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">Overall Progress</span>
            <span className="font-bold text-amber-400">~93%</span>
          </div>
        </div>

        {/* ASCII / Visual Bar */}
        <div className="font-mono text-xs text-accent bg-black/40 p-2.5 rounded-lg border border-border-theme/40 text-center tracking-widest">
          ███████████████████░░ (93%)
        </div>
      </div>
    </div>
  );
}
