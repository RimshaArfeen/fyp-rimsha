
// app/api/supervisor/dashboard/route.ts
// this route returns the dashboard data for a supervisor, including their projects, milestones, submissions, and feedback.
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { handle, HttpError, requireUser } from "../../../../lib/api";
import { fmtDate } from "../../../../lib/format";

export const dynamic = "force-dynamic";

type Status = "pending" | "approved" | "revision";

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    if (user.role !== "teacher") throw new HttpError(403, "Supervisors only");

    const projects = await prisma.project.findMany({
      where: { supervisorId: user.id },
      orderBy: { createdAt: "asc" },
      include: {
        team: { select: { name: true } },
        milestones: {
          orderBy: { deadline: "asc" },
          include: {
            submissions: {
              orderBy: { createdAt: "desc" },
              include: { submittedBy: { select: { name: true } } },
            },
          },
        },
        feedback: {
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true } }, milestone: { select: { title: true } } },
        },
      },
    });

    const milestones = projects.flatMap((p) =>
      p.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status as Status,
        due: fmtDate(m.deadline),
        dueISO: m.deadline.toISOString(),
        projectId: p.id,
        projectTitle: p.title,
        teamName: p.team.name,
        waiting: m.status === "pending" && m.submissions[0]?.status === "pending",
      }))
    );

    const submissions = projects
      .flatMap((p) =>
        p.milestones.flatMap((m) =>
          m.submissions.map((s) => ({
            id: s.id,
            milestoneId: m.id,
            milestone: m.title,
            projectId: p.id,
            projectTitle: p.title,
            fileName: s.fileName,
            fileUrl: s.fileUrl,
            version: s.version,
            submittedBy: s.submittedBy.name,
            date: fmtDate(s.createdAt),
            status: s.status as Status,
            note: s.notes,
            _t: s.createdAt.getTime(),
          }))
        )
      )
      .sort((a, b) => b._t - a._t)
      .map(({ _t, ...rest }) => rest);

    const feedback = projects
      .flatMap((p) =>
        p.feedback.map((f) => ({
          id: f.id,
          author: f.author.name,
          date: fmtDate(f.createdAt),
          body: f.content,
          resolved: f.resolved,
          milestone: f.milestone?.title ?? null,
          projectId: p.id,
          mine: f.authorId === user.id,
          _t: f.createdAt.getTime(),
        }))
      )
      .sort((a, b) => b._t - a._t)
      .map(({ _t, ...rest }) => rest);

    return NextResponse.json({
      supervisor: { id: user.id, name: user.name },
      projects: projects.map((p) => ({ id: p.id, title: p.title, teamName: p.team.name })),
      milestones,
      submissions,
      feedback,
    });
  });
}