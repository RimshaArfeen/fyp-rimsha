
// app/api/invites/[token]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { handle, HttpError, parse, requireUser } from "../../../../lib/api";
import { hashToken } from "../../../../lib/invites";
import { inviteActionSchema } from "../../../../lib/validations";

async function find(token: string) {
  const invite = await prisma.invite.findFirst({
    where: { tokenHash: hashToken(token) },
    include: {
      invitedBy: { select: { name: true } },
      team: { include: { project: { select: { id: true, title: true, description: true } } } },
    },
  });
  if (!invite) throw new HttpError(404, "Invitation not found");
  return invite;
}

const stateOf = (i: { status: string; expiresAt: Date | null }) =>
  i.status !== "pending" ? i.status : i.expiresAt && i.expiresAt < new Date() ? "expired" : "pending";

// Public: the token is the credential. Only the recipient has it.
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  return handle(async () => {
    const { token } = await params;
    const i = await find(token);
    const accountExists = !!(await prisma.user.findUnique({ where: { email: i.email ?? "" }, select: { id: true } }));
    return NextResponse.json({
      state: stateOf(i),
      role: i.role,
      name: i.name,
      email: i.email,
      accountExists,
      invitedBy: i.invitedBy?.name ?? "A team lead",
      team: i.team.name,
      project: i.team.project
        ? { title: i.team.project.title, description: i.team.project.description.slice(0, 300) }
        : null,
    });
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  return handle(async () => {
    const { token } = await params;
    const session = await requireUser();
    const { action } = parse(inviteActionSchema, await req.json().catch(() => null));
    const invite = await find(token);

    if (stateOf(invite) !== "pending") throw new HttpError(409, "This invitation is no longer valid");

    const me = await prisma.user.findUnique({ where: { id: session.id } });
    if (!me) throw new HttpError(401, "Not signed in");
    if (me.email.toLowerCase() !== (invite.email ?? "").toLowerCase())
      throw new HttpError(403, "This invitation was sent to a different email address");

    if (action === "decline") {
      await prisma.invite.update({ where: { id: invite.id }, data: { status: "declined", inviteeId: me.id } });
      return NextResponse.json({ ok: true });
    }

    if (invite.role === "MEMBER") {
      if (me.role !== "student") throw new HttpError(403, "Only students can join as members");
      if (await prisma.teamMember.findUnique({ where: { userId: me.id } }))
        throw new HttpError(409, "You are already in a team");
      const count = await prisma.teamMember.count({ where: { teamId: invite.teamId } });
      if (count >= invite.team.maxSize) throw new HttpError(409, "This team is full");

      await prisma.$transaction([
        prisma.teamMember.create({ data: { userId: me.id, teamId: invite.teamId, role: "MEMBER" } }),
        prisma.invite.update({ where: { id: invite.id }, data: { status: "accepted", inviteeId: me.id } }),
      ]);
    } else {
      if (me.role !== "teacher") throw new HttpError(403, "Only supervisor accounts can accept this");
      const project = invite.team.project;
      if (!project) throw new HttpError(409, "This team has no project yet");
      if (invite.team.supervisorStatus === "ACCEPTED") throw new HttpError(409, "This project already has a supervisor");
      const load = await prisma.project.count({ where: { supervisorId: me.id } });
      if (load >= me.maxProjects) throw new HttpError(409, "You have reached your supervision limit");

      await prisma.$transaction([
        prisma.project.update({ where: { id: project.id }, data: { supervisorId: me.id } }),
        prisma.team.update({ where: { id: invite.teamId }, data: { supervisorStatus: "ACCEPTED" } }),
        prisma.invite.update({ where: { id: invite.id }, data: { status: "accepted", inviteeId: me.id } }),
      ]);
    }
    return NextResponse.json({ ok: true, role: invite.role });
  });
}