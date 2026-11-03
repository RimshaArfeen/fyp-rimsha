"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { ProjectInfo } from "../../../lib/project-store";

type Msg = { id: string; from: string; initials: string; text: string; createdAt: string; mine: boolean };

const time = (iso: string) =>
     new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function ChatAvatar({ initials, name, mine }: { initials: string; name: string; mine?: boolean }) {
     return (
          <div
               title={name}
               className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${mine ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
                    }`}
          >
               {initials}
          </div>
     );
}

export default function ChatTab({ project }: { project: ProjectInfo }) {
     const [messages, setMessages] = useState<Msg[]>([]);
     const [text, setText] = useState("");
     const [sending, setSending] = useState(false);
     const [loaded, setLoaded] = useState(false);
     const list = useRef<HTMLDivElement>(null);
     const last = useRef<string | null>(null);

     const online = project.members.filter((m) => m.online).length;

     const merge = useCallback((incoming: Msg[]) => {
          if (!incoming.length) return;
          last.current = incoming[incoming.length - 1].createdAt;
          setMessages((p) => {
               const ids = new Set(p.map((m) => m.id));
               return [...p, ...incoming.filter((m) => !ids.has(m.id))];
          });
     }, []);

     const load = useCallback(async () => {
          const q = last.current ? `?after=${encodeURIComponent(last.current)}` : "";
          const res = await fetch(`/api/chat${q}`, { cache: "no-store" });
          if (res.ok) merge((await res.json()).messages);
          setLoaded(true);
     }, [merge]);

     useEffect(() => {
          load();
          const t = setInterval(() => { if (!document.hidden) load(); }, 3000);
          return () => clearInterval(t);
     }, [load]);

     useEffect(() => {
          if (list.current) list.current.scrollTop = list.current.scrollHeight;
     }, [messages]);

     const send = async () => {
          const t = text.trim();
          if (!t || sending) return;
          setSending(true);
          try {
               const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: t }),
               });
               if (res.ok) {
                    merge([(await res.json()).message]);
                    setText("");
               }
          } finally {
               setSending(false);
          }
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
                    {loaded && messages.length === 0 && (
                         <p className="text-sm text-muted-foreground">No messages yet. Say hello to your team.</p>
                    )}
                    {messages.map((m) => (
                         <div key={m.id} className={`pop flex items-end gap-2 ${m.mine ? "justify-end" : ""}`}>
                              {!m.mine && <ChatAvatar initials={m.initials} name={m.from} />}

                              <div
                                   className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted"
                                        }`}
                              >
                                   {!m.mine && <p className="mb-0.5 text-xs font-medium text-muted-foreground">{m.from}</p>}
                                   <p className="whitespace-pre-wrap break-words">{m.text}</p>
                                   <p className={`mt-1 text-[10px] ${m.mine ? "opacity-70" : "text-muted-foreground"}`}>
                                        {time(m.createdAt)}
                                   </p>
                              </div>

                              {m.mine && <ChatAvatar initials={m.initials} name={m.from} mine />}
                         </div>
                    ))}
               </div>

               <div className="flex gap-2 border-t border-border p-3">
                    <input
                         value={text}
                         onChange={(e) => setText(e.target.value)}
                         onKeyDown={(e) => e.key === "Enter" && send()}
                         placeholder="Write a message"
                         maxLength={2000}
                         className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                         onClick={send}
                         disabled={!text.trim() || sending}
                         className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                         <Send className="h-4 w-4" /> Send
                    </button>
               </div>
          </section>
     );
}