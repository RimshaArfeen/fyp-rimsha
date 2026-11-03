import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireUser } from "../../../../../../lib/api-auth";

export async function GET() {
  const { user, error } = await requireUser("student");
  if (error) return error;
  const invites = await prisma.invite.findMany({
    where: { inviteeId: user.id, status: "pending" },
    include: { team: { select: { id: true, name: true, lead: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    invites: invites.map((i) => ({ id: i.id, teamId: i.team.id, teamName: i.team.name, lead: i.team.lead.name })),
  });
}