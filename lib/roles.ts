
// lib/roles.ts
export type Role = "student" | "teacher";

export const homeFor = (role?: string) =>
  role === "teacher" ? "/supervisor" : "/dashboard";