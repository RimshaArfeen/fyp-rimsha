

"use client";

import { useState } from "react";
import Badge from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

export default function FeedbackTab({ project }: { project: typeof Project }) {
     const [activeId, setActiveId] = useState(project.feedback[0]?.id);
     const active = project.feedback.find((f) => f.id === activeId);

     return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
               {/* List */}
               <ul className="md:col-span-5 space-y-2">
                    {project.feedback.map((f) => {
                         const isActive = f.id === activeId;
                         return (
                              <li key={f.id}>
                                   <button
                                        onClick={() => setActiveId(f.id)}
                                        className={`w-full text-left card-surface p-4 transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/60"
                                             }`}
                                   >
                                        <div className="flex items-center justify-between gap-2">
                                             <p className="text-sm font-medium">{f.author}</p>
                                             {!f.resolved ? (
                                                  <Badge variant="pending">Awaiting</Badge>
                                             ) : (
                                                  <Badge variant="approved">Resolved</Badge>
                                             )}
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

                              <div className="mt-4 flex flex-wrap gap-2">
                                   {["Auth flow", "Rate limiting", "Diagrams"].map((tag) => (
                                        <span
                                             key={tag}
                                             className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                                        >
                                             {tag}
                                        </span>
                                   ))}
                              </div>

                              <div className="mt-6 flex justify-end gap-2">
                                   <button className="rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
                                        Reply
                                   </button>
                                   {!active.resolved && (
                                        <button className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                                             Mark as resolved
                                        </button>
                                   )}
                              </div>
                         </div>
                    ) : (
                         <div className="card-surface p-6 text-sm text-muted-foreground">
                              Select a feedback item to view details.
                         </div>
                    )}
               </div>
          </div>
     );
}