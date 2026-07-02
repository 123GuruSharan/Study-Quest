"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuthStore();
  const { showToast } = useToastStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loading = status === "initializing";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast("Please fill in both email and password fields.", "error", "Validation Error");
      return;
    }

    const success = await login(email.trim(), password.trim());
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none relative overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary">
              Welcome back
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Enter credentials to access your study missions
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 border-border-theme shadow-xl bg-card">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="h-10 text-xs pl-9"
                  disabled={loading}
                />
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/55" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
            </div>

            {/* Action Buttons */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full h-10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight size={13} />}
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <div className="text-center text-xs text-text-secondary">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-accent hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
