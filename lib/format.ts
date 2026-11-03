
// lib/format.ts  (usable on server and client)
/** First letter of the first name + first letter of the last name. "Ali Hassan Khan" -> "AK", "Sara" -> "S" */
export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

export const fmtDate = (d: Date | null | undefined) =>
  d ? d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Karachi" }) : "";

/** "2026-11-03" -> Date at 12:00 UTC, so the calendar day is the same in any timezone. */
export const toDay = (v: string) => new Date(`${v}T12:00:00Z`);
export const dayKey = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : "");

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });