"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Badge from "./ui/Badge";
import { AvatarGroup } from "./ui/AvatarGroup";
import type { project as Project } from "../../app/(student)/project/dummy-data";

export default function ProjectHeader({ project }: { project: typeof Project }) {
     const [inviteOpen, setInviteOpen] = useState(false);
     const [submitOpen, setSubmitOpen] = useState(false);

     return (
          <>
               <header
                    className="border-b border-border bg-background/80 backdrop-blur-sm"
                    aria-label="Project header"
               >
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
                         {/* Breadcrumb */}
                         <nav
                              aria-label="Breadcrumb"
                              className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"
                         >
                              <a
                                   href="/dashboard"
                                   className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   Dashboard
                              </a>
                              <span aria-hidden="true" className="opacity-60">
                                   ›
                              </span>
                              <a
                                   href="/projects"
                                   className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   Projects
                              </a>
                              <span aria-hidden="true" className="opacity-60">
                                   ›
                              </span>
                              <span
                                   aria-current="page"
                                   className="truncate font-medium text-foreground"
                                   title={project.team}
                              >
                                   {project.team}
                              </span>
                         </nav>

                         {/* Main row */}
                         <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                              {/* Left: title + meta */}
                              <div className="min-w-0 flex-1">
                                   <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                        <h1
                                             className="truncate text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl"
                                             title={project.title}
                                        >
                                             {project.title}
                                        </h1>

                                        <Badge variant={project.status}>
                                             {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </Badge>
                                   </div>

                                   {/* Meta line */}
                                   <div className="mt-1.5 hidden sm:flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                        {project.type && (
                                             <span className="inline-flex items-center gap-1.5">
                                                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                                                  {project.type}
                                             </span>
                                        )}

                                        {project.startDate && project.endDate && (
                                             <>
                                                  <span aria-hidden="true" className="text-border">
                                                       ·
                                                  </span>
                                                  <span>
                                                       {project.startDate} — {project.endDate}
                                                  </span>
                                             </>
                                        )}

                                        {typeof project.progress === "number" && (
                                             <>
                                                  <span aria-hidden="true" className="text-border">
                                                       ·
                                                  </span>
                                                  <span className="inline-flex items-center gap-2">
                                                       <span className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                                            <span
                                                                 className="absolute inset-y-0 left-0 rounded-full bg-success"
                                                                 style={{ width: `${project.progress}%` }}
                                                            />
                                                       </span>
                                                       <span className="tabular-nums">{project.progress}%</span>
                                                  </span>
                                             </>
                                        )}
                                   </div>
                              </div>

                              {/* Right: people + actions */}
                              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                   {/* Team members */}
                                   <div className="hidden items-center gap-2 rounded-[var(--radius-custom)] border border-border bg-card/60 px-2.5 py-1.5 sm:flex">
                                        <AvatarGroup members={project.members} />
                                   </div>

                                   {/* Invite button */}
                                   <button
                                        type="button"
                                        onClick={() => setInviteOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
                                             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                             <circle cx="9" cy="7" r="4" />
                                             <line x1="19" y1="8" x2="19" y2="14" />
                                             <line x1="22" y1="11" x2="16" y2="11" />
                                        </svg>
                                        <span className="hidden sm:inline">Invite</span>
                                   </button>

                                   {/* Primary action */}
                                   <button
                                        type="button"
                                        onClick={() => setSubmitOpen(true)}
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
                                             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                             <polyline points="17 8 12 3 7 8" />
                                             <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span className="hidden sm:inline">Submit Milestone</span>
                                        <span className="sm:hidden">Submit</span>
                                   </button>
                              </div>
                         </div>
                    </div>
               </header>

               {inviteOpen && (
                    <InviteMembersModal
                         projectTitle={project.title}
                         existingMembers={project.members}
                         onClose={() => setInviteOpen(false)}
                    />
               )}

               {submitOpen && (
                    <SubmitMilestoneModal
                         projectTitle={project.title}
                         onClose={() => setSubmitOpen(false)}
                    />
               )}
          </>
     );
}

/* ---------- Invite Modal ---------- */

type InviteRow = {
     id: string;
     email: string;
     role: "Member" | "Lead" | "Viewer";
};

