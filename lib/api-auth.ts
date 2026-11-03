
//lib/api-auth.ts
// lib/api-auth.ts
import { NextResponse } from "next/server";
import { auth } from "./auth";

export type SessionUser = { id: string; name: string; email: string; role: "student" | "teacher" };

type Ok = { user: SessionUser; error: null };
type Fail = { user: null; error: NextResponse };

export async function requireUser(role?: "student" | "teacher"): Promise<Ok | Fail> {
  const session = await auth();
  const u = session?.user;

  if (!u?.id) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (u.role !== "student" && u.role !== "teacher") {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (role && u.role !== role) {
    return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return {
    user: { id: u.id, name: u.name ?? "", email: u.email ?? "", role: u.role },
    error: null,
  };
}