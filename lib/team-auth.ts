
import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { requireUser } from "./api-auth";

const deny = (msg: string, status: number) =>
  ({ error: NextResponse.json({ error: msg }, { status }), user: null, teamId: null, role: null }) as const;

export async function requireMember() {
  const { user, error } = await requireUser("student");
  if (error) return { error, user: null, teamId: null, role: null } as const;

  const m = await prisma.teamMember.findUnique({
    where: { userId: user.id },
    select: { teamId: true, role: true },
  });
  if (!m) return deny("You are not in a team", 403);
  return { error: null, user, teamId: m.teamId, role: m.role } as const;
}

export async function requireLead() {
  const r = await requireMember();
  if (r.error) return r;
  if (r.role !== "LEAD") return deny("Only the team lead can do this", 403);
  return r;
}