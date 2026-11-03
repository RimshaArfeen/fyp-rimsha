//app/api/teams/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../lib/api-auth";

export async function GET(req: Request) {
  const { user, error } = await requireUser("student");
  if (error) return error;

  const sp = new URL(req.url).searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const skill = sp.get("skill") ?? "";
  const openOnly = sp.get("openOnly") === "true";

  const [teams, pending, membership] = await Promise.all([
    prisma.team.findMany({
      where: {
        ...(skill && skill !== "all" ? { skills: { has: skill } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { project: { is: { title: { contains: q, mode: "insensitive" } } } },
                { skills: { has: q } },
              ],
            }
          : {}),
      },
      include: {
        project: { select: { title: true } },
        lead: { select: { name: true } },
        members: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.joinRequest.findMany({
      where: { requesterId: user.id, status: "pending" },
      select: { teamId: true },
    }),
    prisma.teamMember.findUnique({
      where: { userId: user.id },
      select: { teamId: true, role: true },
    }),
  ]);

  const out = teams
    .filter((t) => !openOnly || t.members.length < t.maxSize)
    .map((t) => ({
      id: t.id,
      name: t.name,
      project: t.project?.title ?? "No project yet",
      description: t.description ?? "",
      lead: t.lead.name,
      members: t.members.map((m) => m.user.name),
      maxMembers: t.maxSize,
      skills: t.skills,
    }));

    return NextResponse.json({
    teams: out,
    requestedTeamIds: pending.map((r) => r.teamId),
    me: {
      teamId: membership?.teamId ?? null,
      role: membership ? (membership.role === "LEAD" ? "lead" : "member") : null,
    },
  });
}

const Create = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
  maxSize: z.number().int().min(4).max(5).default(4),
});

export async function POST(req: Request) {
  const { user, error } = await requireUser("student");
  if (error) return error;
  const p = Create.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid team data" }, { status: 400 });

  if (await prisma.teamMember.findUnique({ where: { userId: user.id } }))
    return NextResponse.json({ error: "You are already in a team" }, { status: 409 });

  const team = await prisma.team.create({
    data: { ...p.data, leadId: user.id, members: { create: { userId: user.id, role: "LEAD" } } },
  });
  return NextResponse.json({ id: team.id }, { status: 201 });
}