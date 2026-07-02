import { eventSystem, EVENTS } from "./eventSystem";

export class TimerSystem {
  calculateFocusXP(minutesFocused: number, comboMultiplier: number): number {
    // Standard rule: 1 XP per focus minute
    const baseXP = minutesFocused * 1;
    return Math.round(baseXP * comboMultiplier);
  }

  calculateFocusCoins(minutesFocused: number): number {
    // Standard rule: 1 coin per 10 minutes focused
    return Math.floor(minutesFocused / 10);
  }
}

export const timerSystem = new TimerSystem();
