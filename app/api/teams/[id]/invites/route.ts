import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { requireUser } from "../ ../../../../lib/api";
import { isObjectId } from "../../../../../lib/ids";

const Body = z.object({
  who: z.string().trim().min(2, "Enter an email or a name").max(100),
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error } = await requireUser("student");
    if (error) return error;

    if (!isObjectId(id)) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const who = parsed.data.who;
    if (who.includes("@") && !EMAIL.test(who)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id },
      select: { leadId: true, maxSize: true, _count: { select: { members: true } } },
    });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });
    if (team.leadId !== user.id) {
      return NextResponse.json({ error: "Only the team lead can invite" }, { status: 403 });
    }
    if (team._count.members >= team.maxSize) {
      return NextResponse.json({ error: "Team is full" }, { status: 409 });
    }

    // already a member?
    if (who.includes("@")) {
      const member = await prisma.teamMember.findFirst({
        where: { teamId: id, user: { email: { equals: who, mode: "insensitive" } } },
        select: { id: true },
      });
      if (member) return NextResponse.json({ error: "That person is already in your team" }, { status: 409 });
    }

    // duplicate pending invite?
    const dup = await prisma.invite.findFirst({
      where: { teamId: id, status: "pending", who: { equals: who, mode: "insensitive" } },
      select: { id: true },
    });
    if (dup) return NextResponse.json({ error: "You already invited this person" }, { status: 409 });

    const invite = await prisma.invite.create({ data: { teamId: id, who } });
    return NextResponse.json({ id: invite.id, who: invite.who, status: invite.status }, { status: 201 });
  } catch (e) {
    console.error("POST invites failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}