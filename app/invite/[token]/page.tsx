
//app/invite/%5Btoken%5D/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Info = {
     state: string; role: "MEMBER" | "SUPERVISOR"; name: string; email: string; accountExists: boolean;
     invitedBy: string; team: string; project: { title: string; description: string } | null;
};

export default function InvitePage() {
     const { token } = useParams<{ token: string }>();
     const [info, setInfo] = useState<Info | null>(null);
     const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
     const [error, setError] = useState("");
     const [busy, setBusy] = useState(false);
     const [done, setDone] = useState("");

     useEffect(() => {
          fetch(`/api/invites/${token}`, { cache: "no-store" })
               .then(async (r) => (r.ok ? setInfo(await r.json()) : setError((await r.json()).error ?? "Invitation not found")))
               .catch(() => setError("Could not load the invitation"));
          fetch("/api/me/state", { cache: "no-store" }).then((r) => setLoggedIn(r.status !== 401));
     }, [token]);

     const act = async (action: "accept" | "decline") => {
          setBusy(true);
          setError("");
          const res = await fetch(`/api/invites/${token}`, {
               method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }),
          });
          const json = await res.json().catch(() => ({}));
          setBusy(false);
          if (!res.ok) return setError(json.error ?? "Something went wrong");
          if (action === "decline") return setDone("Invitation declined.");
          // Hard navigation so the stage and store reload with the new membership.
          window.location.assign(info?.role === "SUPERVISOR" ? "/" : "/my-team");
     };

     const next = encodeURIComponent(`/invite/${token}`);
     const roleText = info?.role === "SUPERVISOR" ? "supervisor" : "team member";

     return (
          <main className="min-h-screen grid place-items-center p-6 bg-background">
               <div className="card-surface w-full max-w-md p-6 space-y-4">
                    {!info && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {done && <p className="text-sm">{done}</p>}

                    {info && !done && (
                         <>
                              <h1 className="text-xl font-semibold">You are invited</h1>
                              <p className="text-sm text-muted-foreground">
                                   <b>{info.invitedBy}</b> invited <b>{info.name}</b> to join <b>{info.team}</b> as {roleText}.
                              </p>
                              {info.project && (
                                   <div className="rounded-lg border border-border p-3 text-sm">
                                        <p className="font-medium">{info.project.title}</p>
                                        <p className="text-muted-foreground">{info.project.description}</p>
                                   </div>
                              )}

                              {info.state !== "pending" ? (
                                   <p className="text-sm text-destructive">This invitation is {info.state}. Ask the team lead for a new one.</p>
                              ) : loggedIn ? (
                                   <div className="flex gap-2">
                                        <button disabled={busy} onClick={() => act("decline")} className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50">Decline</button>
                                        <button disabled={busy} onClick={() => act("accept")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50">
                                             {busy ? "Working…" : "Accept"}
                                        </button>
                                   </div>
                              ) : (
                                   <div className="flex flex-col gap-2">
                                        <p className="text-xs text-muted-foreground">Use <b>{info.email}</b> to {info.accountExists ? "log in" : "sign up"}.</p>
                                        <Link
                                             href={info.accountExists ? `/login?next=${next}` : `/signup?invite=${token}&email=${encodeURIComponent(info.email)}&role=${info.role === "SUPERVISOR" ? "teacher" : "student"}`}
                                             className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm text-center"
                                        >
                                             {info.accountExists ? "Log in to accept" : "Create account to accept"}
                                        </Link>
                                        <Link href={`/login?next=${next}`} className="text-xs text-secondary hover:underline text-center">
                                             I already have an account
                                        </Link>
                                   </div>
                              )}
                         </>
                    )}
               </div>
          </main>
     );
}