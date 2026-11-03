
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { handle, requireUser, requireFeedbackAccess } from "../../../../../lib/api";

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await requireUser();
    await requireFeedbackAccess(id, user);
    await prisma.feedback.update({ where: { id }, data: { resolved: true } });
    return NextResponse.json({ ok: true });
  });
}