
// types/next-auth.d.ts
import "next-auth";
declare module "next-auth" {
  interface User { role?: "student" | "teacher" }
  interface Session {
    user: { id: string; role: "student" | "teacher"; name?: string | null; email?: string | null };
  }
}
declare module "next-auth/jwt" {
  interface JWT { id?: string; role?: "student" | "teacher" }
}