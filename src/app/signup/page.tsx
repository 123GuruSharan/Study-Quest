"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { signup, status } = useAuthStore();
  const { showToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const loading = status === "initializing";

  // Password criteria regex: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password || !confirmPassword) {
      showToast("Please fill out all required fields.", "error", "Validation Error");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      showToast("Please enter a valid email address.", "error", "Validation Error");
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

    if (!acceptTerms) {
      showToast("You must accept the Terms of Service to continue.", "error", "Validation Error");
      return;
    }

    const success = await signup(email.trim(), password);
    if (success) {
      router.push("/verify-email");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 select-none relative overflow-hidden">
      {/* Background radial soft accent */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_75%)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-text-primary">
              Create your account
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Join StudyQuest to start logging gamified achievements
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 border-border-theme shadow-xl bg-card">
          <form onSubmit={handleSignup} className="space-y-4">
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Password
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

            {/* Accept Terms */}
            <div className="flex items-center gap-2 pt-1 select-none">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm border-border-theme text-accent focus:ring-accent focus:ring-opacity-25"
              />
              <label htmlFor="terms" className="text-xs text-text-secondary font-medium cursor-pointer">
                I accept the{" "}
                <span className="font-bold text-accent hover:underline">Terms of Service</span>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full h-10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
              {!loading && <ArrowRight size={13} />}
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <div className="text-center text-xs text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-accent hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
