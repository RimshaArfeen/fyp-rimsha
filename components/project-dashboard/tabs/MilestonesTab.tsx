"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SectionCard } from "../ui/SectionCard";
import { Avatar } from "../ui/Avatar";
import Badge from "../ui/Badge";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

const filters = ["All", "Pending", "Approved", "Revision"] as const;
type Milestone = (typeof Project)["milestones"][number];

export default function MilestonesTab({ project }: { project: typeof Project }) {
     const [filter, setFilter] = useState<(typeof filters)[number]>("All");
     const [selected, setSelected] = useState<Milestone | null>(null);

     const list =
          filter === "All"
               ? project.milestones
               : project.milestones.filter((m) => m.status === filter.toLowerCase());

     return (
          <>
               <SectionCard>
                    {/* Filter pills */}
                    <div className="mb-5 flex flex-wrap gap-2">
                         {filters.map((f) => (
                              <button
                                   key={f}
                                   onClick={() => setFilter(f)}
                                   className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${filter === f
                                             ? "bg-primary text-primary-foreground border-primary"
                                             : "bg-card text-muted-foreground border-border hover:bg-accent"
                                        }`}
                              >
                                   {f}
                              </button>
                         ))}
                    </div>

                    {/* Timeline */}
                    <ol className="relative border-l border-border ml-2 space-y-6">
                         {list.map((m) => (
                              <li key={m.id} className="pl-6 relative">
                                   <span
                                        className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-2 ring-card ${m.status === "approved"
                                                  ? "bg-success"
                                                  : m.status === "pending"
                                                       ? "bg-secondary"
                                                       : "bg-destructive"
                                             }`}
                                   />
                                   <div className="card-surface p-4">
                                        <div className="flex items-start justify-between gap-3">
                                             <div>
                                                  <h4 className="font-medium">{m.title}</h4>
                                                  <p className="text-xs text-muted-foreground mt-0.5">
                                                       Due {m.due}
                                                  </p>
                                             </div>
                                             <Badge variant={m.status}>
                                                  {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                             </Badge>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                             <div className="flex -space-x-2">
                                                  {m.assignees.map((a) => (
                                                       <span key={a} className="ring-2 ring-card rounded-full">
                                                            <Avatar initials={a} size={26} />
                                                       </span>
                                                  ))}
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       console.log("SETTING SELECTED:", m);
                                                       setSelected(m);
                                                  }}
                                                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                                             >
                                                  View details →
                                             </button>
                                        </div>
                                   </div>
                              </li>
                         ))}

                         {list.length === 0 && (
                              <li className="pl-6 text-sm text-muted-foreground">
                                   No milestones match this filter.
                              </li>
                         )}
                    </ol>
               </SectionCard>

               {selected && (
                    <MilestoneDetailsModal
                         milestone={selected}
                         project={project}
                         onClose={() => setSelected(null)}
                    />
               )}
          </>
     );
}

