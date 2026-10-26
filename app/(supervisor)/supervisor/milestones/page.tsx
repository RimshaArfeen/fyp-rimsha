"use client";

import { useState } from "react";
import { ChevronDown, FileText, MessageSquare } from "lucide-react";
import Badge from "../../../../components/project-dashboard/ui/Badge";
import { useProjectStore, type LiveMilestone } from "../../../../lib/project-store";

type Kind = "waiting" | "revision" | "approved" | "notsubmitted";

const filters: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "waiting", label: "Waiting for review" },
  { id: "revision", label: "Needs revision" },
  { id: "approved", label: "Approved" },
  { id: "notsubmitted", label: "Not submitted" },
];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const inputCls =
  "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function ReviewBox({ milestone, onDone }: { milestone: LiveMilestone; onDone: (msg: string) => void }) {
  const { review } = useProjectStore();
  const [comment, setComment] = useState("");

  const decide = (d: "approved" | "revision") => {
    review(milestone.id, milestone.title, d, comment);
    onDone(d === "approved" ? `Approved: ${milestone.title}` : `Revision requested: ${milestone.title}`);
  };

  return (
    <div className="md:col-span-2 flex flex-col gap-2 rounded-lg border border-dashed border-border p-3">
      <p className="text-sm font-medium">Review this submission</p>
      <textarea
        className={inputCls}
        rows={2}
        placeholder="Write your feedback for the team"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => decide("revision")}
          className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition"
        >
          Request revision
        </button>
        <button
          onClick={() => decide("approved")}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

export default function SupervisorMilestonesPage() {
  const { milestones, submissionsFor, feedbackFor } = useProjectStore();
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const say = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2600);
  };

  const kindOf = (m: LiveMilestone): Kind => {
    if (m.status === "approved") return "approved";
    if (m.status === "revision") return "revision";
    return submissionsFor(m.title)[0]?.status === "pending" ? "waiting" : "notsubmitted";
  };

  const count = (k: "all" | Kind) =>
    k === "all" ? milestones.length : milestones.filter((m) => kindOf(m) === k).length;

  const list = filter === "all" ? milestones : milestones.filter((m) => kindOf(m) === filter);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {notice && (
        <div className="pop fixed top-6 right-6 z-50 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg text-sm">
          {notice}
        </div>
      )}

      <section className="fade-up card-surface p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h1 className="text-xl font-semibold">Milestones ({list.length})</h1>
          <div className="flex flex-wrap bg-muted rounded-lg p-1 text-xs">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-md transition ${
                  filter === f.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {f.label} ({count(f.id)})
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {list.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">No milestones here.</li>
          )}
          {list.map((m) => {
            const kind = kindOf(m);
            const id = String(m.id);
            const open = openId === id;
            const subs = submissionsFor(m.title);
            const fbs = feedbackFor(m.title);

            return (
              <li key={id} className="pop lift rounded-xl border border-border">
                <button
                  onClick={() => setOpenId(open ? null : id)}
                  className="w-full text-left p-4 flex items-center gap-4"
                  aria-expanded={open}
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold truncate">{m.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      Due {m.due} • {subs.length} submission{subs.length === 1 ? "" : "s"} • {fbs.length} feedback
                    </p>
                  </div>
                  <div className="hidden sm:flex -space-x-2">
                    {m.assignees.map((a) => (
                      <span
                        key={a}
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-[10px] font-semibold text-primary-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  {kind === "approved" && <Badge variant="approved">Approved</Badge>}
                  {kind === "revision" && <Badge variant="revision">Needs revision</Badge>}
                  {kind === "waiting" && <Badge variant="pending">Waiting for review</Badge>}
                  {kind === "notsubmitted" && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                      Not submitted
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                  <div className="border-t border-border p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" /> Submissions
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {subs.length === 0 && (
                          <li className="text-sm text-muted-foreground">The team has not submitted anything yet.</li>
                        )}
                        {subs.map((s) => (
                          <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{s.fileName || s.milestone}</p>
                              <p className="text-xs text-muted-foreground">
                                {s.submittedBy} • {s.date}
                              </p>
                            </div>
                            <Badge variant={s.status}>{label(s.status)}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <MessageSquare className="w-3.5 h-3.5" /> Feedback
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {fbs.length === 0 && <li className="text-sm text-muted-foreground">No feedback yet.</li>}
                        {fbs.map((f) => (
                          <li key={f.id} className="rounded-lg bg-muted px-3 py-2">
                            <p className="text-xs text-muted-foreground">
                              {f.author} • {f.date}
                            </p>
                            <p className="text-sm">{f.body}</p>
                            {f.resolved && <span className="text-[11px] font-medium text-success">✓ Resolved</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {kind === "waiting" && <ReviewBox milestone={m} onDone={say} />}

                    {kind === "revision" && (
                      <p className="md:col-span-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                        Waiting for the team to resubmit. You can review it again once they do.
                      </p>
                    )}
                    {kind === "notsubmitted" && (
                      <p className="md:col-span-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                        Nothing to review yet. The team has not submitted this milestone.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}