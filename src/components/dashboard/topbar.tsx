"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Sun, Moon, Coins, Zap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

import { useProfileStore } from "@/profile/stores/profileStore";
import { profileRepository } from "@/profile/repositories/ProfileRepository";
import { useUserStore } from "@/stores/userStore";
import { NotificationCenter } from "./notification-center";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const coins = useUserStore((state) => state.user?.coins ?? 0);
  const xp = useUserStore((state) => state.user?.xp ?? 0);
  const { profile } = useProfileStore();
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();
  const [greeting, setGreeting] = useState("Good Morning");

  // Fetch player display name, defaulting to "Scholar"
  const displayName = profile?.displayName || "Scholar";

  // Resolve avatar URL path to public CDN URL or UI-Avatars initials fallback
  const avatarUrl = profile?.avatarUrl
    ? profileRepository.getPublicUrl(profile.avatarUrl)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&bold=true`;

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-20 px-6 bg-card/85 backdrop-blur-md border-b border-border-theme transition-colors duration-200 select-none">
      {/* Left side: Hamburger + Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg lg:text-xl font-bold tracking-tight text-text-primary">
            {greeting}, <span className="text-accent">{displayName}</span>
          </h2>
          <p className="hidden sm:block text-xs text-text-secondary mt-0.5">
            Focus. Progress. Consistency.
          </p>
        </div>
      </div>

      {/* Right side: XP, Coins, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Coins Badge */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 cursor-help"
          title="Study Coins - Earned by completing study missions. Spend them in the Reward Shop."
        >
          <Coins size={15} className="animate-[spin_12s_linear_infinite]" />
          <span className="text-xs font-bold font-mono tracking-tight">{(coins ?? 0).toLocaleString()}</span>
        </div>

        {/* XP Badge */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 text-accent dark:text-blue-400 cursor-help"
          title="Focus Experience (XP) - Lifetime accumulated XP. Earned by focusing and completing missions."
        >
          <Zap size={15} className="fill-current" />
          <span className="text-xs font-bold font-mono tracking-tight">{(xp ?? 0).toLocaleString()} XP</span>
        </div>

        <div className="h-6 w-[1px] bg-border-theme hidden sm:block mx-1" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-0 rounded-xl"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {mounted && theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </Button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Small Profile Button (Link to /profile) */}
        <Link
          href="/profile"
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-border-theme/40 hover:scale-105 transition-all duration-200 select-none"
          title="View Profile"
        >
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}
