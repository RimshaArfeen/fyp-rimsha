
// app/api/feedback/[id]/route.ts  (resolve)
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { HttpError, handle, requireUser } from "../../../../lib/api";

export async function assertFeedbackAccess(feedbackId: string, userId: string) {
  const f = await prisma.feedback.findUnique({
    where: { id: feedbackId }, include: { project: { select: { teamId: true } } },
  });
  if (!f) throw new HttpError(404, "Not found");
  const m = await prisma.teamMember.findUnique({ where: { userId } });
  if (m?.teamId !== f.project.teamId) throw new HttpError(403, "Forbidden");
  return f;
}

export const PATCH = (_: Request, ctx: { params: Promise<{ id: string }> }) =>
  handle(async () => {
    const { id } = await ctx.params;
    const user = await requireUser();
    await assertFeedbackAccess(id, user.id);
    await prisma.feedback.update({ where: { id }, data: { resolved: true } });
    return NextResponse.json({ ok: true });
  });