export const gameConfig = {
  dailyTargets: {
    missionPoints: 6,
    xp: 300,
    studyHours: 4.0,
    phoneUsageLimitMinutes: 90, // 1.5 hours
  },
  comboRules: {
    // successive completions -> XP multiplier
    multipliers: [
      { completionsCount: 1, multiplier: 1.0 },
      { completionsCount: 2, multiplier: 1.2 },
      { completionsCount: 3, multiplier: 1.5 },
      { completionsCount: 4, multiplier: 2.0 }, // Capped at 2.0x
    ],
  },
  streakRules: {
    // consecutive days -> rank name & multiplier
    tiers: [
      { days: 0, tierName: "Initiate Flame", multiplier: 1.0 },
      { days: 7, tierName: "Bronze Flame", multiplier: 1.1 },
      { days: 30, tierName: "Silver Flame", multiplier: 1.25 },
      { days: 100, tierName: "Golden Flame", multiplier: 1.5 },
      { days: 365, tierName: "Immortal", multiplier: 2.0 },
    ],
  },
  dailyGoalBonus: {
    xp: 50,
    coins: 10,
  },
  penalties: {
    phoneOverusePerTenMinutes: 10,
    expiredMission: 50,
    lateSubmission: 20,
    missedDailyGoal: 15,
  },
  bossRules: {
    maxHP: 25000,
    damage: {
      Easy: 250,
      Medium: 600,
      Hard: 1200,
    },
  },
  dailyQuestsTemplates: [
    { id: "dq_m_hard", text: "Complete 2 Hard Missions", targetType: "hard_missions", targetValue: 2 },
    { id: "dq_xp", text: "Earn 300 XP", targetType: "xp", targetValue: 300 },
    { id: "dq_phone", text: "Stay below 90 min Phone", targetType: "phone_limit", targetValue: 90 },
    { id: "dq_study", text: "Study 4 Hours", targetType: "study_hours", targetValue: 4 },
  ],
};
