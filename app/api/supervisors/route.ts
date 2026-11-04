// app/api/supervisors/route.ts
// This route returns a list of all supervisors (teachers) in the system, including their id, name, and department.
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../lib/api";

export async function GET() {
  await requireUser("student");

  const teachers = await prisma.user.findMany({
    where: { role: "teacher" },
    select: { id: true, name: true, department: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ supervisors: teachers });
}