
//app/api/teams/mine/members/%5BuserId%5D/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireLead } from "../../../../../../lib/team-auth";
import { errorResponse } from "../../../../../../lib/team-service";

export async function DELETE(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { user, teamId, error } = await requireLead();
  if (error) return error;
  if (userId === user.id) return NextResponse.json({ error: "The lead can't be removed" }, { status: 400 });

  const target = await prisma.teamMember.findUnique({ where: { userId } });
  if (!target || target.teamId !== teamId)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  try {
    await prisma.$transaction([
      prisma.teamMember.delete({ where: { userId } }),
      prisma.task.updateMany({ where: { teamId, assignedToId: userId }, data: { assignedToId: null } }),
      prisma.milestone.updateMany({
        where: { assigneeId: userId, project: { is: { teamId } } },
        data: { assigneeId: null },
      }),
      prisma.team.update({ where: { id: teamId }, data: { isOpen: true } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}