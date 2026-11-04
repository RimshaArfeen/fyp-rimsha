
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireUser } from "../ ../../../../lib/api";
import { getMembership } from "../../../../../lib/membership";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { user, error } = await requireUser("student");
  if (error) return error;

  const feedback = await prisma.feedback.findUnique({
    where: { id },
    include: { project: true },
  });
  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  const membership = await getMembership(user.id);
  if (!membership || membership.teamId !== feedback.project.teamId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!feedback.readByIds.includes(user.id)) {
    await prisma.feedback.update({
      where: { id: feedback.id },
      data: { readByIds: { push: user.id } },
    });
  }

  return NextResponse.json({ ok: true });
}