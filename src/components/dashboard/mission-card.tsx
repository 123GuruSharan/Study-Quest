"use client";

import React, { useRef } from "react";
import { Lock, Check, Zap, Coins, Clock, Star, Eye, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types/mission";
import { useMissionStore } from "@/stores/missionStore";

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const { lockMission, uploadProof, completeMission } = useMissionStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleLock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await lockMission(mission.id);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadProof(mission.id, file.name);
    }
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await completeMission(mission.id);
  };

  const formatDeadline = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="relative flex flex-col justify-between p-5 h-full min-h-[220px] hover:border-accent/40 group overflow-hidden select-none">
      {/* Background radial lock overlay if Locked */}
      {mission.status === "Locked" && !mission.proofUploaded && (
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10">
          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/25">
            <Lock size={12} />
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="space-y-3.5">
        {/* Title and Difficulty */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
            {mission.title}
          </h4>
          <Badge variant={getDifficultyColor(mission.difficulty)} className="shrink-0 text-[9px] px-1.5 py-0.5">
            {mission.difficulty}
          </Badge>
        </div>

        {/* Notes or Description */}
        {mission.description && (
          <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
            {mission.description}
          </p>
        )}

        {/* Rewards grid */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="primary" className="gap-1 text-[9px] py-0.5 px-1.5">
            <Zap size={10} className="fill-current" />
            <span>+{mission.xpReward} XP</span>
          </Badge>
          <Badge variant="warning" className="gap-1 text-[9px] py-0.5 px-1.5">
            <Coins size={10} className="fill-current" />
            <span>+{mission.coinReward} c</span>
          </Badge>
          <Badge variant="outline" className="gap-1 text-[9px] py-0.5 px-1.5">
            <Star size={10} className="text-accent" />
            <span>{mission.missionPoints} MP</span>
          </Badge>
        </div>

        {/* Proof System Upload Block */}
        {mission.status === "Locked" && (
          <div className="pt-2 border-t border-border-theme/40 space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block">
              Evidence of Completion *
            </span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            {!mission.proofUploaded ? (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-border-theme hover:border-accent/40 bg-slate-50/50 dark:bg-slate-800/20 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <UploadCloud size={13} />
                <span>Upload proof (Image, PDF)</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileText size={12} className="shrink-0" />
                  <span className="text-[10px] font-semibold truncate">
                    {mission.proofFileName || "evidence_doc.png"}
                  </span>
                </div>
                <CheckCircle2 size={13} className="shrink-0 text-success" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer & Action Trays */}
      <div className="mt-4 pt-3 border-t border-border-theme flex items-center justify-between">
        {/* Clock/Deadline */}
        <div className="flex items-center gap-1.5 text-text-secondary shrink-0">
          <Clock size={12} />
          <span className="text-[10px] font-semibold">
            {formatDeadline(mission.deadline)}
          </span>
        </div>

        {/* Action Trays */}
        <div className="flex items-center justify-end gap-1.5">
          {mission.status === "Draft" && (
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-[11px] font-bold px-3 rounded-lg flex items-center gap-1 cursor-pointer"
              onClick={handleLock}
            >
              <Lock size={11} />
              <span>Lock Target</span>
            </Button>
          )}

          {mission.status === "Locked" && (
            <Button
              variant="primary"
              size="sm"
              className="h-8 text-[11px] font-bold px-3 rounded-lg cursor-pointer"
              disabled={!mission.proofUploaded}
              onClick={handleComplete}
            >
              Complete
            </Button>
          )}

          {mission.status === "Completed" && (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-success select-none">
              <Check size={14} className="stroke-[3px]" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
