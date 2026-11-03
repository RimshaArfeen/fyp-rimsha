
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { requireUser } from "../../../../lib/api-auth";
import { getMembership } from "../../../../lib/membership";

const Body = z.object({
  status: z.enum(["pending", "done", "revision"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { user, error } = await requireUser("student");
  if (error) return error;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const membership = await getMembership(user.id);
  if (!membership || membership.teamId !== task.project.teamId) {
    return NextResponse.json({ error: "Not your team's task" }, { status: 403 });
  }

  const isLead = membership.role === "LEAD";
  if (!isLead && task.assignedToId !== user.id) {
    return NextResponse.json(
      { error: "Only the assignee or team lead can update this task" },
      { status: 403 }
    );
  }

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}