function InviteMembersModal({
     projectTitle,
     existingMembers,
     onClose,
}: {
     projectTitle: string;
     existingMembers: typeof Project.members;
     onClose: () => void;
}) {
     const [mounted, setMounted] = useState(false);
     const [rows, setRows] = useState<InviteRow[]>([
          { id: crypto.randomUUID(), email: "", role: "Member" },
     ]);
     const [message, setMessage] = useState("");
     const [sent, setSent] = useState(false);

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

     const addRow = () =>
          setRows((r) => [
               ...r,
               { id: crypto.randomUUID(), email: "", role: "Member" },
          ]);

     const removeRow = (id: string) =>
          setRows((r) => (r.length === 1 ? r : r.filter((x) => x.id !== id)));

     const updateRow = (id: string, patch: Partial<InviteRow>) =>
          setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));

     const emailIsValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
     const filledRows = rows.filter((r) => r.email.trim() !== "");
     const canSubmit =
          filledRows.length > 0 && filledRows.every((r) => emailIsValid(r.email));

     const handleSend = (e: React.FormEvent) => {
          e.preventDefault();
          if (!canSubmit) return;
          console.log("Invites to send:", filledRows, "message:", message);
          setSent(true);
          setTimeout(() => {
               onClose();
          }, 1200);
     };

     return createPortal(
          <div
               className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
               role="dialog"
               aria-modal="true"
               aria-labelledby="invite-modal-title"
          >
               <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
               />

               <form
                    onSubmit={handleSend}
                    className="relative z-10 w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl"
               >
                    <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-border">
                         <div>
                              <h3
                                   id="invite-modal-title"
                                   className="text-lg sm:text-xl font-semibold tracking-tight"
                              >
                                   Invite team members
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                   Send email invitations to join{" "}
                                   <span className="font-medium text-foreground">{projectTitle}</span>.
                              </p>
                         </div>
                         <button
                              type="button"
                              onClick={onClose}
                              aria-label="Close invite dialog"
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

                    <div className="p-5 sm:p-6 space-y-5">
                         <div className="flex items-center gap-3 rounded-[var(--radius-custom)] border border-border bg-card/60 p-3">
                              <AvatarGroup members={existingMembers} />
                              <div className="text-xs text-muted-foreground">
                                   <span className="font-medium text-foreground">
                                        {existingMembers.length}
                                   </span>{" "}
                                   member{existingMembers.length === 1 ? "" : "s"} already on this
                                   project
                              </div>
                         </div>

                         <div>
                              <div className="flex items-center justify-between">
                                   <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Email addresses
                                   </label>
                                   <button
                                        type="button"
                                        onClick={addRow}
                                        className="text-xs font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm"
                                   >
                                        + Add another
                                   </button>
                              </div>

                              <ul className="mt-3 space-y-2">
                                   {rows.map((row, idx) => {
                                        const touched = row.email.length > 0;
                                        const invalid = touched && !emailIsValid(row.email);
                                        return (
                                             <li
                                                  key={row.id}
                                                  className="flex flex-col sm:flex-row sm:items-center gap-2"
                                             >
                                                  <div className="relative flex-1">
                                                       <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                            aria-hidden="true"
                                                       >
                                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                                            <path d="m22 6-10 7L2 6" />
                                                       </svg>
                                                       <input
                                                            type="email"
                                                            required
                                                            placeholder={`member${idx + 1}@example.com`}
                                                            value={row.email}
                                                            onChange={(e) =>
                                                                 updateRow(row.id, { email: e.target.value })
                                                            }
                                                            aria-invalid={invalid}
                                                            className={`w-full rounded-[var(--radius-custom)] border bg-background pl-9 pr-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${invalid
                                                                 ? "border-destructive focus-visible:outline-destructive"
                                                                 : "border-border"
                                                                 }`}
                                                       />
                                                  </div>

                                                  <select
                                                       value={row.role}
                                                       onChange={(e) =>
                                                            updateRow(row.id, {
                                                                 role: e.target.value as InviteRow["role"],
                                                            })
                                                       }
                                                       className="rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                                  >
                                                       <option value="Member">Member</option>
                                                       <option value="Lead">Lead</option>
                                                       <option value="Viewer">Viewer</option>
                                                  </select>

                                                  <button
                                                       type="button"
                                                       onClick={() => removeRow(row.id)}
                                                       disabled={rows.length === 1}
                                                       aria-label="Remove this invite"
                                                       className="grid place-items-center h-9 w-9 shrink-0 rounded-[var(--radius-custom)] border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                       </svg>
                                                  </button>
                                             </li>
                                        );
                                   })}
                              </ul>

                              {filledRows.length > 0 && !canSubmit && (
                                   <p className="mt-2 text-xs text-destructive">
                                        Please enter valid email addresses for all fields.
                                   </p>
                              )}
                         </div>

                         <div>
                              <label
                                   htmlFor="invite-message"
                                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                              >
                                   Personal message <span className="normal-case font-normal">(optional)</span>
                              </label>
                              <textarea
                                   id="invite-message"
                                   rows={3}
                                   value={message}
                                   onChange={(e) => setMessage(e.target.value)}
                                   placeholder="Add a short note to include in the invite email…"
                                   className="mt-2 w-full resize-none rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              />
                         </div>
                    </div>

                    <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur px-5 sm:px-6 py-3 flex items-center justify-between gap-2">
                         <p className="hidden sm:block text-xs text-muted-foreground">
                              Invitations expire after 7 days.
                         </p>
                         <div className="flex items-center gap-2 ml-auto">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   disabled={!canSubmit || sent}
                                   className="inline-flex items-center gap-2 rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   {sent ? (
                                        <>
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
                                                  <polyline points="20 6 9 17 4 12" />
                                             </svg>
                                             Sent
                                        </>
                                   ) : (
                                        <>
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
                                                  <line x1="22" y1="2" x2="11" y2="13" />
                                                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                             </svg>
                                             Send email{filledRows.length > 1 ? `s (${filledRows.length})` : ""}
                                        </>
                                   )}
                              </button>
                         </div>
                    </div>
               </form>
          </div>,
          document.body
     );
}

