import { create } from "zustand";
import {
  StudyBlock,
  ActiveSession,
  DsaTopic,
  DsaProblem,
  WebDevTopic,
  WebDevProject,
  DailyReview,
  SessionStatus,
  DsaMasteryLevel,
} from "../types/study";
import {
  initialStudyBlocks,
  day2StudyBlocks,
  day3StudyBlocks,
  day4StudyBlocks,
  day5StudyBlocks,
  day6StudyBlocks,
  day7StudyBlocks,
  day8StudyBlocks,
  day9StudyBlocks,
  day10StudyBlocks,
  day11StudyBlocks,
  day12StudyBlocks,
  day13StudyBlocks,
  day14StudyBlocks,
  day15StudyBlocks,
  day16StudyBlocks,
  day17StudyBlocks,
  day18StudyBlocks,
  day19StudyBlocks,
  day20StudyBlocks,
  day21StudyBlocks,
  day22StudyBlocks,
  day23StudyBlocks,
  day24StudyBlocks,
  day25StudyBlocks,
  day26StudyBlocks,
  day27StudyBlocks,
  day28StudyBlocks,
  day29StudyBlocks,
  day30StudyBlocks,
  getStudyBlocksForDay,
  initialDsaTopics,
  initialDsaProblems,
  initialWebDevTopics,
  initialProjects,
} from "../data/initialStudyData";
import { useUserStore } from "@/stores/userStore";
import { useToastStore } from "@/stores/toastStore";

export type StudyTab = "today" | "dsa" | "webdev" | "problems" | "projects" | "progress";

interface StudyState {
  activeTab: StudyTab;
  currentDay: number;
  studyBlocks: StudyBlock[];
  studyBlocksByDay: Record<number, StudyBlock[]>;
  activeSession: ActiveSession | null;
  dsaTopics: DsaTopic[];
  dsaProblems: DsaProblem[];
  webdevTopics: WebDevTopic[];
  projects: WebDevProject[];
  dailyReviews: DailyReview[];
  isReviewModalOpen: boolean;

  // Actions
  setActiveTab: (tab: StudyTab) => void;
  setCurrentDay: (day: number) => void;
  setReviewModalOpen: (open: boolean) => void;

