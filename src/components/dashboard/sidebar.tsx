"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Trophy,
  Award,
  ShoppingBag,
  Flame,
  BarChart3,
  Calendar,
  Settings,
  X,
  Sparkles,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useProfileStore } from "@/profile/stores/profileStore";
import { profileRepository } from "@/profile/repositories/ProfileRepository";
import { useUiStore } from "@/stores/uiStore";

export const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Missions", icon: Target, id: "missions" },
  { name: "Achievements", icon: Trophy, id: "achievements" },
  { name: "Levels", icon: Award, id: "levels" },
  { name: "Reward Shop", icon: ShoppingBag, id: "shop" },
  { name: "Boss Battles", icon: Flame, id: "boss" },
  { name: "Statistics", icon: BarChart3, id: "statistics" },
  { name: "Calendar", icon: Calendar, id: "calendar" },
  { name: "Settings", icon: Settings, id: "settings" },
  { name: "Rule Book", icon: BookOpen, id: "rules" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, loading: isProfileLoading } = useProfileStore();
  const { activeTab, setActiveTab } = useUiStore();
  const pathname = usePathname();
  
  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border-theme p-6 select-none transition-colors duration-200">
      {/* Header / Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white">
            <Sparkles size={18} className="animate-[pulse_3s_infinite]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              StudyQuest
            </h1>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold mt-0.5">
              Level Up Your Mind.
            </p>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          
          // Determine if this sidebar item is active
          let isActive = false;
          if (item.id === "settings") {
            isActive = pathname === "/settings";
          } else {
            isActive = pathname === "/dashboard" && activeTab === item.id;
          }

          // Determine navigation destination
          const href = item.id === "settings" ? "/settings" : `/dashboard?tab=${item.id}`;

          return (
            <Link
              key={item.id}
              href={href}
              onClick={() => {
                if (item.id !== "settings") {
                  setActiveTab(item.id);
                }
                onClose(); // Close mobile drawer on navigation
              }}
              className={cn(
                "flex items-center w-full gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-all duration-200 cursor-pointer group",
                isActive
                  ? "bg-accent/5 dark:bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-slate-800/40"
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                )}
              />
              <span>{item.name}</span>
              {item.id === "boss" && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Block */}
      {isProfileLoading || !profile ? (
        <div className="pt-4 border-t border-border-theme mt-auto flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-border-theme mt-auto flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border-theme shrink-0">
            <img
              src={profile.avatarUrl ? profileRepository.getPublicUrl(profile.avatarUrl) : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=3b82f6&color=fff&bold=true`}
              alt={profile.displayName}
              className="w-full h-full object-cover animate-[fadeIn_300ms_ease]"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{profile.displayName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success"></span>
              <p className="text-[11px] text-text-secondary truncate">@{profile.username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Responsive Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed top-0 bottom-0 left-0 z-50 w-72 h-full shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
