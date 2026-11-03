
// lib/membership.ts
import { prisma } from "./prisma";

export const getMembership = (userId: string) =>
  prisma.teamMember.findUnique({
    where: { userId },
    include: { team: { include: { project: true } } },
  });

export const deriveStage = (m: Awaited<ReturnType<typeof getMembership>>): 1 | 2 | 3 =>
  !m ? 1 : m.team.project ? 3 : 2;

export const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date";