"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Crown, UserPlus, Users, Check, X, Send, ClipboardList, FolderKanban, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStage } from "../../../lib/stage";
import { api } from "../../../lib/api-client";
import InviteDialog from "../../../components/project-dashboard/InviteDialog";

type Member = { id: string; name: string; email: string; skills: string[]; isLead: boolean };
type JoinReq = { id: string; userId: string; name: string; skills: string[]; message: string | null };
type InviteT = { id: string; who: string };
type TaskT = { id: string; title: string; status: string; assignedToId: string | null; assignedToName: string | null };
type Data = {
  team: { id: string; name: string; description: string; maxSize: number; skills: string[] } | null;
  isLead: boolean;
  members: Member[];
  joinRequests: JoinReq[];
  invites: InviteT[];
  tasks: TaskT[];
  stats: { joinRequests: number; invites: number };
  project: { id: string; title: string; description: string; supervisor: string | null; status: string; progress: number } | null;
};
type Supervisor = { id: string; name: string; department: string | null };

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function MyTeamPage() {
  const router = useRouter();
  const { stage, ready, refresh } = useStage();

  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTo, setTaskTo] = useState("");
  const [pTitle, setPTitle] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pSupervisorId, setPSupervisorId] = useState("");
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  const say = useCallback((msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  }, []);

  const load = useCallback(async () => {
    try {
      setData(await api<Data>("/api/teams/mine"));
    } catch (e) {
      say(e instanceof Error ? e.message : "Could not load your team");
    }
  }, [say]);

  useEffect(() => {
    if (ready && stage === 1) router.replace("/teams");
    if (ready && stage > 1) load();
  }, [ready, stage, router, load]);

  useEffect(() => {
    if (data?.isLead && !data.project)
      api<{ supervisors: Supervisor[] }>("/api/supervisors")
        .then((r) => setSupervisors(r.supervisors))
        .catch(() => { });
  }, [data?.isLead, data?.project]);

  // default assignee = first non-lead member (or the lead if alone)
  useEffect(() => {
    if (data && !data.members.some((m) => m.id === taskTo))
      setTaskTo(data.members[1]?.id ?? data.members[0]?.id ?? "");
  }, [data, taskTo]);

  // one wrapper for every mutation: call API -> reload -> toast
  const run = async (key: string, fn: () => Promise<unknown>, okMsg: string) => {
    if (busy) return;
    setBusy(key);
    try {
      await fn();
      await load();
      say(okMsg);
    } catch (e) {
      say(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  if (!ready || stage === 1 || !data || !data.team) return null;

  const isLead = data.isLead;
  const { team, members, joinRequests: requests, invites, tasks, project } = data;
  const spots = team.maxSize - members.length;

  const accept = (r: JoinReq) =>
    run(`req-${r.id}`, () => api(`/api/teams/mine/requests/${r.id}`, "PATCH", { action: "accept" }), `${r.name} joined your team`);
  const decline = (r: JoinReq) =>
    run(`req-${r.id}`, () => api(`/api/teams/mine/requests/${r.id}`, "PATCH", { action: "decline" }), `Declined ${r.name}`);

  const removeMember = (m: Member) => {
    if (confirmId !== m.id) return setConfirmId(m.id);
    setConfirmId(null);
    run(`rm-${m.id}`, () => api(`/api/teams/mine/members/${m.id}`, "DELETE"), `${m.name} removed from the team`);
  };

  const cancelInvite = (id: string) =>
    run(`inv-${id}`, () => api(`/api/teams/mine/invites/${id}`, "DELETE"), "Invite cancelled");

  const assignTask = () => {
    const title = taskTitle.trim();
    if (!title) return say("Write the task first");
    const to = members.find((m) => m.id === taskTo);
    run(
      "task",
      async () => {
        await api("/api/teams/mine/tasks", "POST", { title, assignedToId: taskTo || undefined });
        setTaskTitle("");
      },
      `Task assigned to ${to?.name ?? "the team"}`
    );
  };
  const toggleTask = (t: TaskT) =>
    run(
      `task-${t.id}`,
      () => api(`/api/teams/mine/tasks/${t.id}`, "PATCH", { status: t.status === "done" ? "pending" : "done" }),
      "Task updated"
    );

  const createProject = async () => {
    if (!pTitle.trim()) return say("Write the project title first");
    if (busy) return;
    setBusy("project");
    try {
      await api("/api/teams/mine/project", "POST", {
        title: pTitle,
        description: pDesc,
        supervisorId: pSupervisorId || undefined,
      });
      await refresh(); // /api/me/state -> stage becomes 3
      router.push("/project");
    } catch (e) {
      say(e instanceof Error ? e.message : "Could not create the project");
      setBusy(null);
    }
  };

  const stats = [
    { label: "Members", value: `${members.length}/${team.maxSize}`, icon: Users },
    { label: "Open spots", value: String(spots), icon: UserPlus },
    { label: "Join requests", value: String(data.stats.joinRequests), icon: Clock },
    { label: "Invites sent", value: String(data.stats.invites), icon: Send },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Hero */}
      <section
        className="fade-up relative overflow-hidden rounded-2xl p-8 md:p-10 text-primary-foreground flex items-center justify-between gap-6 flex-wrap"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
      >
        <div className="float-slow absolute -top-10 -right-8 w-44 h-44 rounded-full bg-secondary/20" />
        <div className="float-slow absolute -bottom-12 left-1/3 w-32 h-32 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10">
          <p className="text-sm opacity-80 mb-1">My Team</p>
          <h1 className="text-3xl font-bold mb-1">{team.name}</h1>
          <p className="text-sm opacity-80">
            {project ? `${project.title} • Supervisor: ${project.supervisor ?? "Not assigned"}` : "No project yet"}
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-3">
          <span className="px-4 py-1.5 rounded-lg bg-white/10 text-sm">
            {isLead ? "Team Lead" : "Team Member"}
          </span>
          {project && (
            <Link href="/project" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
              Open Project Dashboard
            </Link>
          )}
        </div>
      </section>

      {notice && (
        <div className="pop fixed top-6 right-6 z-50 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg text-sm">{notice}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="fade-up lift card-surface p-6 flex items-center gap-4" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-3xl font-bold leading-none">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {!isLead && (
        <p className="card-surface p-4 text-sm text-muted-foreground">
          Only the team lead can manage requests, send invites, assign tasks and create the project. You can update tasks assigned to you.
        </p>
      )}

      <div className="grid xl:grid-cols-3 gap-6">
        {/* LEFT: members + requests */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <section className="fade-up card-surface p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="font-semibold text-lg mb-5">Team Members</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {members.map((m) => (
                <div key={m.id} className="pop lift rounded-xl border border-border p-4 flex items-start gap-4">
                  <div className={`relative w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center ${m.isLead ? "ring-2 ring-secondary" : ""}`}>
                    {m.name.charAt(0)}
                    {m.isLead && <Crown className="absolute -top-2 -right-1 w-4 h-4 text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{m.isLead ? "Team Lead" : "Member"}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                  {isLead && !m.isLead && (
                    <button
                      onClick={() => removeMember(m)}
                      onBlur={() => setConfirmId(null)}
                      disabled={busy === `rm-${m.id}`}
                      className={`text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${confirmId === m.id ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}
                    >
                      {confirmId === m.id ? "Confirm?" : "Remove"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {isLead && (
            <section className="fade-up card-surface p-6" style={{ animationDelay: "200ms" }}>
              <h2 className="font-semibold text-lg mb-5">Join Requests ({requests.length})</h2>
              {requests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No pending requests right now.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {requests.map((r) => (
                    <li key={r.id} className="pop rounded-xl border border-border p-4 flex items-center gap-4 flex-wrap">
                      <div className="w-11 h-11 rounded-full bg-secondary text-secondary-foreground font-semibold flex items-center justify-center">{r.name.charAt(0)}</div>
                      <div className="flex-1 min-w-48">
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-muted-foreground">{r.message ?? "No message"}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {r.skills.map((s) => (
                            <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-primary">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => decline(r)}
                          disabled={busy === `req-${r.id}`}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                        <button
                          onClick={() => accept(r)}
                          disabled={busy === `req-${r.id}` || spots <= 0}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary-hover transition disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {/* RIGHT: project, invite, tasks */}
        <div className="flex flex-col gap-6">
          {project ? (
            <section className="fade-up card-surface p-6" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">Project</h2>
                <span className={project.status === "APPROVED" ? "badge-approved" : "badge-pending"}>
                  {project.status === "APPROVED" ? "Approved" : "Awaiting supervisor"}
                </span>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center"><FolderKanban className="w-5 h-5" /></div>
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted-foreground">Supervisor: {project.supervisor ?? "Not assigned"}</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${project.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
            </section>
          ) : (
            <section className="fade-up card-surface p-6 border-l-4 border-l-secondary" style={{ animationDelay: "160ms" }}>
              <h2 className="font-semibold text-lg mb-1">Create your project</h2>
              {isLead ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">Add your project to unlock Milestones and Feedback.</p>
                  <div className="flex flex-col gap-3">
                    <input className={inputCls} placeholder="Project title" value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
                    <textarea className={inputCls} rows={3} placeholder="Short description" value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
                    <select className={inputCls} value={pSupervisorId} onChange={(e) => setPSupervisorId(e.target.value)}>
                      <option value="">Choose a supervisor (optional)</option>
                      {supervisors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}{s.department ? ` · ${s.department}` : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={createProject}
                      disabled={busy === "project"}
                      className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition disabled:opacity-50"
                    >
                      {busy === "project" ? "Creating..." : "Create project"}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Only the team lead can create the project. Ask your lead to do it.</p>
              )}
            </section>
          )}

          {isLead && (
            <>
              <section className="fade-up card-surface p-6" style={{ animationDelay: "240ms" }}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="font-semibold text-lg">Invitations</h2>
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm shrink-0 hover:bg-primary-hover transition"
                  >
                    <UserPlus className="w-4 h-4" /> Invite
                  </button>
                </div>
                {invites.length === 0 && <p className="text-sm text-muted-foreground">No pending invitations.</p>}
                <ul className="flex flex-col gap-2">
                  {invites.map((i) => (
                    <li key={i.id} className="pop flex items-center justify-between gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                      <span className="truncate">{i.who}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="badge-pending">Pending</span>
                        <button
                          onClick={() => cancelInvite(i.id)}
                          disabled={busy === `inv-${i.id}`}
                          aria-label="Cancel invite"
                          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="fade-up card-surface p-6" style={{ animationDelay: "320ms" }}>
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-secondary" /> Assign a Task</h2>
                <div className="flex flex-col gap-3 mb-4">
                  <input
                    className={inputCls}
                    placeholder="Task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && assignTask()}
                  />
                  <div className="flex gap-2">
                    <select className={inputCls} value={taskTo} onChange={(e) => setTaskTo(e.target.value)}>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={assignTask}
                      disabled={busy === "task"}
                      className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium shrink-0 hover:scale-105 transition disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {tasks.slice(0, 6).map((t) => {
                    const done = t.status === "done";
                    return (
                      <li key={t.id} className="pop flex items-center gap-3 text-sm">
                        <button
                          onClick={() => toggleTask(t)}
                          disabled={busy === `task-${t.id}`}
                          aria-label="Toggle task"
                          className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition ${done ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}
                        >
                          {done && <Check className="w-3 h-3" />}
                        </button>
                        <span className={`flex-1 ${done ? "line-through opacity-60" : ""}`}>{t.title}</span>
                        {t.assignedToName && (
                          <span className="text-xs text-muted-foreground">{t.assignedToName.split(" ")[0]}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {project && (
                  <Link href="/dashboard" className="mt-4 inline-block text-xs font-medium text-secondary hover:underline">
                    See all tasks on the Dashboard
                  </Link>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {inviteOpen && (
        <InviteDialog
          teamName={team.name}
          project={{
            title: project?.title ?? "No project yet",
            description: project?.description ?? "Your team has not created a project yet.",
          }}
          onClose={() => setInviteOpen(false)}
          onSent={(m) => { say(m); load(); }}
        />
      )}
    </div>
  );
}