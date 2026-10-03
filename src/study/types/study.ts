export type StudySubject = "DSA" | "WEBDEV" | "INTERVIEW" | "PROJECT" | "REVIEW";

export type SessionStatus = "Not Started" | "In Progress" | "Completed" | "Needs Revision" | "Skipped";

export interface StudyProblemReference {
  id: string;
  name: string;
  url?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface StudyBlock {
  id: string;
  subject: StudySubject;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "09:20"
  durationMinutes: number;
  title: string;
  topic: string;
  description: string;
  learnPoints: string[];
  action?: string;
  codeTasks: string[];
  problems: StudyProblemReference[];
  interviewQuestions: string[];
  status: SessionStatus;
  completedAt?: string;
  actualTimeSpentSeconds: number;
}

export interface ActiveSession {
  blockId: string;
  startTime: number; // Unix timestamp
  elapsedSeconds: number;
  isPaused: boolean;
}

export type DsaMasteryLevel = 1 | 2 | 3 | 4 | 5;

export interface DsaTopic {
  id: string;
  category:
    | "Foundations"
    | "Arrays & Strings"
    | "Hashing"
    | "Linked List"
    | "Stack & Queue"
    | "Trees"
    | "Heap"
    | "Greedy"
    | "Graphs"
    | "Dynamic Programming"
    | "Trie";
  name: string;
  description: string;
  masteryLevel: DsaMasteryLevel;
  keyConcepts: string[];
  sampleCode?: string;
  notes?: string;
}

export interface DsaProblem {
  id: string;
  name: string;
  platform: "LeetCode" | "GeeksforGeeks" | "CodeStudio" | "HackerRank" | "Other";
  url: string;
  topic: string;
  pattern: string;
  difficulty: "Easy" | "Medium" | "Hard";
  attempted: boolean;
  solved: boolean;
  timeTakenMinutes: number;
  approach: string;
  mistakes: string;
  timeComplexity: string;
  spaceComplexity: string;
  confidenceRating: number; // 1-5
  revisionDate: string;
  needsRevision: boolean;
}

export interface WebDevTopic {
  id: string;
  category: "JavaScript" | "React" | "Node.js" | "Express.js" | "MongoDB" | "MERN";
  title: string;
  description: string;
  completed: boolean;
  keyTakeaways: string[];
  codeSnippet?: string;
  notes?: string;
}

export interface ProjectInterviewQuestion {
  id: string;
  question: string;
  suggestedAnswer: string;
  userNotes?: string;
}

export interface WebDevProject {
  id: string;
  name: string;
  techStack: string[];
  description: string;
  features: string[];
  progressPercentage: number;
  githubUrl: string;
  liveUrl: string;
  bugs: string[];
  remainingFeatures: string[];
  interviewQuestions: ProjectInterviewQuestion[];
}

export interface DailyReview {
  id: string;
  date: string;
  studyTimeMinutes: number;
  dsaAttempted: number;
  dsaSolved: number;
  webdevTopicsCompleted: number;
  confidenceRating: number; // 1-5
  strugglesText: string;
  revisionTopicIds: string[];
  createdAt: string;
}