function MilestoneDetailsModal({
     milestone,
     project,
     onClose,
}: {
     milestone: Milestone;
     project: typeof Project;
     onClose: () => void;
}) {
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     useEffect(() => {
          if (!mounted) return;
          const onKey = (e: KeyboardEvent) => {
               if (e.key === "Escape") onClose();
          };
          document.addEventListener("keydown", onKey);
          const prev = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          return () => {
               document.removeEventListener("keydown", onKey);
               document.body.style.overflow = prev;
          };
     }, [mounted, onClose]);

     if (!mounted) return null;

     /* ---- Derived info ---- */

     // Resolve assignee initials → full Member objects
     const assigneeMembers = project.members.filter((mem) =>
          milestone.assignees.includes(mem.initials)
     );

     // Lead for this milestone = first assignee who is a Lead, else first assignee
     const lead =
          assigneeMembers.find((m) => m.role === "Lead") ?? assigneeMembers[0];

     // Related submissions for this milestone
     const relatedSubmissions = project.submissions.filter(
          (s) => s.milestone === milestone.title
     );

     // Related feedback (matched loosely by substring of title)
     const relatedFeedback = project.feedback.filter(
          (f) =>
               f.snippet.toLowerCase().includes(milestone.title.split(" ")[0].toLowerCase()) ||
               f.body.toLowerCase().includes(milestone.title.split(" ")[0].toLowerCase())
     );

     // Days remaining calculation (best-effort against endDate)
     const daysUntilDue = (() => {
          const due = new Date(milestone.due);
          const today = new Date();
          if (isNaN(due.getTime())) return null;
          const diff = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
          return diff;
     })();

     /* ---- Status styling ---- */
     const statusStyles: Record<
          Milestone["status"],
          { ring: string; pill: string; label: string; dot: string; blurb: string }
     > = {
          approved: {
               ring: "ring-success/30",
               pill: "bg-success/15 text-success border-success/30",
               dot: "bg-success",
               label: "Approved",
               blurb: "This milestone has been reviewed and approved by your supervisor.",
          },
          pending: {
               ring: "ring-secondary/30",
               pill: "bg-secondary/15 text-secondary border-secondary/30",
               dot: "bg-secondary",
               label: "Pending Review",
               blurb: "Awaiting supervisor review. Make sure all deliverables are uploaded.",
          },
          revision: {
               ring: "ring-destructive/30",
               pill: "bg-destructive/15 text-destructive border-destructive/30",
               dot: "bg-destructive",
               label: "Needs Revision",
               blurb: "Supervisor has requested changes. Check the feedback tab for details.",
          },
     };
     const s = statusStyles[milestone.status];

     return createPortal(
          <div
               className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
               role="dialog"
               aria-modal="true"
               aria-labelledby="milestone-details-title"
          >
               {/* Backdrop */}
               <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
               />

               {/* Card */}
               <div className="relative z-10 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-black/5">
                    {/* --- Colored top band --- */}
                    <div className={`h-1.5 w-full rounded-t-2xl ${s.dot}`} />

                    {/* --- Header --- */}
                    <div className="p-5 sm:p-6 border-b border-border">
                         <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                   <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        <span>Milestone</span>
                                        <span aria-hidden="true" className="opacity-50">
                                             ·
                                        </span>
                                        <span className="tabular-nums">{milestone.id}</span>
                                   </div>
                                   <h3
                                        id="milestone-details-title"
                                        className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight truncate"
                                        title={milestone.title}
                                   >
                                        {milestone.title}
                                   </h3>
                                   <p className="mt-1 text-sm text-muted-foreground">
                                        {s.blurb}
                                   </p>
                              </div>

                              <button
                                   type="button"
                                   onClick={onClose}
                                   aria-label="Close details"
                                   className="shrink-0 grid place-items-center h-9 w-9 rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                   >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                   </svg>
                              </button>
                         </div>

                         {/* Status + due chips */}
                         <div className="mt-4 flex flex-wrap items-center gap-2">
                              <span
                                   className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.pill}`}
                              >
                                   <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
                                   {s.label}
                              </span>

                              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                   <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                   >
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                   </svg>
                                   Due {milestone.due}
                              </span>

                              {daysUntilDue !== null && (
                                   <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${daysUntilDue < 0
                                                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                                                  : daysUntilDue <= 7
                                                       ? "border-secondary/30 bg-secondary/10 text-secondary"
                                                       : "border-border bg-background/60 text-muted-foreground"
                                             }`}
                                   >
                                        {daysUntilDue < 0
                                             ? `${Math.abs(daysUntilDue)}d overdue`
                                             : daysUntilDue === 0
                                                  ? "Due today"
                                                  : `${daysUntilDue}d left`}
                                   </span>
                              )}
                         </div>
                    </div>

                    {/* --- Body --- */}
                    <div className="p-5 sm:p-6 space-y-6">
                         {/* Team / Assignees */}
                         <section>
                              <SectionHeading
                                   icon={
                                        <svg
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             className="h-3.5 w-3.5"
                                             aria-hidden="true"
                                        >
                                             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                             <circle cx="9" cy="7" r="4" />
                                             <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                   }
                                   title="Assignees"
                                   count={assigneeMembers.length}
                              />

                              {/* Lead spotlight */}
                              {lead && (
                                   <div
                                        className={`mt-3 flex items-center gap-3 rounded-[var(--radius-custom)] border border-border bg-gradient-to-br from-primary/5 to-transparent p-3`}
                                   >
                                        <div className="relative">
                                             <Avatar initials={lead.initials} size={44} />
                                             {lead.online && (
                                                  <span
                                                       className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card"
                                                       aria-label="Online"
                                                  />
                                             )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                             <div className="flex items-center gap-2">
                                                  <p className="font-medium truncate">{lead.name}</p>
                                                  <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                                       Lead
                                                  </span>
                                             </div>
                                             <p className="text-xs text-muted-foreground">
                                                  Primary owner of this milestone
                                             </p>
                                        </div>
                                        <span
                                             className={`shrink-0 text-[11px] font-medium ${lead.online ? "text-success" : "text-muted-foreground"
                                                  }`}
                                        >
                                             {lead.online ? "● Online" : "○ Offline"}
                                        </span>
                                   </div>
                              )}

                              {/* Other assignees */}
                              {assigneeMembers.length > 1 && (
                                   <ul className="mt-3 space-y-2">
                                        {assigneeMembers
                                             .filter((m) => m.id !== lead?.id)
                                             .map((m) => (
                                                  <li
                                                       key={m.id}
                                                       className="flex items-center gap-3 rounded-[var(--radius-custom)] border border-border bg-card/60 p-2.5"
                                                  >
                                                       <div className="relative">
                                                            <Avatar initials={m.initials} size={34} />
                                                            {m.online && (
                                                                 <span
                                                                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card"
                                                                      aria-label="Online"
                                                                 />
                                                            )}
                                                       </div>
                                                       <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-medium truncate">{m.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                 {m.role}
                                                            </p>
                                                       </div>
                                                       <span
                                                            className={`text-[11px] font-medium ${m.online ? "text-success" : "text-muted-foreground"
                                                                 }`}
                                                       >
                                                            {m.online ? "Online" : "Offline"}
                                                       </span>
                                                  </li>
                                             ))}
                                   </ul>
                              )}
                         </section>

                         {/* Timeline / Dates */}
                         <section>
                              <SectionHeading
                                   icon={
                                        <svg
                                             viewBox="0 0 24 24"
                                             fill="none"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             className="h-3.5 w-3.5"
                                             aria-hidden="true"
                                        >
                                             <circle cx="12" cy="12" r="10" />
                                             <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                   }
                                   title="Timeline"
                              />
                              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                   <MetaTile label="Project start" value={project.startDate} />
                                   <MetaTile label="Milestone due" value={milestone.due} />
                                   <MetaTile label="Project end" value={project.endDate} />
                              </div>
                         </section>

                         {/* Related submissions */}
                         {relatedSubmissions.length > 0 && (
                              <section>
                                   <SectionHeading
                                        icon={
                                             <svg
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="h-3.5 w-3.5"
                                                  aria-hidden="true"
                                             >
                                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                  <polyline points="17 8 12 3 7 8" />
                                                  <line x1="12" y1="3" x2="12" y2="15" />
                                             </svg>
                                        }
                                        title="Submissions"
                                        count={relatedSubmissions.length}
                                   />
                                   <ul className="mt-3 space-y-2">
                                        {relatedSubmissions.map((sub) => (
                                             <li
                                                  key={sub.id}
                                                  className="flex items-center justify-between gap-3 rounded-[var(--radius-custom)] border border-border bg-card/60 p-3"
                                             >
                                                  <div className="min-w-0">
                                                       <p className="text-sm font-medium truncate">
                                                            {sub.milestone}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">
                                                            {sub.submittedBy} · {sub.date}
                                                       </p>
                                                  </div>
                                                  <Badge variant={sub.status}>
                                                       {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                  </Badge>
                                             </li>
                                        ))}
                                   </ul>
                              </section>
                         )}

                         {/* Related feedback */}
                         {relatedFeedback.length > 0 && (
                              <section>
                                   <SectionHeading
                                        icon={
                                             <svg
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="h-3.5 w-3.5"
                                                  aria-hidden="true"
                                             >
                                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                             </svg>
                                        }
                                        title="Supervisor feedback"
                                        count={relatedFeedback.length}
                                   />
                                   <ul className="mt-3 space-y-2">
                                        {relatedFeedback.map((f) => (
                                             <li
                                                  key={f.id}
                                                  className="rounded-[var(--radius-custom)] border border-border bg-card/60 p-3"
                                             >
                                                  <div className="flex items-center justify-between gap-2">
                                                       <p className="text-xs font-medium text-foreground">
                                                            {f.author}
                                                       </p>
                                                       <span className="text-xs text-muted-foreground">
                                                            {f.date}
                                                       </span>
                                                  </div>
                                                  <p className="mt-1 text-sm text-foreground/80 leading-relaxed">
                                                       {f.body}
                                                  </p>
                                                  {f.resolved && (
                                                       <span className="mt-2 inline-block text-[11px] font-medium text-success">
                                                            ✓ Resolved
                                                       </span>
                                                  )}
                                             </li>
                                        ))}
                                   </ul>
                              </section>
                         )}
                    </div>

                    {/* --- Footer --- */}
                    <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur px-5 sm:px-6 py-3 flex items-center justify-between gap-2">
                         <p className="hidden sm:block text-xs text-muted-foreground">
                              Milestone ID · <span className="tabular-nums">{milestone.id}</span>
                         </p>
                         <div className="flex items-center gap-2 ml-auto">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   Close
                              </button>
                              {/* <button
                                   type="button"
                                   className="inline-flex items-center gap-2 rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                   >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                   </svg>
                                   Open full view
                              </button> */}
                         </div>
                    </div>
               </div>
          </div>,
          document.body
     );
}

/* ---------- Small helpers ---------- */

function SectionHeading({
     icon,
     title,
     count,
}: {
     icon: React.ReactNode;
     title: string;
     count?: number;
}) {
     return (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
               <span className="text-muted-foreground">{icon}</span>
               <span>{title}</span>
               {typeof count === "number" && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                         {count}
                    </span>
               )}
          </div>
     );
}

function MetaTile({ label, value }: { label: string; value: string }) {
     return (
          <div className="rounded-[var(--radius-custom)] border border-border bg-card/60 p-3">
               <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
               </p>
               <p className="mt-1 text-sm font-medium truncate">{value}</p>
          </div>
     );
}