"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/profile/stores/profileStore";
import { profileService } from "@/profile/services/ProfileService";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Sparkles, Camera, ArrowRight, Check, X, Loader2 } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setupProfile, loading } = useProfileStore();
  const { showToast } = useToastStore();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  
  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Username live-check states
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live username check effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const cleanVal = username.trim().toLowerCase();
    if (!cleanVal) {
      setUsernameState("idle");
      return;
    }

    // Regex check first
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!regex.test(cleanVal)) {
      setUsernameState("invalid");
      return;
    }

    setUsernameState("checking");
    debounceTimerRef.current = setTimeout(async () => {
      const isAvailable = await profileService.isUsernameAvailable(cleanVal);
      setUsernameState(isAvailable ? "available" : "taken");
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [username]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Avatar image size must be less than 2 MB.", "error", "File Too Large");
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Invalid format. Only PNG, JPG and WEBP are supported.", "error", "Format Error");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showToast("Session expired. Please sign in again.", "error", "Auth Required");
      router.replace("/login");
      return;
    }

    if (!displayName.trim()) {
      showToast("Please provide a display name.", "error", "Validation Failed");
      return;
    }

    if (usernameState === "taken") {
      showToast("This username is already taken.", "error", "Validation Failed");
      return;
    }

    if (usernameState === "invalid" || !username.trim()) {
      showToast("Please enter a valid username.", "error", "Validation Failed");
      return;
    }

    const success = await setupProfile(user.id, {
      username: username.toLowerCase().trim(),
      displayName: displayName.trim(),
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      bio: bio.trim() || null,
      avatarFile,
    });

    if (success) {
      router.replace("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] p-4 sm:p-6 select-none transition-colors duration-200">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <Card className="w-full max-w-xl p-6 sm:p-10 border border-slate-200 shadow-md relative overflow-hidden bg-white rounded-2xl">
        {/* Sleek top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 bg-blue-50 rounded-2xl text-accent border border-blue-100 mb-3.5 animate-[bounce_3s_ease_infinite]">
            <Sparkles size={22} className="fill-current" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Establish Your Player Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
            Configure your alias. This credentials card represents your cloud account throughout the StudyQuest game grid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleAvatarTrigger}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer group hover:border-accent hover:bg-slate-100/50 transition-all duration-200"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400 group-hover:text-accent">
                  <Camera size={20} className="mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Upload</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200">
                <Camera size={18} />
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />
            <span className="text-[10px] text-slate-400 font-medium mt-2">
              Max size 2MB. formats: PNG, JPG, WEBP (Optional)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Username */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="username" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Username *
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="e.g. guru_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-accent focus:bg-white outline-none transition-all font-mono"
                />
                
                {/* Status indicator */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
                  {usernameState === "checking" && (
                    <Loader2 size={15} className="text-slate-400 animate-spin" />
                  )}
                  {usernameState === "available" && (
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                      <Check size={13} className="stroke-[3px]" />
                      <span>Available</span>
                    </div>
                  )}
                  {usernameState === "taken" && (
                    <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold">
                      <X size={13} className="stroke-[3px]" />
                      <span>Taken</span>
                    </div>
                  )}
                  {usernameState === "invalid" && (
                    <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                      <X size={13} className="stroke-[3px]" />
                      <span>Invalid format</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Alphanumeric lowercases & underscores, 3-20 characters. Will be used as player handle.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="displayName" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Display Name (Nickname) *
              </label>
              <input
                id="displayName"
                type="text"
                required
                placeholder="e.g. Master Guru"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-accent focus:bg-white outline-none transition-all"
              />
            </div>

            {/* First Name */}
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-accent focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-accent focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Biography */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex justify-between items-center">
                <label htmlFor="bio" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Biography (Bio)
                </label>
                <span className="text-[9px] font-bold text-slate-400 font-mono">
                  {bio.length}/300
                </span>
              </div>
              <textarea
                id="bio"
                placeholder="Write a brief profile description..."
                value={bio}
                onChange={(e) => setBio(e.target.value.substring(0, 300))}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:border-accent focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || usernameState === "checking" || usernameState === "taken" || usernameState === "invalid"}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer transition-all duration-150 shadow-md shadow-accent/15"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Configuring Cloud Player...</span>
              </>
            ) : (
              <>
                <span>Enter StudyQuest</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
