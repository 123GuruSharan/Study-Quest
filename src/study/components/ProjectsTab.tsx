"use client";

import React, { useState } from "react";
import { useStudyStore } from "../stores/studyStore";
import { WebDevProject, ProjectInterviewQuestion } from "../types/study";
import {
  FolderGit2,
  ExternalLink,
  Plus,
  HelpCircle,
  Bug,
  ListTodo,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export function ProjectsTab() {
  const { projects, addProject, updateProject, addProjectInterviewQuestion } = useStudyStore();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [activeQuestionModalProject, setActiveQuestionModalProject] = useState<string | null>(null);

  // Form State for new project
  const [newProject, setNewProject] = useState({
    name: "",
    techStackStr: "React, Node.js, Express, MongoDB",
    description: "",
    featuresStr: "Authentication, REST API, Responsive UI",
    progressPercentage: 50,
    githubUrl: "",
    liveUrl: "",
    bugsStr: "",
    remainingFeaturesStr: "",
  });

  // Question Form State
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    suggestedAnswer: "",
  });

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    addProject({
      name: newProject.name.trim(),
      techStack: newProject.techStackStr.split(",").map((s) => s.trim()).filter(Boolean),
      description: newProject.description.trim(),
      features: newProject.featuresStr.split(",").map((s) => s.trim()).filter(Boolean),
      progressPercentage: newProject.progressPercentage,
      githubUrl: newProject.githubUrl.trim(),
      liveUrl: newProject.liveUrl.trim(),
      bugs: newProject.bugsStr.split(",").map((s) => s.trim()).filter(Boolean),
      remainingFeatures: newProject.remainingFeaturesStr.split(",").map((s) => s.trim()).filter(Boolean),
      interviewQuestions: [
        {
          id: `iq_${Date.now()}_1`,
          question: "Why did you choose this tech stack?",
          suggestedAnswer: "Selected for full-stack JavaScript integration, rapid component development, and scalable REST/NoSQL layer.",
        },
        {
          id: `iq_${Date.now()}_2`,
          question: "Explain your project architecture & data flow.",
          suggestedAnswer: "React client renders UI and dispatches actions -> Express server validates & authorizes -> Mongoose queries MongoDB -> Returns JSON payload.",
        },
      ],
    });

    setIsAddProjectModalOpen(false);
    setNewProject({
      name: "",
      techStackStr: "React, Node.js, Express, MongoDB",
      description: "",
      featuresStr: "Authentication, REST API, Responsive UI",
      progressPercentage: 50,
      githubUrl: "",
      liveUrl: "",
      bugsStr: "",
      remainingFeaturesStr: "",
    });
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestionModalProject || !newQuestion.question.trim()) return;

    addProjectInterviewQuestion(
      activeQuestionModalProject,
      newQuestion.question.trim(),
      newQuestion.suggestedAnswer.trim()
    );

    setActiveQuestionModalProject(null);
    setNewQuestion({ question: "", suggestedAnswer: "" });
  };

  return (
    <div className="space-y-6">

      {/* Top Header & Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border-theme/70 rounded-2xl p-5 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            Placement Portfolio & Project Tracker ({projects.length} Projects)
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Track implementation progress, open bugs, and practice core placement interview questions for your projects.
          </p>
        </div>

        <Button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-white font-bold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Plus size={14} /> Add Project
        </Button>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-4">
        {projects.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className="bg-card border border-border-theme/70 rounded-2xl p-6 shadow-xs space-y-4 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {proj.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {proj.description}
                  </p>
                </div>

                {/* Progress Bar & Links */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 w-full md:w-auto justify-between">
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-text-secondary">
                      <span>Progress</span>
                      <span>{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-border-theme hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-primary transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-border-theme hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary hover:text-text-primary transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}

                    <Button
                      onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                      variant="secondary"
                      size="sm"
                      className="h-9 text-xs font-bold rounded-xl border-border-theme"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      <span>{isExpanded ? "Collapse" : "Details & Q&A"}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expanded Details Section */}
              {isExpanded && (
                <div className="pt-4 border-t border-border-theme/40 space-y-5 animate-[fadeIn_200ms_ease]">
                  
                  {/* Features & Bugs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {/* Implemented Features */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border-theme/40 space-y-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 size={13} /> Implemented Features:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                        {proj.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Open Bugs */}
                    <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <Bug size={13} /> Open Bugs / Blockers:
                      </span>
                      {proj.bugs.length === 0 ? (
                        <p className="text-text-secondary italic text-[11px]">No active bugs logged.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                          {proj.bugs.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Remaining Features */}
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                        <ListTodo size={13} /> Remaining Features:
                      </span>
                      {proj.remainingFeatures.length === 0 ? (
                        <p className="text-text-secondary italic text-[11px]">All core features complete!</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-0.5 text-text-secondary">
                          {proj.remainingFeatures.map((rf, i) => (
                            <li key={i}>{rf}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Project Interview Questions & Answers */}
                  <div className="space-y-3 bg-card border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600 dark:text-purple-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={14} /> Project Placement Interview Q&amp;A Prep ({proj.interviewQuestions.length}):
                      </span>

                      <Button
                        onClick={() => setActiveQuestionModalProject(proj.id)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                      >
                        + Add Custom Q&amp;A
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {proj.interviewQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-theme/40 text-xs space-y-1"
                        >
                          <div className="font-bold text-text-primary flex items-start gap-1.5">
                            <HelpCircle size={14} className="text-purple-500 shrink-0 mt-0.5" />
                            <span>{q.question}</span>
                          </div>
                          <div className="pl-5 text-text-secondary">
                            <strong className="text-text-primary font-medium">Answer Guide: </strong>
                            {q.suggestedAnswer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal: Add Project */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
          <div className="bg-card border border-border-theme rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-[fadeIn_200ms_ease]">
            <div className="flex items-center justify-between border-b border-border-theme pb-3">
              <h3 className="text-base font-bold text-text-primary">Add Project to Portfolio</h3>
              <button
                onClick={() => setIsAddProjectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Resume Builder"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, Tailwind, MongoDB"
                  value={newProject.techStackStr}
                  onChange={(e) => setNewProject({ ...newProject, techStackStr: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Short Description</label>
                <textarea
                  placeholder="Overview of what the project does..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">GitHub URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary uppercase text-[10px]">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://myproject.vercel.app"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Key Features (comma separated)</label>
                <input
                  type="text"
                  placeholder="OAuth, Payment Gateway, Real-time Chat"
                  value={newProject.featuresStr}
                  onChange={(e) => setNewProject({ ...newProject, featuresStr: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-theme">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="h-9 px-4 text-xs font-bold rounded-xl border-border-theme"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent/90"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Interview Question */}
      {activeQuestionModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
          <div className="bg-card border border-border-theme rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-[fadeIn_200ms_ease]">
            <div className="flex items-center justify-between border-b border-border-theme pb-3">
              <h3 className="text-base font-bold text-text-primary">Add Project Placement Question</h3>
              <button
                onClick={() => setActiveQuestionModalProject(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do you handle state synchronization across tabs?"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary uppercase text-[10px]">Suggested Answer Guide</label>
                <textarea
                  placeholder="Explain how you would answer this in an interview..."
                  value={newQuestion.suggestedAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, suggestedAnswer: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-border-theme bg-card text-xs text-text-primary focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-theme">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveQuestionModalProject(null)}
                  className="h-9 px-4 text-xs font-bold rounded-xl border-border-theme"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-4 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent/90"
                >
                  Save Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
