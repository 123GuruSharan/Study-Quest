"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { 
  Calendar as CalendarIcon, 
  Target, 
  Trophy, 
  Award, 
  Flame, 
  Star, 
  Sparkles, 
  Gift, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  AlertCircle,
  HelpCircle,
  Zap,
  Coins
} from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

// Helper to format ISO Date strings
const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
};

// Parser to extract structured fields from JSON or Regex text patterns
const parseJourneyDescription = (title: string, desc: string) => {
  // 1. Parse JSON payloads (used by Boss Damaged events)
  try {
    if (desc.trim().startsWith("{")) {
      return JSON.parse(desc);
    }
  } catch {}

  // 2. Parse text templates dynamically (used by Mission Completed and Focus Sessions)
  if (title === "Mission Completed" || title === "Focus Session Completed") {
    const xpMatch = desc.match(/Earned \+(\d+) XP/i) || desc.match(/\+(\d+)\s*XP/i);
    const coinsMatch = desc.match(/\+(\d+)\s*Coins/i) || desc.match(/\+(\d+)\s*coins/i);
    const comboMatch = desc.match(/Combo increased to ([\d\.]+)x/i) || desc.match(/combo:?\s*([\d\.]+)x/i);
    const minutesMatch = desc.match(/Logged (\d+) focus minutes/i);

    return {
      xpEarned: xpMatch ? parseInt(xpMatch[1]) : null,
      coinsEarned: coinsMatch ? parseInt(coinsMatch[1]) : null,
      comboMultiplier: comboMatch ? parseFloat(comboMatch[1]) : null,
      minutesFocused: minutesMatch ? parseInt(minutesMatch[1]) : null,
      rawText: desc
    };
  }

  return null;
};

// --- TIMELINE COMPONENT RENDERERS ---

const MissionRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  const parsed = parseJourneyDescription(entry.title, entry.description);
  const isStarted = entry.title.toLowerCase().includes("started") || entry.title.toLowerCase().includes("locked");

  if (isStarted) {
    return (
      <div className="p-4 rounded-xl border border-border-theme bg-card space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-accent flex items-center gap-1">
            🔒 Mission Started
          </span>
          <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-text-primary leading-snug">{entry.title.replace("Mission Committed & Locked:", "").trim()}</h4>
          <p className="text-[10px] text-text-secondary mt-1">Focus timer can now begin. Complete study objectives to slay the weekly boss!</p>
        </div>
      </div>
    );
  }

  const isFocusSession = entry.title.toLowerCase().includes("focus");

  return (
    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3 dark:border-emerald-950/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          {isFocusSession ? "⏳ Focus Session Logged" : "✅ Mission Completed"}
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold text-text-primary">
          {isFocusSession ? "Focus Session Completed" : entry.title}
        </h4>
        {parsed?.minutesFocused && (
          <p className="text-[10px] text-text-secondary font-semibold">
            Logged {parsed.minutesFocused} minutes of deep work focus.
          </p>
        )}
        {!parsed && <p className="text-[10px] text-text-secondary leading-normal">{entry.description}</p>}
      </div>

      {parsed && (parsed.xpEarned || parsed.coinsEarned || parsed.comboMultiplier) && (
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-emerald-500/10 text-[9px] font-bold text-text-secondary">
          {parsed.xpEarned && (
            <span className="flex items-center gap-0.5 text-accent">
              <Zap size={10} className="fill-current" />
              +{parsed.xpEarned} XP
            </span>
          )}
          {parsed.coinsEarned && (
            <span className="flex items-center gap-0.5 text-amber-500">
              <Coins size={10} className="fill-current" />
              +{parsed.coinsEarned} Coins
            </span>
          )}
          {parsed.comboMultiplier && (
            <span className="flex items-center gap-0.5 text-purple-500">
              ⚡ Combo {parsed.comboMultiplier.toFixed(2)}x
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const BossRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  const parsed = parseJourneyDescription(entry.title, entry.description);
  const isDefeated = entry.title.toLowerCase().includes("defeated");

  if (isDefeated) {
    return (
      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2 dark:border-red-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5 animate-pulse">
            🏆 Boss Slayed
          </span>
          <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
          <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-3 dark:border-orange-950/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1">
          🐉 Boss Damaged
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>

      {parsed ? (
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[8px] text-text-secondary font-bold uppercase block">Target Mission</span>
            <span className="text-[11px] font-bold text-text-primary leading-tight block">{parsed.missionTitle}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
            <div>
              <span className="text-[8px] text-text-secondary uppercase block">Difficulty</span>
              <span className="font-bold text-text-primary">{parsed.difficulty}</span>
            </div>
            <div>
              <span className="text-[8px] text-text-secondary uppercase block">Damage Dealt</span>
              <span className="font-black text-red-500 font-mono">-{parsed.damageDealt} HP</span>
            </div>
            <div>
              <span className="text-[8px] text-text-secondary uppercase block">Boss Health</span>
              <span className="font-bold text-slate-400 font-mono">Remaining</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-orange-500/10 text-[9px] font-bold text-text-secondary">
            <span className="flex items-center gap-0.5 text-accent">
              <Zap size={10} className="fill-current" />
              +{parsed.xpEarned} XP
            </span>
            <span className="flex items-center gap-0.5 text-amber-500">
              <Coins size={10} className="fill-current" />
              +{parsed.coinsEarned} Coins
            </span>
            {parsed.missionPoints > 0 && (
              <span className="flex items-center gap-0.5 text-purple-500">
                ⭐ +{parsed.missionPoints} MP
              </span>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
          <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
        </div>
      )}
    </div>
  );
};

const LevelRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  // e.g. "Reached Level 5 (Elite Scholar)!"
  const match = entry.description.match(/Reached Level (\d+)\s*\((.*?)\)/i) || entry.description.match(/Level\s*(\d+)\s*\((.*?)\)/i);
  const levelNum = match ? match[1] : "";
  const rankTitle = match ? match[2] : "";

  return (
    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3 dark:border-blue-950/40 relative overflow-hidden">
      <div className="absolute right-3 top-3 opacity-15 text-blue-500">
        <Award size={36} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
          ⬆️ Level Up
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>
      <div>
        {levelNum ? (
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-text-primary tracking-tight">Reached Level {levelNum}!</h4>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 uppercase tracking-widest inline-block">{rankTitle || "New Title"}</span>
            <p className="text-[10px] text-text-secondary leading-normal pt-1">New Shop custom rewards and Sage titles unlocked.</p>
          </div>
        ) : (
          <div>
            <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
            <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AchievementRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  return (
    <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2 dark:border-purple-950/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
          🏆 Achievement Unlocked
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
        <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
      </div>
    </div>
  );
};

const StreakRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  return (
    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2 dark:border-amber-950/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
          🔥 Streak Milestone
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
        <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
      </div>
    </div>
  );
};

const RewardRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  return (
    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2 dark:border-emerald-950/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1">
          🎁 Shop Reward Claimed
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
        <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
      </div>
    </div>
  );
};

const SystemRenderer: React.FC<{ entry: any }> = ({ entry }) => {
  const isReset = entry.title === "Midnight Reset Activated";

  return (
    <div className="p-4 rounded-xl border border-border-theme bg-slate-50/50 dark:bg-slate-900/10 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary flex items-center gap-1">
          {isReset ? "🌙 Midnight Quest Reset" : "⚙️ System Event"}
        </span>
        <span className="text-[9px] font-mono text-text-secondary">{formatDate(entry.timestamp)}</span>
      </div>
      <div>
        <h4 className="text-xs font-bold text-text-primary">{entry.title}</h4>
        <p className="text-[10px] text-text-secondary leading-normal mt-1">{entry.description}</p>
      </div>
    </div>
  );
};

// Renderer registry to prevent huge switch statements
const RENDERER_REGISTRY: { [key: string]: React.FC<{ entry: any }> } = {
  mission: MissionRenderer,
  boss: BossRenderer,
  level: LevelRenderer,
  achievement: AchievementRenderer,
  streak: StreakRenderer,
  reward: RewardRenderer,
  other: SystemRenderer
};

export function JourneyTimeline() {
  const mounted = useMounted();
  const { journeyLog } = useUserStore();

  // Filters & Search states
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedResets, setExpandedResets] = useState<{ [key: string]: boolean }>({});

  const toggleExpandReset = (groupId: string) => {
    setExpandedResets((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-secondary select-none">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mb-2" />
        <span className="text-xs">Loading study memories...</span>
      </div>
    );
  }

  // 1. Filter and Search timeline logs
  const filteredLogs = journeyLog.filter((entry) => {
    // Event category matching
    if (filterType !== "all") {
      if (filterType === "mission" && entry.category !== "mission") return false;
      if (filterType === "boss" && entry.category !== "boss") return false;
      if (filterType === "achievement" && entry.category !== "achievement") return false;
      if (filterType === "reward" && entry.category !== "reward") return false;
      if (filterType === "system" && entry.category !== "other") return false;
    }

    // Search query matching (matches title, desc, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchDesc = entry.description.toLowerCase().includes(q);
      const matchCat = entry.category.toLowerCase().includes(q);
      
      // Parse description internally and match variables
      const parsed = parseJourneyDescription(entry.title, entry.description);
      const matchParsed = parsed
        ? (parsed.missionTitle && parsed.missionTitle.toLowerCase().includes(q)) ||
          (parsed.difficulty && parsed.difficulty.toLowerCase().includes(q))
        : false;

      return matchTitle || matchDesc || matchCat || matchParsed;
    }

    return true;
  });

  // 2. Collapse consecutive resets AND group by calendar date strings
  const getGroupedTimeline = () => {
    // First, collapse consecutive midnight resets
    const collapsed: (any)[] = [];
    let currentResetsGroup: any[] = [];

    for (let i = 0; i < filteredLogs.length; i++) {
      const entry = filteredLogs[i];
      if (entry.title === "Midnight Reset Activated") {
        currentResetsGroup.push(entry);
      } else {
        if (currentResetsGroup.length > 0) {
          if (currentResetsGroup.length === 1) {
            collapsed.push(currentResetsGroup[0]);
          } else {
            collapsed.push({
              type: "collapsed_resets",
              id: `collapse_${currentResetsGroup[0].id || i}`,
              count: currentResetsGroup.length,
              entries: [...currentResetsGroup],
              timestamp: currentResetsGroup[0].timestamp,
              category: "other"
            });
          }
          currentResetsGroup = [];
        }
        collapsed.push(entry);
      }
    }

    if (currentResetsGroup.length > 0) {
      if (currentResetsGroup.length === 1) {
        collapsed.push(currentResetsGroup[0]);
      } else {
        collapsed.push({
          type: "collapsed_resets",
          id: `collapse_${currentResetsGroup[0].id || 'end'}`,
          count: currentResetsGroup.length,
          entries: [...currentResetsGroup],
          timestamp: currentResetsGroup[0].timestamp,
          category: "other"
        });
      }
    }

    // Now group entries under Today, Yesterday, or Month separators
    const groups: { [key: string]: any[] } = {};
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    collapsed.forEach((item) => {
      const date = new Date(item.timestamp);
      let groupKey = "";
      
      if (date.toDateString() === todayStr) {
        groupKey = "TODAY";
      } else if (date.toDateString() === yesterdayStr) {
        groupKey = "YESTERDAY";
      } else {
        const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();
        const year = date.getFullYear();
        groupKey = `${month} ${year}`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  };

  const groupedTimeline = getGroupedTimeline();
  const groupKeys = Object.keys(groupedTimeline);

  // Filter chips definitions
  const filterChips = [
    { label: "All Events", value: "all" },
    { label: "Missions", value: "mission" },
    { label: "Boss Battles", value: "boss" },
    { label: "Achievements", value: "achievement" },
    { label: "Rewards", value: "reward" },
    { label: "System Log", value: "system" }
  ];

  return (
    <Card className="p-6 border-border-theme select-none space-y-6 w-full">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
            Player Journey Timeline
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Your digital memory — chronological history of milestones, bosses slayed, and completed sessions
          </p>
        </div>
      </div>

      {/* Filters and Search Bar Container */}
      <div className="space-y-4 pt-1">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mission, difficulty, rewards, boss..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus-visible:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary text-[10px] font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips Scroll container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setFilterType(chip.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                filterType === chip.value
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-card border-border-theme/60 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800/40"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed Container */}
      {journeyLog.length === 0 ? (
        // Empty State: No logs exist at all
        <div className="p-10 text-center border border-dashed border-border-theme rounded-2xl max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto">
            <Compass size={18} />
          </div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">📖 Your Journey Begins</h4>
          <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed mx-auto">
            Formulate your first commitment target and complete focus logs to start building your StudyQuest history.
          </p>
        </div>
      ) : filteredLogs.length === 0 ? (
        // Empty State: Search/Filter returned nothing
        <div className="p-8 text-center border border-dashed border-border-theme rounded-2xl max-w-md mx-auto space-y-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary mx-auto">
            <HelpCircle size={15} />
          </div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">No matching logs found</h4>
          <p className="text-[10px] text-text-secondary leading-relaxed mx-auto">
            Adjust your search query or select another filter chip to see active milestones.
          </p>
        </div>
      ) : (
        // Render Grouped Timeline Cards (at 90%+ Width)
        <div className="space-y-8 w-full">
          {groupKeys.map((groupKey) => (
            <div key={groupKey} className="space-y-4 w-full">
              
              {/* Date Group Heading Separator */}
              <div className="flex items-center gap-3 w-full">
                <span className="text-[10px] font-black text-accent tracking-widest uppercase">{groupKey}</span>
                <div className="h-px bg-border-theme flex-1 opacity-60" />
              </div>

              {/* Group Entries List */}
              <div className="space-y-4 pl-1 w-full flex flex-col items-center">
                {groupedTimeline[groupKey].map((item) => {
                  
                  // Handle collapsed resets toggle element
                  if (item.type === "collapsed_resets") {
                    const isExpanded = !!expandedResets[item.id];
                    return (
                      <div key={item.id} className="w-[94%] space-y-2.5 transition-all">
                        <button
                          onClick={() => toggleExpandReset(item.id)}
                          className="w-full p-3 rounded-xl border border-border-theme bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 font-bold">
                            🌙 System Event: {item.count} Daily Quests resets occurred
                          </span>
                          <span className="flex items-center gap-1 font-bold text-accent">
                            {isExpanded ? (
                              <>
                                <span>Collapse</span>
                                <ChevronUp size={12} />
                              </>
                            ) : (
                              <>
                                <span>Expand ({item.count})</span>
                                <ChevronDown size={12} />
                              </>
                            )}
                          </span>
                        </button>
                        
                        {isExpanded && (
                          <div className="pl-4 border-l border-border-theme space-y-3 pt-1 animate-[fadeIn_150ms_ease]">
                            {item.entries.map((resetEntry: any, rIdx: number) => (
                              <div key={resetEntry.id || rIdx} className="w-full">
                                <SystemRenderer entry={resetEntry} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Handle Standard Registered Category Renderers
                  const Renderer = RENDERER_REGISTRY[item.category] || SystemRenderer;
                  return (
                    <div key={item.id} className="w-[94%] hover:translate-x-0.5 transition-transform duration-200">
                      <Renderer entry={item} />
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

    </Card>
  );
}
