"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Target, 
  Trophy, 
  Award, 
  Flame, 
  Sparkles, 
  Gift, 
  Clock, 
  Settings, 
  X, 
  Check, 
  ChevronRight,
  Zap,
  Coins,
  Smile,
  ShieldAlert
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { getNotificationMetadata, getRelativeTime, ParsedNotification } from "@/game/systems/notificationHelpers";

// Sub-component to resolve category icons in notifications panel
const NotificationIcon: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case "mission":
      return (
        <div className="p-2 rounded-xl bg-accent/15 border border-accent/20 text-accent shrink-0">
          <Target size={14} />
        </div>
      );
    case "boss":
      return (
        <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-500 shrink-0">
          <Flame size={14} />
        </div>
      );
    case "achievement":
      return (
        <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-500 shrink-0">
          <Trophy size={14} />
        </div>
      );
    case "level":
      return (
        <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-500 shrink-0">
          <Award size={14} />
        </div>
      );
    case "focus":
      return (
        <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/20 text-amber-500 shrink-0">
          <Clock size={14} />
        </div>
      );
    case "chest":
      return (
        <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 shrink-0">
          <Gift size={14} />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-xl bg-slate-500/15 border border-slate-500/20 text-slate-500 shrink-0">
          <Settings size={14} />
        </div>
      );
  }
};

export function NotificationCenter() {
  const { journeyLog } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  
  const popoverRef = useRef<HTMLDivElement>(null);

  // 1. Load read list from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("studyquest_read_notification_ids");
    if (saved) {
      try {
        setReadIds(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // 2. Click outside closes panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 3. ESC key closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Cap notifications at 100 logs
  const notificationsList = journeyLog.slice(0, 100);

  // Unread badge count calculation
  const unreadCount = notificationsList.filter((item) => !readIds.includes(item.id)).length;

  // Mark all visible notifications as read
  const markAllAsRead = () => {
    const visibleIds = notificationsList.map((item) => item.id);
    const updatedReadIds = Array.from(new Set([...readIds, ...visibleIds]));
    setReadIds(updatedReadIds);
    localStorage.setItem("studyquest_read_notification_ids", JSON.stringify(updatedReadIds));
  };

  // Mark single notification as read
  const markAsRead = (id: string) => {
    if (readIds.includes(id)) return;
    const updatedReadIds = [...readIds, id];
    setReadIds(updatedReadIds);
    localStorage.setItem("studyquest_read_notification_ids", JSON.stringify(updatedReadIds));
  };

  // Filter list by category
  const filteredNotifications = notificationsList.filter((item) => {
    const meta = getNotificationMetadata(item.title, item.description);
    if (filter === "all") return true;
    
    // Group chest and rewards
    if (filter === "rewards") {
      return meta.category === "chest" || meta.category === "reward";
    }
    
    return meta.category === filter;
  });

  // Filter chips definitions
  const filterChips = [
    { label: "All", value: "all" },
    { label: "Missions", value: "mission" },
    { label: "Boss", value: "boss" },
    { label: "Achievements", value: "achievement" },
    { label: "Focus", value: "focus" },
    { label: "Rewards", value: "rewards" },
    { label: "System", value: "system" }
  ];

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button with Badge Count */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            // Automatically mark all as read when opening to clear badge immediately
            markAllAsRead();
          }
        }}
        className="w-9 h-9 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer flex items-center justify-center relative border border-transparent hover:border-border-theme/40"
        aria-label="Toggle Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-card animate-[pulse_2s_infinite]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Popover panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-80 md:w-96 rounded-2xl border border-border-theme bg-card/95 backdrop-blur-md shadow-2xl z-40 max-h-[500px] flex flex-col overflow-hidden animate-[fadeIn_150ms_ease]">
          
          {/* Header Panel */}
          <div className="p-4 border-b border-border-theme/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-primary">
                Activity Alerts
              </span>
              {unreadCount > 0 && (
                <span className="text-[9px] font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[9px] font-bold text-accent hover:text-accent/80 flex items-center gap-0.5 cursor-pointer"
                >
                  <Check size={11} />
                  <span>Read All</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary cursor-pointer p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Scrolling filter chips */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border-theme/40 overflow-x-auto scrollbar-none shrink-0">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setFilter(chip.value)}
                className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all border whitespace-nowrap cursor-pointer ${
                  filter === chip.value
                    ? "bg-accent/10 border-accent/30 text-accent font-extrabold"
                    : "bg-transparent border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Notifications List Container */}
          <div className="overflow-y-auto flex-1 divide-y divide-border-theme/30 max-h-[380px] scrollbar-thin">
            {filteredNotifications.length === 0 ? (
              // Empty State
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary">
                  <Bell size={18} className="opacity-75" />
                </div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">No notifications</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed max-w-xs mx-auto">
                  Complete study sessions, unlock achievements, or claim chest milestones to populate alerts.
                </p>
              </div>
            ) : (
              // Render list
              filteredNotifications.map((entry) => {
                const meta = getNotificationMetadata(entry.title, entry.description);
                const isUnread = !readIds.includes(entry.id);

                return (
                  <div
                    key={entry.id}
                    onClick={() => markAsRead(entry.id)}
                    className={`p-3.5 flex gap-3 transition-colors text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/15 cursor-pointer relative ${
                      isUnread ? "bg-accent/3 dark:bg-accent/5" : ""
                    }`}
                  >
                    {/* Unread highlight bar */}
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                    )}

                    <NotificationIcon category={meta.category} />

                    <div className="flex-1 space-y-0.5 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-[11px] font-black text-text-primary truncate">
                          {meta.formattedTitle}
                        </span>
                        <span className="text-[8px] font-bold text-text-secondary/70 shrink-0 font-mono">
                          {getRelativeTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-normal pr-1.5 break-words">
                        {meta.formattedDescription}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}
