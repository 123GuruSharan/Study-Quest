export interface BossConfig {
  id: string;
  name: string;
  description: string;
  baseMaxHp: number;
  rewardXP: number;
  rewardCoins: number;
  challengeText: string;
}

export const bossesConfig: BossConfig[] = [
  {
    id: "procrastination_dragon",
    name: "Procrastination Dragon",
    description: "A colossal beast feeding on deferred tasks. Defeat it by completing study sessions!",
    baseMaxHp: 25000,
    rewardXP: 800,
    rewardCoins: 350,
    challengeText: "Complete study missions to deal damage to the dragon and earn epic loot.",
  },
  {
    id: "distraction_goblin",
    name: "Distraction Goblin",
    description: "A mischievous creature lure-gaming you away from your focus. Slay it!",
    baseMaxHp: 30000,
    rewardXP: 1000,
    rewardCoins: 450,
    challengeText: "Complete study missions to damage the goblin and reclaim your focus.",
  },
  {
    id: "social_media_kraken",
    name: "Social Media Kraken",
    description: "An ancient sea terror whose tentacles draw you back into the social feeds.",
    baseMaxHp: 35000,
    rewardXP: 1200,
    rewardCoins: 550,
    challengeText: "Complete study missions to destroy the kraken's tentacles and escape the loop.",
  },
];

/**
 * Centralized function to calculate boss damage strictly based on mission difficulty.
 */
export function calculateBossDamage(difficulty: string): number {
  switch (difficulty) {
    case "Easy":
      return 250;
    case "Medium":
      return 600;
    case "Hard":
      return 1200;
    case "Epic":
      return 2500;
    case "Legendary":
      return 5000;
    default:
      return 0;
  }
}

/**
 * Returns the calculated Boss configuration dynamically scaled by defeated count.
 */
export function getBossForDefeatedCount(defeatedCount: number) {
  const index = defeatedCount % bossesConfig.length;
  const baseBoss = bossesConfig[index];
  
  // Scale stats dynamically based on boss cycles
  const cycle = Math.floor(defeatedCount / bossesConfig.length);
  const hpMultiplier = 1 + (cycle * 0.2); // +20% HP per cycle
  const xpMultiplier = 1 + (cycle * 0.15); // +15% XP per cycle
  const coinsMultiplier = 1 + (cycle * 0.15); // +15% Coins per cycle

  const maxHp = Math.round((baseBoss.baseMaxHp + (defeatedCount * 5000)) * hpMultiplier);
  const rewardXP = Math.round(baseBoss.rewardXP * xpMultiplier);
  const rewardCoins = Math.round(baseBoss.rewardCoins * coinsMultiplier);
  
  const levelSuffix = defeatedCount >= bossesConfig.length ? ` (Lvl ${defeatedCount + 1})` : "";
  
  return {
    ...baseBoss,
    name: `${baseBoss.name}${levelSuffix}`,
    maxHp,
    rewardXP,
    rewardCoins,
  };
}

/**
 * Calculates remaining time until the weekly Monday 00:00 UTC reset.
 */
export function getWeeklyTimeRemaining(): string {
  const now = new Date();
  const nextMonday = new Date();
  // Get next Monday 00:00
  nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
  nextMonday.setHours(0, 0, 0, 0);

  const diffMs = nextMonday.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  if (diffDays > 0) {
    return `${diffDays}d ${remainingHours}h left`;
  }
  return `${remainingHours}h left`;
}

export interface BossCombatLogEntry {
  id: string;
  timestamp: string;
  isMilestone: boolean;
  title: string;
  description: string;
  missionTitle?: string;
  difficulty?: string;
  damageDealt?: number;
  xpEarned?: number;
  coinsEarned?: number;
  missionPoints?: number;
  comboMultiplier?: number;
  streakMultiplier?: number;
}

/**
 * Parses a JourneyEntry into a structured BossCombatLogEntry if valid.
 */
export function parseBossCombatLog(entry: { category: string; description: string; id: string; timestamp: string; title: string }): BossCombatLogEntry | null {
  if (entry.category !== "boss" || !entry.description) {
    return null;
  }
  if (entry.description.startsWith("{")) {
    try {
      const data = JSON.parse(entry.description);
      return {
        id: entry.id,
        timestamp: entry.timestamp,
        isMilestone: false,
        title: entry.title,
        description: entry.description,
        missionTitle: data.missionTitle || entry.title,
        difficulty: data.difficulty || "Medium",
        damageDealt: data.damageDealt || 0,
        xpEarned: data.xpEarned || 0,
        coinsEarned: data.coinsEarned || 0,
        missionPoints: data.missionPoints || 0,
        comboMultiplier: data.comboMultiplier || 1.0,
        streakMultiplier: data.streakMultiplier || 1.0,
      };
    } catch (err) {
      // Fallback to milestone if JSON parsing fails
    }
  }
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    isMilestone: true,
    title: entry.title,
    description: entry.description,
  };
}

export interface BossCombatStats {
  totalDamageDealt: number;
  damageThisWeek: number;
  averageDamagePerMission: number;
  strongestHit: number;
  lastHit: number;
  bossesDefeated: number;
  totalHpRemoved: number;
}

/**
 * Computes live RPG combat intelligence stats from the journey logs history.
 */
export function calculateBossStats(journeyLog: any[], defeatedCount: number): BossCombatStats {
  const logs = journeyLog
    .map(parseBossCombatLog)
    .filter((l): l is BossCombatLogEntry => l !== null);

  const hitsOnly = logs.filter((l) => !l.isMilestone);

  let totalDamageDealt = 0;
  let damageThisWeek = 0;
  let strongestHit = 0;
  let lastHit = 0;
  
  const now = new Date().getTime();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  hitsOnly.forEach((log, index) => {
    const damage = log.damageDealt || 0;
    totalDamageDealt += damage;
    if (new Date(log.timestamp).getTime() >= oneWeekAgo) {
      damageThisWeek += damage;
    }
    if (damage > strongestHit) {
      strongestHit = damage;
    }
    if (index === 0) {
      lastHit = damage;
    }
  });

  const averageDamagePerMission = hitsOnly.length > 0
    ? Math.round(totalDamageDealt / hitsOnly.length)
    : 0;

  return {
    totalDamageDealt,
    damageThisWeek,
    averageDamagePerMission,
    strongestHit,
    lastHit,
    bossesDefeated: defeatedCount,
    totalHpRemoved: totalDamageDealt,
  };
}

/**
 * Formats a combat log timestamp to matches the RPG timeline aesthetics.
 */
export function formatLogTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (isToday) {
    return `Today • ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday • ${timeStr}`;
  }
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${timeStr}`;
}
