"use client";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStage } from "../lib/stage";

export default function StageGuard({ min, children }: { min: 1 | 2 | 3; children: ReactNode }) {
  const router = useRouter();
  const { stage, ready } = useStage();

  useEffect(() => {
    if (ready && stage < min) router.replace(stage === 1 ? "/teams" : "/my-team");
  }, [ready, stage, min, router]);

  if (!ready || stage < min) return null;
  return <>{children}</>;
}