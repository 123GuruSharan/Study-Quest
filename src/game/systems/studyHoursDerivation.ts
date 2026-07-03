import { useStatisticsStore } from "@/stores/statisticsStore";
import { StudySessionLog } from "@/types/statistics";

export function getLifetimeStudyMinutes(logs?: StudySessionLog[]): number {
  const activeLogs = logs || useStatisticsStore.getState().historyLogs || [];
  return activeLogs.reduce((acc, log) => acc + (log.minutesFocused || 0), 0);
}

export function getTodayStudyMinutes(logs?: StudySessionLog[]): number {
  const activeLogs = logs || useStatisticsStore.getState().historyLogs || [];
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${date}`;

  const todayLog = activeLogs.find(log => log.date === todayStr);
  return todayLog ? todayLog.minutesFocused : 0;
}

export function getWeeklyStudyMinutes(logs?: StudySessionLog[]): number {
  const activeLogs = logs || useStatisticsStore.getState().historyLogs || [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return activeLogs
    .filter(log => new Date(log.date) >= cutoff)
    .reduce((acc, log) => acc + (log.minutesFocused || 0), 0);
}

export function getMonthlyStudyMinutes(logs?: StudySessionLog[]): number {
  const activeLogs = logs || useStatisticsStore.getState().historyLogs || [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return activeLogs
    .filter(log => new Date(log.date) >= cutoff)
    .reduce((acc, log) => acc + (log.minutesFocused || 0), 0);
}

export function formatStudyHours(minutes: number): string {
  if (minutes <= 0) return "0 min";
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hrs > 0) {
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  }
  return `${rem}m`;
}
