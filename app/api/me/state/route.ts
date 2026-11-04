
// app/api/me/state/route.ts
import { NextResponse } from "next/server";
import { getMembership, deriveStage } from "../../../../lib/membership";
import { requireUser } from "../../../../lib/api";
export async function GET() {
  const user = await requireUser("student");
  const m = await getMembership(user.id);
  return NextResponse.json({
    stage: deriveStage(m),
    teamId: m?.teamId ?? null,
    projectId: m?.team.project?.id ?? null,
    isTeamLead: m?.role === "LEAD",
  });
}