"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Import the local illustration from the login folder
import illustration from "../login/image.png";

export default function SignupPage() {
  const router = useRouter();
  const { signup, status } = useAuthStore();
  const { showToast } = useToastStore();

  const [fullName, setFullName] = useState("");
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

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
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
      showToast("You must accept the Terms & Conditions to continue.", "error", "Validation Error");
      return;
    }

    const success = await signup(email.trim(), password);
    if (success) {
      // Store full name locally for profile setup
      localStorage.setItem("studyquest_signup_fullname", fullName.trim());
      router.push("/verify-email");
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-white dark:bg-slate-950 transition-colors duration-200 select-none overflow-hidden font-sans">
      
      {/* Left Column: Authentic Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-7">
          
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight">
              Ready to start your success story?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Signup to our website and start leafing through your favorite literature today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5 pt-2">
            
            {/* Full Name */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="janedoe@mail.com"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 py-1.5 focus-within:border-[#96cdfb] transition-all">
              <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-transparent border-none p-0 text-sm text-slate-800 dark:text-white placeholder-slate-300 focus:outline-hidden focus:ring-0 focus:border-none"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2.5 pt-2 select-none">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-300 text-[#96cdfb] focus:ring-[#96cdfb] focus:ring-opacity-25"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-400 dark:text-slate-500 font-medium cursor-pointer">
                I agree to the <span className="text-[#96cdfb] hover:underline">Terms & Conditions</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-5 bg-[#96cdfb] hover:bg-[#85c1f9] active:bg-[#72b5f7] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
              >
                {loading ? "Signing up..." : "Sign up"}
              </Button>

              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Already registered?{" "}
                <Link href="/login" className="font-bold text-[#96cdfb] hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>

      {/* Right Column: Illustration Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#faf9f6] dark:bg-slate-900 justify-center items-center relative p-8">
        <div className="relative w-full h-full max-w-lg max-h-lg flex items-center justify-center">
          <Image
            src={illustration}
            alt="Study Illustration"
            priority
            className="object-contain w-auto h-auto max-w-full max-h-full"
          />
        </div>
      </div>

    </div>
  );
}
