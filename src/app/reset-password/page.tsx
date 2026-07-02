"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, status } = useAuthStore();
  const { showToast } = useToastStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const loading = status === "initializing";
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast("Please fill in all password fields.", "error", "Validation Error");
      return;
    }

    if (!passwordRegex.test(password)) {
      showToast(
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.",
        "error",
        "Weak Password"
      );
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error", "Validation Error");
      return;
    }

    const completed = await updatePassword(password);
    if (completed) {
      setSuccess(true);
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
              Set New Password
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Enter your new secure password credentials
            </p>
          </div>
        </div>

        <Card className="p-6 border-border-theme shadow-xl bg-card">
          {success ? (
            <div className="space-y-4 text-center py-2 animate-[fadeIn_200ms_ease]">
              <div className="flex justify-center text-success">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Password Updated
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Your password has been reset successfully. You can now log in using your new credentials.
                </p>
              </div>
              <Link href="/login" className="block">
                <Button variant="primary" size="md" className="w-full text-xs font-semibold rounded-xl cursor-pointer">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 text-xs pl-9"
                    disabled={loading}
                  />
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/55" />
                </div>
                <p className="text-[9px] text-text-secondary/80 leading-normal">
                  Min 8 chars: 1 uppercase, 1 lowercase, 1 number, 1 symbol (@$!%*?&#).
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 text-xs pl-9"
                    disabled={loading}
                  />
                  <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/55" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full h-10 text-xs font-bold rounded-xl cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? "Updating password..." : "Reset Password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
