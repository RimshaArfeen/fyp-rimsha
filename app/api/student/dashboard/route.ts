
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { handle, requireUser } from "../../../../lib/api";
import { fmtDate, initials } from "../../../../lib/format";

export const dynamic = "force-dynamic";
const ONLINE_MS = 2 * 60 * 1000;

const EMPTY = { team: null, project: null, tasks: [], milestones: [], submissions: [], feedback: [] };

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    const student = { id: user.id, name: user.name };

    const membership = await prisma.teamMember.findUnique({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            members: {
              orderBy: { joinedAt: "asc" },
              include: { user: { select: { id: true, name: true, lastSeenAt: true } } },
            },
            project: { include: { supervisor: { select: { name: true } } } },
          },
        },
      },
    });
    if (!membership) return NextResponse.json({ student, isLead: false, ...EMPTY });

    const { team } = membership;
    // Is the CURRENT user the lead? (named differently from the per-member flag below)
    const viewerIsLead = membership.role === "LEAD" || team.leadId === user.id;

    const members = team.members.map((m) => {
      const memberIsLead = m.userId === team.leadId || m.role === "LEAD";
      return {
        id: m.user.id,
        name: m.user.name,
        initials: initials(m.user.name),
        isLead: memberIsLead,
        role: memberIsLead ? "Lead" : "Member",
        online: !!m.user.lastSeenAt && Date.now() - m.user.lastSeenAt.getTime() < ONLINE_MS,
      };
    });
    const teamDto = { id: team.id, name: team.name, members };
    const project = team.project;
    if (!project) return NextResponse.json({ student, isLead: viewerIsLead, ...EMPTY, team: teamDto });

    const [milestones, feedback, tasks] = await Promise.all([
      prisma.milestone.findMany({
        where: { projectId: project.id },
        orderBy: { deadline: "asc" },
        include: {
          submissions: { orderBy: { createdAt: "desc" }, include: { submittedBy: { select: { name: true } } } },
        },
      }),
      prisma.feedback.findMany({
        where: { projectId: project.id },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true } },
          milestone: { select: { title: true } },
          replies: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
        },
      }),
      prisma.task.findMany({ where: { teamId: team.id }, orderBy: { createdAt: "asc" } }),
    ]);

    const initialsById = new Map(members.map((m) => [m.id, m.initials]));

    const milestoneDtos = milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description ?? "",
      status: m.status as "pending" | "approved" | "revision",
      due: fmtDate(m.deadline),
      dueISO: m.deadline.toISOString(),
      dueDay: m.deadline.toISOString().slice(0, 10),
      assigneeIds: m.assigneeIds,
      assignees: m.assigneeIds.map((id) => initialsById.get(id)).filter(Boolean) as string[],
      waiting: m.status === "pending" && m.submissions[0]?.status === "pending",
    }));

    const submissions = milestones
      .flatMap((m) =>
        m.submissions.map((s) => ({
          id: s.id,
          milestoneId: m.id,
          milestone: m.title,
          fileName: s.fileName,
          note: s.notes,
          fileUrl: s.fileUrl,
          version: s.version,
          submittedBy: s.submittedBy.name,
          date: fmtDate(s.createdAt),
          status: s.status as "pending" | "approved" | "revision",
          _t: s.createdAt.getTime(),
        }))
      )
      .sort((a, b) => b._t - a._t)
      .map(({ _t, ...rest }) => rest);

    return NextResponse.json({
      student,
      isLead: viewerIsLead,
      team: teamDto,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        supervisor: project.supervisor?.name ?? "Not assigned",
        startDate: fmtDate(project.timelineStart) || "—",
        endDate: fmtDate(project.timelineEnd) || "—",
        startISO: project.timelineStart ? project.timelineStart.toISOString().slice(0, 10) : "",
        endISO: project.timelineEnd ? project.timelineEnd.toISOString().slice(0, 10) : "",
        members,
      },
      tasks: tasks.map((t) => ({
        id: t.id, title: t.title, status: t.status, due: fmtDate(t.due), to: t.assignedToId,
      })),
      milestones: milestoneDtos,
      submissions,
      feedback: feedback.map((f) => ({
        id: f.id,
        author: f.author.name,
        date: fmtDate(f.createdAt),
        snippet: f.content.length > 120 ? f.content.slice(0, 117) + "…" : f.content,
        body: f.content,
        resolved: f.resolved,
        read: f.readByIds.includes(user.id),
        milestoneId: f.milestoneId,
        milestone: f.milestone?.title ?? null,
        replies: f.replies.map((r) => ({
          id: r.id, author: r.author.name, text: r.content, date: fmtDate(r.createdAt), mine: r.authorId === user.id,
        })),
      })),
    });
  });
}