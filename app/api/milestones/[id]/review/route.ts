import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { handle, HttpError, parse, requireUser, requireMilestoneAccess } from "../../../../../lib/api";
import { reviewSchema } from "../../../../../lib/validations";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await requireUser();
    const { milestone, isSupervisor } = await requireMilestoneAccess(id, user);
    if (user.role !== "teacher" || !isSupervisor) throw new HttpError(403, "Only the supervisor can review");

    const { decision, comment } = parse(reviewSchema, await req.json().catch(() => null));
    const latest = await prisma.submission.findFirst({ where: { milestoneId: id }, orderBy: { createdAt: "desc" } });
    if (!latest || latest.status !== "pending") throw new HttpError(409, "Nothing is waiting for review");

    await prisma.$transaction([
prisma.submission.update({ where: { id: latest.id }, data: { status: decision, reviewedAt: new Date() } }),      
prisma.milestone.update({ where: { id }, data: { status: decision } }),
      prisma.feedback.create({
        data: {
          content: comment,
          milestoneId: id,
          submissionId: latest.id,
          authorId: user.id,
          projectId: milestone.projectId,
          resolved: decision === "approved",
        },
      }),
    ]);
    return NextResponse.json({ ok: true });
  });
}