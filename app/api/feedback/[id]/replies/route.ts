import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { handle, parse, requireUser, requireFeedbackAccess } from "../../../../../lib/api";
import { replySchema } from "../../../../../lib/validations";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await requireUser();
    await requireFeedbackAccess(id, user);
    const { text } = parse(replySchema, await req.json().catch(() => null));
    const reply = await prisma.feedbackReply.create({
      data: { content: text, feedbackId: id, authorId: user.id },
    });
    return NextResponse.json({ id: reply.id }, { status: 201 });
  });
}