import { StudySessionLog } from "@/types/statistics";
import { Mission } from "@/types/mission";
import { CompletedSession } from "@/stores/focusStore";

export interface SubjectStats {
  subject: string;
  totalMins: number;
  completedCount: number;
  averageMins: number;
  difficultyDistribution: { [diff: string]: number };
}

export class StatisticsEngine {
  /**
   * Generates weekly summary values (last 7 days).
   */
  getWeeklySummary(
    historyLogs: StudySessionLog[],
    missions: Mission[],
    focusHistory: CompletedSession[],
    streak: number
  ) {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    // Filter history logs for last 7 days
    const weeklyLogs = historyLogs.filter(
      (log) => new Date(log.date + "T00:00:00").getTime() >= oneWeekAgo
    );

    const weeklyXP = weeklyLogs.reduce((acc, l) => acc + l.xpEarned, 0);
    
    // Coins from completed missions in last 7 days + focus sessions in last 7 days
    const weeklyCoinsMissions = missions
      .filter((m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).getTime() >= oneWeekAgo)
      .reduce((acc, m) => acc + m.coinReward, 0);

    const weeklyCoinsFocus = focusHistory
      .filter((h) => new Date(h.completedAt).getTime() >= oneWeekAgo)
      .reduce((acc, h) => acc + h.coinsEarned, 0);

    const weeklyCoins = weeklyCoinsMissions + weeklyCoinsFocus;

    const weeklyMinutes = weeklyLogs.reduce((acc, l) => acc + l.minutesFocused, 0);
    const weeklyFocusHours = parseFloat((weeklyMinutes / 60).toFixed(1));

    const weeklyMissions = missions.filter(
      (m) => m.status === "Completed" && m.completedAt && new Date(m.completedAt).getTime() >= oneWeekAgo
    ).length;

    const averageDailyFocusMinutes = weeklyLogs.length > 0
      ? Math.round(weeklyMinutes / weeklyLogs.length)
      : 0;

    // Productivity Score
    const prodScore = this.calculateProductivityScore(historyLogs, missions, streak);

    return {
      weeklyXP,
      weeklyCoins,
      weeklyFocusHours,
      weeklyMissions,
      averageDailyFocusMinutes,
      streak,
      productivityScore: prodScore.score,
      productivityTier: prodScore.tier,
    };
  }

  /**
   * Calculates the productivity score (0 - 100).
   */
  calculateProductivityScore(
    historyLogs: StudySessionLog[],
    missions: Mission[],
    streak: number
  ) {
    // 1. Focus consistency: % of active days in last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const monthlyLogs = historyLogs.filter(
      (log) => new Date(log.date + "T00:00:00").getTime() >= thirtyDaysAgo
    );
    const activeDays = monthlyLogs.filter((log) => log.minutesFocused > 0).length;
    const totalDays = monthlyLogs.length || 1;
    const consistency = Math.round((activeDays / totalDays) * 100);

    // 2. Mission completion rate: (completed / total created) in last 30 days
    const monthlyMissions = missions.filter(
      (m) => new Date(m.createdAt).getTime() >= thirtyDaysAgo && m.status !== "Draft"
    );
    const completed = monthlyMissions.filter((m) => m.status === "Completed").length;
    const totalMissions = monthlyMissions.length || 1;
    const completionRate = Math.round((completed / totalMissions) * 100);

    // 3. Streak multiplier: cap streak points at 100 (e.g. streak of 20 = 100 points)
    const streakPoints = Math.min(100, streak * 5);

    // Weighted formula
    const score = Math.min(
      100,
      Math.round(consistency * 0.4 + completionRate * 0.4 + streakPoints * 0.2)
    );

    // Tiers: Beginner, Developing, Consistent, Focused, Elite Scholar, Legend
    let tier = "Beginner";
    if (score > 95) tier = "Legend";
    else if (score > 80) tier = "Elite Scholar";
    else if (score > 60) tier = "Focused";
    else if (score > 40) tier = "Consistent";
    else if (score > 20) tier = "Developing";

