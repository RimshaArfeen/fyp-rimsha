
//app/api/teams/%5Bid%5D/join-requests/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { requireUser } from "../../../../../lib/api-auth";
import { isObjectId } from "../../../../../lib/ids";

const Body = z.object({
  message: z.string().trim().max(500).optional(),
});

// Student sends a join request
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error } = await requireUser("student");
    if (error) return error;

    if (!isObjectId(id)) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "Message is too long (max 500 characters)" }, { status: 400 });
    }
    const message = parsed.data.message || null;

    // 1) already in a team?
    const alreadyInTeam = await prisma.teamMember.findUnique({ where: { userId: user.id } });
    if (alreadyInTeam) {
      return NextResponse.json({ error: "You are already in a team" }, { status: 409 });
    }

    // 2) team exists, is open and has space?
    const team = await prisma.team.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    if (!team.isOpen) return NextResponse.json({ error: "This team is not accepting requests" }, { status: 409 });
    if (team._count.members >= team.maxSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 409 });
    }

    // 3) only one open request at a time
    const openRequest = await prisma.joinRequest.findFirst({
      where: { requesterId: user.id, status: "pending" },
    });
    if (openRequest) {
      return NextResponse.json({ error: "You already have an open request" }, { status: 409 });
    }

    // upsert: (requesterId, teamId) is unique, and a declined request can be re-sent
    const request = await prisma.joinRequest.upsert({
      where: { requesterId_teamId: { requesterId: user.id, teamId: team.id } },
      create: { requesterId: user.id, teamId: team.id, message },
      update: { status: "pending", message },
    });

    return NextResponse.json({ id: request.id, status: request.status }, { status: 201 });
  } catch (e) {
    console.error("POST join-requests failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Student cancels their own pending request to this team
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error } = await requireUser("student");
    if (error) return error;

    if (!isObjectId(id)) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const result = await prisma.joinRequest.deleteMany({
      where: { requesterId: user.id, teamId: id, status: "pending" },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "No pending request to cancel" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE join-requests failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}