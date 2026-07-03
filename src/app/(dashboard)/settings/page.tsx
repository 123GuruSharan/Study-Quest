"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { Settings as SettingsIcon, LogOut, Clock, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const { loadUser, user, userRepositorySave, isLoading } = useUserStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-text-secondary">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-semibold">Loading settings...</span>
      </div>
    );
  }

  const handlePhoneLimitChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...user, phoneUsageMinutes: parseInt(e.target.value) || 0 };
    await userRepositorySave(updated);
  };



  const handleSignOutClick = async () => {
    await logout();
    // Redirect is automatically triggered by AuthProvider when status becomes anonymous
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full select-none animate-[fadeIn_200ms_ease] pb-10">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">
          System Settings
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure study goals, screen time limits, and session credentials
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Goals & Limits Card */}
        <Card className="p-6 border-border-theme bg-card space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <SettingsIcon size={14} className="text-accent" />
            <span>Study Parameters</span>
          </h4>

          <div className="space-y-4">
            {/* Phone Limit */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-text-secondary" />
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Daily Phone Limit (Minutes)
                </label>
              </div>
              <input
                type="number"
                value={user.phoneUsageMinutes}
                onChange={handlePhoneLimitChange}
                className="w-full h-10 rounded-xl border border-border-theme bg-card px-3 text-xs text-text-primary focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
                placeholder="60"
              />
            </div>


          </div>
        </Card>

        {/* Danger Zone / Session Management */}
        <Card className="p-6 border-red-500/10 bg-card space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-danger">
            Session Controls
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Signing out will disconnect your secure session from the local client.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleSignOutClick}
              className="w-full h-10 text-xs font-bold hover:bg-danger hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-border-theme"
            >
              <LogOut size={13} />
              <span>Sign Out Session</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