    return { score, tier };
  }

  /**
   * Generates focus statistics by subject category.
   */
  getCategoryDistribution(missions: Mission[]) {
    const subjectStats: { [subject: string]: number } = {};
    missions.forEach((m) => {
      if (m.status === "Completed") {
        const estimatedMinutes = m.actualHours 
          ? m.actualHours * 60 
          : (m.difficulty === "Easy" ? 30 : m.difficulty === "Medium" ? 60 : m.difficulty === "Hard" ? 120 : 240);
        subjectStats[m.subject] = (subjectStats[m.subject] || 0) + estimatedMinutes;
      }
    });

    const totalMinutes = Object.values(subjectStats).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(subjectStats)
      .map(([name, mins]) => ({
        name,
        minutes: mins,
        percentage: Math.round((mins / totalMinutes) * 100),
      }))
      .sort((a, b) => b.minutes - a.minutes);

    return sorted;
  }

  /**
   * Generates intelligence analytics from missions.
   */
  getSubjectIntelligence(missions: Mission[]) {
    const completed = missions.filter((m) => m.status === "Completed");
    
    if (completed.length === 0) {
      return {
        mostStudiedSubject: "None",
        fastestCompletedSubject: "None",
        hardestSubject: "None",
        favoriteDifficulty: "None",
        averageCompletionTime: "N/A",
      };
    }

    // 1. Most Studied Subject (by completed missions count)
    const subjectCounts: { [subject: string]: number } = {};
    completed.forEach((m) => {
      subjectCounts[m.subject] = (subjectCounts[m.subject] || 0) + 1;
    });
    const mostStudiedSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    // 2. Average completed duration and fastest subject
    // We calculate duration as difference between completedAt and startedAt (fallback to createdAt)
    const subjectDurations: { [subject: string]: { totalMs: number; count: number } } = {};
    let totalMsSum = 0;
    let totalMsCount = 0;

    completed.forEach((m) => {
      if (m.completedAt) {
        const start = m.startedAt ? new Date(m.startedAt).getTime() : new Date(m.createdAt).getTime();
        const duration = new Date(m.completedAt).getTime() - start;
        if (duration > 0) {
          totalMsSum += duration;
          totalMsCount++;
          if (!subjectDurations[m.subject]) {
            subjectDurations[m.subject] = { totalMs: 0, count: 0 };
          }
          subjectDurations[m.subject].totalMs += duration;
          subjectDurations[m.subject].count += 1;
        }
      }
    });

    let fastestCompletedSubject = "None";
    let minAvgDuration = Infinity;
    Object.entries(subjectDurations).forEach(([subj, data]) => {
      const avg = data.totalMs / data.count;
      if (avg < minAvgDuration) {
        minAvgDuration = avg;
        fastestCompletedSubject = subj;
      }
    });

    const formatDuration = (ms: number) => {
      const mins = Math.round(ms / 60000);
      if (mins < 60) return `${mins}m`;
      const hrs = parseFloat((mins / 60).toFixed(1));
      return `${hrs}h`;
    };

    const averageCompletionTime = totalMsCount > 0 ? formatDuration(totalMsSum / totalMsCount) : "N/A";

    // 3. Favorite Difficulty
    const difficultyCounts: { [diff: string]: number } = {};
    completed.forEach((m) => {
      difficultyCounts[m.difficulty] = (difficultyCounts[m.difficulty] || 0) + 1;
    });
    const favoriteDifficulty = Object.entries(difficultyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    // 4. Hardest Subject (Subject with most Epic/Hard missions)
    const subjectHardCounts: { [subject: string]: number } = {};
    completed.forEach((m) => {
      if (m.difficulty === "Hard" || m.difficulty === "Epic") {
        subjectHardCounts[m.subject] = (subjectHardCounts[m.subject] || 0) + 1;
      }
    });
    const hardestSubject = Object.entries(subjectHardCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

    return {
      mostStudiedSubject,
      fastestCompletedSubject,
      hardestSubject,
      favoriteDifficulty,
      averageCompletionTime,
    };
  }

  /**
   * Generates Recharts datasets for graph logs based on selected days range.
   */
  getGraphDataset(
    historyLogs: StudySessionLog[], 
    daysRange: number, 
    activeTab: "xp" | "hours" | "missions" | "coins", 
    missions: Mission[], 
    focusHistory: CompletedSession[]
  ) {
    const today = new Date();
    const datesList: string[] = [];

    // Generate consecutive local dates
    for (let i = daysRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const date = String(d.getDate()).padStart(2, "0");
      datesList.push(`${year}-${month}-${date}`);
    }

    const logsMap = new Map(historyLogs.map((l) => [l.date, l]));

    // Mission and Focus maps for coins
    const missionCoinsMap = new Map<string, number>();
    missions.forEach((m) => {
      if (m.status === "Completed" && m.completedAt) {
        const dStr = m.completedAt.split("T")[0];
        missionCoinsMap.set(dStr, (missionCoinsMap.get(dStr) || 0) + m.coinReward);
      }
    });

    const focusCoinsMap = new Map<string, number>();
    focusHistory.forEach((h) => {
      const dStr = h.completedAt.split("T")[0];
      focusCoinsMap.set(dStr, (focusCoinsMap.get(dStr) || 0) + h.coinsEarned);
    });

    const dataset = datesList.map((dateStr) => {
      const log = logsMap.get(dateStr);
      const dayLabel = new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const xp = log ? log.xpEarned : 0;
      const hours = log ? parseFloat((log.minutesFocused / 60).toFixed(1)) : 0;
      const missionsCompleted = log ? log.missionsCompleted : 0;
      
      const coins = (missionCoinsMap.get(dateStr) || 0) + (focusCoinsMap.get(dateStr) || 0);

      let value = xp;
      if (activeTab === "hours") value = hours;
      else if (activeTab === "missions") value = missionsCompleted;
      else if (activeTab === "coins") value = coins;

      return {
        date: dateStr,
        day: dayLabel,
        value,
        xp,
        hours,
        missions: missionsCompleted,
        coins,
      };
    });

    console.group(`Analytics Dataset Generated (${daysRange} Days)`);
    console.log("Tab Active:", activeTab);
    console.log("Datapoints:", dataset.length);
    console.groupEnd();

    return dataset;
  }
}

export const statisticsEngine = new StatisticsEngine();
