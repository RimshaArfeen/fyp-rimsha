
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { requireLead } from "../../../../../lib/team-auth";
import { errorResponse } from "../../../../../lib/team-service";

const Body = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(2000).default(""),
  supervisorId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
});

export async function POST(req: Request) {
  const { teamId, error } = await requireLead();
  if (error) return error;
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Write the project title first" }, { status: 400 });
  const { title, description, supervisorId } = p.data;

  try {
    if (supervisorId) {
      const t = await prisma.user.findFirst({ where: { id: supervisorId, role: "teacher" }, select: { id: true } });
      if (!t) return NextResponse.json({ error: "Supervisor not found" }, { status: 400 });
    }
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: { title, description, teamId, supervisorId: supervisorId ?? null, status: supervisorId ? "PENDING" : "DRAFT" },
      });
      // tasks assigned before the project existed now belong to it
      await tx.task.updateMany({ where: { teamId, projectId: null }, data: { projectId: created.id } });
      await tx.team.update({ where: { id: teamId }, data: { supervisorStatus: supervisorId ? "PENDING" : "NONE" } });
      return created;
    });
    return NextResponse.json({ id: project.id }, { status: 201 }); // teamId @unique → P2002 if one exists
  } catch (e) {
    return errorResponse(e);
  }
}