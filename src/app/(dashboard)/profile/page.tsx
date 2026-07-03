"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/profile/stores/profileStore";
import { useMissionStore } from "@/stores/missionStore";
import { useStatisticsStore } from "@/stores/statisticsStore";
import { profileRepository } from "@/profile/repositories/ProfileRepository";
import { calculateBossStats, getBossForDefeatedCount } from "@/config/bosses";
import { getLifetimeStudyMinutes, formatStudyHours } from "@/game/systems/studyHoursDerivation";
import { 
  Flame, 
  Star, 
  Award, 
  Zap, 
  Sparkles, 
  Camera, 
  Loader2, 
  Globe, 
  Target, 
  Trophy, 
  Gift, 
  BookOpen, 
  ShieldAlert, 
  Info,
  Calendar,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  X,
  Compass
} from "lucide-react";

export default function ProfilePage() {
  const { user, loadUser, isLoading: isUserLoading, journeyLog, achievements } = useUserStore();
  const { user: authUser } = useAuthStore();
  const { profile, updateProfile, uploadAvatar, loading: isProfileUpdating } = useProfileStore();
  const { loadMissions, missions } = useMissionStore();
  const { historyLogs, loadHistoryLogs } = useStatisticsStore();

  // Local form editing states
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  // Collapsible panels
  const [showDevDetails, setShowDevDetails] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUser();
    loadMissions();
    loadHistoryLogs();
  }, [loadUser, loadMissions, loadHistoryLogs]);

  // Sync form states with profile fields on load
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setBio(profile.bio || "");
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

  // Edit action handlers
  const handleStartEdit = () => {
    setDisplayName(profile.displayName || "");
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setBio(profile.bio || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    const success = await updateProfile(profile.id, {
      displayName: displayName.trim(),
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      bio: bio.trim() || null,
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleAvatarTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    await uploadAvatar(profile.id, file);
  };

  // 1. Identity Completion Checklist
  const identityChecklist = [
    { label: "Profile Picture", met: !!profile.avatarUrl },
    { label: "Display Name", met: !!profile.displayName && profile.displayName !== "New Player" },
    { label: "First Name", met: !!profile.firstName },
    { label: "Last Name", met: !!profile.lastName },
    { label: "Biography", met: !!profile.bio && profile.bio.trim().length > 0 },
    { label: "Timezone", met: !!profile.timezone }
  ];

  const metCount = identityChecklist.filter((item) => item.met).length;
  const checklistPercentage = Math.round((metCount / identityChecklist.length) * 100);
  const isIdentityComplete = metCount === identityChecklist.length;

  // 2. Lifetime Statistics Calculations (Consuming stores / logs directly)
  const completedMissionsCount = missions.filter((m) => m.status === "Completed").length;
  const unlockedAchievementsCount = achievements.filter((a) => a.progressPercentage === 100).length;
  
  // Resolve boss combat damage
  const bossesDefeatedCount = user?.bossesDefeatedCount || 0;
  const combatStats = calculateBossStats(journeyLog, bossesDefeatedCount);
  const totalBossDamage = combatStats.totalDamageDealt;

  // Active weekly boss details
  const activeBoss = getBossForDefeatedCount(bossesDefeatedCount);

  // Helper formatting for empty statistics values (converts 0 -> —)
  const formatStatValue = (val: number | string, suffix: string = "") => {
    if (val === 0 || val === "0" || val === "" || val === null || val === undefined) {
      return "—";
    }
    return `${val}${suffix}`;
  };

  // Resolve public avatar url
  const avatarUrl = profile.avatarUrl
    ? profileRepository.getPublicUrl(profile.avatarUrl)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "Scholar")}&background=3b82f6&color=fff&bold=true`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full select-none animate-[fadeIn_200ms_ease] pb-12">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Character Profile
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your StudyQuest character parameters and view your academic achievements.
          </p>
        </div>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Character Card & Checklist */}
        <div className="space-y-6 md:col-span-1">
          
          {/* Identity Card */}
          <Card className="p-6 border-border-theme bg-card flex flex-col items-center text-center space-y-4">
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
              <h4 className="text-base font-black tracking-tight text-text-primary">
                {profile.displayName || "New Scholar"}
              </h4>
              <p className="text-[11px] font-mono text-text-secondary mt-0.5">
                @{profile.username}
              </p>
            </div>
          </Card>

          {/* Setup Checklist Card */}
          <Card className="p-5 border-border-theme bg-card space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Identity Completion
              </span>
              <span className="text-xs font-black text-text-primary">
                {isIdentityComplete ? (
                  <span className="text-success font-black flex items-center gap-1">
                    🏆 Identity Complete
                  </span>
                ) : (
                  `${checklistPercentage}%`
                )}
              </span>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-theme/40">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-accent rounded-full transition-all duration-500"
                style={{ width: `${checklistPercentage}%` }}
              />
            </div>

            {/* Checklist Items list */}
            <div className="space-y-2 pt-2 text-[11px] text-text-secondary font-semibold">
              {identityChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.met ? (
                    <CheckCircle2 size={13} className="text-success" />
                  ) : (
                    <XCircle size={13} className="text-text-secondary/30" />
                  )}
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Right Column: Profile Form fields */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-border-theme bg-card space-y-5">
            
            {/* Header controls: Edit Mode Toggle */}
            <div className="flex justify-between items-center border-b border-border-theme/40 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent animate-pulse" />
                <span>Character Parameters</span>
              </h4>
              
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  disabled={isProfileUpdating}
                  className="px-3.5 py-1.5 rounded-xl border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-extrabold text-text-secondary hover:text-text-primary flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit size={12} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-xl border border-border-theme hover:bg-slate-50 dark:hover:bg-slate-800 text-[10px] font-extrabold text-text-secondary hover:text-text-primary flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X size={12} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-[10px] font-extrabold text-white flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    <Save size={12} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Editable/Read-only Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
              
              {/* Display Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all font-semibold"
                    placeholder="Master Guru"
                  />
                ) : (
                  <p className="text-xs font-bold text-text-primary p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-border-theme/40 min-h-[38px] flex items-center">
                    {profile.displayName || "—"}
                  </p>
                )}
              </div>

              {/* First Name */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                    placeholder="First Name"
                  />
                ) : (
                  <p className="text-xs font-semibold text-text-primary p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-border-theme/40 min-h-[38px] flex items-center">
                    {profile.firstName || "—"}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                    placeholder="Last Name"
                  />
                ) : (
                  <p className="text-xs font-semibold text-text-primary p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-border-theme/40 min-h-[38px] flex items-center">
                    {profile.lastName || "—"}
                  </p>
                )}
              </div>

              {/* Biography */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                    Biography / Motto
                  </label>
                  {isEditing && (
                    <span className="text-[9px] font-mono text-text-secondary/70">{bio.length}/300</span>
                  )}
                </div>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.substring(0, 300))}
                    className="w-full p-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 min-h-[90px] resize-none transition-all"
                    placeholder="Define your daily study motivation motto..."
                  />
                ) : (
                  <p className="text-xs font-semibold text-text-secondary p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-border-theme/40 min-h-[90px] leading-relaxed break-words whitespace-pre-wrap">
                    {profile.bio || "—"}
                  </p>
                )}
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* Lifetime Progress RPG Statistics dashboard */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
          <Award size={13} className="text-accent" />
          <span>Lifetime Progress</span>
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {/* Hours Card */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Total Study Hours</span>
            <span className="text-xl font-black text-text-primary font-mono">
              {formatStudyHours(getLifetimeStudyMinutes(historyLogs))}
            </span>
          </Card>

          {/* Missions Completed */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Missions Completed</span>
            <span className="text-xl font-black text-accent font-mono">{formatStatValue(completedMissionsCount)}</span>
          </Card>

          {/* Boss Damage */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Total Boss Damage</span>
            <span className="text-xl font-black text-red-500 font-mono">{formatStatValue(totalBossDamage, " HP")}</span>
          </Card>

          {/* Achievements */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Achievements Unlocked</span>
            <span className="text-xl font-black text-purple-500 font-mono">{formatStatValue(unlockedAchievementsCount)}</span>
          </Card>

          {/* Longest streak */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Longest Streak</span>
            <span className="text-xl font-black text-amber-500 font-mono">{formatStatValue(user.streak, " Days")}</span>
          </Card>

          {/* Lifetime XP */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Lifetime XP Earned</span>
            <span className="text-xl font-black text-blue-500 font-mono">{formatStatValue(user.xp, " XP")}</span>
          </Card>

          {/* Lifetime Coins */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Study Coins Bank</span>
            <span className="text-xl font-black text-emerald-500 font-mono">{formatStatValue(user.coins)}</span>
          </Card>

          {/* Level Details */}
          <Card className="p-4 border-border-theme bg-card flex flex-col justify-between min-h-[100px]">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block mb-2">Scholar Level</span>
            <span className="text-xl font-black text-text-primary font-mono">Lvl {user.level}</span>
          </Card>
        </div>
      </div>

      {/* Scholar Journey & Account Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Scholar Journey (RPG Record sheet) */}
        <Card className="p-5 border-border-theme bg-card space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 border-b border-border-theme/40 pb-3">
            <Compass size={13} className="text-accent" />
            <span>Scholar Journey</span>
          </h4>
          
          <div className="space-y-2.5 text-xs text-text-secondary font-semibold">
            <div className="flex justify-between items-center">
              <span>Member Since</span>
              <span className="text-text-primary font-mono">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Rank</span>
              <span className="text-text-primary font-bold">{user.rankName || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Level</span>
              <span className="text-accent font-black font-mono">Lvl {user.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Streak</span>
              <span className="text-amber-500 font-black font-mono">{user.streak} Days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Weekly Boss</span>
              <span className="text-red-500 font-bold">{activeBoss.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Weekly Bosses Defeated</span>
              <span className="text-text-primary font-mono">{bossesDefeatedCount} Bosses</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Profile Timezone</span>
              <span className="text-text-primary font-mono">{profile.timezone}</span>
            </div>
          </div>
        </Card>

        {/* Account Information Panel */}
        <Card className="p-5 border-border-theme bg-card space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 border-b border-border-theme/40 pb-3">
            <Info size={13} className="text-emerald-500" />
            <span>Account Details</span>
          </h4>

          <div className="space-y-2.5 text-xs text-text-secondary font-semibold">
            <div className="flex justify-between items-center">
              <span>Registered Email</span>
              <span className="text-text-primary font-mono">{authUser?.email || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Unique Username</span>
              <span className="text-text-primary font-mono">@{profile.username}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database Provider</span>
              <span className="text-text-primary">Supabase Database</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Authentication Gate</span>
              <span className="text-text-primary">Supabase Auth Services</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Account Sync</span>
              <span className="text-text-primary font-mono">Real-time</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Developer details (Collapsible panel) */}
      <Card className="border-border-theme bg-card p-4 text-left">
        <button
          onClick={() => setShowDevDetails(!showDevDetails)}
          className="w-full flex items-center justify-between text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Lock size={12} className="text-slate-400" />
            <span>Developer Details</span>
          </span>
          {showDevDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDevDetails && (
          <div className="pt-4 border-t border-border-theme/30 mt-3 text-xs text-text-secondary font-semibold space-y-2.5 animate-[fadeIn_150ms_ease] font-mono text-[10px]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <span>Player UUID:</span>
              <span className="text-text-primary font-bold select-text bg-slate-50 dark:bg-slate-900/50 p-1 px-2.5 rounded-lg border border-border-theme/40 break-all">
                {profile.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Account Status:</span>
              <span className="text-success font-bold uppercase tracking-widest">{profile.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database Version:</span>
              <span className="text-text-primary font-bold">Supabase PostgreSQL 15.x</span>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
}
