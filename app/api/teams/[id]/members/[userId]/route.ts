
//app/api/teams/%5Bid%5D/members/%5BuserId%5D/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireUser } from "../../../../../../lib/api-auth";
import { isObjectId } from "../../../../../../lib/ids";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const { id, userId } = await params;

  const { user, error } = await requireUser("student");
  if (error) return error;

  if (!isObjectId(id) || !isObjectId(userId)) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const team = await prisma.team.findUnique({ where: { id }, select: { leadId: true } });
  if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

  if (team.leadId !== user.id) {
    return NextResponse.json({ error: "Only the team lead can remove members" }, { status: 403 });
  }
  if (userId === user.id) {
    return NextResponse.json({ error: "The team lead cannot be removed" }, { status: 400 });
  }

  const target = await prisma.teamMember.findUnique({ where: { userId } });
  if (!target || target.teamId !== id) {
    return NextResponse.json({ error: "Member not found in this team" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.teamMember.delete({ where: { userId } }),
    // unassign their work so nothing points at someone outside the team
    prisma.task.updateMany({
      where: { assignedToId: userId, project: { teamId: id } },
      data: { assignedToId: null },
    }),
    prisma.milestone.updateMany({
      where: { assigneeId: userId, project: { teamId: id } },
      data: { assigneeId: null },
    }),
  ]);

  return NextResponse.json({ ok: true });
}