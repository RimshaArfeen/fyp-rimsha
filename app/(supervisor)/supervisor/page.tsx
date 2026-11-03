
// app/(supervisor)/supervisor/page.tsx
// This page displays the dashboard for a supervisor, including their projects, milestones, submissions, and feedback. It uses the SupervisorStoreProvider to manage the state of the dashboard and provides functions to refresh the data and to review milestones.


"use client";

import { useState } from "react";
import { CheckCircle2, Clock, RotateCcw, MessageSquare, FileText } from "lucide-react";
import Badge from "../../../components/project-dashboard/ui/Badge";
import CountUp from "../../../components/student/CountUp";
import Loader from "../../../components/Loader";
import { useSupervisorStore, type Sub, type LiveMilestone } from "../../../lib/supervisor-store";

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function ReviewCard({ sub, milestone, onDone }: { sub: Sub; milestone: LiveMilestone; onDone: (msg: string) => void }) {
  const { review } = useSupervisorStore();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const decide = async (d: "approved" | "revision") => {
    if (busy) return;
    const text = comment.trim() || (d === "approved" ? "Approved." : "");
    if (!text) return setError("Write what the team needs to change.");
    setBusy(true);
    setError("");
    try {
      await review(milestone.id, d, text);
      onDone(d === "approved" ? `Approved: ${milestone.title}` : `Revision requested: ${milestone.title}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the review");
      setBusy(false);
    }
  };

  return (
    <li className="pop rounded-xl border border-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{milestone.title}</h3>
          <p className="text-xs text-muted-foreground">
            {milestone.teamName} • Due {milestone.due}
          </p>
        </div>
        <Badge variant="pending">Pending</Badge>
      </div>

      <div className="rounded-lg bg-muted p-3 text-sm flex flex-col gap-1">
        <p>
          <span className="text-muted-foreground">Submitted by: </span>
          {sub.submittedBy} • {sub.date} • v{sub.version}
        </p>
        <p className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-secondary" />
          {sub.fileUrl ? (
            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {sub.fileName || "Open file"}
            </a>
          ) : (
            sub.fileName || "No file name recorded"
          )}
        </p>
        {sub.note && (
          <p>
            <span className="text-muted-foreground">Note: </span>
            {sub.note}
          </p>
        )}
      </div>

      <textarea
        className={inputCls}
        rows={2}
        maxLength={2000}
        placeholder="Write your feedback for the team"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => decide("revision")}
          disabled={busy}
          className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition disabled:opacity-50"
        >
          Request revision
        </button>
        <button
          onClick={() => decide("approved")}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition disabled:opacity-50"
        >
          {busy ? "Saving…" : "Approve"}
        </button>
      </div>
    </li>
  );
}

export default function SupervisorPage() {
  const { supervisor, projects, milestones, submissions, feedback, loading } = useSupervisorStore();
  const [notice, setNotice] = useState("");

  if (loading) return <Loader fullScreen message="Loading..." />;

  const say = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  };

  // Latest waiting submission for each milestone that is waiting for review
  const queue: { sub: Sub; milestone: LiveMilestone }[] = [];
  for (const m of milestones) {
    if (!m.waiting) continue;
    const sub = submissions.find((s) => s.milestoneId === m.id && s.status === "pending");
    if (sub) queue.push({ sub, milestone: m });
  }

  const revision = milestones.filter((m) => m.status === "revision").length;
  const approved = milestones.filter((m) => m.status === "approved").length;
  const sent = feedback.filter((f) => f.mine).length;

  const stats = [
    { label: "Waiting for review", value: queue.length, suffix: "", icon: Clock },
    { label: "Needs revision", value: revision, suffix: "", icon: RotateCcw },
    { label: "Approved", value: approved, suffix: `/${milestones.length}`, icon: CheckCircle2 },
    { label: "Feedback sent", value: sent, suffix: "", icon: MessageSquare },
  ];

  const subtitle =
    projects.length === 0
      ? "No projects assigned yet"
      : projects.length === 1
        ? `${projects[0].teamName} • ${projects[0].title}`
        : `${projects.length} projects`;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Hero */}
      <section
        className="fade-up relative overflow-hidden rounded-2xl p-6 md:p-8 text-primary-foreground"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
      >
        <div className="float-slow absolute -top-10 -right-10 w-48 h-48 rounded-full bg-secondary/20" />
        <div className="float-slow absolute -bottom-12 left-1/3 w-32 h-32 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10">
          <p className="text-sm opacity-80">Supervisor dashboard</p>
          <h1 className="text-3xl font-bold mb-1">{supervisor.name}</h1>
          <p className="text-sm opacity-80">{subtitle}</p>
        </div>
      </section>

      {notice && (
        <div className="pop fixed top-6 right-6 z-50 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg text-sm">
          {notice}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, suffix, icon: Icon }, i) => (
          <div key={label} className="fade-up lift card-surface p-4 flex items-center gap-3" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-11 h-11 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                <CountUp to={value} />
                {suffix}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Review queue */}
        <section className="lg:col-span-2 fade-up card-surface p-5" style={{ animationDelay: "150ms" }}>
          <h2 className="font-semibold mb-4">Review queue ({queue.length})</h2>
          {queue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nothing is waiting. New submissions from your teams will show up here.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {queue.map(({ sub, milestone }) => (
                <ReviewCard key={sub.id} sub={sub} milestone={milestone} onDone={say} />
              ))}
            </ul>
          )}
        </section>

        {/* All milestones */}
        <section className="fade-up card-surface p-5" style={{ animationDelay: "250ms" }}>
          <h2 className="font-semibold mb-3">All milestones</h2>
          {milestones.length === 0 && <p className="text-sm text-muted-foreground">No milestones yet.</p>}
          <ul className="divide-y divide-border">
            {milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.teamName} • Due {m.due}
                  </p>
                </div>
                <Badge variant={m.status}>{label(m.status)}</Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}