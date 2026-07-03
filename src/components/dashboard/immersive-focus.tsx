"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  ChevronDown, 
  Music, 
  Image as ImageIcon,
  Award, 
  Zap, 
  Coins, 
  Sparkles,
  CheckCircle2,
  ChevronRight,
  LogOut,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/stores/userStore";
import { useMissionStore } from "@/stores/missionStore";
import { useFocusStore } from "@/stores/focusStore";
import { focusTimerEngine } from "@/game/systems/focusTimerEngine";
import { calculateBossDamage } from "@/config/bosses";
import { levelSystem } from "@/game/systems/levelSystem";

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
  background: string;
  thumbnail: string;
  recommendedAudio: string;
  availableAudio: string[];
  accentColor: string;
  timerStyle: string;
  premium: boolean;
  recommendedSession: number;
  tags: string[];
}

export function ImmersiveFocus() {
  const { user } = useUserStore();
  const { missions } = useMissionStore();
  
  const {
    mode,
    durationMinutes,
    remainingSeconds,
    isRunning,
    isPaused,
    associatedMissionId,
    showSummaryModal,
    summaryRewards,
    closeSummaryModal,
    setFocusModeActive
  } = useFocusStore();

  // Environment loader states
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentConfig | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Selector dropdowns toggles
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [showAudioMenu, setShowAudioMenu] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Audio object reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch available drop-in environments from filesystem API
  useEffect(() => {
    fetch("/api/focus/environments")
      .then((res) => res.json())
      .then((data: EnvironmentConfig[]) => {
        if (data && data.length > 0) {
          setEnvironments(data);
          
          // Restore selected theme from localStorage if saved
          const savedEnvId = localStorage.getItem("studyquest_focus_env_id");
          const restored = data.find((e) => e.id === savedEnvId) || data[0];
          setCurrentEnv(restored);
          
          // Restore selected audio and volume
          const savedAudio = localStorage.getItem(`studyquest_focus_audio_${restored.id}`);
          setSelectedAudio(savedAudio || restored.recommendedAudio);
        }
      })
      .catch((err) => console.error("Error loading focus environments:", err));

    // Restore volume and mute states
    const savedVol = localStorage.getItem("studyquest_focus_volume");
    if (savedVol !== null) setVolume(parseFloat(savedVol));
    
    const savedMute = localStorage.getItem("studyquest_focus_mute");
    if (savedMute !== null) setIsMuted(savedMute === "true");

    const savedFullscreen = localStorage.getItem("studyquest_focus_fullscreen");
    if (savedFullscreen === "true") {
      enterFullscreen();
    }
  }, []);

  // 2. Playback Audio effect
  useEffect(() => {
    // Stop and clear previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    if (!currentEnv || !selectedAudio) return;

    const audioPath = `/focus/environments/${currentEnv.id}/${selectedAudio}`;
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    // Start playing immediately if timer is active
    if (isRunning && !isPaused) {
      audio.play().catch((err) => console.warn("Audio play blocked by browser:", err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [currentEnv, selectedAudio]);

  // Sync volume/mute values on change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem("studyquest_focus_volume", String(volume));
    localStorage.setItem("studyquest_focus_mute", String(isMuted));
  }, [volume, isMuted]);

  // Sync playback state when timer state pauses/resumes
  useEffect(() => {
    if (!audioRef.current) return;
    if (isRunning && !isPaused) {
      audioRef.current.play().catch((err) => console.warn("Audio play blocked:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isRunning, isPaused]);

  // 3. Browser Fullscreen Helper
  const enterFullscreen = () => {
    const element = containerRef.current || document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => setIsFullscreen(true));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      enterFullscreen();
      localStorage.setItem("studyquest_focus_fullscreen", "true");
    } else {
      exitFullscreen();
      localStorage.setItem("studyquest_focus_fullscreen", "false");
    }
  };

  // Sync browser fullscreen escapes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  // 4. Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm || showSummaryModal) return;

      const activeEl = document.activeElement;
      if (
        activeEl && 
        (activeEl.tagName === "INPUT" || 
         activeEl.tagName === "TEXTAREA" || 
         activeEl.tagName === "SELECT")
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (!isRunning) {
          focusTimerEngine.startTimer();
        } else if (isPaused) {
          focusTimerEngine.resumeTimer();
        } else {
          focusTimerEngine.pauseTimer();
        }
      } else if (e.code === "KeyM" || e.code === "KeyM") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.code === "KeyF" || e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === "Escape") {
        e.preventDefault();
        handleExitAttempt();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, isPaused, showExitConfirm, showSummaryModal]);

  const handleExitAttempt = () => {
    if (isRunning) {
      setShowExitConfirm(true);
    } else {
      setFocusModeActive(false);
    }
  };

  const confirmExit = () => {
    focusTimerEngine.resetTimer();
    setFocusModeActive(false);
  };

  // 5. Timer format & calculations
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${pad(m)}:${pad(s)}`;
  };

  const totalDurationSeconds = mode === "work" ? durationMinutes * 60 : 5 * 60;
  const progressRatio = totalDurationSeconds > 0 ? remainingSeconds / totalDurationSeconds : 0;
  const strokeDashoffset = progressRatio * 283;

  // Attached Mission details
  const activeMission = missions.find((m) => m.id === associatedMissionId);

  // Level Progression stats
  const xpDetails = levelSystem.calculateLevelDetails(user?.xp || 0);

  // Select new environment handler
  const handleSelectEnvironment = (env: EnvironmentConfig) => {
    setCurrentEnv(env);
    localStorage.setItem("studyquest_focus_env_id", env.id);
    
    const savedAudio = localStorage.getItem(`studyquest_focus_audio_${env.id}`);
    setSelectedAudio(savedAudio || env.recommendedAudio);
    
    setShowThemeMenu(false);
  };

  // Select new audio handler
  const handleSelectAudio = (audioFile: string) => {
    setSelectedAudio(audioFile);
    if (currentEnv) {
      localStorage.setItem(`studyquest_focus_audio_${currentEnv.id}`, audioFile);
    }
    setShowAudioMenu(false);
  };

  if (!currentEnv) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white font-sans overflow-hidden select-none"
    >
      
      {/* Background Loops Video */}
      <video
        key={currentEnv.id}
        src={`/focus/environments/${currentEnv.id}/${currentEnv.background}`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000"
      />

      {/* Dark Ambient Layer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/80 pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <div className="relative z-10 p-6 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white shadow-xs">
            <Sparkles size={16} className="animate-[pulse_3s_infinite]" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white block">StudyQuest</span>
            <span className="text-[8px] tracking-widest text-slate-300 uppercase font-bold">Immersive Focus</span>
          </div>
        </div>

        {/* Top controls: Fullscreen & Exit */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 transition-colors text-slate-300 hover:text-white"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          
          <button
            onClick={handleExitAttempt}
            title="Exit Focus Mode (Esc)"
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all text-red-400 hover:text-red-300 flex items-center gap-1.5 text-xs font-bold"
          >
            <LogOut size={13} />
            <span>Exit Focus</span>
          </button>
        </div>
      </div>

      {/* Center Layout Panel */}
      <div className="relative z-10 my-auto w-full max-w-xl mx-auto px-6 flex flex-col items-center space-y-8">
        
        {/* Mission card */}
        {mode === "work" && (
          <div className="w-full">
            {activeMission ? (
              <div className="p-4 rounded-2xl bg-black/65 border border-white/15 backdrop-blur-md shadow-2xl text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Active Mission</span>
                </div>
                <h4 className="text-base font-extrabold text-white leading-tight">{activeMission.title}</h4>
                <div className="flex flex-wrap justify-center items-center gap-3 text-[10px] text-slate-300 font-semibold pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/10">{activeMission.subject}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10">{activeMission.difficulty}</span>
                  <span className="flex items-center gap-0.5 text-accent">
                    <Zap size={10} className="fill-current" />
                    +{activeMission.xpReward} XP
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Coins size={10} className="fill-current" />
                    +{activeMission.coinReward} Coins
                  </span>
                  <span className="flex items-center gap-0.5 text-red-400">
                    <AlertCircle size={10} />
                    -{calculateBossDamage(activeMission.difficulty)} Boss HP
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-black/65 border border-white/15 backdrop-blur-md shadow-2xl text-center space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Free Focus Session</span>
                <h4 className="text-base font-extrabold text-white">General Study Work</h4>
                <div className="flex justify-center items-center gap-4 text-[10px] text-slate-300 font-bold">
                  <span className="flex items-center gap-0.5 text-accent">
                    <Zap size={10} className="fill-current" />
                    +25 XP
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Coins size={10} className="fill-current" />
                    +2 Coins
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Circular Ring Timer */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="85"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="85"
              stroke={mode === "work" ? (currentEnv.accentColor || "var(--accent)") : "#10B981"}
              strokeWidth="5.5"
              fill="transparent"
              strokeDasharray="534"
              strokeDashoffset={534 - (progressRatio * 534)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear shadow-lg"
            />
          </svg>

          {/* Time digits text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {formatTime(remainingSeconds)}
            </span>
            <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-widest mt-1.5 drop-shadow-xs">
              {mode === "work" ? (isPaused ? "Paused" : "Focusing") : "Rest Break"}
            </span>
          </div>
        </div>

        {/* Play Pause Controls */}
        <div className="flex items-center gap-4">
          {mode === "break" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => focusTimerEngine.skipBreak()}
                className="px-5 h-10 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/10 cursor-pointer"
              >
                Skip Break
              </Button>
              <Button
                onClick={() => {
                  focusTimerEngine.skipBreak();
                  focusTimerEngine.startTimer();
                }}
                className="px-6 h-10 rounded-xl text-xs font-extrabold bg-white text-black hover:bg-white/90 cursor-pointer flex items-center gap-1.5"
              >
                <Play size={13} className="fill-current" />
                <span>Next Session</span>
              </Button>
            </div>
          ) : (
            <>
              <button
                onClick={() => focusTimerEngine.resetTimer()}
                disabled={!isRunning}
                title="Restart Session"
                className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCcw size={15} />
              </button>

              {!isRunning ? (
                <Button
                  onClick={() => focusTimerEngine.startTimer()}
                  className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-extrabold text-sm cursor-pointer flex items-center gap-2 shadow-2xl"
                >
                  <Play size={15} className="fill-current" />
                  <span>Start Focus</span>
                </Button>
              ) : isPaused ? (
                <Button
                  onClick={() => focusTimerEngine.resumeTimer()}
                  className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-extrabold text-sm cursor-pointer flex items-center gap-2 shadow-2xl"
                >
                  <Play size={15} className="fill-current" />
                  <span>Resume</span>
                </Button>
              ) : (
                <Button
                  onClick={() => focusTimerEngine.pauseTimer()}
                  className="h-12 px-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 text-white font-extrabold text-sm cursor-pointer flex items-center gap-2 shadow-2xl"
                >
                  <Pause size={15} />
                  <span>Pause</span>
                </Button>
              )}
            </>
          )}
        </div>

      </div>

      {/* Bottom Environments Selection Controls Bar */}
      <div className="relative z-10 p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-t from-black/80 to-transparent w-full">
        
        {/* Environment Theme selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowAudioMenu(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/45 border border-white/15 hover:bg-black/65 transition-all text-xs font-bold text-slate-200 hover:text-white cursor-pointer"
          >
            <ImageIcon size={14} className="text-accent" />
            <span>Theme: {currentEnv.name}</span>
            <ChevronDown size={12} className={`transition-transform ${showThemeMenu ? "rotate-180" : ""}`} />
          </button>

          {/* Theme Dropdown menu */}
          {showThemeMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl bg-slate-950/95 border border-white/10 p-3 shadow-2xl space-y-2 z-20 backdrop-blur-md animate-[fadeIn_150ms_ease]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Select Environment</span>
              <div className="grid grid-cols-2 gap-2">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => handleSelectEnvironment(env)}
                    className={`flex flex-col text-left rounded-xl overflow-hidden border p-1 transition-all ${
                      currentEnv.id === env.id
                        ? "border-accent bg-accent/10"
                        : "border-white/5 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={`/focus/environments/${env.id}/${env.thumbnail}`}
                        alt={env.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white mt-1 px-1 truncate w-full">{env.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ambient Audio Selection & Vol controls */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          
          {/* Ambience selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAudioMenu(!showAudioMenu);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/45 border border-white/15 hover:bg-black/65 transition-all text-xs font-bold text-slate-200 hover:text-white cursor-pointer"
            >
              <Music size={14} className="text-emerald-400" />
              <span className="capitalize">Sound: {selectedAudio.replace(".mp3", "").replace("-", " ")}</span>
              <ChevronDown size={12} className={`transition-transform ${showAudioMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Audio Dropdown menu */}
            {showAudioMenu && (
              <div className="absolute bottom-full right-0 md:left-0 mb-2 w-52 rounded-2xl bg-slate-950/95 border border-white/10 p-2 shadow-2xl space-y-0.5 z-20 backdrop-blur-md animate-[fadeIn_150ms_ease]">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block p-1.5 mb-0.5">Select Ambient Noise</span>
                {currentEnv.availableAudio.map((audioFile) => (
                  <button
                    key={audioFile}
                    onClick={() => handleSelectAudio(audioFile)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-between ${
                      selectedAudio === audioFile
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{audioFile.replace(".mp3", "").replace("-", " ").replace("white noise", "white noise")}</span>
                    {selectedAudio === audioFile && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Slider control */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute (M)"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={isMuted}
              className="w-20 accent-white h-1 rounded-lg bg-white/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

        </div>

      </div>

      {/* Exit Confirmation Dialog Modal Overlay */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <Card className="p-6 max-w-sm w-full text-center border-white/15 bg-slate-900/95 space-y-4 shadow-2xl rounded-2xl animate-[scaleIn_150ms_ease]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <LogOut size={20} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Exit Focus Session?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leaving focus mode will reset the active countdown timer. Do you wish to proceed?
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 text-xs font-bold h-10 rounded-xl border-white/10 text-white bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                No, Stay
              </Button>
              <Button
                onClick={confirmExit}
                className="flex-1 text-xs font-bold h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              >
                Yes, Exit
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Completion Summary Overlay Modal */}
      {showSummaryModal && summaryRewards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-[fadeIn_200ms_ease]">
          <Card className="p-6 max-w-md w-full text-center border-white/15 bg-slate-950/90 relative overflow-hidden animate-[scaleIn_200ms_ease] space-y-5 rounded-3xl shadow-2xl">
            
            {/* Visual shine badge */}
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={24} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight">Focus Complete!</h3>
              <p className="text-xs text-slate-400">
                Outstanding study session volume logged. Rewards disbursed:
              </p>
            </div>

            {/* Payout metrics summaries card grid */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl grid grid-cols-3 gap-2 divide-x divide-white/10">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Duration</span>
                <span className="text-sm font-black text-white block font-mono">{summaryRewards.duration} Mins</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">XP Gained</span>
                <span className="text-sm font-black text-accent block font-mono">+{summaryRewards.xp} XP</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase font-bold text-slate-400 block">Coins Earned</span>
                <span className="text-sm font-black text-amber-400 block font-mono">+{summaryRewards.coins}</span>
              </div>
            </div>

             {/* Level up meter details */}
            <div className="space-y-2 text-left p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Level {xpDetails.level} ({xpDetails.rankName})</span>
                <span className="font-mono">{xpDetails.xpInCurrentLevel} / {xpDetails.xpRequiredForNextLevel} XP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${xpDetails.percentage}%` }}
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                onClick={() => {
                  closeSummaryModal();
                  focusTimerEngine.startTimer(); // Immediately start break interval
                }}
                className="w-full font-bold text-xs h-11 rounded-xl bg-white text-black hover:bg-white/90 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Take 5-Minute Break</span>
                <ChevronRight size={14} />
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    closeSummaryModal();
                    setFocusModeActive(false); // Return directly
                  }}
                  className="flex-1 font-bold text-xs h-10 rounded-xl border-white/10 text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  Return to Dashboard
                </Button>
                
                <Button
                  onClick={() => {
                    closeSummaryModal();
                    focusTimerEngine.startTimer(); // Start another focus
                  }}
                  className="flex-1 font-bold text-xs h-10 rounded-xl bg-accent hover:bg-accent/90 text-white cursor-pointer"
                >
                  Start Another Session
                </Button>
              </div>
            </div>
            
          </Card>
        </div>
      )}

    </div>
  );
}
