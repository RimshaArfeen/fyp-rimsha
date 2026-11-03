
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT ?? 465);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function sendInviteEmail(p: {
  to: string; name: string; role: "MEMBER" | "SUPERVISOR"; teamName: string;
  projectTitle: string | null; projectDescription: string | null; invitedBy: string; link: string;
}) {
  const roleText = p.role === "SUPERVISOR" ? "supervisor" : "team member";
  const subject = `${p.invitedBy} invited you to join "${p.teamName}" as ${roleText}`;
  const project = p.projectTitle
    ? `<p><b>Project:</b> ${esc(p.projectTitle)}<br/>${esc(p.projectDescription ?? "")}</p>`
    : "";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px">
      <p>Hi ${esc(p.name)},</p>
      <p><b>${esc(p.invitedBy)}</b> invited you to join the team <b>${esc(p.teamName)}</b> as <b>${roleText}</b>.</p>
      ${project}
      <p><a href="${p.link}" style="background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">View invitation</a></p>
      <p style="color:#666;font-size:12px">Create an account or log in with this email address to accept. The link expires in 7 days.
      If you weren't expecting this, ignore this email.</p>
    </div>`;
  const text = `${p.invitedBy} invited you to join "${p.teamName}" as ${roleText}.\n${p.link}\nExpires in 7 days.`;
  await transporter.sendMail({ from: process.env.MAIL_FROM, to: p.to, subject, html, text });
}