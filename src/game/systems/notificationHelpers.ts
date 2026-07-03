import { JourneyEntry } from "@/types/journey";

// Calculates clean, relative time strings for notifications
export function getRelativeTime(timestampStr: string): string {
  try {
    const now = new Date();
    const date = new Date(timestampStr);
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 0) return "now";
    
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) {
      return "now";
    }
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return "yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "now";
  }
}

export interface ParsedNotification {
  category: "mission" | "boss" | "achievement" | "reward" | "focus" | "system" | "level" | "chest";
  formattedTitle: string;
  formattedDescription: string;
}

// Maps raw journey logs to friendly notification categories and descriptions
export function getNotificationMetadata(title: string, desc: string): ParsedNotification {
  const lowercaseTitle = title.toLowerCase();
  const lowercaseDesc = desc.toLowerCase();

  // 1. Check Level Up
  if (lowercaseTitle.includes("level up") || lowercaseDesc.includes("level up")) {
    return {
      category: "level",
      formattedTitle: "⬆️ Level Up",
      formattedDescription: desc
    };
  }

  // 2. Check Boss Defeated
  if (lowercaseTitle.includes("boss defeated") || lowercaseDesc.includes("boss defeated")) {
    return {
      category: "boss",
      formattedTitle: "🏆 Boss Defeated",
      formattedDescription: desc
    };
  }

  // 3. Check Boss Damaged
  if (lowercaseTitle.includes("boss damaged") || lowercaseTitle.includes("boss attack")) {
    // Try to parse JSON combat log
    try {
      if (desc.trim().startsWith("{")) {
        const payload = JSON.parse(desc);
        return {
          category: "boss",
          formattedTitle: "🐉 Boss Damaged",
          formattedDescription: `Dealt -${payload.damageDealt} HP to Weekly Boss via mission "${payload.missionTitle}".`
        };
      }
    } catch {}
    
    return {
      category: "boss",
      formattedTitle: "🐉 Boss Damaged",
      formattedDescription: desc
    };
  }

  // 4. Check Focus Sessions
  if (lowercaseTitle.includes("focus session completed") || lowercaseDesc.includes("focus minutes")) {
    return {
      category: "focus",
      formattedTitle: "⏳ Focus Completed",
      formattedDescription: desc
    };
  }

  // 5. Check Mission Completed
  if (lowercaseTitle.includes("mission completed")) {
    return {
      category: "mission",
      formattedTitle: "✅ Mission Completed",
      formattedDescription: desc
    };
  }

  // 6. Check Mission Started
  if (lowercaseTitle.includes("mission started") || lowercaseTitle.includes("mission committed") || lowercaseTitle.includes("locked")) {
    return {
      category: "mission",
      formattedTitle: "📝 Mission Started",
      formattedDescription: desc.replace("Mission Committed & Locked:", "").trim()
    };
  }

  // 7. Check Achievements
  if (lowercaseTitle.includes("achievement unlocked") || lowercaseTitle.includes("quests completed")) {
    return {
      category: "achievement",
      formattedTitle: "⭐ Achievement Unlocked",
      formattedDescription: desc
    };
  }

  // 8. Check Chest Claims
  if (lowercaseTitle.includes("chest claimed") || lowercaseTitle.includes("daily chest")) {
    return {
      category: "chest",
      formattedTitle: "🎁 Chest Claimed",
      formattedDescription: desc
    };
  }

  // 9. Check System resets
  if (lowercaseTitle.includes("midnight reset")) {
    return {
      category: "system",
      formattedTitle: "⚙️ System Update",
      formattedDescription: "A new study day has started. Daily quests refreshed!"
    };
  }

  // Fallbacks based on category fields
  return {
    category: "system",
    formattedTitle: `⚙️ ${title}`,
    formattedDescription: desc
  };
}
