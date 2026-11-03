import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "../../../../../lib/prisma";
import { handle, HttpError, requireUser, requireMilestoneAccess } from "../../../../../lib/api";

export const runtime = "nodejs";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip", ".png", ".jpg", ".jpeg", ".txt", ".md"]);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const user = await requireUser();
    const { milestone, isMember } = await requireMilestoneAccess(id, user);
    if (!isMember) throw new HttpError(403, "Only team members can submit");
    if (milestone.status === "approved") throw new HttpError(409, "This milestone is already approved");

    const latest = await prisma.submission.findFirst({ where: { milestoneId: id }, orderBy: { createdAt: "desc" } });
    if (milestone.status === "pending" && latest?.status === "pending")
      throw new HttpError(409, "Already submitted. Waiting for review");

    const form = await req.formData();
    const file = form.get("file");
    const note = String(form.get("note") ?? "").trim().slice(0, 1000) || null;
    if (!(file instanceof File) || file.size === 0) throw new HttpError(400, "Choose a file to upload");
    if (file.size > MAX_BYTES) throw new HttpError(400, "File is larger than 10 MB");
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED.has(ext)) throw new HttpError(400, "This file type is not allowed");

    const safeName = `${Date.now()}-${path.basename(file.name).replace(/[^\w.\-]/g, "_")}`;
    const dir = path.join(process.cwd(), "public", "uploads", id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()));

    const [submission] = await prisma.$transaction([
      prisma.submission.create({
        data: {
          fileName: file.name,
          fileUrl: `/uploads/${id}/${safeName}`,
          notes: note,
          version: (latest?.version ?? 0) + 1,
          status: "pending",
          milestoneId: id,
          submittedById: user.id,
        },
      }),
      prisma.milestone.update({ where: { id }, data: { status: "pending" } }),
    ]);
    return NextResponse.json({ id: submission.id }, { status: 201 });
  });
}