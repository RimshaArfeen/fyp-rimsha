// app/api/teams/mine/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireUser } from "../../../../lib/api-auth";

const none = {
  team: null,
  isLead: false,
  me: null,
  members: [],
  joinRequests: [],
  invites: [],
  tasks: [],
  stats: { joinRequests: 0, invites: 0 },
  project: null,
};

export async function GET() {
  try {
    const { user, error } = await requireUser("student");
    if (error) return error;

    const m = await prisma.teamMember.findUnique({
      where: { userId: user.id },
      select: { teamId: true, role: true },
    });
    if (!m) return NextResponse.json(none);

    const isLead = m.role === "LEAD";

    const [team, requests, invites] = await Promise.all([
      prisma.team.findUnique({
        where: { id: m.teamId },
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, skills: true } } },
            orderBy: { joinedAt: "asc" },
          },
          project: { include: { supervisor: { select: { name: true } } } },
          // tasks belong in the QUERY include, not in the response object
          tasks: {
            include: { assignedTo: { select: { id: true, name: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.joinRequest.findMany({
        where: { teamId: m.teamId, status: "pending" },
        include: { requester: { select: { id: true, name: true, skills: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.invite.findMany({
        where: { teamId: m.teamId, status: "pending" },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    if (!team) return NextResponse.json(none);

    // project progress = share of completed tasks
    const doneCount = team.tasks.filter((t) => t.status === "done").length;
    const progress = team.tasks.length
      ? Math.round((doneCount / team.tasks.length) * 100)
      : 0;

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        description: team.description ?? "",
        maxSize: team.maxSize,
        skills: team.skills,
        isOpen: team.isOpen,
      },
      isLead,
      me: { id: user.id },
      members: team.members.map((tm) => ({
        id: tm.user.id,
        name: tm.user.name,
        email: tm.user.email,
        skills: tm.user.skills,
        isLead: tm.role === "LEAD",
      })),
      // lists are lead-only; counts are visible to the whole team
      joinRequests: isLead
        ? requests.map((r) => ({
            id: r.id,
            userId: r.requester.id,
            name: r.requester.name,
            skills: r.requester.skills,
            message: r.message,
            createdAt: r.createdAt.toISOString(),
          }))
        : [],
      invites: isLead
        ? invites.map((i) => ({
            id: i.id,
            who: i.who,
            createdAt: i.createdAt.toISOString(),
          }))
        : [],
      tasks: team.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        due: t.due ? t.due.toISOString() : null,
        assignedToId: t.assignedToId,
        assignedToName: t.assignedTo?.name ?? null,
      })),
      stats: { joinRequests: requests.length, invites: invites.length },
      project: team.project
        ? {
            id: team.project.id,
            title: team.project.title,
            description: team.project.description,
            supervisor: team.project.supervisor?.name ?? null,
            status: team.project.status,
            progress,
          }
        : null,
    });
  } catch (e) {
    console.error("GET /api/teams/mine failed:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}