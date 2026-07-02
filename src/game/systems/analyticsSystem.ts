import { StudySessionLog } from "@/types/statistics";
import { Mission } from "@/types/mission";

export class AnalyticsSystem {
  calculateAnalytics(
    historyLogs: StudySessionLog[],
    missions: Mission[]
  ) {
    // Total hours focused
    const totalMinutes = historyLogs.reduce((acc, log) => acc + log.minutesFocused, 0);
    const totalHours = parseFloat((totalMinutes / 60).toFixed(1));

    // Completion rate
    const totalMissions = missions.filter((m) => m.status !== "Draft").length;
    const completedMissions = missions.filter((m) => m.status === "Completed").length;
    const expiredMissions = missions.filter((m) => m.status === "Expired").length;
    const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;

    // Study Consistency: % of days where user logged > 0 minutes
    const activeDays = historyLogs.filter((log) => log.minutesFocused > 0).length;
    const totalDays = historyLogs.length || 1;
    const consistencyPercentage = Math.round((activeDays / totalDays) * 100);

    // Average phone usage
    const totalPhoneMinutes = historyLogs.reduce((acc, log) => acc + log.phoneUsageMinutes, 0);
    const averagePhoneUsage = historyLogs.length > 0 ? Math.round(totalPhoneMinutes / historyLogs.length) : 0;

    // Subject Focus distribution
    const subjectMinutes: { [subject: string]: number } = {};
    missions.forEach((m) => {
      if (m.status === "Completed") {
        const estimatedMinutes = m.actualHours ? m.actualHours * 60 : (m.difficulty === "Easy" ? 30 : m.difficulty === "Medium" ? 60 : 120);
        subjectMinutes[m.subject] = (subjectMinutes[m.subject] || 0) + estimatedMinutes;
      }
    });

    // Subject rankings
    let bestSubject = "None";
    let highestFocus = 0;
    let weakestSubject = "None";
    let lowestFocus = Infinity;

    Object.entries(subjectMinutes).forEach(([subj, mins]) => {
      if (mins > highestFocus) {
        highestFocus = mins;
        bestSubject = subj;
      }
      if (mins < lowestFocus) {
        lowestFocus = mins;
        weakestSubject = subj;
      }
    });

    if (weakestSubject === "None" && Object.keys(subjectMinutes).length > 0) {
      weakestSubject = Object.keys(subjectMinutes)[0];
    }

    return {
      totalHours,
      completionRate,
      consistencyPercentage,
      averagePhoneUsage,
      bestSubject,
      weakestSubject: weakestSubject === "None" ? "None" : weakestSubject,
      peakProductivityTime: "9:00 AM - 11:30 AM",
      completedMissions,
      expiredMissions,
      subjectMinutes,
    };
  }
}

export const analyticsSystem = new AnalyticsSystem();
