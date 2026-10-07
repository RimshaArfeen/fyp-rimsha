//  app/(student)/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CalendarClock, MessageSquare, TrendingUp, Users, Circle, ChevronDown } from "lucide-react";
import CountUp from "../../../components/student/CountUp";
import ProgressRing from "../../../components/student/ProgressRing";
import { student, team, project, tasks as initialTasks, deadlines, feedback, TaskStatus } from "../../../lib/dummyData";

const badgeClass = { done: "badge-approved", pending: "badge-pending", revision: "badge-revision" } as const;
const badgeLabel = { done: "Done", pending: "Pending", revision: "Revision" } as const;

export default function StudentDashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [readIds, setReadIds] = useState<number[]>([]);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = Math.round((doneCount / tasks.length) * 100);
  const unread = feedback.length - readIds.length;
  const shown = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const toggleTask = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t))
    );

  const openFeedback = (id: number) => {
    setOpenId(openId === id ? null : id);
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const stats = [
    { label: "Tasks Done", value: doneCount, icon: CheckCircle2 },
    { label: "Total Tasks", value: tasks.length, icon: TrendingUp },
    { label: "Team Members", value: team.members.length, icon: Users },
    { label: "Unread Feedback", value: unread, icon: MessageSquare },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Hero */}
      <section
        className="fade-up relative overflow-hidden rounded-2xl p-6 md:p-8 text-primary-foreground flex items-center justify-between gap-6 flex-wrap"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
      >
        <div className="float-slow absolute -top-10 -right-10 w-48 h-48 rounded-full bg-secondary/20" />
        <div className="float-slow absolute -bottom-12 left-1/3 w-32 h-32 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10">
          <p className="text-sm opacity-80">Welcome back</p>
          <h1 className="text-3xl font-bold mb-1">{student.name.split(" ")[0]} 👋</h1>
          <p className="text-sm opacity-80 mb-4">
            {team.name} • {project.title}
          </p>
          <Link href="/profile" className="inline-block px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
            View Profile
          </Link>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <ProgressRing value={progress} size={130} />
          <span className="text-xs opacity-80">Project progress</span>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="fade-up lift card-surface p-4 flex items-center gap-3" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-11 h-11 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                <CountUp to={value} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tasks */}
          <section className="fade-up card-surface p-5" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <h2 className="font-semibold">My Tasks</h2>
              <div className="flex bg-muted rounded-lg p-1 text-xs">
                {(["all", "pending", "done", "revision"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-md capitalize transition ${
                      filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <ul className="divide-y divide-border">
              {shown.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No tasks here</li>}
              {shown.map((task) => (
                <li key={task.id} className="pop flex items-center gap-3 py-3">
                  <button onClick={() => toggleTask(task.id)} aria-label="Toggle task" className="text-primary hover:scale-110 transition">
                    {task.status === "done" ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.status === "done" ? "line-through opacity-60" : ""}`}>{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due {task.due}</p>
                  </div>
                  <span className={badgeClass[task.status]}>{badgeLabel[task.status]}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Feedback */}
          <section className="fade-up card-surface p-5" style={{ animationDelay: "250ms" }}>
            <h2 className="font-semibold mb-3">Supervisor Feedback</h2>
            <div className="flex flex-col gap-3">
              {feedback.map((f) => (
                <button key={f.id} onClick={() => openFeedback(f.id)} className="text-left bg-muted rounded-lg p-3 hover:bg-accent transition">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      {!readIds.includes(f.id) && <span className="w-2 h-2 rounded-full bg-secondary" />}
                      {f.from} • {f.date}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition ${openId === f.id ? "rotate-180" : ""}`} />
                  </div>
                  <p className={`text-sm mt-1 ${openId === f.id ? "" : "line-clamp-1"}`}>{f.message}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {/* Team */}
          <section className="fade-up card-surface p-5" style={{ animationDelay: "200ms" }}>
            <h2 className="font-semibold mb-3">{team.name}</h2>
            <ul className="flex flex-col gap-3">
              {team.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 group">
                  <div
                    className={`w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold group-hover:scale-110 transition ${
                      m.role === "Team Lead" ? "ring-2 ring-secondary" : ""
                    }`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Deadlines */}
          <section className="fade-up card-surface p-5" style={{ animationDelay: "300ms" }}>
            <h2 className="font-semibold mb-3">Upcoming Deadlines</h2>
            <ul className="flex flex-col gap-3">
              {deadlines.map((d) => (
                <li key={d.id} className="lift flex items-center gap-3 rounded-lg border border-border p-3 border-l-4 border-l-secondary">
                  <CalendarClock className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
