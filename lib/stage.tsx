
// lib/stage.tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type State = { stage: 1 | 2 | 3; teamId: string | null; projectId: string | null; isTeamLead: boolean };
type Ctx = State & { ready: boolean; refresh: () => Promise<void> };

const StageContext = createContext<Ctx | null>(null);

export function StageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ stage: 1, teamId: null, projectId: null, isTeamLead: false });
  const [ready, setReady] = useState(false);


  const refresh = useCallback(async () => {
    const res = await fetch("/api/me/state", { cache: "no-store" });
    if (res.status === 401) return router.replace("/login");
    if (res.ok) setState(await res.json());
    setReady(true);
  }, [router]);

  useEffect(() => { refresh(); }, [refresh]);

  return <StageContext.Provider value={{ ...state, ready, refresh }}>{children}</StageContext.Provider>;
}

export function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside StageProvider");
  return ctx;
}