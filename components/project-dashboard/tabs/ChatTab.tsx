
"use client";

import { useState } from "react";
import { Avatar } from "../ui/Avatar";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

export default function ChatTab({ project }: { project: typeof Project }) {
     const [draft, setDraft] = useState("");

     return (
          <div className="card-surface flex flex-col h-[600px]">
               {/* Message list */}
               <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="text-center">
                         <span className="inline-block rounded-full bg-muted text-muted-foreground text-[11px] px-3 py-1">
                              Today
                         </span>
                    </div>

                    {project.messages.map((m) => (
                         <div
                              key={m.id}
                              className={`flex items-end gap-2 ${m.self ? "flex-row-reverse" : ""}`}
                         >
                              {!m.self && <Avatar initials={m.initials} size={30} />}
                              <div className={`max-w-[75%] ${m.self ? "text-right" : ""}`}>
                                   {!m.self && (
                                        <p className="text-[11px] text-muted-foreground mb-1 ml-1">{m.author}</p>
                                   )}
                                   <div
                                        className={`inline-block px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${m.self
                                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                                  : "bg-muted text-foreground rounded-bl-sm"
                                             }`}
                                   >
                                        {m.body}
                                   </div>
                                   <p className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</p>
                              </div>
                         </div>
                    ))}
               </div>

               {/* Composer */}
               <div className="border-t border-border p-3 flex items-center gap-2">
                    <button
                         aria-label="Attach file"
                         className="h-9 w-9 grid place-items-center rounded-[var(--radius-custom)] border border-border bg-card text-muted-foreground hover:bg-accent transition-colors"
                    >
                         +
                    </button>
                    <input
                         value={draft}
                         onChange={(e) => setDraft(e.target.value)}
                         placeholder="Write a message…"
                         className="flex-1 h-9 rounded-[var(--radius-custom)] border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                    />
                    <button
                         disabled={!draft.trim()}
                         className="h-9 px-4 rounded-[var(--radius-custom)] bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
                    >
                         Send
                    </button>
               </div>
          </div>
     );
}