"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/profile/stores/profileStore";
import { profileRepository } from "@/profile/repositories/ProfileRepository";
import { profileService } from "@/profile/services/ProfileService";
import { Flame, Star, Award, Zap, Sparkles, Camera, Loader2, Globe } from "lucide-react";

export default function ProfilePage() {
  const { user, loadUser, isLoading: isUserLoading } = useUserStore();
  const { user: authUser } = useAuthStore();
  const { profile, updateProfile, uploadAvatar, loading: isProfileUpdating } = useProfileStore();

  // Local form states
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Sync form states with store profile once loaded
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setBio(profile.bio || "");
      setTimezone(profile.timezone || "UTC");
    }
  }, [profile]);

  if (isUserLoading || !profile) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-text-secondary select-none">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold">Retrieving profile credentials...</span>
      </div>
    );
  }

  // Handle instant saves on blur
  const handleInstantSave = async (field: string, value: string) => {
    if (!profile) return;
    
    // Check if value actually changed to prevent redundant updates
    const currentVal = profile[field as keyof typeof profile] || "";
    if (currentVal === value.trim()) return;

    await updateProfile(profile.id, {
      [field]: value.trim() || null,
    });
  };

  const handleAvatarTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    await uploadAvatar(profile.id, file);
  };

  // Dynamically calculate completion
  const completionPercentage = profileService.calculateCompletionPercentage(profile);

  // Resolve public avatar URL
  const avatarUrl = profile.avatarUrl
    ? profileRepository.getPublicUrl(profile.avatarUrl)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "Scholar")}&background=3b82f6&color=fff&bold=true`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full select-none animate-[fadeIn_200ms_ease] pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Player Profile
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Customize your study identity and view game achievements.
          </p>
        </div>

        {/* Profile Completion Score */}
        <div className="flex items-center gap-3 bg-card px-4 py-2.5 rounded-xl border border-border-theme w-fit">
          <div className="text-left">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              Identity Setup
            </span>
            <span className="text-xs font-black text-text-primary">
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-theme/40 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Identity Card */}
        <Card className="p-6 md:col-span-1 border-border-theme bg-card flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <button
              onClick={handleAvatarTrigger}
              disabled={isProfileUpdating}
              className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-border-theme group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {isProfileUpdating ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Loader2 size={20} className="animate-spin" />
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Overlay edit icon */}
              {!isProfileUpdating && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150">
                  <Camera size={18} />
                </div>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
          </div>

          <div>
            <h4 className="text-lg font-black tracking-tight text-text-primary">
              {displayName || "Scholar"}
            </h4>
            <p className="text-[11px] font-mono text-text-secondary mt-0.5">
              @{profile.username}
            </p>
            <p className="text-[10px] text-text-secondary mt-1.5 font-mono">
              {authUser?.email}
            </p>
          </div>

          <div className="w-full pt-4 border-t border-border-theme/40 space-y-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Player UUID</span>
              <span className="font-mono text-[9px] text-text-primary font-bold truncate max-w-[130px]" title={profile.id}>
                {profile.id}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Player Status</span>
              <span className="font-bold text-success text-[10px] uppercase tracking-wider">
                {profile.status}
              </span>
            </div>
          </div>
        </Card>

        {/* Bio & Identity details */}
        <Card className="p-6 md:col-span-2 border-border-theme bg-card space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Sparkles size={13} className="text-accent animate-pulse" />
            <span>Character Parameters</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Display Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onBlur={() => handleInstantSave("displayName", displayName)}
                className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                placeholder="Guru Dev"
              />
            </div>

            {/* First Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => handleInstantSave("firstName", firstName)}
                className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                placeholder="First Name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => handleInstantSave("lastName", lastName)}
                className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                placeholder="Last Name"
              />
            </div>

            {/* Biography */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Biography / Motto
                </label>
                <span className="text-[9px] font-mono text-text-secondary/70">{bio.length}/300</span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.substring(0, 300))}
                onBlur={() => handleInstantSave("bio", bio)}
                className="w-full p-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 min-h-[90px] resize-none transition-all"
                placeholder="Define your daily motivation motto..."
              />
            </div>

            {/* Timezone */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center gap-1.5">
                <Globe size={12} className="text-text-secondary" />
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Timezone
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled
                  value={timezone}
                  className="w-full h-10 rounded-xl border border-border-theme bg-card/50 px-3 text-xs text-text-secondary cursor-not-allowed outline-none font-mono"
                />
              </div>
              <p className="text-[9px] text-text-secondary/60">
                Timezone is configured automatically from client locale parameters.
              </p>
            </div>

          </div>
        </Card>
      </div>

      {/* Row 2: Character Stats (Remains local for Sprint 2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Scholar Level"
          value={`Lvl ${user.level}`}
          description="Progressing milestones"
          icon={Award}
          iconColorClass="text-purple-500 bg-purple-500/10 border-purple-500/20"
        />
        <StatsCard
          title="Focus Experience"
          value={`${user.xp} XP`}
          description="Lifetime accumulated XP"
          icon={Zap}
          iconColorClass="text-accent bg-accent/10 border-accent/20"
        />
        <StatsCard
          title="Streak Record"
          value={`${user.streak} Days`}
          description="Consecutive daily study runs"
          icon={Flame}
          iconColorClass="text-amber-500 bg-amber-500/10 border-amber-500/20"
        />
        <StatsCard
          title="Study Coin Bank"
          value={`${user.coins} Coins`}
          description="Available reward shop credits"
          icon={Star}
          iconColorClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        />
      </div>
    </div>
  );
}