/* ---------- Submit Milestone Modal ---------- */

type MilestoneAttachment = {
     id: string;
     name: string;
     size: number;
     type: string;
};

function SubmitMilestoneModal({
     projectTitle,
     onClose,
}: {
     projectTitle: string;
     onClose: () => void;
}) {
     const [mounted, setMounted] = useState(false);
     const [title, setTitle] = useState("");
     const [description, setDescription] = useState("");
     const [deliverableUrl, setDeliverableUrl] = useState("");
     const [notes, setNotes] = useState("");
     const [files, setFiles] = useState<MilestoneAttachment[]>([]);
     const [submitted, setSubmitted] = useState(false);
     const [dragActive, setDragActive] = useState(false);

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

     const canSubmit =
          title.trim().length > 0 && description.trim().length > 0;

     const handleFiles = (incoming: FileList | null) => {
          if (!incoming) return;
          const next: MilestoneAttachment[] = Array.from(incoming).map((f) => ({
               id: crypto.randomUUID(),
               name: f.name,
               size: f.size,
               type: f.type,
          }));
          setFiles((prev) => [...prev, ...next]);
     };

     const removeFile = (id: string) =>
          setFiles((prev) => prev.filter((f) => f.id !== id));

     const formatSize = (bytes: number) => {
          if (bytes < 1024) return `${bytes} B`;
          if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
          return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
     };

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!canSubmit) return;
          console.log("Milestone submitted:", {
               title,
               description,
               deliverableUrl,
               notes,
               files,
          });
          setSubmitted(true);
          setTimeout(() => {
               onClose();
          }, 1200);
     };

     const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
     };

     return createPortal(
          <div
               className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
               role="dialog"
               aria-modal="true"
               aria-labelledby="submit-modal-title"
          >
               {/* Backdrop */}
               <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
               />

               {/* Card */}
               <form
                    onSubmit={handleSubmit}
                    className="relative z-10 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-2xl"
               >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-border">
                         <div>
                              <h3
                                   id="submit-modal-title"
                                   className="text-lg sm:text-xl font-semibold tracking-tight"
                              >
                                   Submit milestone
                              </h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                   Submit your deliverable for{" "}
                                   <span className="font-medium text-foreground">{projectTitle}</span>.
                              </p>
                         </div>
                         <button
                              type="button"
                              onClick={onClose}
                              aria-label="Close submit dialog"
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

                    {/* Body */}
                    <div className="p-5 sm:p-6 space-y-5">
                         {/* Milestone title */}
                         <div>
                              <label
                                   htmlFor="milestone-title"
                                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                              >
                                   Milestone title <span className="text-destructive">*</span>
                              </label>
                              <input
                                   id="milestone-title"
                                   type="text"
                                   required
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                                   placeholder="e.g. Sprint 3 — Authentication module"
                                   className="mt-2 w-full rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              />
                         </div>

                         {/* Description */}
                         <div>
                              <label
                                   htmlFor="milestone-description"
                                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                              >
                                   Description <span className="text-destructive">*</span>
                              </label>
                              <textarea
                                   id="milestone-description"
                                   required
                                   rows={4}
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)}
                                   placeholder="Summarize what was completed, key decisions, and any blockers…"
                                   className="mt-2 w-full resize-none rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              />
                         </div>

                         {/* Deliverable URL */}
                         <div>
                              <label
                                   htmlFor="milestone-url"
                                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                              >
                                   Deliverable link{" "}
                                   <span className="normal-case font-normal">(optional)</span>
                              </label>
                              <div className="relative mt-2">
                                   <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                        aria-hidden="true"
                                   >
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                   </svg>
                                   <input
                                        id="milestone-url"
                                        type="url"
                                        value={deliverableUrl}
                                        onChange={(e) => setDeliverableUrl(e.target.value)}
                                        placeholder="https://github.com/… or https://figma.com/…"
                                        className="w-full rounded-[var(--radius-custom)] border border-border bg-background pl-9 pr-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                   />
                              </div>
                         </div>

                         {/* File upload */}
                         <div>
                              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                   Attachments{" "}
                                   <span className="normal-case font-normal">(optional)</span>
                              </label>

                              <label
                                   onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragActive(true);
                                   }}
                                   onDragLeave={() => setDragActive(false)}
                                   onDrop={handleDrop}
                                   className={`mt-2 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-custom)] border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${dragActive
                                             ? "border-primary bg-primary/5"
                                             : "border-border bg-card/40 hover:bg-accent/40"
                                        }`}
                              >
                                   <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6 text-muted-foreground"
                                        aria-hidden="true"
                                   >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                   </svg>
                                   <div className="text-sm">
                                        <span className="font-medium text-foreground">
                                             Click to upload
                                        </span>{" "}
                                        <span className="text-muted-foreground">
                                             or drag and drop
                                        </span>
                                   </div>
                                   <p className="text-xs text-muted-foreground">
                                        PDF, ZIP, PNG, JPG up to 25 MB each
                                   </p>
                                   <input
                                        type="file"
                                        multiple
                                        className="sr-only"
                                        onChange={(e) => handleFiles(e.target.files)}
                                   />
                              </label>

                              {files.length > 0 && (
                                   <ul className="mt-3 space-y-2">
                                        {files.map((file) => (
                                             <li
                                                  key={file.id}
                                                  className="flex items-center gap-3 rounded-[var(--radius-custom)] border border-border bg-card/60 px-3 py-2"
                                             >
                                                  <svg
                                                       viewBox="0 0 24 24"
                                                       fill="none"
                                                       stroke="currentColor"
                                                       strokeWidth="2"
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       className="h-4 w-4 shrink-0 text-muted-foreground"
                                                       aria-hidden="true"
                                                  >
                                                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                       <polyline points="14 2 14 8 20 8" />
                                                  </svg>
                                                  <div className="min-w-0 flex-1">
                                                       <p className="truncate text-sm font-medium">
                                                            {file.name}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">
                                                            {formatSize(file.size)}
                                                       </p>
                                                  </div>
                                                  <button
                                                       type="button"
                                                       onClick={() => removeFile(file.id)}
                                                       aria-label={`Remove ${file.name}`}
                                                       className="grid place-items-center h-8 w-8 shrink-0 rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
                                             </li>
                                        ))}
                                   </ul>
                              )}
                         </div>

                         {/* Notes for reviewer */}
                         <div>
                              <label
                                   htmlFor="milestone-notes"
                                   className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                              >
                                   Notes for reviewer{" "}
                                   <span className="normal-case font-normal">(optional)</span>
                              </label>
                              <textarea
                                   id="milestone-notes"
                                   rows={3}
                                   value={notes}
                                   onChange={(e) => setNotes(e.target.value)}
                                   placeholder="Anything specific you'd like your mentor or reviewer to focus on…"
                                   className="mt-2 w-full resize-none rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              />
                         </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur px-5 sm:px-6 py-3 flex items-center justify-between gap-2">
                         <p className="hidden sm:block text-xs text-muted-foreground">
                              Your mentor will be notified once submitted.
                         </p>
                         <div className="flex items-center gap-2 ml-auto">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   disabled={!canSubmit || submitted}
                                   className="inline-flex items-center gap-2 rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                   {submitted ? (
                                        <>
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
                                                  <polyline points="20 6 9 17 4 12" />
                                             </svg>
                                             Submitted
                                        </>
                                   ) : (
                                        <>
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
                                                  <line x1="22" y1="2" x2="11" y2="13" />
                                                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                             </svg>
                                             Submit milestone
                                        </>
                                   )}
                              </button>
                         </div>
                    </div>
               </form>
          </div>,
          document.body
     );
}