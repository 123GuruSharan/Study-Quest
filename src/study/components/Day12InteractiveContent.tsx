"use client";

import React, { useState } from "react";
import {
  Code2,
  Play,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Clock,
  Send,
  RefreshCw,
  CheckSquare,
  Square,
  Flame,
  Zap,
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
    id: "group-anagrams",
    name: "1. Group Anagrams (Basic Approach)",
    statement: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    example: {
      input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
      output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    },
    hint: "Use a Hash Map where the key is either the sorted string or a 26-element character frequency count tuple.",
    expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
    complexity: {
      time: "O(N * K log K) with sorting OR O(N * K) with frequency counting",
      space: "O(N * K) to store the grouped anagram strings in the hash map",
    },
    defaultCode: `function groupAnagrams(strs) {
  const map = {};
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }
  return Object.values(map);
}

// Test call
groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "longest-palindromic-substring",
    name: "2. Longest Palindromic Substring",
    statement: "Given a string `s`, return the longest palindromic substring in `s` using expand-around-center intuition.",
    example: {
      input: 's = "babad"',
      output: '"bab" (or "aba")',
    },
    hint: "Brute-force checks O(N²) substrings in O(N³) time. Expand-around-center checks 2N-1 centers in O(N²) time and O(1) space.",
    expectedOutput: '"bab" or "aba"',
    complexity: {
      time: "O(N²) — Expanding around each character / pair of characters",
      space: "O(1) — Constant extra memory (in-place center expansion)",
    },
    defaultCode: `function longestPalindrome(s) {
  if (!s || s.length < 1) return "";
  let start = 0, end = 0;

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    const len1 = expand(i, i);
    const len2 = expand(i, i + 1);
    const len = Math.max(len1, len2);
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}

// Test call
longestPalindrome("babad");`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return longestPalindrome("babad");`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "string-compression",
    name: "3. String Compression",
    statement: "Given an array of characters `chars`, compress it in-place using run-length encoding. Return the new length.",
    example: {
      input: 'chars = ["a","a","b","b","c","c","c"]',
      output: '6, chars = ["a","2","b","2","c","3"]',
    },
    hint: "Use two pointers: `read` pointer iterates through the original array and counts consecutive identical chars; `write` pointer overwrites `chars` in-place.",
    expectedOutput: '6 (Updated chars: ["a","2","b","2","c","3"])',
    complexity: {
      time: "O(N) — Single pass over input character array",
      space: "O(1) — In-place array mutation without extra buffers",
    },
    defaultCode: `function compress(chars) {
  let write = 0, read = 0;
  while (read < chars.length) {
    const char = chars[read];
    let count = 0;
    while (read < chars.length && chars[read] === char) {
      read++;
      count++;
    }
    chars[write++] = char;
    if (count > 1) {
      for (const c of String(count)) {
        chars[write++] = c;
      }
    }
  }
  return write;
}

const testChars = ["a","a","b","b","c","c","c"];
const len = compress(testChars);
({ length: len, chars: testChars.slice(0, len) });`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; const testChars = ["a","a","b","b","c","c","c"]; const len = compress(testChars); return { newLength: len, compressedArray: testChars.slice(0, len) };`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "check-rotation",
    name: "4. Check Rotation of String",
    statement: "Given two strings `s1` and `s2`, return `true` if `s2` is a rotation of `s1`.",
    example: {
      input: 's1 = "waterbottle", s2 = "erbottlewat"',
      output: "true",
    },
    hint: "If s1 and s2 have equal lengths, s2 will always be a substring of (s1 + s1).",
    expectedOutput: "true",
    complexity: {
      time: "O(N) — Concatenation & string search",
      space: "O(N) — Memory to store concatenated s1 + s1 string",
    },
    defaultCode: `function isRotation(s1, s2) {
  if (s1.length !== s2.length || s1.length === 0) return false;
  return (s1 + s1).includes(s2);
}

// Test call
isRotation("waterbottle", "erbottlewat");`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return isRotation("waterbottle", "erbottlewat");`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
  {
    id: "count-and-say",
    name: "5. Count and Say (Pattern Only)",
    statement: "The count-and-say sequence is defined recursively: countAndSay(1) = '1', and countAndSay(n) is run-length encoding of countAndSay(n-1).",
    example: {
      input: "n = 4",
      output: '"1211" (Sequence: "1" -> "11" -> "21" -> "1211")',
    },
    hint: "Iterate over the previous string, count consecutive identical digits, and append `[count][digit]`.",
    expectedOutput: '"1211"',
    complexity: {
      time: "O(2^N) worst-case sequence growth",
      space: "O(2^N) auxiliary string space",
    },
    defaultCode: `function countAndSay(n) {
  if (n === 1) return "1";
  let prev = "1";
  for (let i = 2; i <= n; i++) {
    let curr = "";
    let count = 1;
    for (let j = 0; j < prev.length; j++) {
      if (prev[j] === prev[j + 1]) {
        count++;
      } else {
        curr += count + prev[j];
        count = 1;
      }
    }
    prev = curr;
  }
  return prev;
}

// Test call for n = 4
countAndSay(4);`,
    testRunner: (code) => {
      try {
        const fn = new Function(`${code}; return countAndSay(4);`);
        const res = fn();
        return { success: true, output: JSON.stringify(res) };
      } catch (err: any) {
        return { success: false, output: `Error: ${err.message}` };
      }
    },
  },
];

