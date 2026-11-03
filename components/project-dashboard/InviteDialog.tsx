
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../lib/api-client";

type Supervisor = { id: string; name: string; department: string | null };
type Props = {
     teamName: string;
     project: { title: string; description: string };
     onClose: () => void;
     onSent: (msg: string) => void;
};

const input =
     "w-full rounded-[var(--radius-custom)] border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function InviteDialog({ teamName, project, onClose, onSent }: Props) {
     const [mounted, setMounted] = useState(false);
     const [role, setRole] = useState<"member" | "supervisor">("member");
     const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
     const [supId, setSupId] = useState(""); // "" = someone else, by email
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [busy, setBusy] = useState(false);
     const [error, setError] = useState("");

     useEffect(() => setMounted(true), []);

     useEffect(() => {
          const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
          document.addEventListener("keydown", onKey);
          return () => document.removeEventListener("keydown", onKey);
     }, [onClose]);

     useEffect(() => {
          if (role !== "supervisor" || supervisors.length) return;
          api<{ supervisors: Supervisor[] }>("/api/supervisors")
               .then((r) => setSupervisors(r.supervisors))
               .catch(() => { });
     }, [role, supervisors.length]);

     const byEmail = role === "member" || !supId;

     const send = async () => {
          if (busy) return;
          if (byEmail && (!name.trim() || !email.trim())) return setError("Enter a name and email");
          setBusy(true);
          setError("");
          try {
               await api(
                    "/api/teams/mine/invites",
                    "POST",
                    byEmail ? { role, name: name.trim(), email: email.trim() } : { role, inviteeId: supId }
               );
               onSent("Invitation sent");
               onClose();
          } catch (e) {
               setError(e instanceof Error ? e.message : "Could not send the invitation");
               setBusy(false);
          }
     };

     if (!mounted) return null;

     return createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="invite-title">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
               <div className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-5 shadow-2xl">
                    <div>
                         <h3 id="invite-title" className="text-lg font-semibold">Invite someone to {teamName}</h3>
                         <p className="text-xs text-muted-foreground">They get an email with a link to sign up and join.</p>
                    </div>

                    <div className="flex gap-1 rounded-lg bg-muted p-1 text-sm" role="tablist">
                         {(["member", "supervisor"] as const).map((r) => (
                              <button
                                   key={r}
                                   type="button"
                                   role="tab"
                                   aria-selected={role === r}
                                   onClick={() => { setRole(r); setError(""); }}
                                   className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                              >
                                   {r === "member" ? "Team member" : "Supervisor"}
                              </button>
                         ))}
                    </div>

                    {role === "supervisor" && (
                         <select className={input} value={supId} onChange={(e) => setSupId(e.target.value)}>
                              <option value="">Someone else (invite by email)</option>
                              {supervisors.map((s) => (
                                   <option key={s.id} value={s.id}>
                                        {s.name}{s.department ? ` · ${s.department}` : ""}
                                   </option>
                              ))}
                         </select>
                    )}

                    {byEmail && (
                         <div className="space-y-2">
                              <input className={input} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                              <input className={input} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                         </div>
                    )}

                    <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                         <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Project overview (included in the email)
                         </p>
                         <p className="mt-1 font-medium">{project.title}</p>
                         <p className="line-clamp-3 text-muted-foreground">{project.description}</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end gap-2">
                         <button type="button" onClick={onClose} className="rounded-[var(--radius-custom)] border border-border px-3 py-2 text-sm hover:bg-accent">
                              Cancel
                         </button>
                         <button
                              type="button"
                              onClick={send}
                              disabled={busy}
                              className="rounded-[var(--radius-custom)] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
                         >
                              {busy ? "Sending…" : "Send invitation"}
                         </button>
                    </div>
               </div>
          </div>,
          document.body
     );
}