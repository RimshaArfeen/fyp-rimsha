
import { createHash, randomBytes } from "crypto";
import { z } from "zod";

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");

export function newToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export const inviteSchema = z
  .object({
    role: z.enum(["member", "supervisor"], { message: "Choose a role" }),
    name: z.string().trim().min(2, "Enter a name").max(80).optional(),
    email: z.string().trim().toLowerCase().email("Enter a valid email").optional(),
    inviteeId: z.string().regex(/^[a-f\d]{24}$/i).optional(), // registered supervisor picked from the list
  })
  .refine((v) => v.inviteeId || (v.name && v.email), { message: "Enter a name and email" });

export const inviteActionSchema = z.object({ action: z.enum(["accept", "decline"]) });