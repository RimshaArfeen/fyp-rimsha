
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireUser } from "../../../../../../lib/api-auth";
import { isObjectId } from "../../../../../../lib/ids";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error } = await requireUser("student");
    if (error) return error;

    if (!isObjectId(id)) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

    const invite = await prisma.invite.findUnique({
      where: { id },
      include: { team: { select: { leadId: true } } },
    });
    if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    if (invite.team.leadId !== user.id) {
      return NextResponse.json({ error: "Only the team lead can cancel invites" }, { status: 403 });
    }
    if (invite.status !== "pending") {
      return NextResponse.json({ error: "This invite was already handled" }, { status: 409 });
    }

    await prisma.invite.update({ where: { id }, data: { status: "cancelled" } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE invite failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}