import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";
import { handle, HttpError, parse, requireMembership, requireUser } from "../../../../../lib/api";
import { INVITE_TTL_MS, newToken } from "../../../../../lib/invites";
import { sendInviteEmail } from "../../../../../lib/mail";

export const runtime = "nodejs";
const DAILY_LIMIT = 20;
const inviteSchema = z.object({
  inviteeId: z.string().min(1).optional(),
  email: z.string().email().optional(),
  name: z.string().trim().min(1).max(100).optional(),
  role: z.enum(["member", "supervisor"]),
}).refine(
  (input) => Boolean(input.inviteeId || (input.email && input.name)),
  "Provide an existing invitee or an email and name",
);

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const { teamId } = await requireMembership(user.id);
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { project: true, _count: { select: { members: true } } },
    });
    if (!team || team.leadId !== user.id) throw new HttpError(403, "Only the team lead can send invitations");

    const input = parse(inviteSchema, await req.json().catch(() => null));
    const role = input.role === "supervisor" ? "SUPERVISOR" : "MEMBER";

    // Who is being invited? A registered user (by id or email) or a brand-new email.
    const pick = { id: true, name: true, email: true, role: true } as const;
    const existing = input.inviteeId
      ? await prisma.user.findUnique({ where: { id: input.inviteeId }, select: pick })
      : await prisma.user.findUnique({ where: { email: input.email! }, select: pick });
    if (input.inviteeId && !existing) throw new HttpError(404, "That user was not found");
    if (existing?.id === user.id) throw new HttpError(400, "You cannot invite yourself");

    const name = existing?.name ?? input.name!;
    const email = existing?.email ?? input.email!;

    if (existing) {
      if (role === "SUPERVISOR" && existing.role !== "teacher")
        throw new HttpError(400, "That account is not a supervisor account");
      if (role === "MEMBER" && existing.role !== "student")
        throw new HttpError(400, "Only student accounts can join as team members");
    }

    if (role === "MEMBER") {
      if (team._count.members >= team.maxSize) throw new HttpError(409, "Your team is full");
      if (existing && (await prisma.teamMember.findUnique({ where: { userId: existing.id } })))
        throw new HttpError(409, "That student is already in a team");
    } else {
      if (!team.project) throw new HttpError(400, "Create your project before inviting a supervisor");
      if (team.supervisorStatus === "ACCEPTED") throw new HttpError(409, "Your project already has a supervisor");
      const pendingSup = await prisma.invite.findFirst({ where: { teamId, role: "SUPERVISOR", status: "pending" } });
      if (pendingSup) throw new HttpError(409, "A supervisor invitation is already pending. Cancel it first");
    }

    const dup = await prisma.invite.findFirst({ where: { teamId, role, email, status: "pending" } });
    if (dup) throw new HttpError(409, "This person already has a pending invitation");

    const today = await prisma.invite.count({
      where: { teamId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (today >= DAILY_LIMIT) throw new HttpError(429, "Daily invitation limit reached. Try again tomorrow");

    const { token, hash } = newToken();
    const invite = await prisma.invite.create({
      data: {
        who: `${name} (${email})`,
        name, email, role,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + INVITE_TTL_MS),
        teamId,
        invitedById: user.id,
        inviteeId: existing?.id,
      },
    });

    try {
      await sendInviteEmail({
        to: email, name, role,
        teamName: team.name,
        projectTitle: team.project?.title ?? null,
        projectDescription: team.project?.description?.slice(0, 300) ?? null,
        invitedBy: user.name,
        link: `${process.env.APP_URL}/invite/${token}`,
      });
    } catch (e) {
      console.error("[invite mail]", e);
      await prisma.invite.delete({ where: { id: invite.id } }); // don't leave a ghost invite
      throw new HttpError(502, "Could not send the email. Check the address and try again");
    }
    return NextResponse.json({ id: invite.id }, { status: 201 });
  });
}