
// lib/validations.ts
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number"),
  // Never accept "admin" from a public form
  role: z.enum(["student", "teacher"], { message: "Select a valid role" }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
// ---------- Profile ----------
const optionalText = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === "" ? null : v));

// ids like "FA22-BCS-045" or "B-1234567": letters, digits, dash, slash, space
const optionalId = (label: string) =>
  z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || /^[A-Za-z0-9\-/ ]{2,30}$/.test(v), {
      message: `Enter a valid ${label}`,
    })
    .transform((v) => (v === "" ? null : v));

// "https://www.github.com/me/" -> "github.com/me"
const profileLink = (host: string) =>
  z
    .string()
    .trim()
    .max(200)
    .transform((v) =>
      v.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "")
    )
    .refine(
      (v) =>
        v === "" ||
        new RegExp(`^${host.replace(".", "\\.")}/[\\w\\-./%]+$`, "i").test(v),
      { message: `Enter a valid ${host} link` }
    )
    .transform((v) => (v === "" ? null : v));

// any site: "https://www.me.dev/" -> "me.dev"
const portfolioLink = z
  .string()
  .trim()
  .max(200)
  .transform((v) =>
    v.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "")
  )
  .refine(
    (v) => v === "" || /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i.test(v),
    { message: "Enter a valid portfolio link" }
  )
  .transform((v) => (v === "" ? null : v));

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    phone: z
      .string()
      .trim()
      .refine((v) => v === "" || /^[0-9+\-\s()]{7,20}$/.test(v), {
        message: "Enter a valid phone number",
      })
      .transform((v) => (v === "" ? null : v)),
    department: optionalText(80),
    semester: z.number().int().min(1).max(12).nullable(),
    cgpa: z
      .number("CGPA must be a number")
      .min(0, "CGPA must be between 0 and 4")
      .max(4, "CGPA must be between 0 and 4")
      .nullable()
      .transform((v) => (v === null ? null : Math.round(v * 100) / 100)),

    // academic details
    university: optionalText(120),
    program: optionalText(100),
    batch: optionalText(30),
    registrationNumber: optionalId("registration number"),
    seatNumber: optionalId("seat number"),

    // location
    city: optionalText(60),
    country: optionalText(60),

    github: profileLink("github.com"),
    linkedin: profileLink("linkedin.com"),
    portfolio: portfolioLink,
    skills: z
      .array(z.string().trim().min(1).max(30))
      .max(20, "You can add up to 20 skills")
      .transform((a) => Array.from(new Set(a))),
  })
  .partial(); // every field optional: PATCH only updates what is sent

  export const reviewSchema = z.object({
  decision: z.enum(["approved", "revision"], { message: "Choose approved or revision" }),
  comment: z.string().trim().min(1, "Add a comment").max(2000),
});
export const replySchema = z.object({ text: z.string().trim().min(1, "Write a reply").max(2000) });
export const messageSchema = z.object({ text: z.string().trim().min(1).max(2000) });


// ---------- Invites ----------
export const inviteSchema = z
  .object({
    role: z.enum(["member", "supervisor"], { message: "Choose a role" }),
    name: z.string().trim().min(2, "Enter a name").max(80).optional(),
    email: z.string().trim().toLowerCase().email("Enter a valid email").optional(),
    inviteeId: z.string().regex(/^[a-f\d]{24}$/i).optional(), // registered supervisor picked from the list
  })
  .refine((v) => v.inviteeId || (v.name && v.email), { message: "Enter a name and email" });

export const inviteActionSchema = z.object({
  action: z.enum(["accept", "decline"], { message: "Choose accept or decline" }),
});

const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date")
  .refine((v) => !isNaN(new Date(`${v}T12:00:00Z`).getTime()), "Pick a valid date");

export const projectUpdateSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
    timelineStart: day.nullable(),
    timelineEnd: day.nullable(),
  })
  .partial();

const milestoneBase = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().trim().max(1000).optional(),
  deadline: day,
  assigneeIds: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid assignee")).max(10).optional(),
});
export const milestoneCreateSchema = milestoneBase;
export const milestoneUpdateSchema = milestoneBase.partial();