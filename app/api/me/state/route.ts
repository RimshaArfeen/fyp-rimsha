
import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/api-auth";
import { getMembership, deriveStage } from "../../../../lib/membership";

export async function GET() {
  const { user, error } = await requireUser("student");
  if (error) return error;
  const m = await getMembership(user.id);
  return NextResponse.json({
    stage: deriveStage(m),
    teamId: m?.teamId ?? null,
    projectId: m?.team.project?.id ?? null,
    isTeamLead: m?.role === "LEAD",
  });
}