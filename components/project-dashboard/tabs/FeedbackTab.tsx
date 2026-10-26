"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import { useProjectStore } from "../../../lib/project-store";
import { projectTabHref } from "../../../lib/project-tabs";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

const input =
     "w-full rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function FeedbackTab(_props: { project: typeof Project }) {
     const { feedback, milestones, milestoneOf, resolveFeedback, replyFeedback } = useProjectStore();
     const [activeId, setActiveId] = useState<string | null>(null);
     const [replying, setReplying] = useState(false);
     const [text, setText] = useState("");

     const active = feedback.find((f) => f.id === activeId) ?? feedback[0];
     const mTitle = active ? milestoneOf(active) : undefined;
     const mStatus = milestones.find((m) => m.title === mTitle)?.status;

     const send = () => {
          if (!text.trim() || !active) return;
          replyFeedback(active.id, text.trim());
          setText("");
          setReplying(false);
     };

     return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
               {/* List */}
               <ul className="md:col-span-5 space-y-2">
                    {feedback.map((f) => {
                         const isActive = f.id === active?.id;
                         return (
                              <li key={f.id}>
                                   <button
                                        onClick={() => { setActiveId(f.id); setReplying(false); }}
                                        className={`w-full text-left card-surface p-4 transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/60"}`}
                                   >
                                        <div className="flex items-center justify-between gap-2">
                                             <p className="text-sm font-medium">{f.author}</p>
                                             {!f.resolved ? <Badge variant="pending">Awaiting</Badge> : <Badge variant="approved">Resolved</Badge>}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">{f.date}</p>
                                        <p className="mt-2 text-sm line-clamp-2 text-foreground/80">{f.snippet}</p>
                                   </button>
                              </li>
                         );
                    })}
               </ul>

               {/* Detail */}
               <div className="md:col-span-7">
                    {active ? (
                         <div className="card-surface p-5">
                              <header className="flex items-center gap-3 mb-4">
                                   <Avatar initials={active.author.split(" ").map((n) => n[0]).join("")} />
                                   <div>
                                        <p className="text-sm font-semibold">{active.author}</p>
                                        <p className="text-xs text-muted-foreground">{active.date}</p>
                                   </div>
                              </header>

                              <blockquote className="border-l-2 border-primary pl-4 text-sm leading-relaxed text-foreground/90">
                                   {active.body}
                              </blockquote>

                              {mTitle && (
                                   <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                             Milestone: {mTitle}
                                        </span>
                                        <Link href={projectTabHref("milestones")} className="text-xs font-medium text-secondary hover:underline">
                                             {mStatus === "revision" ? "Fix and resubmit →" : "Open milestones →"}
                                        </Link>
                                   </div>
                              )}

                              {active.replies.length > 0 && (
                                   <ul className="mt-4 space-y-2">
                                        {active.replies.map((r, i) => (
                                             <li key={i} className="rounded-[var(--radius-custom)] bg-muted p-3 text-sm">
                                                  <p className="text-xs text-muted-foreground mb-1">You · {r.date}</p>
                                                  {r.text}
                                             </li>
                                        ))}
                                   </ul>
                              )}

                              {replying && (
                                   <div className="mt-4 space-y-2">
                                        <textarea className={input} rows={3} placeholder="Write your reply" value={text} onChange={(e) => setText(e.target.value)} />
                                        <div className="flex justify-end gap-2">
                                             <button onClick={() => setReplying(false)} className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
                                                  Cancel
                                             </button>
                                             <button onClick={send} className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                                                  Send reply
                                             </button>
                                        </div>
                                   </div>
                              )}

                              {!replying && (
                                   <div className="mt-6 flex justify-end gap-2">
                                        <button onClick={() => setReplying(true)} className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
                                             Reply
                                        </button>
                                        {!active.resolved && (
                                             <button onClick={() => resolveFeedback(active.id)} className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                                                  Mark as resolved
                                             </button>
                                        )}
                                   </div>
                              )}
                         </div>
                    ) : (
                         <div className="card-surface p-6 text-sm text-muted-foreground">
                              No feedback yet. It appears here after your supervisor reviews a submission.
                         </div>
                    )}
               </div>
          </div>
     );
}