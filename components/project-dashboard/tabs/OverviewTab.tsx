"use client";

import Link from "next/link";
import { ArrowRight, Flag, MessageSquare } from "lucide-react";
import Badge from "../ui/Badge";
import { useProjectStore } from "../../../lib/project-store";
import { projectTabHref } from "../../../lib/project-tabs";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

export default function OverviewTab(_props: { project: typeof Project }) {
     const { milestones, submissionsFor, feedback } = useProjectStore();

     const base = projectTabHref("milestones");
     const hrefFor = (id: string | number) => `${base}${base.includes("?") ? "&" : "?"}open=${id}`;

     const waitingOf = (title: string) => submissionsFor(title)[0]?.status === "pending";
     const fix = milestones.find((m) => m.status === "revision");
     const todo = milestones.find((m) => m.status === "pending" && !waitingOf(m.title));
     const anyWaiting = milestones.some((m) => m.status === "pending" && waitingOf(m.title));
     const attention = milestones.filter((m) => m.status !== "approved").slice(0, 4);

     const next = fix
          ? { title: `Fix and resubmit: ${fix.title}`, text: "Your supervisor asked for changes.", href: hrefFor(fix.id), button: "Open milestone", warn: true }
          : todo
          ? { title: `Submit: ${todo.title}`, text: `Due ${todo.due}`, href: hrefFor(todo.id), button: "Open milestone", warn: false }
          : anyWaiting
          ? { title: "Waiting for your supervisor", text: "Everything is submitted. You will see the result in Feedback.", href: projectTabHref("feedback"), button: "Open Feedback", warn: false }
          : { title: "All milestones approved", text: "Nothing left to submit. Great work.", href: "", button: "", warn: false };

     return (
          <div className="flex flex-col gap-4">
               {/* Next step */}
               <section
                    className={`fade-up card-surface p-5 flex items-center justify-between gap-4 flex-wrap border-l-4 ${
                         next.warn ? "border-l-destructive" : "border-l-secondary"
                    }`}
               >
                    <div>
                         <p className="text-xs text-muted-foreground mb-1">Your next step</p>
                         <h3 className="font-semibold">{next.title}</h3>
                         <p className="text-sm text-muted-foreground">{next.text}</p>
                    </div>
                    {next.href && (
                         <Link
                              href={next.href}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition"
                         >
                              {next.button} <ArrowRight className="w-4 h-4" />
                         </Link>
                    )}
               </section>

               <div className="grid md:grid-cols-2 gap-4">
                    {/* Needs attention */}
                    <section className="fade-up card-surface p-5" style={{ animationDelay: "100ms" }}>
                         <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold flex items-center gap-2">
                                   <Flag className="w-4 h-4 text-secondary" /> Needs attention
                              </h3>
                              <Link href={base} className="text-xs font-medium text-secondary hover:underline">
                                   All milestones
                              </Link>
                         </div>
                         <ul className="flex flex-col gap-2">
                              {attention.length === 0 && (
                                   <li className="text-sm text-muted-foreground">All milestones are approved. 🎉</li>
                              )}
                              {attention.map((m) => (
                                   <li key={m.id}>
                                        <Link
                                             href={hrefFor(m.id)}
                                             className="lift flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 hover:bg-accent transition"
                                        >
                                             <div className="min-w-0">
                                                  <p className="text-sm font-medium truncate">{m.title}</p>
                                                  <p className="text-xs text-muted-foreground">Due {m.due}</p>
                                             </div>
                                             {m.status === "revision" ? (
                                                  <Badge variant="revision">Needs revision</Badge>
                                             ) : waitingOf(m.title) ? (
                                                  <Badge variant="pending">Waiting for review</Badge>
                                             ) : (
                                                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                                                       Not submitted
                                                  </span>
                                             )}
                                        </Link>
                                   </li>
                              ))}
                         </ul>
                    </section>

                    {/* Latest feedback */}
                    <section className="fade-up card-surface p-5" style={{ animationDelay: "200ms" }}>
                         <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold flex items-center gap-2">
                                   <MessageSquare className="w-4 h-4 text-secondary" /> Latest feedback
                              </h3>
                              <Link href={projectTabHref("feedback")} className="text-xs font-medium text-secondary hover:underline">
                                   See all
                              </Link>
                         </div>
                         <ul className="flex flex-col gap-2">
                              {feedback.length === 0 && <li className="text-sm text-muted-foreground">No feedback yet.</li>}
                              {feedback.slice(0, 3).map((f) => (
                                   <li key={f.id} className="lift rounded-lg bg-muted px-3 py-2">
                                        <p className="text-xs text-muted-foreground">{f.author} · {f.date}</p>
                                        <p className="text-sm line-clamp-2">{f.snippet}</p>
                                   </li>
                              ))}
                         </ul>
                    </section>
               </div>
          </div>
     );
}