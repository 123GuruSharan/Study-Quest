import { levelsConfig, LevelDefinition } from "@/config/levels";

export class LevelSystem {
  calculateLevelDetails(totalXP: number): {
    level: number;
    rankName: string;
    xpInCurrentLevel: number;
    xpRequiredForNextLevel: number;
    percentage: number;
  } {
    let currentLevelDef: LevelDefinition = levelsConfig[0];
    let nextLevelDef: LevelDefinition | null = null;

    for (let i = 0; i < levelsConfig.length; i++) {
      if (totalXP >= levelsConfig[i].xpRequired) {
        currentLevelDef = levelsConfig[i];
        nextLevelDef = levelsConfig[i + 1] || null;
      } else {
        break;
      }
    }

    if (!nextLevelDef) {
      // Reached maximum configured level
      return {
        level: currentLevelDef.level,
        rankName: currentLevelDef.rankName,
        xpInCurrentLevel: totalXP - currentLevelDef.xpRequired,
        xpRequiredForNextLevel: 0,
        percentage: 100,
      };
    }

    const levelXPWindow = nextLevelDef.xpRequired - currentLevelDef.xpRequired;
    const xpInCurrentLevel = totalXP - currentLevelDef.xpRequired;
    const percentage = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelXPWindow) * 100)));

    return {
      level: currentLevelDef.level,
      rankName: currentLevelDef.rankName,
      xpInCurrentLevel,
      xpRequiredForNextLevel: levelXPWindow,
      percentage,
    };
  }
}

export const levelSystem = new LevelSystem();
