
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export class TeamError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function addMember(tx: Prisma.TransactionClient, teamId: string, userId: string) {
  const team = await tx.team.findUnique({
    where: { id: teamId },
    select: { maxSize: true, _count: { select: { members: true } } },
  });
  if (!team) throw new TeamError(404, "Team not found");
  if (team._count.members >= team.maxSize) throw new TeamError(409, "Your team is full");
  if (await tx.teamMember.findUnique({ where: { userId } }))
    throw new TeamError(409, "This student is already in a team");

  await tx.teamMember.create({ data: { teamId, userId, role: "MEMBER" } });

  // a student can only be in one team: clean up everything else they had pending
  await tx.joinRequest.updateMany({ where: { requesterId: userId, status: "pending" }, data: { status: "declined" } });
  await tx.invite.updateMany({ where: { inviteeId: userId, status: "pending" }, data: { status: "cancelled" } });

  if (team._count.members + 1 >= team.maxSize)
    await tx.team.update({ where: { id: teamId }, data: { isOpen: false } });
}

export function errorResponse(e: unknown) {
  if (e instanceof TeamError) return NextResponse.json({ error: e.message }, { status: e.status });
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
    return NextResponse.json({ error: "Already exists or already in a team" }, { status: 409 });
  console.error(e);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}