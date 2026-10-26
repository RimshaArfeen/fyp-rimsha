"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Stage = 1 | 2 | 3;

type Ctx = { stage: Stage; setStage: (s: Stage) => void; ready: boolean };
const StageContext = createContext<Ctx | null>(null);

export function StageProvider({ children }: { children: ReactNode }) {
  const [stage, setStageState] = useState<Stage>(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem("pulse-stage"));
    if (saved === 1 || saved === 2 || saved === 3) setStageState(saved);
    setReady(true);
  }, []);

  const setStage = (s: Stage) => {
    setStageState(s);
    localStorage.setItem("pulse-stage", String(s));
  };

  return (
    <StageContext.Provider value={{ stage, setStage, ready }}>
      {children}
    </StageContext.Provider>
  );
}

export function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside StageProvider");
  return ctx;
}