export function Day12DsaProblemsWidget() {
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
          <Code2 className="text-accent shrink-0" size={18} />
          <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Day 12 DSA Problem Workbench (5 Core String Problems)
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
          aria-label="DSA Code Area"
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
// 2. String Final Cheat Sheet Widget (Session 5: 12:00-12:15)
// ---------------------------------------------------------------------------

export function Day12CheatSheetWidget() {
  return (
    <div className="mt-4 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h4 className="font-extrabold text-sm text-purple-200 uppercase tracking-wider">
            String Final Cheat Sheet & Complexity Rules
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          12:00–12:15
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            1. Character Frequency Counts
          </div>
          <p className="text-text-secondary">
            Use <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">freq[26]</code> array for lowercase English OR <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">unordered_map</code> for arbitrary characters.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N) | Space: O(26) or O(K)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            2. Opposite Ends / Converging
          </div>
          <p className="text-text-secondary">
            Use <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">Two Pointers</code> (left = 0, right = n - 1) for palindrome checks, string reversals, and character swaps.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N) | Space: O(1) in-place
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            3. Prefix Comparison
          </div>
          <p className="text-text-secondary">
            Compare strings starting from index 0 for Longest Common Prefix (LCP), Trie matching, and string rotation checks.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N * M) | Space: O(1)
          </div>
        </div>

        <div className="bg-card/60 backdrop-blur-xs border border-border-theme p-3 rounded-xl space-y-1">
          <div className="font-bold text-accent text-[11px] uppercase tracking-wider">
            4. Palindrome Center Expansion
          </div>
          <p className="text-text-secondary">
            Expand around odd (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">i, i</code>) and even (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-text-primary font-mono text-[11px]">i, i+1</code>) center pairs to find longest palindromes.
          </p>
          <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
            Time: O(N²) | Space: O(1)
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-700 dark:text-amber-300 flex items-center gap-2">
        <Zap size={16} className="shrink-0 text-amber-500" />
        <div>
          <span className="font-bold">Golden Interview Rule:</span> Always explain time and space complexity trade-offs for every solution before coding!
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Mini Project: Student Registration Form v2 Async Demo (Session 10: 17:00-17:30)
// ---------------------------------------------------------------------------

interface RegisteredStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  studentId: string;
  registeredAt: string;
}

