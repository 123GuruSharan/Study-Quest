export interface DailyChallenge {
  id: string;
  description: string;
  targetCount: number;
  currentCount: number;
  xpBonus: number;
  coinsBonus: number;
  completed: boolean;
  type: "hard_missions" | "subject_study" | "early_completion" | "low_phone";
  subject?: string;
}

const challengePool = [
  {
    id: "ch1",
    description: "Complete 2 Hard Missions today",
    targetCount: 2,
    xpBonus: 150,
    coinsBonus: 30,
    type: "hard_missions" as const,
  },
  {
    id: "ch2",
    description: "Focus on Algorithms for 60+ minutes",
    targetCount: 60,
    xpBonus: 120,
    coinsBonus: 20,
    type: "subject_study" as const,
    subject: "Algorithms",
  },
  {
    id: "ch3",
    description: "Finish a study mission before 12:00 PM",
    targetCount: 1,
    xpBonus: 100,
    coinsBonus: 15,
    type: "early_completion" as const,
  },
  {
    id: "ch4",
    description: "Maintain phone screen time under 45 minutes",
    targetCount: 45, // maximum minutes allowed
    xpBonus: 130,
    coinsBonus: 25,
    type: "low_phone" as const,
  },
];

export class ChallengeSystem {
  generateDailyChallenge(): DailyChallenge {
    // Pick based on today's day of the week to stay static and persistent for a single day
    const day = new Date().getDay();
    const challengeIndex = day % challengePool.length;
    const challengeTemplate = challengePool[challengeIndex];

    return {
      ...challengeTemplate,
      currentCount: 0,
      completed: false,
    };
  }

  evaluateChallenge(
    challenge: DailyChallenge,
    actions: {
      hardMissionsCompleted: number;
      subjectMinutes: { [subject: string]: number };
      phoneUsageMinutes: number;
      completedBeforeNoon: boolean;
    }
  ): DailyChallenge {
    if (challenge.completed) return challenge;

    let currentCount = 0;
    let completed = false;

    switch (challenge.type) {
      case "hard_missions":
        currentCount = actions.hardMissionsCompleted;
        completed = currentCount >= challenge.targetCount;
        break;
      case "subject_study":
        currentCount = actions.subjectMinutes[challenge.subject || ""] || 0;
        completed = currentCount >= challenge.targetCount;
        break;
      case "early_completion":
        currentCount = actions.completedBeforeNoon ? 1 : 0;
        completed = currentCount >= challenge.targetCount;
        break;
      case "low_phone":
        currentCount = actions.phoneUsageMinutes;
        // Goal is keeping screen time under target, evaluated during active checks
        completed = currentCount > 0 && currentCount <= challenge.targetCount;
        break;
    }

    return {
      ...challenge,
      currentCount,
      completed,
    };
  }
}

export const challengeSystem = new ChallengeSystem();
