"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, RefreshCw, LogOut } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, status, verifyEmail, resendVerificationEmail, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const email = user?.email || "";

  const handleCheckStatus = async () => {
    setChecking(true);
    const verified = await verifyEmail();
    setChecking(false);
    
    if (verified) {
      router.push("/dashboard");
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      showToast("Email address is not loaded. Try signing in again.", "error", "Link Error");
      return;
    }

    setResending(true);
    await resendVerificationEmail(email);
    setResending(false);
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary">
              Verify your email
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Please verify your email to unlock dashboard access
            </p>
          </div>
        </div>

        <Card className="p-6 border-border-theme shadow-xl bg-card space-y-5 text-center">
          <div className="flex justify-center text-accent animate-[bounce_2s_infinite]">
            <Mail size={40} />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-text-secondary leading-relaxed">
              We've dispatched a secure verification link to{" "}
              <span className="font-bold text-text-primary">{email || "your inbox"}</span>.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleCheckStatus}
              disabled={checking || status === "initializing"}
              className="w-full h-10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} className={checking ? "animate-spin" : ""} />
              <span>{checking ? "Checking Status..." : "Check Status"}</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleResendEmail}
              disabled={resending || !email}
              className="w-full h-10 text-xs font-semibold rounded-xl cursor-pointer border border-border-theme"
            >
              {resending ? "Resending..." : "Resend Verification Email"}
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-danger cursor-pointer select-none"
          >
            <LogOut size={13} />
            <span>Cancel & Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