export function Day12AsyncProjectWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("Full Stack MERN WebDev");
  const [studentId, setStudentId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [students, setStudents] = useState<RegisteredStudent[]>([
    {
      id: "std_101",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      course: "Full Stack MERN WebDev",
      studentId: "STU-2026-01",
      registeredAt: "10:15 AM",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    if (!name.trim() || !email.trim()) {
      setFeedback({ type: "error", message: "Please fill in all required fields (Name & Email)." });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    // Simulate async network request using Promise + setTimeout
    new Promise<RegisteredStudent>((resolve, reject) => {
      setTimeout(() => {
        if (email.includes("@")) {
          resolve({
            id: `std_${Date.now()}`,
            name,
            email,
            course,
            studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
            registeredAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        } else {
          reject(new Error("Invalid email domain server validation."));
        }
      }, 1500);
    })
      .then((newStudent) => {
        setIsLoading(false);
        setStudents((prev) => [newStudent, ...prev]);
        setFeedback({ type: "success", message: `Student ${newStudent.name} registered successfully via async Promise!` });
        setName("");
        setEmail("");
        setStudentId("");
      })
      .catch((err) => {
        setIsLoading(false);
        setFeedback({ type: "error", message: err.message || "Failed to submit form." });
      });
  };

  return (
    <div className="mt-4 bg-card border-2 border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-4 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <Send className="text-amber-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Student Registration Form v2 — Async Submission Upgrade
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Simulates Promise + setTimeout async network request, loading state, e.preventDefault(), and dynamic DOM rendering.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          Mini Project 17:00–17:30
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-border-theme">
          <h5 className="font-bold text-xs uppercase tracking-wider text-text-primary">
            Register New Student (Form)
          </h5>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary mb-1">Student Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Rohan Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-text-secondary mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. rohan@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Course Track</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                disabled={isLoading}
                className="w-full h-8 px-2 rounded-lg border border-border-theme bg-card text-[11px] text-text-primary focus:border-accent focus:outline-none"
              >
                <option value="Full Stack MERN WebDev">Full Stack MERN</option>
                <option value="DSA & Placement Prep">DSA Masterclass</option>
                <option value="System Design">System Design</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-secondary mb-1">Student ID (Optional)</label>
              <input
                type="text"
                placeholder="STU-9901"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading}
                className="w-full h-8 px-3 rounded-lg border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-2.5 rounded-lg border font-medium text-[11px] ${
                feedback.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-9 text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isLoading ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Submitting Asynchronously (Promise)...
              </>
            ) : (
              <>
                <Send size={14} /> Submit Async Form (No Page Reload)
              </>
            )}
          </Button>
        </form>

        {/* Dynamic Registered Students Container */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-xs uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" /> Registered Students ({students.length})
            </h5>
            <span className="text-[10px] text-text-secondary font-mono">Dynamic DOM Render</span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {students.map((st) => (
              <div
                key={st.id}
                className="bg-card border border-border-theme/80 rounded-xl p-3 shadow-2xs space-y-1 animate-[fadeIn_200ms_ease]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-text-primary">{st.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent font-mono text-[10px] font-bold">
                    {st.studentId}
                  </span>
                </div>
                <div className="text-[11px] text-text-secondary flex items-center justify-between">
                  <span>{st.email}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">{st.registeredAt}</span>
                </div>
                <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pt-0.5">
                  {st.course}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Day 12 Final Checklist & Progress Display Widget (Session 11: 17:30-17:45)
// ---------------------------------------------------------------------------

const day12ChecklistItems = [
  "09:00–09:20 — String Revision (Traversal, frequency, two pointers, prefix patterns, ASCII math, complexity)",
  "09:20–10:00 — String Problem-Solving Patterns (Frequency array vs hashmap, two pointers, prefix, mapping)",
  "10:15–11:00 — String Practice (Anagram pattern, unique/repeating chars, LCP, palindrome variations)",
  "11:00–12:00 — DSA Problems (Group Anagrams, Longest Palindrome, String Compression, Rotation, Count & Say)",
  "12:00–12:15 — String Final Cheat Sheet (Frequency, Two Pointers, Prefix, Palindrome expansion rules)",
  "14:00–14:45 — Async JavaScript Basics (Call stack, event loop, setTimeout, callbacks, why async is needed)",
  "14:45–15:30 — Promises (Promise states, resolve/reject, .then, .catch, .finally, create & consume Promise)",
  "15:45–16:30 — Fetch API (fetch(), request/response flow, response.json(), error handling, DOM rendering)",
  "16:30–17:00 — Interview Recall (Self-test 5 core Async JS & Fetch placement questions)",
  "17:00–17:30 — Mini Project (Upgrade Student Registration Form v2 with Promise submission & loading UI)",
  "17:30–17:45 — Final Checklist & Progress Display (~40% curriculum coverage verified)",
];

export function Day12FinalChecklistWidget() {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedState((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalTasks = day12ChecklistItems.length;

  return (
    <div className="mt-4 bg-card border-2 border-indigo-500/30 rounded-2xl p-5 shadow-lg space-y-5 text-xs font-sans">
      <div className="flex items-center justify-between border-b border-border-theme pb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-500 shrink-0" size={18} />
          <div>
            <h4 className="font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Day 12 Final Checklist & Sequential Curriculum Progress
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
        {day12ChecklistItems.map((item, idx) => {
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

      {/* Progress Bars Section at Bottom of Day 12 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-500/40 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
          <span className="font-extrabold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Flame size={15} className="text-amber-400" /> Bottom of Day 12 Progress Summary
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400">Target Coverage: ~40%</span>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {/* DSA Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-blue-400">DSA Progress</span>
              <span className="font-bold text-blue-400">~40%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>

          {/* WebDev Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-emerald-400">WebDev/MERN Progress</span>
              <span className="font-bold text-emerald-400">~40%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>

          {/* Overall Metric */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-amber-400">Overall Curriculum Progress</span>
              <span className="font-bold text-amber-400">~40%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-gradient-to-r from-accent via-purple-500 to-amber-500 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>

          {/* Prompt Requested ASCII Progress Bar */}
          <div className="pt-2 text-center text-xs font-mono tracking-widest text-amber-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            Progress bar: <span className="font-bold">████████░░░░░░░░░░░░</span>
          </div>
        </div>
      </div>
    </div>
  );
}
