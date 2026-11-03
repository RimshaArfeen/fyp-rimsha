
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { handle, requireUser } from "../../../lib/api";

export async function POST() {
  return handle(async () => {
    const user = await requireUser();
    await prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    return NextResponse.json({ ok: true });
  });
}