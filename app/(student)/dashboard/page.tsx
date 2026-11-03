// app/(student)/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, CalendarClock, MessageSquare, TrendingUp, Users,
  Circle, ChevronDown, ArrowRight, Sparkles, Crown, Clock, AlertCircle
} from "lucide-react";
import CountUp from "../../../components/student/CountUp";
import ProgressRing from "../../../components/student/ProgressRing";
import FlowStepper from "../../../components/student/FlowStepper";
import NextStepCard from "../../../components/student/NextStepCard";
import type { TaskStatus } from "../../../lib/project-store";
import { useStage } from "../../../lib/stage";
import { useProjectStore } from "../../../lib/project-store";
import { projectTabHref } from "../../../lib/project-tabs";
import Loader from "../../../components/Loader";

const badgeClass = {
  done: "badge-approved",
  pending: "badge-pending",
  revision: "badge-revision",
} as const;

const badgeLabel = {
  done: "Done",
  pending: "Pending",
  revision: "Revision",
} as const;

function SectionHeader({
  title,
  action,
  href,
  icon: Icon,
}: {
  title: string;
  action?: string;
  href?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="w-7 h-7 rounded-lg bg-accent text-primary flex items-center justify-center">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
        <h2 className="font-semibold tracking-tight">{title}</h2>
      </div>
      {href && action && (
        <Link
          href={href}
          className="group text-xs font-medium text-secondary hover:underline inline-flex items-center gap-1"
        >
          {action}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function ProjectDashboard() {
  const {
    student, team, project, tasks, toggleTask, milestones, feedback, markFeedbackRead,
  } = useProjectStore();
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const members = team?.members ?? [];
  const shown = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const upcoming = milestones.filter((m) => m.status !== "approved").slice(0, 3);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const approved = milestones.filter((m) => m.status === "approved").length;
  const progress = milestones.length
    ? Math.round((approved / milestones.length) * 100)
    : 0;
  const unread = feedback.filter((f) => !f.resolved && !f.read).length;

  const openFeedback = (id: string) => {
    setOpenId(openId === id ? null : id);
    markFeedbackRead(id);
  };

  const stats = [
    {
      label: "Tasks Done",
      value: doneCount,
      icon: CheckCircle2,
      accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    },
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: TrendingUp,
      accent: "from-blue-500/15 to-blue-500/5 text-blue-600",
    },
    {
      label: "Team Members",
      value: members.length,
      icon: Users,
      accent: "from-violet-500/15 to-violet-500/5 text-violet-600",
    },
    {
      label: "Unread Feedback",
      value: unread,
      icon: MessageSquare,
      accent: "from-amber-500/15 to-amber-500/5 text-amber-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* HERO */}
      <section className="fade-up relative overflow-hidden rounded-3xl p-7 md:p-10 text-primary-foreground">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
          }}
        />
        {/* ambient orbs */}
        <div className="float-slow absolute -top-16 -right-16 w-72 h-72 rounded-full bg-secondary/25 blur-2xl" />
        <div
          className="float-slow absolute -bottom-20 left-1/4 w-56 h-56 rounded-full bg-white/10 blur-2xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="float-slow absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-secondary/20 blur-xl"
          style={{ animationDelay: "0.8s" }}
        />

        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-90 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" /> Welcome back
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
              Hi, {student.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm opacity-80 mb-5 max-w-md">
              {team?.name} <span className="opacity-50 mx-1">•</span> {project?.title}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/profile"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5 transition-all"
              >
                View Profile
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={projectTabHref("milestones")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur text-primary-foreground text-sm font-medium border border-white/20 hover:bg-white/20 transition"
              >
                Open Milestones
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div className="absolute inset-0 rounded-full bg-white/5 blur-xl scale-125" />
            <div className="relative">
              <ProgressRing value={progress} size={140} />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wider opacity-75">
              Milestone progress
            </span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, accent }, i) => (
          <div
            key={label}
            className="fade-up lift group card-surface p-5 flex items-center gap-4 relative overflow-hidden"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none tracking-tight">
                <CountUp to={value} />
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">{label}</p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* TASKS */}
          <section className="fade-up card-surface p-6" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-accent text-primary flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <h2 className="font-semibold tracking-tight">My Tasks</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {doneCount}/{tasks.length}
                </span>
              </div>
              <div className="flex bg-muted rounded-xl p-1 text-xs gap-0.5">
                {(["all", "pending", "done", "revision"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${filter === f
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-border/60">
              {shown.length === 0 && (
                <li className="py-8 text-center text-sm text-muted-foreground">
                  <div className="inline-flex flex-col items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </span>
                    No tasks here
                  </div>
                </li>
              )}
              {shown.map((task) => (
                <li
                  key={task.id}
                  className="pop group flex items-center gap-3 py-3.5 hover:bg-accent/40 -mx-3 px-3 rounded-lg transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task"
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${task.status === "done"
                        ? "bg-primary text-primary-foreground scale-100"
                        : "text-muted-foreground hover:text-primary border-2 border-border hover:border-primary"
                      }`}
                  >
                    {task.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-4 h-4 opacity-0" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium transition-all ${task.status === "done"
                          ? "line-through opacity-50"
                          : ""
                        }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due {task.due}
                      {task.to ? ` • ${task.to.split(" ")[0]}` : ""}
                    </p>
                  </div>
                  <span className={badgeClass[task.status]}>
                    {badgeLabel[task.status]}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* FEEDBACK */}
          <section className="fade-up card-surface p-6" style={{ animationDelay: "250ms" }}>
            <SectionHeader
              title="Supervisor Feedback"
              icon={MessageSquare}
              href={projectTabHref("feedback")}
              action="See all"
            />
            <div className="flex flex-col gap-2.5">
              {feedback.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No feedback yet — you're all caught up ✨
                </p>
              )}
              {feedback.slice(0, 4).map((f) => {
                const isUnread = !f.resolved && !f.read;
                const isOpen = openId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => openFeedback(f.id)}
                    className={`text-left rounded-xl p-3.5 transition-all border ${isUnread
                        ? "bg-accent/60 border-secondary/30 hover:bg-accent"
                        : "bg-muted/60 border-transparent hover:bg-muted"
                      } ${isOpen ? "shadow-sm" : ""}`}
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2">
                        {isUnread && (
                          <span className="relative flex w-2 h-2">
                            <span className="absolute inline-flex w-full h-full rounded-full bg-secondary opacity-75 animate-ping" />
                            <span className="relative inline-flex w-2 h-2 rounded-full bg-secondary" />
                          </span>
                        )}
                        <span className="font-medium text-foreground/80">{f.author}</span>
                        <span className="opacity-60">• {f.date}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                    <p
                      className={`text-sm mt-1.5 leading-relaxed ${isOpen ? "" : "line-clamp-1 opacity-80"
                        }`}
                    >
                      {f.body}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {/* TEAM */}
          <section className="fade-up card-surface p-6" style={{ animationDelay: "200ms" }}>
            <SectionHeader
              title={team?.name ?? "Team"}
              icon={Users}
              href="/my-team"
              action="Manage"
            />
            <ul className="flex flex-col gap-1">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 group p-2 -mx-2 rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-sm transition-transform group-hover:scale-105 ${m.isLead ? "ring-2 ring-secondary ring-offset-2 ring-offset-card" : ""
                        }`}
                    >
                      {m.name.charAt(0)}
                    </div>
                    {m.isLead && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow">
                        <Crown className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.isLead ? "Team Lead" : "Member"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* DEADLINES */}
          <section className="fade-up card-surface p-6" style={{ animationDelay: "300ms" }}>
            <SectionHeader
              title="Upcoming Deadlines"
              icon={CalendarClock}
              href={projectTabHref("milestones")}
              action="Milestones"
            />
            <ul className="flex flex-col gap-2.5">
              {upcoming.length === 0 && (
                <li className="text-sm text-muted-foreground py-4 text-center">
                  All milestones approved 🎉
                </li>
              )}
              {upcoming.map((m) => {
                const needsRevision = m.status === "revision";
                return (
                  <li
                    key={m.id}
                    className={`lift group flex items-start gap-3 rounded-xl border p-3 transition-all ${needsRevision
                        ? "border-destructive/30 bg-destructive/5 hover:border-destructive/50"
                        : "border-border bg-card hover:border-secondary/40"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${needsRevision
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary/15 text-secondary"
                        }`}
                    >
                      {needsRevision ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CalendarClock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Due {m.due}
                        {needsRevision && (
                          <span className="text-destructive font-medium">
                            {" "}• Needs revision
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { stage, ready } = useStage();
  const { milestones, student, team, loading } = useProjectStore();

  if (!ready || loading)
    return <Loader fullScreen message="Loading dashboard..." />;

  if (stage === 3) {
    const needsFix = milestones.some((m) => m.status === "revision");
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <FlowStepper />
        <NextStepCard
          title={needsFix ? "A milestone needs changes" : "Check your milestones"}
          text={
            needsFix
              ? "Your supervisor asked for a revision. Fix it and resubmit."
              : "See what is due and submit your work."
          }
          href={projectTabHref("milestones")}
          button={needsFix ? "Fix and resubmit" : "Open Milestones"}
        />
        <ProjectDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <section className="fade-up relative overflow-hidden rounded-3xl p-7 md:p-10 text-primary-foreground">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)",
          }}
        />
        <div className="float-slow absolute -top-16 -right-16 w-64 h-64 rounded-full bg-secondary/25 blur-2xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-90 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> Welcome
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">
            {student.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm opacity-80">
            {stage === 1
              ? "You are not in a team yet."
              : `You are in ${team?.name}. Next, create your project.`}
          </p>
        </div>
      </section>
      <FlowStepper />
      {stage === 1 ? (
        <NextStepCard
          title="Find a team"
          text="Search teams by skill and send a join request."
          href="/teams"
          button="Find Teams"
        />
      ) : (
        <NextStepCard
          title="Create your project"
          text="Add your project to unlock Milestones and Feedback."
          href="/my-team"
          button="Go to My Team"
        />
      )}
    </div>
  );
}