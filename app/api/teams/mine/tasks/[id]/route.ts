//app/api/teams/mine/tasks/%5Bid%5D/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../lib/prisma";
import { requireMember } from "../../../../../../lib/team-auth";

const Body = z.object({ status: z.enum(["pending", "done"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, teamId, role, error } = await requireMember();
  if (error) return error;
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const task = await prisma.task.findFirst({ where: { id, teamId } });
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  if (role !== "LEAD" && task.assignedToId !== user.id)
    return NextResponse.json({ error: "You can only update your own tasks" }, { status: 403 });

  await prisma.task.update({ where: { id }, data: { status: p.data.status } });
  return NextResponse.json({ ok: true });
}