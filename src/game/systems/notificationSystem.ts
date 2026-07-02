import { GameNotification } from "@/types/gameState";
import { eventSystem, EVENTS } from "./eventSystem";

export class NotificationSystem {
  createNotification(
    type: GameNotification["type"],
    title: string,
    message: string
  ): GameNotification {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
  }

  // Connect system-wide Event Bus subscriptions
  initializeListeners(addNotification: (n: GameNotification) => void) {
    const unsubLevel = eventSystem.subscribe(
      EVENTS.LEVEL_UP,
      (payload: { level: number; rankName: string }) => {
        addNotification(
          this.createNotification(
            "level_up",
            "Level Up!",
            `Congratulations! You reached Level ${payload.level} (${payload.rankName}).`
          )
        );
      }
    );

    const unsubAchievement = eventSystem.subscribe(
      EVENTS.ACHIEVEMENT_UNLOCKED,
      (payload: { title: string; tier: string }) => {
        addNotification(
          this.createNotification(
            "achievement",
            "Achievement Unlocked!",
            `Unlocked "${payload.title}" (${payload.tier} Tier).`
          )
        );
      }
    );

    const unsubMission = eventSystem.subscribe(
      EVENTS.MISSION_COMPLETED,
      (payload: { title: string; finalXP: number; finalCoins: number }) => {
        addNotification(
          this.createNotification(
            "success",
            "Mission Completed!",
            `"${payload.title}" completed. +${payload.finalXP} XP, +${payload.finalCoins} Coins.`
          )
        );
      }
    );

    const unsubPenalty = eventSystem.subscribe(
      EVENTS.PENALTY_APPLIED,
      (payload: { reason: string; amount: number }) => {
        addNotification(
          this.createNotification(
            "danger",
            "Penalty Applied",
            `Deducted ${payload.amount} XP due to ${payload.reason}.`
          )
        );
      }
    );

    const unsubChest = eventSystem.subscribe(
      EVENTS.CHEST_OPENED,
      (payload: { xp: number; coins: number }) => {
        addNotification(
          this.createNotification(
            "info",
            "Chest Unlocked!",
            `Chest rewards claim: Received +${payload.xp} XP and +${payload.coins} Coins.`
          )
        );
      }
    );

    // Return combined unsubscribe hooks
    return () => {
      unsubLevel();
      unsubAchievement();
      unsubMission();
      unsubPenalty();
      unsubChest();
    };
  }
}

export const notificationSystem = new NotificationSystem();