  // Session timer actions
  startSession: (blockId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (blockId: string) => Promise<void>;
  extendSession: (minutes: number) => void;
  updateBlockStatus: (blockId: string, status: SessionStatus) => void;
  moveBlockToTomorrow: (blockId: string) => void;

  // DSA Topic Actions
  updateDsaTopicMastery: (topicId: string, level: DsaMasteryLevel) => void;
  updateDsaTopicNotes: (topicId: string, notes: string) => void;

  // DSA Problems Actions
  addDsaProblem: (problem: Omit<DsaProblem, "id">) => Promise<void>;
  updateDsaProblem: (id: string, updates: Partial<DsaProblem>) => void;
  toggleDsaProblemSolved: (id: string) => Promise<void>;
  toggleDsaProblemRevision: (id: string) => void;

  // WebDev Topics Actions
  toggleWebDevTopic: (topicId: string) => void;

  // Projects Actions
  addProject: (project: Omit<WebDevProject, "id">) => void;
  updateProject: (id: string, updates: Partial<WebDevProject>) => void;
  addProjectInterviewQuestion: (projectId: string, question: string, suggestedAnswer: string) => void;

  // Daily Review Action
  submitDailyReview: (reviewData: {
    studyTimeMinutes: number;
    dsaAttempted: number;
    dsaSolved: number;
    webdevTopicsCompleted: number;
    confidenceRating: number;
    strugglesText: string;
    revisionTopicIds: string[];
  }) => Promise<void>;

  // Reset actions
  resetDayProgress: (dayToReset?: number) => void;
  resetAllStudyData: () => void;

  // Storage Persistence Helper
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = "studyquest_study_data_v1";

export const useStudyStore = create<StudyState>((set, get) => ({
  activeTab: "today",
  currentDay: 1,
  studyBlocks: initialStudyBlocks,
  studyBlocksByDay: {
    1: initialStudyBlocks,
    2: day2StudyBlocks,
    3: day3StudyBlocks,
    4: day4StudyBlocks,
    5: day5StudyBlocks,
    6: day6StudyBlocks,
    7: day7StudyBlocks,
    8: day8StudyBlocks,
    9: day9StudyBlocks,
    10: day10StudyBlocks,
    11: day11StudyBlocks,
    12: day12StudyBlocks,
    13: day13StudyBlocks,
    14: day14StudyBlocks,
    15: day15StudyBlocks,
    16: day16StudyBlocks,
    17: day17StudyBlocks,
    18: day18StudyBlocks,
    19: day19StudyBlocks,
    20: day20StudyBlocks,
    21: day21StudyBlocks,
    22: day22StudyBlocks,
    23: day23StudyBlocks,
    24: day24StudyBlocks,
    25: day25StudyBlocks,
    26: day26StudyBlocks,
    27: day27StudyBlocks,
    28: day28StudyBlocks,
    29: day29StudyBlocks,
    30: day30StudyBlocks,
  },
  activeSession: null,
  dsaTopics: initialDsaTopics,
  dsaProblems: initialDsaProblems,
  webdevTopics: initialWebDevTopics,
  projects: initialProjects,
  dailyReviews: [],
  isReviewModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentDay: (day: number) => {
    const { studyBlocksByDay, currentDay, studyBlocks } = get();
    const updatedByDay = {
      ...studyBlocksByDay,
      [currentDay]: studyBlocks,
    };
    const targetBlocks = updatedByDay[day] || getStudyBlocksForDay(day);

    set({
      currentDay: day,
      studyBlocks: targetBlocks,
      studyBlocksByDay: {
        ...updatedByDay,
        [day]: targetBlocks,
      },
    });
    get().saveToStorage();
  },
  setReviewModalOpen: (open) => set({ isReviewModalOpen: open }),

  resetDayProgress: (dayToReset?: number) => {
    const targetDay = dayToReset || get().currentDay;
    const freshBlocks = getStudyBlocksForDay(targetDay).map((b) => ({
      ...b,
      status: "Not Started" as SessionStatus,
      completedAt: undefined,
      actualTimeSpentSeconds: 0,
    }));

    const { studyBlocksByDay, currentDay } = get();
    const updatedByDay = {
      ...studyBlocksByDay,
      [targetDay]: freshBlocks,
    };

    set({
      studyBlocks: targetDay === currentDay ? freshBlocks : get().studyBlocks,
      studyBlocksByDay: updatedByDay,
      activeSession: targetDay === currentDay ? null : get().activeSession,
    });

    get().saveToStorage();
    useToastStore.getState().showToast(`Reset Day ${targetDay} progress!`, "info", "Progress Reset");
  },

  resetAllStudyData: () => {
    const freshDay1 = getStudyBlocksForDay(1);
    set({
      currentDay: 1,
      studyBlocks: freshDay1,
      studyBlocksByDay: {
        1: freshDay1,
        2: day2StudyBlocks,
        3: day3StudyBlocks,
        4: day4StudyBlocks,
        5: day5StudyBlocks,
        6: day6StudyBlocks,
        7: day7StudyBlocks,
        8: day8StudyBlocks,
        9: day9StudyBlocks,
        10: day10StudyBlocks,
        11: day11StudyBlocks,
        12: day12StudyBlocks,
        13: day13StudyBlocks,
        14: day14StudyBlocks,
        15: day15StudyBlocks,
        16: day16StudyBlocks,
        17: day17StudyBlocks,
        18: day18StudyBlocks,
        19: day19StudyBlocks,
        20: day20StudyBlocks,
      },
      activeSession: null,
      dailyReviews: [],
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    useToastStore.getState().showToast("Reset all study data!", "info", "Store Reset");
  },

  startSession: (blockId: string) => {
    const { studyBlocks, activeSession } = get();
    const block = studyBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const updatedBlocks = studyBlocks.map((b) =>
      b.id === blockId ? { ...b, status: "In Progress" as SessionStatus } : b
    );

    const newActiveSession: ActiveSession = {
      blockId,
      startTime: Date.now(),
      elapsedSeconds: activeSession?.blockId === blockId ? activeSession.elapsedSeconds : 0,
      isPaused: false,
    };

    set({ studyBlocks: updatedBlocks, activeSession: newActiveSession });
    get().saveToStorage();
    useToastStore.getState().showToast(`Started study session: ${block.title}`, "info", "Session Started");
  },

  pauseSession: () => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({ activeSession: { ...activeSession, isPaused: true } });
    get().saveToStorage();
  },

  resumeSession: () => {
    const { activeSession } = get();
    if (!activeSession) return;
    set({ activeSession: { ...activeSession, isPaused: false } });
    get().saveToStorage();
  },

  completeSession: async (blockId: string) => {
    const { studyBlocks, activeSession } = get();
    const block = studyBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const elapsedSeconds = activeSession?.blockId === blockId ? activeSession.elapsedSeconds : block.durationMinutes * 60;
    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    const updatedBlocks = studyBlocks.map((b) =>
      b.id === blockId
        ? {
            ...b,
            status: "Completed" as SessionStatus,
            completedAt: new Date().toISOString(),
            actualTimeSpentSeconds: elapsedSeconds,
          }
        : b
    );

    const xpAwarded = Math.max(25, Math.round(actualMinutes * 2));
    const coinsAwarded = Math.max(10, Math.round(actualMinutes * 0.8));

    await useUserStore.getState().addXp(xpAwarded);
    await useUserStore.getState().addCoins(coinsAwarded);

    await useUserStore.getState().addJourneyEntry(
      `Completed: ${block.title}`,
      `Finished ${actualMinutes}m session (${block.subject} - ${block.topic}). Earned +${xpAwarded} XP and +${coinsAwarded} Coins.`,
      "other"
    );

    set({
      studyBlocks: updatedBlocks,
      activeSession: activeSession?.blockId === blockId ? null : activeSession,
    });

    get().saveToStorage();

    useToastStore.getState().showToast(
      `Session complete! Earned +${xpAwarded} XP & +${coinsAwarded} Coins!`,
      "success",
      "Session Completed 🎉"
    );
  },

  extendSession: (minutes: number) => {
    const { activeSession, studyBlocks } = get();
    if (!activeSession) return;

    const updatedBlocks = studyBlocks.map((b) =>
      b.id === activeSession.blockId
        ? { ...b, durationMinutes: b.durationMinutes + minutes }
        : b
    );

    set({ studyBlocks: updatedBlocks });
    get().saveToStorage();
    useToastStore.getState().showToast(`Session extended by +${minutes} minutes.`, "info", "Time Extended");
  },

  updateBlockStatus: (blockId: string, status: SessionStatus) => {
    const { studyBlocks, activeSession } = get();
    const updatedBlocks = studyBlocks.map((b) =>
      b.id === blockId ? { ...b, status } : b
    );

    set({
      studyBlocks: updatedBlocks,
      activeSession: activeSession?.blockId === blockId && status !== "In Progress" ? null : activeSession,
    });
    get().saveToStorage();
  },

  moveBlockToTomorrow: (blockId: string) => {
    const { studyBlocks, activeSession } = get();
    const block = studyBlocks.find((b) => b.id === blockId);
    if (!block) return;

    const updatedBlocks = studyBlocks.map((b) =>
      b.id === blockId ? { ...b, status: "Skipped" as SessionStatus } : b
    );

    set({
      studyBlocks: updatedBlocks,
      activeSession: activeSession?.blockId === blockId ? null : activeSession,
    });
    get().saveToStorage();
    useToastStore.getState().showToast(`Moved "${block.title}" to tomorrow's schedule.`, "info", "Schedule Updated");
  },

  updateDsaTopicMastery: (topicId: string, level: DsaMasteryLevel) => {
    const { dsaTopics } = get();
    const updated = dsaTopics.map((t) => (t.id === topicId ? { ...t, masteryLevel: level } : t));
    set({ dsaTopics: updated });
    get().saveToStorage();
    useToastStore.getState().showToast(`Topic mastery updated!`, "success", "Mastery Saved");
  },

  updateDsaTopicNotes: (topicId: string, notes: string) => {
    const { dsaTopics } = get();
    const updated = dsaTopics.map((t) => (t.id === topicId ? { ...t, notes } : t));
    set({ dsaTopics: updated });
    get().saveToStorage();
  },

  addDsaProblem: async (problemData) => {
    const { dsaProblems } = get();
    const newProblem: DsaProblem = {
      ...problemData,
      id: `prob_${Date.now()}`,
    };

    const updated = [newProblem, ...dsaProblems];
    set({ dsaProblems: updated });
    get().saveToStorage();

    if (newProblem.solved) {
      await useUserStore.getState().addXp(30);
      await useUserStore.getState().addCoins(15);
      useToastStore.getState().showToast("Problem added & marked solved! +30 XP", "success", "Problem Added");
    } else {
      useToastStore.getState().showToast("Problem added to tracker.", "info", "Problem Logged");
    }
  },

  updateDsaProblem: (id: string, updates: Partial<DsaProblem>) => {
    const { dsaProblems } = get();
    const updated = dsaProblems.map((p) => (p.id === id ? { ...p, ...updates } : p));
    set({ dsaProblems: updated });
    get().saveToStorage();
  },

  toggleDsaProblemSolved: async (id: string) => {
    const { dsaProblems } = get();
    const prob = dsaProblems.find((p) => p.id === id);
    if (!prob) return;

    const nextSolved = !prob.solved;
    const updated = dsaProblems.map((p) =>
      p.id === id ? { ...p, solved: nextSolved, attempted: true } : p
    );

    set({ dsaProblems: updated });
    get().saveToStorage();

    if (nextSolved) {
      const xpAmount = prob.difficulty === "Hard" ? 50 : prob.difficulty === "Medium" ? 35 : 20;
      const coinAmount = prob.difficulty === "Hard" ? 25 : prob.difficulty === "Medium" ? 15 : 10;
      await useUserStore.getState().addXp(xpAmount);
      await useUserStore.getState().addCoins(coinAmount);

      await useUserStore.getState().addJourneyEntry(
        `Solved DSA Problem: ${prob.name}`,
        `Solved ${prob.difficulty} problem on ${prob.platform} (${prob.pattern}). Earned +${xpAmount} XP.`,
        "achievement"
      );

      useToastStore.getState().showToast(`Solved "${prob.name}"! +${xpAmount} XP`, "success", "Problem Solved 🎯");
    }
  },

  toggleDsaProblemRevision: (id: string) => {
    const { dsaProblems } = get();
    const updated = dsaProblems.map((p) =>
      p.id === id ? { ...p, needsRevision: !p.needsRevision } : p
    );
    set({ dsaProblems: updated });
    get().saveToStorage();
  },

  toggleWebDevTopic: (topicId: string) => {
    const { webdevTopics } = get();
    const updated = webdevTopics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    set({ webdevTopics: updated });
    get().saveToStorage();
  },

  addProject: (projectData) => {
    const { projects } = get();
    const newProject: WebDevProject = {
      ...projectData,
      id: `proj_${Date.now()}`,
    };
    const updated = [newProject, ...projects];
    set({ projects: updated });
    get().saveToStorage();
    useToastStore.getState().showToast(`Project "${newProject.name}" created!`, "success", "Project Added");
  },

  updateProject: (id: string, updates: Partial<WebDevProject>) => {
    const { projects } = get();
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    set({ projects: updated });
    get().saveToStorage();
  },

  addProjectInterviewQuestion: (projectId: string, question: string, suggestedAnswer: string) => {
    const { projects } = get();
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const newQ = {
        id: `iq_${Date.now()}`,
        question,
        suggestedAnswer,
      };
      return {
        ...p,
        interviewQuestions: [...p.interviewQuestions, newQ],
      };
    });
    set({ projects: updated });
    get().saveToStorage();
  },

  submitDailyReview: async (reviewData) => {
    const { dailyReviews, currentDay, studyBlocksByDay } = get();
    const newReview: DailyReview = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      ...reviewData,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...dailyReviews];
    const nextDay = currentDay + 1;
    const nextDayBlocks = studyBlocksByDay[nextDay] || getStudyBlocksForDay(nextDay);

    await useUserStore.getState().addXp(100);
    await useUserStore.getState().addCoins(50);

    if (reviewData.studyTimeMinutes >= 30) {
      await useUserStore.getState().incrementStreak();
    }

    await useUserStore.getState().addJourneyEntry(
      `Day ${currentDay} Completed!`,
      `Logged ${reviewData.studyTimeMinutes} mins of study. Solved ${reviewData.dsaSolved} DSA problems. Self-rating: ${reviewData.confidenceRating}/5 stars.`,
      "streak"
    );

    set({
      dailyReviews: updatedReviews,
      currentDay: nextDay,
      studyBlocks: nextDayBlocks,
      isReviewModalOpen: false,
      activeSession: null,
    });

    get().saveToStorage();

    useToastStore.getState().showToast(
      `Day ${currentDay} Complete! Advanced to Day ${nextDay}! +100 XP Bonus!`,
      "success",
      "Day Completed 🚀"
    );
  },

  saveToStorage: () => {
    if (typeof window === "undefined") return;
    const {
      currentDay,
      studyBlocks,
      studyBlocksByDay,
      activeSession,
      dsaTopics,
      dsaProblems,
      webdevTopics,
      projects,
      dailyReviews,
    } = get();

    const data = {
      currentDay,
      studyBlocks,
      studyBlocksByDay: {
        ...studyBlocksByDay,
        [currentDay]: studyBlocks,
      },
      activeSession,
      dsaTopics,
      dsaProblems,
      webdevTopics,
      projects,
      dailyReviews,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist study data to localStorage:", e);
    }
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const cDay = parsed.currentDay || 1;
      const byDay = parsed.studyBlocksByDay || {};
      const activeBlocks = byDay[cDay] || (parsed.studyBlocks && cDay === 1 ? parsed.studyBlocks : getStudyBlocksForDay(cDay));

      set({
        currentDay: cDay,
        studyBlocks: activeBlocks,
        studyBlocksByDay: byDay,
        activeSession: parsed.activeSession || null,
        dsaTopics: parsed.dsaTopics || initialDsaTopics,
        dsaProblems: parsed.dsaProblems || initialDsaProblems,
        webdevTopics: parsed.webdevTopics || initialWebDevTopics,
        projects: parsed.projects || initialProjects,
        dailyReviews: parsed.dailyReviews || [],
      });
    } catch (e) {
      console.error("Failed to parse study data from localStorage:", e);
    }
  },
}));

