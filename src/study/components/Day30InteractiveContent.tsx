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
  AlertTriangle,
  FileText,
  Sliders,
  Maximize2,
  Trophy,
  PartyPopper,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// 1. Final DSA Assessment Widget (Session 5: 11:00–12:00)
// - 2 timed problems
// - No hints initially
// - Explain solution verbally
// - Record mistakes and topics needing revision
// ---------------------------------------------------------------------------

interface AssessmentProblem {
  id: string;
  title: string;
  difficulty: "Medium" | "Hard";
  topic: string;
  timeLimitMinutes: number;
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  optimalSolution: string;
  targetTimeComplexity: string;
  targetSpaceComplexity: string;
}

const finalAssessmentProblems: AssessmentProblem[] = [
  {
    id: "ap_1",
    title: "Assessment Problem 1: 3Sum",
    difficulty: "Medium",
    topic: "Two Pointers & Sorting",
    timeLimitMinutes: 30,
    statement: "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    exampleInput: "nums = [-1, 0, 1, 2, -1, -4]",
    exampleOutput: "[[-1, -1, 2], [-1, 0, 1]]",
    optimalSolution: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
    targetTimeComplexity: "O(N²)",
    targetSpaceComplexity: "O(1) (excluding output array)",
  },
  {
    id: "ap_2",
    title: "Assessment Problem 2: Course Schedule (Cycle Detection)",
    difficulty: "Medium",
    topic: "Graphs & Topological Sort",
    timeLimitMinutes: 30,
    statement: "There are numCourses courses you must take. You are given an array prerequisites where prerequisites[i] = [a, b] indicates you must take course b before a. Return true if you can finish all courses.",
    exampleInput: "numCourses = 2, prerequisites = [[1, 0]]",
    exampleOutput: "true",
    optimalSolution: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  let visitedCount = 0;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    visitedCount++;
    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return visitedCount === numCourses;
}`,
    targetTimeComplexity: "O(V + E)",
    targetSpaceComplexity: "O(V + E)",
  },
];

export function Day30FinalDsaAssessmentWidget() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [userVerbalNotes, setUserVerbalNotes] = useState<Record<number, string>>({
    0: "Sorted array first to enable two pointers. Fixed index i, then used left & right pointers. Handled duplicate triplets by skipping identical consecutive values.",
    1: "Kahn's Algorithm (BFS Topological Sort). Constructed adjacency list & in-degree array. Pushed 0 in-degree nodes into Queue. Tracked processed course count to detect cycles.",
  });
  const [userCode, setUserCode] = useState<Record<number, string>>({
    0: finalAssessmentProblems[0].optimalSolution,
    1: finalAssessmentProblems[1].optimalSolution,
  });
  const [recordedWeakTopics, setRecordedWeakTopics] = useState<string>("");
  const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);

  const prob = finalAssessmentProblems[activeTab];

  const handleCompleteAssessment = () => {
    setAssessmentStatus(`🎉 Final Assessment Completed! Both problems solved with optimal ${prob.targetTimeComplexity} time complexity. Recorded weak topics saved for post-30 day revision.`);
  };

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/20">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Day 30 Final DSA Assessment Arena</h3>
            <p className="text-xs text-text-secondary">
              2 Medium Assessment Problems • Verbal Solution Explanation • Recorded Weak Topics Log
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
          60 Min Assessment Window
        </span>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {finalAssessmentProblems.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setActiveTab(idx);
              setAssessmentStatus(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
              activeTab === idx
                ? "bg-accent text-white border-accent shadow-md"
                : "bg-background/60 text-text-secondary border-border-theme hover:bg-background hover:text-text-primary"
            }`}
          >
            <Code2 size={14} />
            <span>{p.title.split(": ")[1]}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
              {p.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Problem Specification */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-background/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">{prob.title}</h4>
          <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
            {prob.topic}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{prob.statement}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5">
            <span className="text-[11px] font-bold text-accent block">Example Input:</span>
            <span className="text-text-primary">{prob.exampleInput}</span>
          </div>
          <div className="rounded-lg border border-border-theme/40 bg-card/60 p-2.5">
            <span className="text-[11px] font-bold text-emerald-400 block">Expected Output:</span>
            <span className="text-text-primary">{prob.exampleOutput}</span>
          </div>
        </div>
      </div>

      {/* Verbal Explanation Recorder */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-text-secondary block mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-amber-400" /> Verbal Solution Explanation (Explain Before Coding)
          </label>
          <textarea
            value={userVerbalNotes[activeTab] || ""}
            onChange={(e) => setUserVerbalNotes({ ...userVerbalNotes, [activeTab]: e.target.value })}
            rows={6}
            placeholder="Verbalize logic, step-by-step pointers, duplicate handling & edge cases..."
            className="w-full rounded-xl border border-border-theme bg-background/80 p-3 text-xs text-text-primary focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Terminal size={14} className="text-accent" /> Assessment Code Playground
            </label>
            <button
              onClick={() => setShowSolution({ ...showSolution, [activeTab]: !showSolution[activeTab] })}
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              <Eye size={12} /> {showSolution[activeTab] ? "Hide Solution" : "Show Reference Solution"}
            </button>
          </div>
          {showSolution[activeTab] ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-300 overflow-x-auto h-[130px]">
              <pre>{prob.optimalSolution}</pre>
            </div>
          ) : (
            <textarea
              value={userCode[activeTab] || ""}
              onChange={(e) => setUserCode({ ...userCode, [activeTab]: e.target.value })}
              rows={6}
              className="w-full rounded-xl border border-border-theme bg-background/80 p-3 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Record Mistakes & Weak Topics for Future Revision */}
      <div className="mt-4 rounded-xl border border-border-theme/60 bg-card/60 p-4 space-y-3">
        <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
          <BookOpen size={14} className="text-accent" /> Record Mistakes & Weak Topics Needing Post-30 Day Revision
        </label>
        <textarea
          value={recordedWeakTopics}
          onChange={(e) => setRecordedWeakTopics(e.target.value)}
          rows={2}
          placeholder="e.g., Graphs Topological Sort cycle detection, Monotonic Deque index eviction, Binary Search on Answer boundary checks..."
          className="w-full rounded-lg border border-border-theme bg-background p-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-border-theme/40">
          <Button
            onClick={handleCompleteAssessment}
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 text-xs rounded-xl"
          >
            <CheckCircle size={14} className="mr-1.5" /> Submit Assessment Review
          </Button>
          {assessmentStatus && (
            <span className="text-xs text-amber-400 font-medium animate-fade-in">{assessmentStatus}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. DSA Final Master Cheat Sheet Widget (Session 6: 12:00–12:15)
// - Pattern → when to use → complexity
// - Common edge cases and mistakes
// ---------------------------------------------------------------------------

interface MasterPatternItem {
  pattern: string;
  category: string;
  whenToUse: string;
  timeComplexity: string;
  spaceComplexity: string;
  criticalEdgeCases: string[];
}

const masterCheatSheet: MasterPatternItem[] = [
  {
    pattern: "Two Pointers",
    category: "Arrays & Strings",
    whenToUse: "Sorted arrays, pair sums, palindrome verification, partition.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    criticalEdgeCases: ["Array length N < 2", "Duplicate values causing redundant pair checks"],
  },
  {
    pattern: "Sliding Window",
    category: "Arrays & Substrings",
    whenToUse: "Contiguous subarray/substring queries (max sum, min length, distinct K).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K) or O(1)",
    criticalEdgeCases: ["Empty string or string with all identical characters", "Window size K > array length N"],
  },
  {
    pattern: "Prefix Sum",
    category: "Range Queries",
    whenToUse: "Multiple range sum queries Q, sub-array sum equals K.",
    timeComplexity: "O(1) query",
    spaceComplexity: "O(N)",
    criticalEdgeCases: ["Sub-array sum equals 0 with negative numbers", "Offset errors prefix[R] - prefix[L-1]"],
  },
  {
    pattern: "Kadane's Algorithm",
    category: "Dynamic Programming",
    whenToUse: "Maximum contiguous subarray sum in 1D array.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    criticalEdgeCases: ["Array containing all negative numbers (e.g. [-5, -2, -8])"],
  },
  {
    pattern: "Binary Search",
    category: "Searching & Optimization",
    whenToUse: "Sorted arrays, search in rotated array, monotonic search on answer.",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    criticalEdgeCases: ["Single element array N=1", "Target smaller or larger than all array elements"],
  },
  {
    pattern: "Monotonic Stack / Deque",
    category: "Stacks & Queues",
    whenToUse: "Next greater element, histogram rectangle, sliding window max.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    criticalEdgeCases: ["Strictly decreasing or increasing input arrays", "Deque index eviction out-of-window"],
  },
];

export function Day30CheatSheetWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = selectedCategory === "All"
    ? masterCheatSheet
    : masterCheatSheet.filter((p) => p.category === selectedCategory);

  return (
    <div className="mt-4 rounded-2xl border border-border-theme bg-card/40 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">DSA Master Cheat Sheet & Edge Case Guide</h3>
            <p className="text-xs text-text-secondary">
              Pattern → When to Use → Complexity → Critical Edge Cases
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {["All", "Arrays & Strings", "Arrays & Substrings", "Range Queries", "Dynamic Programming", "Searching & Optimization", "Stacks & Queues"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-purple-500 text-white font-bold"
                  : "bg-background/60 text-text-secondary hover:text-text-primary border border-border-theme"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border-theme/60 bg-background/50 p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-border-theme/40 pb-2">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" /> {item.pattern}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {item.category}
              </span>
            </div>

            <div className="text-xs">
              <span className="font-bold text-accent">When to Use:</span>{" "}
              <span className="text-text-secondary">{item.whenToUse}</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Time: {item.timeComplexity}</span>
              <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Space: {item.spaceComplexity}</span>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs">
              <span className="font-bold text-amber-400 block mb-1">Critical Edge Cases to Test:</span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-300">
                {item.criticalEdgeCases.map((ec, i) => (
                  <li key={i}>{ec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Final MERN Student Manager Presentation Release (Session 13: 17:00–17:30)
// Finish a presentation-ready version:
// - Responsive UI
// - Authentication
// - Protected dashboard
// - Full CRUD
// - Search/filter
// - MongoDB persistence
// - Proper error/loading states
// - Clean reusable components
// ---------------------------------------------------------------------------

interface FinalStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  gpa: number;
  status: "Active" | "Graduated" | "On Leave";
}

export function Day30AsyncProjectWidget() {
  const [students, setStudents] = useState<FinalStudent[]>([
    { id: "std_201", name: "Aarav Sharma", email: "aarav@studyquest.edu", course: "Computer Science", gpa: 3.9, status: "Active" },
    { id: "std_202", name: "Ananya Patel", email: "ananya@studyquest.edu", course: "Data Science", gpa: 3.8, status: "Active" },
    { id: "std_203", name: "Rohan Verma", email: "rohan@studyquest.edu", course: "Software Engineering", gpa: 3.6, status: "On Leave" },
    { id: "std_204", name: "Diya Gupta", email: "diya@studyquest.edu", course: "AI & ML", gpa: 4.0, status: "Graduated" },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    course: string;
    gpa: number;
    status: "Active" | "Graduated" | "On Leave";
  }>({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [systemLog, setSystemLog] = useState<string>("Final Production Build v3.0 | Connected to MongoDB Atlas & Express REST API Gateway");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const runApi = (log: string, action: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      action();
      setSystemLog(log);
      setIsLoading(false);
    }, 250);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingId) {
      runApi(`PUT /api/students/${editingId} HTTP 200 OK -> Updated MongoDB Document`, () => {
        setStudents(
          students.map((s) => (s.id === editingId ? { ...s, ...formData, gpa: Number(formData.gpa) } : s))
        );
        setEditingId(null);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("Student document updated successfully!");
      });
    } else {
      runApi(`POST /api/students HTTP 201 Created -> Inserted Document into MongoDB`, () => {
        const created: FinalStudent = {
          id: `std_${Date.now().toString().slice(-4)}`,
          ...formData,
          gpa: Number(formData.gpa),
        };
        setStudents([...students, created]);
        setFormData({ name: "", email: "", course: "Computer Science", gpa: 3.5, status: "Active" });
        setToastMessage("New student document created!");
      });
    }
  };

  const handleEdit = (s: FinalStudent) => {
    setEditingId(s.id);
    setFormData({ name: s.name, email: s.email, course: s.course, gpa: s.gpa, status: s.status });
  };

  const handleDelete = (id: string) => {
    runApi(`DELETE /api/students/${id} HTTP 200 OK -> Deleted Document from MongoDB`, () => {
      setStudents(students.filter((s) => s.id !== id));
      setToastMessage("Student document removed.");
    });
  };

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
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
            <h3 className="text-base font-bold text-text-primary">MERN Student Manager (Final Presentation Release)</h3>
            <p className="text-xs text-text-secondary">
              Fully Connected MERN Architecture • Responsive Dashboard • JWT Protected Gateway
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={12} /> JWT Auth Guard Active
        </span>
      </div>

      {/* Network Log */}
      <div className="mt-3 rounded-xl border border-border-theme/60 bg-black/60 p-2.5 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <Terminal size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">{systemLog}</span>
        </div>
        {isLoading && <RefreshCw size={12} className="animate-spin text-accent shrink-0 ml-2" />}
      </div>

      {toastMessage && (
        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><CheckCircle size={14} /> {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-text-muted hover:text-white text-xs font-bold">×</button>
        </div>
      )}

      {/* Form & Student List Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-xl border border-border-theme/60 bg-background/50 p-4">
          <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 mb-3">
            {editingId ? <Edit2 size={14} className="text-amber-400" /> : <Plus size={14} className="text-emerald-400" />}
            {editingId ? "Edit Student Document" : "Register Student (POST /api/students)"}
          </h4>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Gurleen Kaur"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. gurleen@studyquest.edu"
                className="w-full rounded-lg border border-border-theme bg-background p-2 text-xs text-text-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-text-secondary font-medium block mb-1">Course</label>
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
                <label className="text-[11px] text-text-secondary font-medium block mb-1">GPA</label>
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
              <label className="text-[11px] text-text-secondary font-medium block mb-1">Status</label>
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
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-xs rounded-xl"
              >
                {editingId ? "Update Student" : "Create Record"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
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

        {/* Student Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={13} className="absolute left-2.5 top-2.5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-theme bg-background text-xs text-text-primary"
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
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-text-muted">
                <Database size={24} className="mx-auto text-text-muted/60 mb-2" />
                No matching student documents in MongoDB.
              </div>
            ) : (
              <div className="divide-y divide-border-theme/40">
                {filtered.map((std) => (
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
                        onClick={() => handleEdit(std)}
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(std.id)}
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
// 4. 30-Day Completion Checklist Widget (Session 14: 17:30–17:45)
// Bottom progress:
// DSA: 100%
// WebDev/MERN: 100%
// Overall: 100%
// Visual bar: ████████████████████
// ---------------------------------------------------------------------------

export function Day30FinalChecklistWidget() {
  const [tasks, setTasks] = useState<Record<string, boolean>>({
    s1: false, // 09:00–09:20 — DSA Final Revision
    s2: false, // 09:20–10:00 — DSA Pattern Challenge
    s3: false, // 10:15–11:00 — Final DSA Mock Interview
    s4: false, // 11:00–12:00 — Final DSA Assessment
    s5: false, // 12:00–12:15 — DSA Final Cheat Sheet
    s6: false, // 14:00–14:45 — MERN Project Finalization
    s7: false, // 14:45–15:30 — Final Project Testing
    s8: false, // 15:45–16:30 — MERN Interview Simulation
    s9: false, // 16:30–17:00 — Final Revision
    s10: false, // 17:00–17:30 — Final Project: MERN Student Manager
  });

  const [confidence, setConfidence] = useState<number>(5);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const toggleTask = (id: string) => {
    setTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(tasks).filter(Boolean).length;
  const totalTasks = Object.keys(tasks).length;

  return (
    <div className="mt-4 rounded-2xl border border-amber-500/30 bg-card/40 p-5 backdrop-blur-md relative overflow-hidden">
      {/* Celebration Accent Background */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-theme/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              30-Day StudyQuest Final Completion Checklist <PartyPopper size={16} className="text-amber-400" />
            </h3>
            <p className="text-xs text-text-secondary">
              Congratulations! Verify all 30-day curriculum benchmarks and record final 100% completion
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {completedCount}/{totalTasks} Final Tasks Completed
          </span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {[
          { id: "s1", label: "09:00–09:20 — DSA Final Revision (Patterns & Time/Space Complexities)" },
          { id: "s2", label: "09:20–10:00 — DSA Pattern Challenge (2 Pointers, Binary Search, Kadane)" },
          { id: "s3", label: "10:15–11:00 — Final DSA Mock Interview (5 Core Interview Problems Solved)" },
          { id: "s4", label: "11:00–12:00 — Final DSA Assessment (2 Timed Problems & Weak Topics Logged)" },
          { id: "s5", label: "12:00–12:15 — DSA Final Cheat Sheet (Master Pattern & Edge Case Matrix)" },
          { id: "s6", label: "14:00–14:45 — MERN Project Finalization (React, Express, MongoDB, JWT)" },
          { id: "s7", label: "14:45–15:30 — Final Project Testing (Full Auth, CRUD, Search & Persistence)" },
          { id: "s8", label: "15:45–16:30 — MERN Interview Simulation (End-to-End API Walkthrough)" },
          { id: "s9", label: "16:30–17:00 — Final Revision (DSA, JS, React, Node, Express, MongoDB, Auth)" },
          { id: "s10", label: "17:00–17:30 — Final Project: MERN Student Manager Presentation Release" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => toggleTask(item.id)}
            className={`flex items-start gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
              tasks[item.id]
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300 font-medium"
                : "bg-background/40 border-border-theme text-text-secondary hover:border-border-theme/80"
            }`}
          >
            {tasks[item.id] ? (
              <CheckSquare size={16} className="text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Square size={16} className="text-text-muted shrink-0 mt-0.5" />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Rating & Submission */}
      <div className="mt-5 pt-4 border-t border-border-theme/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-text-primary block mb-1">
            Overall 30-Day Placement Readiness Rating:
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setConfidence(star)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  confidence >= star
                    ? "bg-amber-500 text-white shadow-sm"
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
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold h-9 text-xs rounded-xl px-5"
        >
          <Trophy size={14} className="mr-1.5" /> Complete 30-Day StudyQuest Journey
        </Button>
      </div>

      {submitted && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-300 font-medium flex items-center gap-3 animate-fade-in shadow-md">
          <PartyPopper size={22} className="text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-400 block text-sm">🏆 30-Day StudyQuest Completed Successfully!</span>
            <span>You have completed the entire DSA & Full-Stack MERN placement roadmap. 100% Curriculum Coverage Reached!</span>
          </div>
        </div>
      )}

      {/* Final 100% Curriculum Progress Bar */}
      <div className="mt-6 rounded-xl border border-amber-500/30 bg-background/60 p-4">
        <div className="text-xs font-bold text-text-primary mb-2 flex items-center justify-between">
          <span>Curriculum Coverage Benchmark (Final Milestone)</span>
          <span className="text-amber-400 font-mono font-bold">100%</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 font-mono">
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">DSA Coverage</span>
            <span className="font-bold text-blue-400">100%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">WebDev / MERN Coverage</span>
            <span className="font-bold text-emerald-400">100%</span>
          </div>
          <div className="rounded-lg bg-card/60 p-2 border border-border-theme/40">
            <span className="text-text-muted block text-[10px]">Overall Progress</span>
            <span className="font-bold text-amber-400">100%</span>
          </div>
        </div>

        {/* 100% Visual Progress Bar */}
        <div className="font-mono text-xs text-amber-400 bg-black/40 p-2.5 rounded-lg border border-amber-500/30 text-center tracking-widest font-bold">
          ████████████████████ (100%)
        </div>
      </div>
    </div>
  );
}
