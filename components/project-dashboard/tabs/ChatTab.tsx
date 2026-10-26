"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { student } from "../../../lib/dummyData";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

type Msg = { id: number; from: string; initials: string; text: string; time: string; mine: boolean };

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// Keeps messages while you switch tabs. They reset when you refresh the page.
let saved: Msg[] | null = null;

const seed = (project: typeof Project): Msg[] => {
     const m = project.members;
     return [
          { id: 1, from: m[1]?.name ?? "Teammate", initials: m[1]?.initials ?? "T", text: "Backend routes are ready for review.", time: "09:12", mine: false },
          { id: 2, from: m[2]?.name ?? "Teammate", initials: m[2]?.initials ?? "T", text: "Great. I will update the API docs today.", time: "09:20", mine: false },
     ];
};

export default function ChatTab({ project }: { project: typeof Project }) {
     const [messages, setMessages] = useState<Msg[]>(() => saved ?? seed(project));
     const [text, setText] = useState("");
     const list = useRef<HTMLDivElement>(null);

     const myInitials = student.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2);
     const online = project.members.filter((m) => m.online).length;

     useEffect(() => {
          saved = messages;
          if (list.current) list.current.scrollTop = list.current.scrollHeight;
     }, [messages]);

     const send = () => {
          const t = text.trim();
          if (!t) return;
          setMessages((p) => [...p, { id: Date.now(), from: student.name, initials: myInitials, text: t, time: now(), mine: true }]);
          setText("");
     };

     return (
          <section className="fade-up card-surface flex h-[30rem] flex-col">
               <header className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                         <h3 className="font-semibold">Team chat</h3>
                         <p className="text-xs text-muted-foreground">
                              {project.members.length} members • {online} online
                         </p>
                    </div>
                    <div className="flex -space-x-2">
                         {project.members.slice(0, 5).map((m) => (
                              <div
                                   key={m.id}
                                   title={m.name}
                                   className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-xs font-semibold text-primary-foreground"
                              >
                                   {m.initials}
                              </div>
                         ))}
                    </div>
               </header>

               <div ref={list} className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messages.map((m) => (
                         <div key={m.id} className={`pop flex items-end gap-2 ${m.mine ? "justify-end" : ""}`}>
                              {!m.mine && (
                                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                        {m.initials}
                                   </div>
                              )}
                              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                   m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted"
                              }`}>
                                   {!m.mine && <p className="mb-0.5 text-xs font-medium text-muted-foreground">{m.from}</p>}
                                   <p>{m.text}</p>
                                   <p className={`mt-1 text-[10px] ${m.mine ? "opacity-70" : "text-muted-foreground"}`}>{m.time}</p>
                              </div>
                         </div>
                    ))}
               </div>

               <div className="flex gap-2 border-t border-border p-3">
                    <input
                         value={text}
                         onChange={(e) => setText(e.target.value)}
                         onKeyDown={(e) => e.key === "Enter" && send()}
                         placeholder="Write a message"
                         className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                         onClick={send}
                         disabled={!text.trim()}
                         className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                         <Send className="h-4 w-4" /> Send
                    </button>
               </div>
          </section>
     );
}