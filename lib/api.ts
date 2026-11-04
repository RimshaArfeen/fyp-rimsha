
// lib/api.ts
import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { prisma } from "./prisma";
import { auth } from "./auth";
import { dayKey } from "./format";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function handle(fn: () => Promise<Response>) {
  return fn().catch((e) => {
    if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  });
}

export type Role = "student" | "teacher";
export type SessionUser = { id: string; name: string; email: string; role: Role };

/** Throws 401 if not signed in (or the token has no valid role), 403 if the role doesn't match. */
export async function requireUser(role?: Role): Promise<SessionUser> {
  const session = await auth();
  const u = session?.user;
  if (!u?.id || (u.role !== "student" && u.role !== "teacher")) {
    throw new HttpError(401, "Unauthorized");
  }
  if (role && u.role !== role) throw new HttpError(403, "Forbidden");
  return { id: u.id, name: u.name ?? "", email: u.email ?? "", role: u.role };
}

export function assertObjectId(id: string, what = "Item") {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new HttpError(404, `${what} not found`);
}

export function parse<T>(schema: ZodType<T>, data: unknown): T {
  const r = schema.safeParse(data);
  if (!r.success) throw new HttpError(400, r.error.issues[0]?.message ?? "Invalid input");
  return r.data;
}

export async function requireMembership(userId: string) {
  const m = await prisma.teamMember.findUnique({ where: { userId } });
  if (!m) throw new HttpError(403, "You are not in a team");
  return m;
}

async function projectRole(projectId: string, teamId: string, supervisorId: string | null, user: SessionUser) {
  const member = await prisma.teamMember.findUnique({ where: { userId: user.id } });
  const isMember = member?.teamId === teamId;
  const isSupervisor = supervisorId === user.id;
  if (!isMember && !isSupervisor) throw new HttpError(403, "No access to this project");
  return { isMember, isSupervisor };
}

/** Caller must be on the milestone's team or be its project supervisor. */
export async function requireMilestoneAccess(milestoneId: string, user: SessionUser) {
  assertObjectId(milestoneId, "Milestone");
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { project: { select: { id: true, teamId: true, supervisorId: true } } },
  });
  if (!milestone) throw new HttpError(404, "Milestone not found");
  const p = milestone.project;
  const role = await projectRole(p.id, p.teamId, p.supervisorId, user);
  return { milestone, ...role };
}

export async function requireFeedbackAccess(feedbackId: string, user: SessionUser) {
  assertObjectId(feedbackId, "Feedback");
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
    include: { project: { select: { id: true, teamId: true, supervisorId: true } } },
  });
  if (!feedback) throw new HttpError(404, "Feedback not found");
  const p = feedback.project;
  const role = await projectRole(p.id, p.teamId, p.supervisorId, user);
  return { feedback, ...role };
}

/** Caller must be the lead of a team that already has a project. */
export async function requireLeadProject(user: SessionUser) {
  const m = await prisma.teamMember.findUnique({
    where: { userId: user.id },
    include: { team: { include: { project: true } } },
  });
  if (!m) throw new HttpError(403, "You are not in a team");
  if (m.role !== "LEAD" && m.team.leadId !== user.id) throw new HttpError(403, "Only the team lead can do this");
  if (!m.team.project) throw new HttpError(409, "Create the project first");
  return { team: m.team, project: m.team.project };
}

export async function validAssignees(teamId: string, ids: string[]) {
  const uniq = [...new Set(ids)];
  if (!uniq.length) return [];
  const n = await prisma.teamMember.count({ where: { teamId, userId: { in: uniq } } });
  if (n !== uniq.length) throw new HttpError(400, "Assignees must be members of your team");
  return uniq;
}

export async function assertUniqueTitle(projectId: string, title: string, exceptId?: string) {
  const all = await prisma.milestone.findMany({ where: { projectId }, select: { id: true, title: true } });
  if (all.some((m) => m.id !== exceptId && m.title.trim().toLowerCase() === title.trim().toLowerCase()))
    throw new HttpError(409, "A milestone with this title already exists");
}

export function assertDeadline(
  project: { timelineStart: Date | null; timelineEnd: Date | null },
  deadline: string,
  checkPast: boolean
) {
  if (checkPast) {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
    if (deadline < today) throw new HttpError(400, "Deadline cannot be in the past");
  }
  const start = dayKey(project.timelineStart);
  const end = dayKey(project.timelineEnd);
  if (start && deadline < start) throw new HttpError(400, "Deadline is before the project start date");
  if (end && deadline > end) throw new HttpError(400, "Deadline is after the project end date");
}