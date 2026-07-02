"use client";

import React, { useState, useEffect } from "react";
import { X, Zap, Coins, Star, HelpCircle, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMissionStore } from "@/stores/missionStore";
import { missionsConfig } from "@/config/missions";
import { missionRewardsConfig } from "@/config/rewards";

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMissionModal({ isOpen, onClose }: CreateMissionModalProps) {
  const createMission = useMissionStore((state) => state.createMission);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(missionsConfig.subjects[0]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Epic">("Medium");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [lockOnCreate, setLockOnCreate] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rewards preview derived from selected difficulty
  const [preview, setPreview] = useState(
    missionRewardsConfig.difficultyRewards[difficulty]
  );

  useEffect(() => {
    setPreview(missionRewardsConfig.difficultyRewards[difficulty]);
    // Clear difficulty error when changing difficulty
    if (errors.difficulty) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.difficulty;
        return next;
      });
    }
  }, [difficulty, errors.difficulty]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = await createMission({
      title,
      description,
      subject,
      difficulty,
      deadline,
      notes: notes || undefined,
      priority: difficulty === "Hard" ? "High" : "Medium",
    });

    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
      return;
    }

    // If locked option was chosen, retrieve the newly created mission and lock it
    if (lockOnCreate) {
      const missions = useMissionStore.getState().missions;
      const latest = missions[0]; // The store prepends new missions
      if (latest && latest.title === title) {
        await useMissionStore.getState().lockMission(latest.id);
      }
    }

    setIsSubmitting(false);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setSubject(missionsConfig.subjects[0]);
    setDifficulty("Medium");
    setDeadline("");
    setNotes("");
    setLockOnCreate(false);
    setEstimatedHours("");
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-[fadeIn_200ms_ease]">
      {/* Modal Container */}
      <Card
        className="w-full max-w-lg p-6 bg-card border-border-theme shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
        hoverElevation={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-theme mb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-text-primary">
              Initiate New Mission
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Formulate academic targets and reward parameters
            </p>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* Mission Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Mission Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Dynamic Programming Exercises"
              className={errors.title ? "border-danger focus-visible:ring-danger/20" : ""}
            />
            {errors.title && (
              <p className="text-[11px] font-semibold text-danger mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Description / Action Steps
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail specific tasks, page counts, or questions to solve..."
              rows={2}
              className="flex w-full rounded-xl border border-border-theme bg-card px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent resize-none min-h-[70px]"
            />
          </div>

          {/* Grid: Subject & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Subject Focus *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-border-theme bg-card px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer"
              >
                {missionsConfig.subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Toggle Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Difficulty Level *
              </label>
              <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-border-theme h-11">
                {(["Easy", "Medium", "Hard", "Epic"] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      difficulty === diff
                        ? "bg-card text-text-primary shadow-xs"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              {errors.difficulty && (
                <p className="text-[11px] font-semibold text-danger mt-1">
                  {errors.difficulty}
                </p>
              )}
            </div>
          </div>

          {/* Grid: Deadline & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deadline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Deadline *
              </label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={errors.deadline ? "border-danger focus-visible:ring-danger/20" : ""}
              />
              {errors.deadline && (
                <p className="text-[11px] font-semibold text-danger mt-1">
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Estimated Hours (Optional)
              </label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g. 2.5 hours"
              />
            </div>
          </div>

          {/* Live Rewards Preview Panel */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-border-theme rounded-xl p-4 space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Zap size={13} className="text-accent" />
              Loot Preview
            </h4>
            
            <div className="flex items-center gap-4">
              {/* XP */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Zap size={14} className="fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-secondary">Experience</p>
                  <p className="text-sm font-extrabold text-accent">+{preview.xp} XP</p>
                </div>
              </div>

              {/* Coins */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Coins size={14} className="fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-secondary">Gold Coins</p>
                  <p className="text-sm font-extrabold text-amber-500">+{preview.coins} Coins</p>
                </div>
              </div>

              {/* Mission Points */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                  <Star size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-secondary">Mission Points</p>
                  <p className="text-sm font-extrabold text-purple-500">+{preview.missionPoints} MP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lock Mission on Create toggle */}
          <div
            onClick={() => setLockOnCreate(!lockOnCreate)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              lockOnCreate
                ? "bg-slate-900 border-slate-700 text-white dark:bg-slate-800/80"
                : "bg-card border-border-theme text-text-secondary hover:border-slate-350"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {lockOnCreate ? <Lock size={15} className="text-accent" /> : <LockOpen size={15} />}
            </div>
            <div className="space-y-0.5">
              <h5 className={`text-xs font-bold uppercase tracking-wider ${lockOnCreate ? "text-white" : "text-text-primary"}`}>
                Lock Mission Immediately
              </h5>
              <p className="text-[10px] leading-relaxed text-text-secondary">
                Freezes title, difficulty, rewards, and deadline. Locked tasks cannot be edited or deleted, ensuring commitment.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-border-theme">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="h-10 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="h-10 px-6 rounded-xl shrink-0 cursor-pointer"
            >
              {isSubmitting ? "Formulating..." : "Initiate Mission"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
