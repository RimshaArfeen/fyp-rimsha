"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { project as seed } from "../app/(student)/project/dummy-data";
import { student, tasks as seedTasks, TaskStatus } from "./dummyData";
import { useStage } from "./stage";

export type Status = "pending" | "approved" | "revision";
type Id = string | number;

export type Sub = { id: string; milestone: string; submittedBy: string; date: string; status: Status; fileName: string; note: string };
export type Reply = { text: string; date: string };
export type Fb = { id: string; author: string; date: string; snippet: string; body: string; resolved: boolean; milestone?: string; replies: Reply[] };
export type Task = (typeof seedTasks)[number] & { to?: string };

type Data = { statuses: Record<string, Status>; submissions: Sub[]; feedback: Fb[]; tasks: Task[] };
type SeedMilestone = (typeof seed)["milestones"][number];
export type LiveMilestone = Omit<SeedMilestone, "status"> & { status: Status };

const KEY = "pulse-project";
const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const today = () => fmt(new Date());
const dueIn = (days: number) => fmt(new Date(Date.now() + days * 86_400_000));

const makeInitial = (): Data => ({
  statuses: {},
  submissions: seed.submissions.map((s) => ({
    id: String(s.id), milestone: s.milestone, submittedBy: s.submittedBy, date: s.date,
    status: s.status as Status, fileName: "", note: "",
  })),
  feedback: seed.feedback.map((f) => ({
    id: String(f.id), author: f.author, date: f.date, snippet: f.snippet, body: f.body,
    resolved: Boolean(f.resolved), replies: [],
  })),
  tasks: seedTasks.map((t) => ({ ...t })),
});

const matches = (f: Fb, title: string) => {
  if (f.milestone) return f.milestone === title;
  const w = title.split(" ")[0].toLowerCase();
  return f.snippet.toLowerCase().includes(w) || f.body.toLowerCase().includes(w);
};

type Store = {
  milestones: LiveMilestone[];
  submissions: Sub[];
  feedback: Fb[];
  tasks: Task[];
  submissionsFor: (title: string) => Sub[];
  feedbackFor: (title: string) => Fb[];
  milestoneOf: (f: Fb) => string | undefined;
  submit: (id: Id, title: string, info: { fileName: string; note: string }) => void;
  review: (id: Id, title: string, decision: "approved" | "revision", comment: string) => void;
  resolveFeedback: (id: string) => void;
  replyFeedback: (id: string, text: string) => void;
  addTask: (title: string, to?: string) => void;
  toggleTask: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const { stage, ready } = useStage();
  const [data, setData] = useState<Data>(makeInitial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (stage === 1) {
      setData(makeInitial());
      try { localStorage.removeItem(KEY); } catch {}
      setHydrated(true);
      return;
    }
    if (!hydrated) {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setData({ ...makeInitial(), ...JSON.parse(raw) });
      } catch {}
      setHydrated(true);
    }
  }, [ready, stage, hydrated]);

  useEffect(() => {
    if (!hydrated || stage === 1) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, hydrated, stage]);

  const milestones: LiveMilestone[] = seed.milestones.map((m) => ({
    ...m,
    status: data.statuses[String(m.id)] ?? (m.status as Status),
  }));

  const submit: Store["submit"] = (id, title, info) =>
    setData((d) => ({
      ...d,
      statuses: { ...d.statuses, [String(id)]: "pending" },
      submissions: [
        { id: `s-${Date.now()}`, milestone: title, submittedBy: student.name, date: today(), status: "pending", fileName: info.fileName, note: info.note },
        ...d.submissions,
      ],
    }));

  const review: Store["review"] = (id, title, decision, comment) =>
    setData((d) => {
      const text = comment.trim() || (decision === "approved" ? "Approved. Good work." : "Please revise and resubmit.");
      let marked = false;
      const submissions = d.submissions.map((s) => {
        if (!marked && s.milestone === title && s.status === "pending") {
          marked = true;
          return { ...s, status: decision };
        }
        return s;
      });
      return {
        ...d,
        statuses: { ...d.statuses, [String(id)]: decision },
        submissions,
        feedback: [
          { id: `f-${Date.now()}`, author: "Supervisor", date: today(), snippet: text, body: text, resolved: decision === "approved", milestone: title, replies: [] },
          ...d.feedback,
        ],
      };
    });

  const resolveFeedback = (id: string) =>
    setData((d) => ({ ...d, feedback: d.feedback.map((f) => (f.id === id ? { ...f, resolved: true } : f)) }));

  const replyFeedback = (id: string, text: string) =>
    setData((d) => ({
      ...d,
      feedback: d.feedback.map((f) => (f.id === id ? { ...f, replies: [...f.replies, { text, date: today() }] } : f)),
    }));

  const addTask: Store["addTask"] = (title, to) =>
    setData((d) => ({
      ...d,
      tasks: [{ id: Date.now(), title, to, due: dueIn(7), status: "pending" as TaskStatus } as Task, ...d.tasks],
    }));

  const toggleTask: Store["toggleTask"] = (id) =>
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) =>
        t.id === id ? { ...t, status: (t.status === "done" ? "pending" : "done") as TaskStatus } : t
      ),
    }));

  const value: Store = {
    milestones,
    submissions: data.submissions,
    feedback: data.feedback,
    tasks: data.tasks,
    submissionsFor: (title) => data.submissions.filter((s) => s.milestone === title),
    feedbackFor: (title) => data.feedback.filter((f) => matches(f, title)),
    milestoneOf: (f) => f.milestone ?? seed.milestones.find((m) => matches(f, m.title))?.title,
    submit,
    review,
    resolveFeedback,
    replyFeedback,
    addTask,
    toggleTask,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProjectStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProjectStore must be used inside ProjectStoreProvider");
  return ctx;
}