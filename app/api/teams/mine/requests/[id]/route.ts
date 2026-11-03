
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../lib/prisma";
import { requireLead } from "../../../../../../lib/team-auth";
import { addMember, errorResponse } from "../../../../../../lib/team-service";

const Body = z.object({ action: z.enum(["accept", "decline"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { teamId, error } = await requireLead();
  if (error) return error;

  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const jr = await prisma.joinRequest.findUnique({ where: { id } });
  if (!jr || jr.teamId !== teamId || jr.status !== "pending")
    return NextResponse.json({ error: "Request not found" }, { status: 404 });

  try {
    if (p.data.action === "decline") {
      await prisma.joinRequest.update({ where: { id }, data: { status: "declined" } });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.joinRequest.update({ where: { id }, data: { status: "accepted" } });
        await addMember(tx, teamId, jr.requesterId); // capacity + one-team rule + cleanup
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}