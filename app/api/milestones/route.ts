
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  handle, HttpError, parse, requireUser, requireLeadProject,
  validAssignees, assertUniqueTitle, assertDeadline,
} from "../../../lib/api";
import { milestoneCreateSchema } from "../../../lib/validations";
import { toDay } from "../../../lib/format";

const MAX_MILESTONES = 30;

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const { team, project } = await requireLeadProject(user);
    const input = parse(milestoneCreateSchema, await req.json().catch(() => null));

    if ((await prisma.milestone.count({ where: { projectId: project.id } })) >= MAX_MILESTONES)
      throw new HttpError(409, `A project can have at most ${MAX_MILESTONES} milestones`);
    await assertUniqueTitle(project.id, input.title);
    assertDeadline(project, input.deadline, true);
    const assigneeIds = await validAssignees(team.id, input.assigneeIds ?? []);

    const m = await prisma.milestone.create({
      data: {
        title: input.title,
        description: input.description || null,
        deadline: toDay(input.deadline),
        status: "pending",
        projectId: project.id,
        assigneeIds,
      },
    });
    return NextResponse.json({ id: m.id }, { status: 201 });
  });
}