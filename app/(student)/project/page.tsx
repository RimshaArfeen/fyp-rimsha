"use client";

import Link from "next/link";
import { CheckCircle2, Clock, RotateCcw, Users, UserPlus, Upload } from "lucide-react";
import ProjectTabs from "../../../components/project-dashboard/ProjectTabs";
import StageGuard from "../../../components/StageGuard";
import CountUp from "../../../components/student/CountUp";
import ProgressRing from "../../../components/student/ProgressRing";
import { useProjectStore } from "../../../lib/project-store";
import { projectTabHref } from "../../../lib/project-tabs";
import { team, project as info } from "../../../lib/dummyData";
import { project } from "./dummy-data";

function ProjectView() {
     const { milestones, submissions } = useProjectStore();

     const total = milestones.length;
     const done = milestones.filter((m) => m.status === "approved").length;
     const pending = milestones.filter((m) => m.status === "pending").length;
     const revision = milestones.filter((m) => m.status === "revision").length;
     const progress = total ? Math.round((done / total) * 100) : 0;

     // The milestone the gold button should open: one needing revision first,
     // then one that is pending and has nothing waiting for review yet.
     const waitingTitles = new Set(submissions.filter((s) => s.status === "pending").map((s) => s.milestone));
     const target =
          milestones.find((m) => m.status === "revision") ??
          milestones.find((m) => m.status === "pending" && !waitingTitles.has(m.title));
     const base = projectTabHref("milestones");
     const submitHref = target ? `${base}${base.includes("?") ? "&" : "?"}open=${target.id}` : base;

     const stats = [
          { label: "Approved", value: done, suffix: `/${total}`, icon: CheckCircle2 },
          { label: "Pending review", value: pending, suffix: "", icon: Clock },
          { label: "Needs revision", value: revision, suffix: "", icon: RotateCcw },
          { label: "Team members", value: project.members.length, suffix: "", icon: Users },
     ];

     return (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
               {/* Hero */}
               <section
                    className="fade-up relative overflow-hidden rounded-2xl p-6 md:p-8 text-primary-foreground flex items-center justify-between gap-6 flex-wrap"
                    style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
               >
                    <div className="float-slow absolute -top-10 -right-10 w-48 h-48 rounded-full bg-secondary/20" />
                    <div className="float-slow absolute -bottom-12 left-1/3 w-32 h-32 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
                    <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm opacity-80">Project</p>
                              <span className="badge-approved">Approved</span>
                         </div>
                         <h1 className="text-3xl font-bold mb-1">{info.title}</h1>
                         <p className="text-sm opacity-80 mb-4">
                              {team.name} • Supervisor: {info.supervisor}
                         </p>
                         <div className="flex gap-2 flex-wrap">
                              {target ? (
                                   <Link
                                        href={submitHref}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition"
                                   >
                                        <Upload className="w-4 h-4" />
                                        {target.status === "revision" ? "Fix and resubmit" : "Submit Milestone"}
                                   </Link>
                              ) : (
                                   <span
                                        title="Every milestone is approved or already waiting for review"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-primary-foreground/60 text-sm font-medium cursor-not-allowed"
                                   >
                                        <Upload className="w-4 h-4" /> Nothing to submit
                                   </span>
                              )}
                              <Link
                                   href="/my-team"
                                   className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-primary-foreground text-sm font-medium hover:bg-white/20 transition"
                              >
                                   <UserPlus className="w-4 h-4" /> Invite
                              </Link>
                         </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                         <ProgressRing value={progress} size={130} />
                         <span className="text-xs opacity-80">Project progress</span>
                    </div>
               </section>

               {/* Stats */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ label, value, suffix, icon: Icon }, i) => (
                         <div key={label} className="fade-up lift card-surface p-4 flex items-center gap-3" style={{ animationDelay: `${i * 80}ms` }}>
                              <div className="w-11 h-11 rounded-xl bg-accent text-primary flex items-center justify-center">
                                   <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                   <p className="text-2xl font-bold leading-none">
                                        <CountUp to={value} />
                                        {suffix}
                                   </p>
                                   <p className="text-xs text-muted-foreground mt-1">{label}</p>
                              </div>
                         </div>
                    ))}
               </div>

               <div className="grid lg:grid-cols-3 gap-6">
                    {/* Tabs */}
                    <div className="lg:col-span-2 min-w-0">
                         <ProjectTabs project={project} />
                    </div>

                    <div className="flex flex-col gap-6">
                         {/* Details */}
                         <section className="fade-up card-surface p-5" style={{ animationDelay: "150ms" }}>
                              <h2 className="font-semibold mb-3">Project details</h2>
                              <dl className="flex flex-col gap-2 text-sm">
                                   <div className="flex justify-between gap-3">
                                        <dt className="text-muted-foreground">Supervisor</dt>
                                        <dd className="font-medium text-right">{info.supervisor}</dd>
                                   </div>
                                   <div className="flex justify-between gap-3">
                                        <dt className="text-muted-foreground">Started</dt>
                                        <dd className="font-medium">{project.startDate}</dd>
                                   </div>
                                   <div className="flex justify-between gap-3">
                                        <dt className="text-muted-foreground">Ends</dt>
                                        <dd className="font-medium">{project.endDate}</dd>
                                   </div>
                              </dl>
                              <div className="mt-4">
                                   <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                   </div>
                                   <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${progress}%` }} />
                                   </div>
                              </div>
                         </section>

                         {/* Team */}
                         <section className="fade-up card-surface p-5" style={{ animationDelay: "250ms" }}>
                              <div className="flex items-center justify-between mb-3">
                                   <h2 className="font-semibold">Team Members</h2>
                                   <Link href="/my-team" className="text-xs font-medium text-secondary hover:underline">
                                        Manage
                                   </Link>
                              </div>
                              <ul className="flex flex-col gap-3">
                                   {project.members.map((m) => (
                                        <li key={m.id} className="flex items-center gap-3 group">
                                             <div className="relative">
                                                  <div
                                                       className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold group-hover:scale-110 transition ${
                                                            m.role === "Lead" ? "ring-2 ring-secondary" : ""
                                                       }`}
                                                  >
                                                       {m.initials}
                                                  </div>
                                                  <span
                                                       className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-card ${
                                                            m.online ? "bg-success" : "bg-muted-foreground"
                                                       }`}
                                                  />
                                             </div>
                                             <div className="min-w-0 flex-1">
                                                  <p className="text-sm font-medium truncate">{m.name}</p>
                                                  <p className="text-xs text-muted-foreground">{m.role}</p>
                                             </div>
                                        </li>
                                   ))}
                              </ul>
                         </section>
                    </div>
               </div>
          </div>
     );
}

export default function ProjectDashboardPage() {
     return (
          <StageGuard min={3}>
               <ProjectView />
          </StageGuard>
     );
}