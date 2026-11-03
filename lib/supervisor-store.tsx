
//app/lib/supervisor-store.tsx
// This file contains a React context and provider for managing the state of a supervisor's dashboard, including their projects, milestones, submissions, and feedback. It provides functions to refresh the data and to review milestones.


"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "./api-client";

export type Status = "pending" | "approved" | "revision";
export type LiveMilestone = {
     id: string; title: string; status: Status; due: string; dueISO: string;
     projectId: string; projectTitle: string; teamName: string; waiting: boolean;
};
export type Sub = {
     id: string; milestoneId: string; milestone: string; projectId: string; projectTitle: string;
     fileName: string; fileUrl: string; version: number; submittedBy: string; date: string;
     status: Status; note: string | null;
};
export type SupFeedback = {
     id: string; author: string; date: string; body: string; resolved: boolean;
     milestone: string | null; projectId: string; mine: boolean;
};
export type SupProject = { id: string; title: string; teamName: string };

type Data = {
     supervisor: { id: string; name: string };
     projects: SupProject[];
     milestones: LiveMilestone[];
     submissions: Sub[];
     feedback: SupFeedback[];
};
type Ctx = Data & {
     loading: boolean;
     refresh: () => Promise<void>;
     review: (milestoneId: string, decision: "approved" | "revision", comment: string) => Promise<void>;
};

const empty: Data = { supervisor: { id: "", name: "Supervisor" }, projects: [], milestones: [], submissions: [], feedback: [] };
const Store = createContext<Ctx | null>(null);

export function SupervisorStoreProvider({ children }: { children: ReactNode }) {
     const [data, setData] = useState<Data>(empty);
     const [loading, setLoading] = useState(true);

     const refresh = useCallback(async () => {
          try {
               const res = await fetch("/api/supervisor/dashboard", { cache: "no-store" });
               if (res.ok) setData({ ...empty, ...(await res.json()) });
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          refresh();
          const t = setInterval(() => { if (!document.hidden) refresh(); }, 30_000);
          return () => clearInterval(t);
     }, [refresh]);

     const review: Ctx["review"] = async (milestoneId, decision, comment) => {
          await api(`/api/milestones/${milestoneId}/review`, "POST", { decision, comment });
          await refresh();
     };

     return <Store.Provider value={{ ...data, loading, refresh, review }}>{children}</Store.Provider>;
}

export function useSupervisorStore() {
     const ctx = useContext(Store);
     if (!ctx) throw new Error("useSupervisorStore must be used inside SupervisorStoreProvider");
     return ctx;
}