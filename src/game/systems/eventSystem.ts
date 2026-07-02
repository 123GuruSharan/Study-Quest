type EventCallback = (payload?: any) => void;

class EventSystem {
  private listeners: { [eventType: string]: EventCallback[] } = {};

  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);

    // Return an unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(
        (cb) => cb !== callback
      );
    };
  }

  publish(eventType: string, payload?: any): void {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType].forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error(`Error in event listener for ${eventType}:`, err);
      }
    });
  }
}

export const eventSystem = new EventSystem();

export const EVENTS = {
  MISSION_CREATED: "MISSION_CREATED",
  MISSION_LOCKED: "MISSION_LOCKED",
  MISSION_COMPLETED: "MISSION_COMPLETED",
  XP_UPDATED: "XP_UPDATED",
  COIN_UPDATED: "COIN_UPDATED",
  LEVEL_UP: "LEVEL_UP",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  CHEST_OPENED: "CHEST_OPENED",
  TIMER_TICK: "TIMER_TICK",
  PENALTY_APPLIED: "PENALTY_APPLIED",
  DAILY_GOAL_COMPLETED: "DAILY_GOAL_COMPLETED",
  PHONE_USAGE_UPDATED: "PHONE_USAGE_UPDATED",
  FOCUS_SESSION_COMPLETED: "FOCUS_SESSION_COMPLETED",
};
export type EventType = keyof typeof EVENTS;
