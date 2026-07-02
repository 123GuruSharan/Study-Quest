import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { useFocusStore } from "@/stores/focusStore";
import { economySystem } from "@/game/systems/economySystem";
import { levelSystem } from "@/game/systems/levelSystem";
import { streakEngine } from "@/game/systems/streakEngine";
import { calculateBossDamage, getBossForDefeatedCount } from "@/config/bosses";
import { eventSystem, EVENTS } from "@/game/systems/eventSystem";
import { logGameplayMutation } from "@/game/diagnostics";
import { userRepository, missionRepository, statisticsRepository, journeyRepository } from "@/lib/repositories";
import { Mission } from "@/types/mission";
import { StudySessionLog } from "@/types/statistics";
import { gameConfig } from "@/config/game";

// Helper to get local date string YYYY-MM-DD
const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
};

export class MissionCompletionPipeline {
  async execute(missionId: string): Promise<boolean> {
    const userStore = useUserStore.getState();
    const missionStore = useMissionStore.getState();
    const statisticsStore = useStatisticsStore.getState();
    const focusStore = useFocusStore.getState();

    // 1. Validate Mission
    const mission = missionStore.missions.find((m) => m.id === missionId);
    if (!mission || mission.status === "Completed") {
      console.warn("Pipeline aborted: mission already completed or not found.");
      return false;
    }

    console.group(`MISSION COMPLETION PIPELINE — EXECUTION: "${mission.title}"`);
    const startTime = Date.now();

    // Save rollback snapshots
    const originalUser = { ...userStore.user };
    const originalMissions = [...missionStore.missions];
    const originalHistoryLogs = [...statisticsStore.historyLogs];
    const originalJourneyLog = [...userStore.journeyLog];

    try {
      // 2. Calculate Rewards (Economy)
      const comboCount = userStore.user.comboMultiplier > 1.0
        ? Math.floor((userStore.user.comboMultiplier - 1.0) / 0.2) + 1
        : 0;

      const payout = economySystem.calculateMissionPayout(
        mission,
        userStore.user.streak,
        comboCount
      );

      // Study hours gain based on difficulty
      const studyHourGain = mission.difficulty === "Easy" ? 0.5 : mission.difficulty === "Medium" ? 1.0 : mission.difficulty === "Hard" ? 2.0 : 4.0;
      
      // 3. Deal Boss Damage
      const damage = calculateBossDamage(mission.difficulty);
      const currentDefeatedCount = userStore.user.bossesDefeatedCount || 0;
      const activeBoss = getBossForDefeatedCount(currentDefeatedCount);
      const maxBossHp = activeBoss.maxHp;
      const currentBossHp = userStore.user.bossHp !== undefined ? Math.min(userStore.user.bossHp, maxBossHp) : maxBossHp;
      
      let nextBossHp = Math.max(0, currentBossHp - damage);
      let nextDefeatedCount = currentDefeatedCount;
      let bossRewardXp = 0;
      let bossRewardCoins = 0;
      let bossDefeatedMessage = "";

      if (nextBossHp === 0) {
        nextDefeatedCount += 1;
        const nextBoss = getBossForDefeatedCount(nextDefeatedCount);
        nextBossHp = nextBoss.maxHp;
        bossRewardXp = activeBoss.rewardXP;
        bossRewardCoins = activeBoss.rewardCoins;
        bossDefeatedMessage = `Congratulations! Defeated weekly boss "${activeBoss.name}". Gained +${bossRewardXp} XP and +${bossRewardCoins} Coins. New Weekly Boss "${nextBoss.name}" unlocked!`;
      }

      // 4. Progression & Multipliers
      const totalXpGain = payout.finalXP + bossRewardXp;
      const totalCoinsGain = payout.finalCoins + bossRewardCoins;
      const nextXp = userStore.user.xp + totalXpGain;
      const xpDetails = levelSystem.calculateLevelDetails(nextXp);
      const nextCoins = userStore.user.coins + totalCoinsGain;

      // Increase Combo multiplier
      const nextComboCount = comboCount + 1;
      const nextComboMultiplier = economySystem.calculateMissionPayout(
        mission,
        userStore.user.streak,
        nextComboCount
      ).comboMultiplier;

      // Update locally modified missions
      const updatedMissions = missionStore.missions.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            status: "Completed" as const,
            completedAt: new Date().toISOString(),
            xpReward: payout.finalXP,
            coinReward: payout.finalCoins,
          };
        }
        return m;
      });

      // 5. Update Statistics & Heatmap
      const todayStr = getLocalDateStr();
      const updatedHistory = statisticsStore.historyLogs.map((log) => {
        if (log.date === todayStr) {
          return {
            ...log,
            minutesFocused: log.minutesFocused + Math.round(studyHourGain * 60),
            xpEarned: log.xpEarned + totalXpGain,
            missionsCompleted: log.missionsCompleted + 1,
          };
        }
        return log;
      });

      const todayLogExists = statisticsStore.historyLogs.some((l) => l.date === todayStr);
      if (!todayLogExists) {
        const newLog = {
          id: `log_${Date.now()}`,
          date: todayStr,
          minutesFocused: Math.round(studyHourGain * 60),
          xpEarned: totalXpGain,
          missionsCompleted: 1,
          phoneUsageMinutes: 0,
        };
        updatedHistory.push(newLog);
      }

      // Calculate streak from updated history
      const nextStreak = streakEngine.calculateStreak(updatedHistory);

      // Create new User Profile State
      const nextUser = {
        ...userStore.user,
        studyHours: parseFloat((userStore.user.studyHours + studyHourGain).toFixed(1)),
        missionPoints: Math.max(0, userStore.user.missionPoints + payout.missionPoints),
        xp: nextXp,
        level: xpDetails.level,
        rankName: xpDetails.rankName,
        coins: nextCoins,
        comboMultiplier: nextComboMultiplier,
        bossHp: nextBossHp,
        bossesDefeatedCount: nextDefeatedCount,
        streak: nextStreak,
      };

      // 6. Journey Logs (Structured Entries)
      const journeyLogsToAdd: { title: string; desc: string; cat: any }[] = [];
      
      // Boss Damage Entry
      const combatLogPayload = {
        missionTitle: mission.title,
        difficulty: mission.difficulty,
        damageDealt: damage,
        xpEarned: payout.finalXP,
        coinsEarned: payout.finalCoins,
        missionPoints: payout.missionPoints,
        comboMultiplier: nextComboMultiplier,
        streakMultiplier: 1.0,
      };
      journeyLogsToAdd.push({
        title: "Boss Damaged!",
        desc: JSON.stringify(combatLogPayload),
        cat: "boss",
      });

      if (bossRewardXp > 0) {
        journeyLogsToAdd.push({
          title: "Boss Defeated!",
          desc: bossDefeatedMessage,
          cat: "boss",
        });
      }

      // Mission completion log entry
      journeyLogsToAdd.push({
        title: "Mission Completed",
        desc: `Earned +${payout.finalXP} XP and +${payout.finalCoins} Coins. Combo increased to ${nextComboMultiplier}x.`,
        cat: "mission",
      });

      // Level Up entry
      if (xpDetails.level > userStore.user.level) {
        journeyLogsToAdd.push({
          title: "Level Up!",
          desc: `Reached Level ${xpDetails.level} (${xpDetails.rankName})!`,
          cat: "level",
        });
      }

      // Update journey logs locally
      let updatedJourney = [...userStore.journeyLog];
      for (const log of journeyLogsToAdd) {
        updatedJourney.unshift({
          id: `j_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          title: log.title,
          description: log.desc,
          category: log.cat,
          timestamp: new Date().toISOString(),
        });
      }

      // 7. Mutate Local State In-Memory
      useMissionStore.setState({ missions: updatedMissions });
      useStatisticsStore.setState({ historyLogs: updatedHistory });
      useUserStore.setState({ user: nextUser, journeyLog: updatedJourney });

      // 8. Persist Everything (DB Save)
      console.log("Persisting mutated state to database repositories...");
      await missionRepository.saveMissions(updatedMissions);
      await statisticsRepository.saveHistoryLogs(updatedHistory);
      await userStore.userRepositorySave(nextUser);
      await journeyRepository.saveJourneyEntries(updatedJourney);

      // Check achievements
      await userStore.checkAchievements();

      console.log("Database persistent transaction completed successfully.");

      // 9. Diagnostics Log Groups
      logGameplayMutation({
        mutation: `Pipeline Complete: "${mission.title}"`,
        previousState: originalUser,
        supabasePayload: nextUser,
        dbResponse: "Transaction Success",
        finalState: nextUser,
      });

      // 10. Emit Success Events
      eventSystem.publish(EVENTS.XP_UPDATED, { xp: nextXp, amountGained: totalXpGain });
      eventSystem.publish(EVENTS.COIN_UPDATED, { coins: nextCoins, amountGained: totalCoinsGain });
      if (xpDetails.level > originalUser.level) {
        eventSystem.publish(EVENTS.LEVEL_UP, {
          level: xpDetails.level,
          rankName: xpDetails.rankName,
        });
      }

      eventSystem.publish(EVENTS.MISSION_COMPLETED, {
        id: mission.id,
        title: mission.title,
        difficulty: mission.difficulty,
        finalXP: payout.finalXP,
        finalCoins: payout.finalCoins,
        missionPoints: payout.missionPoints,
        studyHours: studyHourGain,
        subject: mission.subject,
      });

      // Publish Unified Success Event
      eventSystem.publish("MISSION_COMPLETED_SUCCESS", {
        mission,
        payout,
        xpGained: totalXpGain,
        coinsGained: totalCoinsGain,
        bossDamaged: damage,
        bossDefeated: bossRewardXp > 0,
        bossDefeatedMessage,
        levelUp: xpDetails.level > originalUser.level ? xpDetails.level : null,
      });

      missionStore.evaluateDailyQuests();

      const durationMs = Date.now() - startTime;
      console.log(`Pipeline Execution Duration: ${durationMs}ms`);
      console.groupEnd();
      
      return true;

    } catch (error) {
      console.error("Pipeline failure! Rolling back local state in-memory mutations.", error);
      
      // Rollback
      useMissionStore.setState({ missions: originalMissions });
      useStatisticsStore.setState({ historyLogs: originalHistoryLogs });
      useUserStore.setState({ user: originalUser, journeyLog: originalJourneyLog });
      
      console.groupEnd();
      throw error;
    }
  }
}

export const missionCompletionPipeline = new MissionCompletionPipeline();
