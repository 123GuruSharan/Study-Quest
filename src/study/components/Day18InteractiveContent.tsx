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
  ArrowUpDown,
  Filter,
  UserPlus,
  Mail,
  User,
  GraduationCap,
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
    id: "merge-two-sorted-arrays",
    name: "1. Merge Two Sorted Arrays",
    statement: "Given two sorted integer arrays `nums1` and `nums2`, merge them into a single sorted array in non-decreasing order and return it.",
    example: {
      input: "nums1 = [1, 3, 5, 7], nums2 = [2, 4, 6, 8]",
      output: "[1, 2, 3, 4, 5, 6, 7, 8]",
    },
    hint: "Use two pointers `i = 0` and `j = 0`. Compare `nums1[i]` and `nums2[j]`, pushing the smaller element to `res` until both arrays are exhausted.",
    expectedOutput: "[1,2,3,4,5,6,7,8]",
    complexity: {
      time: "O(N + M) Linear merge time",
      space: "O(N + M) Auxiliary result array",
    },
    defaultCode: `function mergeTwoSortedArrays(nums1, nums2) {
  let res = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      res.push(nums1[i++]);
    } else {
      res.push(nums2[j++]);
    }
  }
  while (i < nums1.length) res.push(nums1[i++]);
  while (j < nums2.length) res.push(nums2[j++]);
  return res;
}

// Test call
mergeTwoSortedArrays([1, 3, 5, 7], [2, 4, 6, 8]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return mergeTwoSortedArrays([1, 3, 5, 7], [2, 4, 6, 8]);`);
        const res = fn();
        const expected = [1, 2, 3, 4, 5, 6, 7, 8];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "merge-sort-implementation",
    name: "2. Merge Sort Implementation",
    statement: "Given an unsorted array `arr`, sort it in ascending order using the Merge Sort algorithm (Divide and Conquer). Return the sorted array.",
    example: {
      input: "arr = [38, 27, 43, 3, 9, 82, 10]",
      output: "[3, 9, 10, 27, 38, 43, 82]",
    },
    hint: "If `arr.length <= 1`, return `arr`. Divide array at `mid = Math.floor(arr.length / 2)`, recursively sort `left` and `right` halves, then merge them using helper.",
    expectedOutput: "[3,9,10,27,38,43,82]",
    complexity: {
      time: "O(N log N) for all cases (Worst, Avg, Best)",
      space: "O(N) Auxiliary space for call stack & merge arrays",
    },
    defaultCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Merge helper
  let res = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}

// Test call
mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return mergeSort([38, 27, 43, 3, 9, 82, 10]);`);
        const res = fn();
        const expected = [3, 9, 10, 27, 38, 43, 82];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sort-characters-by-frequency",
    name: "3. Sort Characters by Frequency",
    statement: "Given a string `s`, sort it in decreasing order based on the frequency of characters and return the sorted string.",
    example: {
      input: "s = 'tree'",
      output: "'eert' (or 'eetr')",
    },
    hint: "Build character frequency hashmap. Convert to `[char, freq]` pairs, sort pairs by frequency descending, then repeat characters.",
    expectedOutput: "\"eert\"",
    complexity: {
      time: "O(N + K log K) where K is unique character count",
      space: "O(K) Auxiliary frequency map memory",
    },
    defaultCode: `function frequencySort(s) {
  const map = {};
  for (const char of s) {
    map[char] = (map[char] || 0) + 1;
  }
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return sorted.map(([char, count]) => char.repeat(count)).join("");
}

