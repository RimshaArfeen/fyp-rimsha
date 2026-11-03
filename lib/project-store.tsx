"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { useStage } from "./stage";
import { api } from "./api-client";

export type Status = "pending" | "approved" | "revision";
export type TaskStatus = "pending" | "done" | "revision";
export type Task = { id: string; title: string; status: TaskStatus; due: string; to: string | null };
export type Member = { id: string; name: string; initials: string; role: "Lead" | "Member"; isLead: boolean; online: boolean };
export type Milestone = {
  id: string; title: string; description: string; status: Status; due: string; dueISO: string; dueDay: string;
  assigneeIds: string[]; assignees: string[]; waiting: boolean;
};
export type ProjectInfo = {
  id: string; title: string; description: string; status: string; supervisor: string;
  startDate: string; endDate: string; startISO: string; endISO: string; members: Member[];
};
export type MilestoneInput = { title: string; description?: string; deadline: string; assigneeIds: string[] };
export type ProjectInput = { title: string; description: string; timelineStart: string | null; timelineEnd: string | null };

export type Submission = {
  id: string; milestoneId: string; milestone: string; fileName: string; fileUrl: string;
  version: number; submittedBy: string; date: string; status: Status; note: string | null;
};

export type Reply = { id: string; author: string; text: string; date: string; mine: boolean };
export type Feedback = {
  id: string; author: string; date: string; snippet: string; body: string; resolved: boolean; read: boolean;
  milestoneId: string | null; milestone: string | null; replies: Reply[];
};
export type TeamData = { id: string; name: string; members: Member[] };

type Data = {
  student: { id: string; name: string };
  isLead: boolean;
  team: TeamData | null;
  project: ProjectInfo | null;
  tasks: Task[];
  milestones: Milestone[];
  submissions: Submission[];
  feedback: Feedback[];
};

type Ctx = Data & {
  loading: boolean;
  refresh: () => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  markFeedbackRead: (id: string) => Promise<void>;
  submissionsFor: (milestoneTitle: string) => Submission[]; // newest first
  feedbackFor: (milestoneTitle: string) => Feedback[];
  milestoneOf: (f: Feedback) => string | undefined;
  submit: (milestoneId: string, input: { file: File; note?: string }) => Promise<void>;
  resolveFeedback: (id: string) => Promise<void>;
  replyFeedback: (id: string, text: string) => Promise<void>;
  // lead-only (the server enforces this too)
  updateProject: (input: ProjectInput) => Promise<void>;
  createMilestone: (input: MilestoneInput) => Promise<void>;
  updateMilestone: (id: string, input: Partial<MilestoneInput>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
};

const empty: Data = {
  student: { id: "", name: "Student" },
  isLead: false,
  team: null,
  project: null,
  tasks: [],
  milestones: [],
  submissions: [],
  feedback: [],
};
const Store = createContext<Ctx | null>(null);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const { stage, ready } = useStage();
  const [data, setData] = useState<Data>(empty);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/student/dashboard", { cache: "no-store" });
      // merge with defaults so a missing field is never undefined
      if (res.ok) setData({ ...empty, ...(await res.json()) });
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when the stage changes (joined team, created project)
  useEffect(() => { if (ready) refresh(); }, [ready, stage, refresh]);

  // Pick up supervisor reviews and teammates' changes; heartbeat for online dots
  useEffect(() => {
    if (!ready) return;
    const beat = () => { if (!document.hidden) fetch("/api/presence", { method: "POST" }).catch(() => { }); };
    const poll = () => { if (!document.hidden) refresh(); };
    beat();
    const a = setInterval(beat, 60_000);
    const b = setInterval(poll, 30_000);
    return () => { clearInterval(a); clearInterval(b); };
  }, [ready, refresh]);

  const toggleTask = async (id: string) => {
    const prev = data.tasks;
    const task = prev.find((t) => t.id === id);
    if (!task) return;
    const next: TaskStatus = task.status === "done" ? "pending" : "done";
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, status: next } : t)) }));
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }),
    });
    if (!res.ok) setData((d) => ({ ...d, tasks: prev }));
  };

  const markFeedbackRead = async (id: string) => {
    const f = data.feedback.find((x) => x.id === id);
    if (!f || f.read) return;
    setData((d) => ({ ...d, feedback: d.feedback.map((x) => (x.id === id ? { ...x, read: true } : x)) }));
    fetch(`/api/feedback/${id}/read`, { method: "PATCH" }).catch(() => { });
  };

  const submissionsFor = (title: string) => data.submissions.filter((s) => s.milestone === title);
  const feedbackFor = (title: string) => data.feedback.filter((f) => f.milestone === title);
  const milestoneOf = (f: Feedback) => f.milestone ?? undefined;

  const submit: Ctx["submit"] = async (milestoneId, { file, note }) => {
    const fd = new FormData();
    fd.append("file", file);
    if (note?.trim()) fd.append("note", note.trim());
    const res = await fetch(`/api/milestones/${milestoneId}/submissions`, { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error ?? "Upload failed");
    await refresh();
  };

  const resolveFeedback = async (id: string) => {
    setData((d) => ({ ...d, feedback: d.feedback.map((f) => (f.id === id ? { ...f, resolved: true } : f)) }));
    try { await api(`/api/feedback/${id}/resolve`, "PATCH"); } catch { await refresh(); }
  };

  const replyFeedback = async (id: string, text: string) => {
    await api(`/api/feedback/${id}/replies`, "POST", { text });
    await refresh();
  };

  const updateProject: Ctx["updateProject"] = async (input) => {
    await api("/api/projects/mine", "PATCH", input);
    await refresh();
  };

  const createMilestone: Ctx["createMilestone"] = async (input) => {
    await api("/api/milestones", "POST", input);
    await refresh();
  };

  const updateMilestone: Ctx["updateMilestone"] = async (id, input) => {
    await api(`/api/milestones/${id}`, "PATCH", input);
    await refresh();
  };

  const deleteMilestone: Ctx["deleteMilestone"] = async (id) => {
    await api(`/api/milestones/${id}`, "DELETE");
    await refresh();
  };

  return (
    <Store.Provider
      value={{
        ...data, loading, refresh, toggleTask, markFeedbackRead,
        submissionsFor, feedbackFor, milestoneOf, submit, resolveFeedback, replyFeedback,
        updateProject, createMilestone, updateMilestone, deleteMilestone,
      }}
    >
      {children}
    </Store.Provider>
  );
}

export function useProjectStore() {
  const ctx = useContext(Store);
  if (!ctx) throw new Error("useProjectStore must be used inside ProjectStoreProvider");
  return ctx;
}

