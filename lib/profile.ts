// lib/profile.ts
import type { Prisma } from "@prisma/client";

export const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  contact: true,
  department: true,
  semester: true,
  githubLink: true,
  linkedinProfile: true,
  portfolioLink: true,
  skills: true,
  cgpa: true,
  registrationNumber: true,
  program: true,
  university: true,
  batch: true,
  seatNumber: true,
  city: true,
  country: true,
} satisfies Prisma.UserSelect;

export type ProfileRow = Prisma.UserGetPayload<{ select: typeof profileSelect }>;

export const toProfile = (u: ProfileRow) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.contact,
  department: u.department,
  semester: u.semester,
  github: u.githubLink,
  linkedin: u.linkedinProfile,
  portfolio: u.portfolioLink,
  skills: u.skills,
  cgpa: u.cgpa,
  registrationNumber: u.registrationNumber,
  program: u.program,
  university: u.university,
  batch: u.batch,
  seatNumber: u.seatNumber,
  city: u.city,
  country: u.country,
});