// Test call
frequencySort("tree");`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return frequencySort("tree");`);
        const res = fn();
        const validOutputs = ["eert", "eetr"];
        const isMatch = typeof res === "string" && validOutputs.includes(res);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "sort-array-by-parity",
    name: "4. Sort Array by Parity",
    statement: "Given an integer array `nums`, move all even integers to the beginning of the array followed by all odd integers. Return the partitioned array.",
    example: {
      input: "nums = [3, 1, 2, 4]",
      output: "[2, 4, 3, 1] (or any even-first arrangement)",
    },
    hint: "Two pointers: `left = 0`, `right = n - 1`. If `nums[left]` is odd and `nums[right]` is even, swap them. Move `left` right if even, move `right` left if odd.",
    expectedOutput: "[2,4,3,1]",
    complexity: {
      time: "O(N) Two pointer single-pass",
      space: "O(1) In-place array modification",
    },
    defaultCode: `function sortArrayByParity(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    if (nums[left] % 2 > nums[right] % 2) {
      let temp = nums[left];
      nums[left] = nums[right];
      nums[right] = temp;
    }
    if (nums[left] % 2 === 0) left++;
    if (nums[right] % 2 === 1) right--;
  }
  return nums;
}

// Test call
sortArrayByParity([3, 1, 2, 4]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return sortArrayByParity([3, 1, 2, 4]);`);
        const res = fn();
        const isMatch = Array.isArray(res) && res.slice(0, 2).every((x: number) => x % 2 === 0);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "intersection-of-two-arrays",
    name: "5. Intersection of Two Arrays",
    statement: "Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique.",
    example: {
      input: "nums1 = [1, 2, 2, 1], nums2 = [2, 2]",
      output: "[2]",
    },
    hint: "Use a `Set` for `nums1`. Filter elements of `nums2` that exist in `set1`, then convert back to an array.",
    expectedOutput: "[2]",
    complexity: {
      time: "O(N + M) Set lookup time",
      space: "O(N + M) Auxiliary memory for Set",
    },
    defaultCode: `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();
  for (const num of nums2) {
    if (set1.has(num)) {
      result.add(num);
    }
  }
  return Array.from(result);
}

// Test call
intersection([1, 2, 2, 1], [2, 2]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return intersection([1, 2, 2, 1], [2, 2]);`);
        const res = fn();
        const expected = [2];
        const isMatch = Array.isArray(res) && JSON.stringify(res) === JSON.stringify(expected);
        return { success: isMatch, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day18DsaProblemsWidget() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>("merge-two-sorted-arrays");
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
            Day 18 — Sorting Patterns & Merge Sort Sandbox
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
// 2. Sorting & React Forms Cheat Sheet (Session 6: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day18CheatSheetWidget() {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-border-theme pb-3">
        <Sparkles className="text-amber-500 w-5 h-5" />
        <h3 className="font-bold text-text-primary text-base">
          Day 18 — Sorting Patterns & React Forms Cheat Sheet
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Sorting Patterns Cheat Sheet */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
          <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <ArrowUpDown size={14} /> Sorting Algorithms Cheat Sheet
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">1.</span>
              <span><strong>Adjacent Swaps → Bubble:</strong> $O(N^2)$ worst, $O(N)$ best with swapped flag.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">2.</span>
              <span><strong>Minimum Selection → Selection:</strong> $O(N^2)$ always, $O(N)$ swaps.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">3.</span>
              <span><strong>Sorted Prefix Insertion → Insertion:</strong> $O(N^2)$ worst, $O(N)$ best for nearly sorted data.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">4.</span>
              <span><strong>Divide + Merge → Merge Sort:</strong> $O(N \log N)$ time, $O(N)$ space, stable sort.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-accent font-bold">5.</span>
              <span><strong>Custom Order → Comparator:</strong> <code>arr.sort((a, b) =&gt; a.val - b.val)</code>.</span>
            </li>
          </ul>
        </div>

        {/* React Forms & Lists Rules */}
        <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2">
          <h4 className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <Atom size={14} /> React Forms & Lists Rules
          </h4>
          <ul className="space-y-1.5 text-text-secondary">
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">1.</span>
              <span><strong>Controlled Form Inputs:</strong> Pair <code>value={"{formState}"}</code> with <code>onChange</code> handler.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">2.</span>
              <span><strong>Form Handling & Validation:</strong> Call <code>e.preventDefault()</code> on submit & validate required fields before state append.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">3.</span>
              <span><strong>Form Reset:</strong> Reset state variables back to initial empty values after successful submission.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="font-mono text-purple-500 font-bold">4.</span>
              <span><strong>Empty-State UI:</strong> Render friendly fallback container when list array length is 0.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Registration & Directory Form Hub v7 (Session 13: 17:00-17:30)
// ---------------------------------------------------------------------------

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
}

// Reusable StudentCard
function StudentCard({ student }: { student: Student }) {
  return (
    <div className="p-3.5 rounded-xl bg-card border border-border-theme hover:border-accent/40 transition-all shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
          <User size={14} className="text-accent" /> {student.name}
        </h5>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
          Age: {student.age}
        </span>
      </div>

      <div className="space-y-1 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 truncate">
          <Mail size={12} className="text-text-secondary shrink-0" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GraduationCap size={12} className="text-text-secondary shrink-0" />
          <span className="font-semibold text-text-primary">{student.course}</span>
        </div>
      </div>
    </div>
  );
}

