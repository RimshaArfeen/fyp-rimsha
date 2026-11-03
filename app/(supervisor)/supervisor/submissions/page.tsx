"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import Badge from "../../../../components/project-dashboard/ui/Badge";
import Loader from "../../../../components/Loader";
import { useSupervisorStore } from "../../../../lib/supervisor-store";

const filters = ["All", "Pending", "Approved", "Revision"] as const;
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const snippet = (s: string) => (s.length > 140 ? s.slice(0, 137) + "…" : s);

export default function SupervisorSubmissionsPage() {
  const { submissions, feedback, milestones, loading } = useSupervisorStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  if (loading) return <Loader fullScreen message="Loading..." />;

  const teamOf = (milestoneId: string) => milestones.find((m) => m.id === milestoneId)?.teamName ?? "";

  const list =
    filter === "All" ? submissions : submissions.filter((s) => s.status === filter.toLowerCase());

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <section className="fade-up card-surface p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h1 className="text-xl font-semibold">All submissions ({list.length})</h1>
          <div className="flex bg-muted rounded-lg p-1 text-xs">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md transition ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {list.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">No submissions here.</li>
          )}
          {list.map((s) => {
            // feedback arrives newest first, so the first match is the latest
            const fb = feedback.find((f) => f.projectId === s.projectId && f.milestone === s.milestone);
            const team = teamOf(s.milestoneId);
            return (
              <li key={s.id} className="pop lift rounded-xl border border-border p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{s.milestone}</h2>
                    <p className="text-xs text-muted-foreground">
                      {team ? `${team} • ` : ""}
                      {s.submittedBy} • {s.date} • v{s.version}
                    </p>
                  </div>
                  <Badge variant={s.status}>{label(s.status)}</Badge>
                </div>

                <p className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-secondary" />
                  {s.fileUrl ? (
                    <a href={s.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      {s.fileName || "Open file"}
                    </a>
                  ) : (
                    s.fileName || "No file name recorded"
                  )}
                </p>
                {s.note && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Note: </span>
                    {s.note}
                  </p>
                )}
                {fb && (
                  <p className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="text-muted-foreground">Latest feedback: </span>
                    {snippet(fb.body)}
                  </p>
                )}
                {s.status === "pending" && (
                  <Link href="/supervisor" className="text-xs font-medium text-secondary hover:underline">
                    Go to review queue →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}