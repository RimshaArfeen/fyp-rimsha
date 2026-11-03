import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { handle, HttpError, parse, requireMembership, requireUser } from "../../../lib/api";
import { initials } from "../../../lib/format";
import { messageSchema } from "../../../lib/validations";

export const dynamic = "force-dynamic";

type Row = { id: string; content: string; authorId: string; createdAt: Date; author: { name: string } };
const dto = (m: Row, userId: string) => ({
  id: m.id, from: m.author.name, initials: initials(m.author.name), text: m.content,
  createdAt: m.createdAt.toISOString(), mine: m.authorId === userId,
});

export async function GET(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const { teamId } = await requireMembership(user.id);
    const afterRaw = new URL(req.url).searchParams.get("after");
    const include = { author: { select: { name: true } } };

    let rows: Row[];
    if (afterRaw) {
      const after = new Date(afterRaw);
      if (isNaN(after.getTime())) throw new HttpError(400, "Bad date");
      rows = await prisma.message.findMany({
        where: { teamId, createdAt: { gt: after } }, orderBy: { createdAt: "asc" }, take: 100, include,
      });
    } else {
      rows = (await prisma.message.findMany({
        where: { teamId }, orderBy: { createdAt: "desc" }, take: 50, include,
      })).reverse();
    }
    return NextResponse.json({ messages: rows.map((m) => dto(m, user.id)) });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const { teamId } = await requireMembership(user.id);
    const { text } = parse(messageSchema, await req.json().catch(() => null));
    const m = await prisma.message.create({
      data: { content: text, teamId, authorId: user.id },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json({ message: dto(m, user.id) }, { status: 201 });
  });
}