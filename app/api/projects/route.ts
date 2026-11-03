
// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../lib/api-auth";
import { isObjectId } from "../../../lib/ids";

const Body = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
  supervisorId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { user, error } = await requireUser("student");
    if (error) return error;

    const parsed = Body.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    const { title, description, supervisorId } = parsed.data;

    const m = await prisma.teamMember.findUnique({
      where: { userId: user.id },
      include: { team: { include: { project: { select: { id: true } } } } },
    });
    if (!m) return NextResponse.json({ error: "You are not in a team" }, { status: 403 });
    if (m.role !== "LEAD") {
      return NextResponse.json({ error: "Only the team lead can create the project" }, { status: 403 });
    }
    if (m.team.project) {
      return NextResponse.json({ error: "Your team already has a project" }, { status: 409 });
    }

    let supId: string | null = null;
    if (supervisorId) {
      if (!isObjectId(supervisorId)) {
        return NextResponse.json({ error: "Invalid supervisor" }, { status: 400 });
      }
      const sup = await prisma.user.findFirst({
        where: { id: supervisorId, role: "teacher" },
        select: { id: true },
      });
      if (!sup) return NextResponse.json({ error: "Supervisor not found" }, { status: 400 });
      supId = sup.id;
    }

    const project = await prisma.project.create({
      data: { title, description, teamId: m.teamId, supervisorId: supId },
    });

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (e) {
    console.error("POST /api/projects failed:", e);
    return NextResponse.json({ error: "Server error while creating the project" }, { status: 500 });
  }
}