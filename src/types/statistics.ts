export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutesFocused: number;
  xpEarned: number;
  missionsCompleted: number;
  phoneUsageMinutes: number;
}

export interface SubjectFocusLog {
  subject: string;
  minutesFocused: number;
}

export interface OverallStats {
  totalMissionsCompleted: number;
  totalMissionsExpired: number;
  totalHoursStudied: number;
  totalCoinsEarned: number;
  averagePhoneUsageMinutes: number;
  streakPeak: number;
  completionRate: number;
}
