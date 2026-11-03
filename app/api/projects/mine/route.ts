

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { handle, HttpError, parse, requireUser, requireLeadProject } from "../../../../lib/api";
import { projectUpdateSchema } from "../../../../lib/validations";
import { toDay } from "../../../../lib/format";

export async function PATCH(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const { project } = await requireLeadProject(user);
    const input = parse(projectUpdateSchema, await req.json().catch(() => null));

    const start =
      input.timelineStart !== undefined ? (input.timelineStart ? toDay(input.timelineStart) : null) : project.timelineStart;
    const end =
      input.timelineEnd !== undefined ? (input.timelineEnd ? toDay(input.timelineEnd) : null) : project.timelineEnd;
    if (start && end && end < start) throw new HttpError(400, "End date must be after the start date");

    await prisma.project.update({
      where: { id: project.id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        timelineStart: start,
        timelineEnd: end,
      },
    });
    return NextResponse.json({ ok: true });
  });
}