"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { resetPassword, status } = useAuthStore();
  const { showToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const loading = status === "initializing";

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email address.", "error", "Validation Error");
      return;
    }

    const completed = await resetPassword(email.trim());
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
              Reset Password
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Enter your email to receive recovery link
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
                  Email Disbursed
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  We've sent a secure password reset link to{" "}
                  <span className="font-bold text-text-primary">{email}</span>. Check your inbox and spam folders.
                </p>
              </div>
              <Link href="/login" className="block">
                <Button variant="secondary" size="md" className="w-full text-xs font-semibold rounded-xl cursor-pointer border border-border-theme">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full h-10 text-xs font-bold rounded-xl cursor-pointer mt-2"
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </Card>

        {!success && (
          <div className="text-center text-xs">
            <Link href="/login" className="inline-flex items-center gap-1 font-bold text-text-secondary hover:text-accent select-none">
              <ArrowLeft size={12} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
