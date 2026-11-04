import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { profileUpdateSchema } from "../../../lib/validations";
import { profileSelect, toProfile } from "../../../lib/profile";
import {requireUser} from "../../../lib/api";

export async function GET() {
  const user = await requireUser();

  const row = await prisma.user.findUnique({
    where: { id: user.id },
    select: profileSelect,
  });
  if (!row) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(toProfile(row));
}

export async function PATCH(req: Request) {
  const user = await requireUser();

  const parsed = profileUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(d.name !== undefined && { name: d.name }),
      ...(d.phone !== undefined && { contact: d.phone }),
      ...(d.department !== undefined && { department: d.department }),
      ...(d.semester !== undefined && { semester: d.semester }),
      ...(d.cgpa !== undefined && { cgpa: d.cgpa }),
      ...(d.university !== undefined && { university: d.university }),
      ...(d.program !== undefined && { program: d.program }),
      ...(d.batch !== undefined && { batch: d.batch }),
      ...(d.registrationNumber !== undefined && { registrationNumber: d.registrationNumber }),
      ...(d.seatNumber !== undefined && { seatNumber: d.seatNumber }),
      ...(d.city !== undefined && { city: d.city }),
      ...(d.country !== undefined && { country: d.country }),
      ...(d.github !== undefined && { githubLink: d.github }),
      ...(d.linkedin !== undefined && { linkedinProfile: d.linkedin }),
      ...(d.portfolio !== undefined && { portfolioLink: d.portfolio }),
      ...(d.skills !== undefined && { skills: d.skills }),
    },
    select: profileSelect,
  });

  return NextResponse.json(toProfile(updated));
}