// Reusable StudentList with empty state UI
function StudentList({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-dashed border-border-theme bg-slate-50 dark:bg-slate-900/40 space-y-2">
        <UserPlus size={24} className="mx-auto text-text-secondary opacity-60" />
        <h5 className="font-bold text-text-primary text-sm">No Students Found</h5>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          No student records match your query, or no students have been registered yet. Use the form above to add a new student!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export function Day18AsyncProjectWidget() {
  const [students, setStudents] = useState<Student[]>([
    { id: 101, name: "Rahul Sharma", email: "rahul.sharma@example.com", age: 21, course: "Data Structures & Merge Sort" },
    { id: 102, name: "Priya Patel", email: "priya.patel@example.com", age: 22, course: "React & Next.js Forms" },
    { id: 103, name: "Aman Verma", email: "aman.verma@example.com", age: 20, course: "Full Stack MERN" },
  ]);

  // Controlled Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    course: "React & Next.js Forms",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, age, course } = formData;

    // Form Validation
    if (!name.trim()) {
      setErrorMsg("Please enter the student's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!age || parseInt(age) < 15 || parseInt(age) > 100) {
      setErrorMsg("Please enter a valid age between 15 and 100.");
      return;
    }

    // Add new student
    const newStudent: Student = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      age: parseInt(age),
      course: course.trim(),
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Reset Form
    setFormData({
      name: "",
      email: "",
      age: "",
      course: "React & Next.js Forms",
    });
    setErrorMsg("");
    setSuccessMsg(`Successfully added student ${newStudent.name}!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4 p-4 rounded-2xl bg-card border border-border-theme shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Layers className="text-accent w-5 h-5" />
          <div>
            <h3 className="font-bold text-text-primary text-base">
              React Mini Project: Student Registration & Directory Form Hub v7
            </h3>
            <p className="text-xs text-text-secondary">
              Controlled Form (`useState` + `onSubmit`), Validation, Form Reset, Live Search & Empty State UI
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Interactive Form Demo
        </span>
      </div>

      {/* Student Registration Form */}
      <form onSubmit={handleFormSubmit} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus size={14} className="text-accent" /> Add Student (Controlled Form)
          </span>
          {errorMsg && (
            <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
              <AlertCircle size={13} /> {errorMsg}
            </span>
          )}
          {successMsg && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 size={13} /> {successMsg}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Student Name *"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="number"
            name="age"
            placeholder="Age *"
            value={formData.age}
            onChange={handleInputChange}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            min="15"
            max="100"
          />
          <select
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            className="p-2 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="React & Next.js Forms">React & Next.js Forms</option>
            <option value="Data Structures & Merge Sort">Data Structures & Merge Sort</option>
            <option value="Full Stack MERN">Full Stack MERN</option>
            <option value="System Design">System Design</option>
          </select>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            className="bg-accent hover:bg-accent/90 text-white font-bold h-8 px-4 text-xs rounded-lg flex items-center gap-1.5"
          >
            <Plus size={14} /> Register Student
          </Button>
        </div>
      </form>

      {/* Directory Search & List */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-2.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name, email or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-card border border-border-theme text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <span className="text-xs text-text-secondary font-mono">
            Showing <strong className="text-accent font-bold">{filteredStudents.length}</strong> of <strong className="text-text-primary">{students.length}</strong> records
          </span>
        </div>

        <StudentList students={filteredStudents} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Final Checklist & Progress Display (Session 14: 17:30-17:45)
// ---------------------------------------------------------------------------

export function Day18FinalChecklistWidget() {
  const { studyBlocksByDay, updateBlockStatus } = useStudyStore();
  const day18Blocks = studyBlocksByDay[18] || [];
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});

  const tasksList = [
    { id: "d18_block_1", label: "09:00–09:20 — Sorting Revision (Bubble, Selection, Insertion complexities, stability)" },
    { id: "d18_block_2", label: "09:20–10:00 — Merge Sort (Divide & conquer, split-sort-merge, O(n log n) time, dry-run)" },
    { id: "d18_block_4", label: "10:15–11:00 — Sorting Patterns (Custom comparisons, comparator functions, sorting pairs)" },
    { id: "d18_block_5", label: "11:00–12:00 — DSA Problems (Merge Two Sorted Arrays, Merge Sort, Sort by Freq, Parity, Intersection)" },
    { id: "d18_block_6", label: "12:00–12:15 — Sorting Cheat Sheet (Algorithm decision trees & time/space bounds)" },
    { id: "d18_block_8", label: "14:00–14:45 — React Forms (Controlled inputs, value + onChange, multiple state fields)" },
    { id: "d18_block_9", label: "14:45–15:30 — Form Handling (onSubmit, preventDefault(), validation, form reset)" },
    { id: "d18_block_11", label: "15:45–16:30 — React Lists (map(), keys, filtering, conditional rendering, empty-state UI)" },
    { id: "d18_block_12", label: "16:30–17:00 — Interview Recall (5 Core React Forms & Lists placement questions)" },
    { id: "d18_block_13", label: "17:00–17:30 — Mini Project (Add Student Controlled Form + Search + Empty-State UI)" },
  ];

  const toggleTask = (id: string) => {
    const isDone = getBlockDone(id);
    const newStatus = isDone ? "Not Started" : "Completed";
    updateBlockStatus(id, newStatus);
    setCheckedState((prev) => ({ ...prev, [id]: !isDone }));
  };

  const getBlockDone = (id: string) => {
    if (checkedState[id] !== undefined) return checkedState[id];
    const found = day18Blocks.find((b) => b.id === id);
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
            Day 18 — Final Checklist & Progress Summary
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
            <Award size={14} /> Day 18 Curriculum Progress Metrics
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">~60% Overall</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DSA Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~60%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">WebDev / MERN Coverage:</span>
            <span className="font-mono font-bold text-slate-200">~60%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Overall Progress:</span>
            <span className="font-mono font-bold text-slate-200">~60%</span>
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-slate-400 mb-1">Progress Bar:</div>
            <div className="font-mono text-emerald-400 font-bold tracking-widest text-sm bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
              ████████████░░░░░░░░
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
