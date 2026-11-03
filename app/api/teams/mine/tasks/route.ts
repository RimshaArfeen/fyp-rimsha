
//app/api/teams/mine/tasks/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { requireLead } from "../../../../../lib/team-auth";
import { errorResponse } from "../../../../../lib/team-service";

const Body = z.object({
  title: z.string().trim().min(2).max(140),
  assignedToId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  due: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  const { teamId, error } = await requireLead();
  if (error) return error;
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Write the task first" }, { status: 400 });
  const { title, assignedToId, due } = p.data;

  try {
    if (assignedToId && !(await prisma.teamMember.findFirst({ where: { teamId, userId: assignedToId } })))
      return NextResponse.json({ error: "Assignee is not on your team" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { teamId }, select: { id: true } });
    const task = await prisma.task.create({
      data: { title, teamId, projectId: project?.id ?? null, assignedToId: assignedToId ?? null, due: due ? new Date(due) : null },
    });
    return NextResponse.json({ id: task.id }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}