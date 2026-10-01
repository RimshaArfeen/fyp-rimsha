"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, UserPlus, Users, Check, X, Send, ClipboardList, FolderKanban, Clock, Search } from "lucide-react";
import { team, project } from "../../../lib/dummyData";

type Member = { id: number; name: string; role: string; skills: string[] };
type Request = { id: number; name: string; skills: string[]; message: string };
type Invite = { id: number; who: string };
type Assignment = { id: number; title: string; to: string; done: boolean };

const MAX_MEMBERS = 5;
const skillsByName: Record<string, string[]> = {
  "Ayesha Khan": ["React", "Next.js"],
  "Hamza Ali": ["Node.js", "MongoDB"],
  "Sara Noor": ["UI Design", "Tailwind CSS"],
};

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function MyTeamPage() {
  const [viewAs, setViewAs] = useState<"lead" | "member">("lead");
  const [members, setMembers] = useState<Member[]>(
    team.members.map((m) => ({ ...m, skills: skillsByName[m.name] ?? [] }))
  );
  const [requests, setRequests] = useState<Request[]>([
    { id: 101, name: "Zain Ahmed", skills: ["React", "UI Design"], message: "I can handle the frontend screens and design." },
    { id: 102, name: "Maryam Siddiqui", skills: ["Node.js", "Prisma"], message: "Happy to take the backend and database work." },
    { id: 103, name: "Omar Farooq", skills: ["Testing", "Git"], message: "I can help with testing and documentation." },
  ]);
  const [invites, setInvites] = useState<Invite[]>([{ id: 201, who: "kamran@university.edu.pk" }]);
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 301, title: "Design the database schema", to: "Hamza Ali", done: false },
    { id: 302, title: "Build the login screens", to: "Sara Noor", done: true },
  ]);
  const [inviteText, setInviteText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTo, setTaskTo] = useState(team.members[1].name);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const isLead = viewAs === "lead";
  const spots = MAX_MEMBERS - members.length;

  const say = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  };

  const accept = (r: Request) => {
    if (spots <= 0) return say("Your team is full. Remove a member first.");
    setMembers((p) => [...p, { id: r.id, name: r.name, role: "Member", skills: r.skills }]);
    setRequests((p) => p.filter((x) => x.id !== r.id));
    say(`${r.name} joined your team`);
  };
  const decline = (r: Request) => {
    setRequests((p) => p.filter((x) => x.id !== r.id));
    say(`Declined ${r.name}`);
  };
  const removeMember = (m: Member) => {
    if (confirmId !== m.id) return setConfirmId(m.id);
    setMembers((p) => p.filter((x) => x.id !== m.id));
    setConfirmId(null);
    say(`${m.name} removed from the team`);
  };
  const sendInvite = () => {
    const who = inviteText.trim();
    if (!who) return say("Type an email or name first");
    if (invites.some((i) => i.who.toLowerCase() === who.toLowerCase())) return say("Already invited");
    setInvites((p) => [{ id: Date.now(), who }, ...p]);
    setInviteText("");
    say(`Invitation sent to ${who}`);
  };
  const assignTask = () => {
    const title = taskTitle.trim();
    if (!title) return say("Write the task first");
    setAssignments((p) => [{ id: Date.now(), title, to: taskTo, done: false }, ...p]);
    setTaskTitle("");
    say(`Task assigned to ${taskTo}`);
  };
  const toggleTask = (id: number) =>
    setAssignments((p) => p.map((a) => (a.id === id ? { ...a, done: !a.done } : a)));

  const stats = [
    { label: "Members", value: `${members.length}/${MAX_MEMBERS}`, icon: Users },
    { label: "Open spots", value: String(spots), icon: UserPlus },
    { label: "Join requests", value: String(requests.length), icon: Clock },
    { label: "Invites sent", value: String(invites.length), icon: Send },
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
          <p className="text-sm opacity-80">{project.title} • Supervisor: {project.supervisor}</p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-3">
          <div className="flex bg-white/10 rounded-lg p-1 text-sm">
            {(["lead", "member"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewAs(v)}
                className={`px-4 py-1.5 rounded-md transition ${viewAs === v ? "bg-secondary text-secondary-foreground font-medium" : "opacity-80"}`}
              >
                {v === "lead" ? "Team Lead view" : "Member view"}
              </button>
            ))}
          </div>
          <Link href="/project" className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
            Open Project Dashboard
          </Link>
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
          You are viewing as a team member. Only the team lead can manage requests, send invites and assign tasks. Switch to Team Lead view at the top to see those controls.
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
                  <div className={`relative w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center ${m.role === "Team Lead" ? "ring-2 ring-secondary" : ""}`}>
                    {m.name.charAt(0)}
                    {m.role === "Team Lead" && <Crown className="absolute -top-2 -right-1 w-4 h-4 text-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{m.role}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (<span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-primary">{s}</span>))}
                    </div>
                  </div>
                  {isLead && m.role !== "Team Lead" && (
                    <button
                      onClick={() => removeMember(m)}
                      onBlur={() => setConfirmId(null)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition ${confirmId === m.id ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}
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
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">No pending requests right now.</p>
                  <Link href="/teams" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                    <Search className="w-4 h-4" /> Browse Find Teams
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {requests.map((r) => (
                    <li key={r.id} className="pop rounded-xl border border-border p-4 flex items-center gap-4 flex-wrap">
                      <div className="w-11 h-11 rounded-full bg-secondary text-secondary-foreground font-semibold flex items-center justify-center">{r.name.charAt(0)}</div>
                      <div className="flex-1 min-w-48">
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-muted-foreground">{r.message}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {r.skills.map((s) => (<span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-primary">{s}</span>))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => decline(r)} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition"><X className="w-4 h-4" /> Decline</button>
                        <button onClick={() => accept(r)} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary-hover transition"><Check className="w-4 h-4" /> Accept</button>
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
          <section className="fade-up card-surface p-6" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Project</h2>
              <span className="badge-approved">Approved</span>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center"><FolderKanban className="w-5 h-5" /></div>
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted-foreground">Supervisor: {project.supervisor}</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
              <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
          </section>

          {isLead && (
            <>
              <section className="fade-up card-surface p-6" style={{ animationDelay: "240ms" }}>
                <h2 className="font-semibold text-lg mb-4">Invite a Member</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    className={inputCls}
                    placeholder="Email or name"
                    value={inviteText}
                    onChange={(e) => setInviteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                  />
                  <button onClick={sendInvite} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm shrink-0 hover:bg-primary-hover transition">
                    <UserPlus className="w-4 h-4" /> Invite
                  </button>
                </div>
                <ul className="flex flex-col gap-2">
                  {invites.map((i) => (
                    <li key={i.id} className="pop flex items-center justify-between gap-2 text-sm bg-muted rounded-lg px-3 py-2">
                      <span className="truncate">{i.who}</span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="badge-pending">Pending</span>
                        <button onClick={() => setInvites((p) => p.filter((x) => x.id !== i.id))} aria-label="Cancel invite" className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="fade-up card-surface p-6" style={{ animationDelay: "320ms" }}>
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-secondary" /> Assign a Task</h2>
                <div className="flex flex-col gap-3 mb-4">
                  <input className={inputCls} placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && assignTask()} />
                  <div className="flex gap-2">
                    <select className={inputCls} value={taskTo} onChange={(e) => setTaskTo(e.target.value)}>
                      {members.map((m) => (<option key={m.id} value={m.name}>{m.name}</option>))}
                    </select>
                    <button onClick={assignTask} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium shrink-0 hover:scale-105 transition">Assign</button>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {assignments.map((a) => (
                    <li key={a.id} className="pop flex items-center gap-3 text-sm">
                      <button onClick={() => toggleTask(a.id)} aria-label="Toggle task" className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition ${a.done ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                        {a.done && <Check className="w-3 h-3" />}
                      </button>
                      <span className={`flex-1 ${a.done ? "line-through opacity-60" : ""}`}>{a.title}</span>
                      <span className="text-xs text-muted-foreground">{a.to.split(" ")[0]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
