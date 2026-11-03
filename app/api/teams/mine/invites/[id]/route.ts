
//app/api/teams/mine/invites/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../lib/prisma";
import { requireUser } from "../../../../../../lib/api-auth";
import { addMember, errorResponse } from "../../../../../../lib/team-service";

const Body = z.object({ action: z.enum(["accept", "decline"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, error } = await requireUser("student");
  if (error) return error;
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const inv = await prisma.invite.findUnique({ where: { id } });
  if (!inv || inv.inviteeId !== user.id || inv.status !== "pending")
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  try {
    if (p.data.action === "decline") {
      await prisma.invite.update({ where: { id }, data: { status: "declined" } });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.invite.update({ where: { id }, data: { status: "accepted" } });
        await addMember(tx, inv.teamId, user.id);
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}