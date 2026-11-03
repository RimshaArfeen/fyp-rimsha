
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
     handle, HttpError, parse, assertObjectId, requireUser, requireLeadProject,
     validAssignees, assertUniqueTitle, assertDeadline,
} from "../../../../lib/api";
import { milestoneUpdateSchema } from "../../../../lib/validations";
import { toDay, dayKey } from "../../../../lib/format";

type Ctx = { params: Promise<{ id: string }> };

async function load(id: string) {
     assertObjectId(id, "Milestone");
     const user = await requireUser();
     const { team, project } = await requireLeadProject(user);
     const milestone = await prisma.milestone.findUnique({ where: { id } });
     if (!milestone || milestone.projectId !== project.id) throw new HttpError(404, "Milestone not found");
     return { team, project, milestone };
}

export async function PATCH(req: Request, { params }: Ctx) {
     return handle(async () => {
          const { id } = await params;
          const { team, project, milestone } = await load(id);
          if (milestone.status === "approved") throw new HttpError(409, "Approved milestones cannot be edited");
          const input = parse(milestoneUpdateSchema, await req.json().catch(() => null));

          if (input.title !== undefined) await assertUniqueTitle(project.id, input.title, id);
          if (input.deadline !== undefined)
               assertDeadline(project, input.deadline, input.deadline !== dayKey(milestone.deadline));

          await prisma.milestone.update({
               where: { id },
               data: {
                    ...(input.title !== undefined && { title: input.title }),
                    ...(input.description !== undefined && { description: input.description || null }),
                    ...(input.deadline !== undefined && { deadline: toDay(input.deadline) }),
                    ...(input.assigneeIds !== undefined && { assigneeIds: await validAssignees(team.id, input.assigneeIds) }),
               },
          });
          return NextResponse.json({ ok: true });
     });
}

export async function DELETE(_: Request, { params }: Ctx) {
     return handle(async () => {
          const { id } = await params;
          await load(id);
          const [subs, fb] = await Promise.all([
               prisma.submission.count({ where: { milestoneId: id } }),
               prisma.feedback.count({ where: { milestoneId: id } }),
          ]);
          if (subs || fb) throw new HttpError(409, "This milestone already has submissions or feedback and cannot be deleted");
          await prisma.milestone.delete({ where: { id } });
          return NextResponse.json({ ok: true });
     });
}