"use client";

import { useCallback, useEffect, useState, KeyboardEvent, ReactNode } from "react";
import {
  Mail, Phone, GraduationCap, Link2, Pencil, Check, X, Plus, Award, BookOpen,
  Sparkles, Loader2, Code, Briefcase, Globe, ExternalLink, AlertCircle, UserRound,
  Building2, Hash, Ticket, CalendarDays, MapPin, Flag, School,
} from "lucide-react";
import CountUp from "../../../components/student/CountUp";
import Loader from "../../../components/Loader";

type Profile = {
  name: string;
  email: string;
  phone: string;
  department: string;
  semester: string; // "" or "1".."8"
  cgpa: string; // "" or "3.49" (string for the <input>)
  university: string;
  program: string;
  batch: string;
  registrationNumber: string;
  seatNumber: string;
  city: string;
  country: string;
  github: string;
  linkedin: string;
  portfolio: string;
  skills: string[];
};

type Meta = { role: string };

type ApiProfile = {
  name: string;
  email: string;
  role: string;
  phone: string | null;
  department: string | null;
  semester: number | null;
  cgpa: number | null;
  university: string | null;
  program: string | null;
  batch: string | null;
  registrationNumber: string | null;
  seatNumber: string | null;
  city: string | null;
  country: string | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  skills: string[];
};

const blank: Profile = {
  name: "", email: "", phone: "", department: "", semester: "", cgpa: "",
  university: "", program: "", batch: "", registrationNumber: "", seatNumber: "",
  city: "", country: "",
  github: "", linkedin: "", portfolio: "", skills: [],
};

const toForm = (d: ApiProfile): Profile => ({
  name: d.name,
  email: d.email,
  phone: d.phone ?? "",
  department: d.department ?? "",
  semester: d.semester ? String(d.semester) : "",
  cgpa: d.cgpa !== null ? String(d.cgpa) : "",
  university: d.university ?? "",
  program: d.program ?? "",
  batch: d.batch ?? "",
  registrationNumber: d.registrationNumber ?? "",
  seatNumber: d.seatNumber ?? "",
  city: d.city ?? "",
  country: d.country ?? "",
  github: d.github ?? "",
  linkedin: d.linkedin ?? "",
  portfolio: d.portfolio ?? "",
  skills: d.skills,
});

const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
const semesterLabel = (v: string) => (v ? `${ordinal(Number(v))} Semester` : "");

const inputCls =
  "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const linkFields = [
  { key: "github", label: "GitHub", placeholder: "github.com/username", icon: Code },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/username", icon: Briefcase },
  { key: "portfolio", label: "Portfolio", placeholder: "yourname.dev", icon: Globe },
] as const;

/* ---------- small presentational helpers (no logic) ---------- */

function SectionHeader({ icon: Icon, title, hint }: { icon: typeof Mail; title: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {hint && <span className="text-xs text-muted-foreground hidden sm:block">{hint}</span>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:bg-accent/40">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

// One text row: shows the value, or an input while editing
function TextField({
  icon, label, editing, value, onChange, placeholder, maxLength,
}: {
  icon: typeof Mail;
  label: string;
  editing: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <InfoRow icon={icon} label={label}>
      {editing ? (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm font-medium truncate">
          {value || <span className="text-muted-foreground font-normal">Not added</span>}
        </p>
      )}
    </InfoRow>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(blank);
  const [draft, setDraft] = useState<Profile>(blank);
  const [meta, setMeta] = useState<Meta>({ role: "student" });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: ApiProfile = await res.json();
      setProfile(toForm(data));
      setMeta({ role: data.role });
    } catch {
      setLoadError("Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const view = editing ? draft : profile;

  const startEdit = () => { setDraft(profile); setEditing(true); setSaved(false); setSaveError(""); };
  const cancel = () => { setEditing(false); setNewSkill(""); setSaveError(""); };

  const save = async () => {
    // Validate CGPA first: Number("abc") is NaN, which JSON turns into null and would erase the value
    const cgpaText = draft.cgpa.trim();
    const cgpaNum = cgpaText === "" ? null : Number(cgpaText);
    if (cgpaNum !== null && (Number.isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 4)) {
      setSaveError("CGPA must be a number between 0 and 4");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          phone: draft.phone,
          department: draft.department,
          semester: draft.semester === "" ? null : Number(draft.semester),
          cgpa: cgpaNum,
          university: draft.university,
          program: draft.program,
          batch: draft.batch,
          registrationNumber: draft.registrationNumber,
          seatNumber: draft.seatNumber,
          city: draft.city,
          country: draft.country,
          github: draft.github,
          linkedin: draft.linkedin,
          portfolio: draft.portfolio,
          skills: draft.skills,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setSaveError(data?.error ?? "Could not save changes");
        return;
      }
      setProfile(toForm(data)); // show what the server actually stored (normalized links, rounded CGPA)
      setEditing(false);
      setNewSkill("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (draft.skills.some((x) => x.toLowerCase() === s.toLowerCase())) { setNewSkill(""); return; }
    if (draft.skills.length >= 20) { setSaveError("You can add up to 20 skills"); return; }
    setSaveError("");
    setDraft({ ...draft, skills: [...draft.skills, s] });
    setNewSkill("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  if (loading) {
    return (
      <Loader fullScreen message="Loading dashboard..." />
    );
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto card-surface p-10 text-center pop flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <p className="font-medium">{loadError}</p>
        <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
        <button onClick={load} className="mt-1 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition">
          Try again
        </button>
      </div>
    );
  }

  const cgpa = view.cgpa === "" || Number.isNaN(Number(view.cgpa)) ? null : Number(view.cgpa);
  const roleLabel = meta.role.charAt(0).toUpperCase() + meta.role.slice(1);

  // display-only: how complete the profile looks
  const completenessFields = [
    view.name, view.phone, view.department, view.semester, view.cgpa,
    view.university, view.program, view.batch, view.registrationNumber, view.seatNumber,
    view.city, view.country, view.github, view.linkedin, view.portfolio,
  ];
  const completeness = Math.round(
    ((completenessFields.filter((v) => v.trim() !== "").length + (view.skills.length > 0 ? 1 : 0)) /
      (completenessFields.length + 1)) * 100
  );

  const headerSub = [view.university, view.registrationNumber].filter(Boolean).join(" • ");

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Cover + header */}
      <section className="fade-up card-surface">
        <div
          className="relative h-40 md:h-44 rounded-t-xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
        >
          <div className="float-slow absolute -top-10 right-10 w-40 h-40 rounded-full bg-secondary/25" />
          <div className="float-slow absolute -bottom-6 left-1/4 w-24 h-24 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
          <div className="float-slow absolute top-6 left-8 w-10 h-10 rounded-full bg-white/10" style={{ animationDelay: "0.8s" }} />
        </div>

        <div className="relative z-10 px-5 md:px-8 pb-6 -mt-14 flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4 min-w-0">
              <div className="w-28 h-28 shrink-0 rounded-full bg-secondary text-secondary-foreground text-5xl font-bold flex items-center justify-center border-4 border-card shadow-lg ring-2 ring-secondary/30 hover:scale-105 transition">
                {(view.name.charAt(0) || "?").toUpperCase()}
              </div>
              <div className="pb-2 min-w-0">
                {editing ? (
                  <input
                    className={`${inputCls} text-lg font-semibold`}
                    value={draft.name}
                    maxLength={80}
                    placeholder="Your full name"
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                ) : (
                  <p className="text-2xl font-bold truncate">{view.name}</p>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="badge-approved">{roleLabel}</span>
                  {headerSub && <span className="text-sm text-muted-foreground">{headerSub}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-2">
              {saved && <span className="pop badge-approved">Saved ✓</span>}
              {editing ? (
                <>
                  <button onClick={cancel} disabled={saving} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition disabled:opacity-60">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={save} disabled={saving} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button onClick={startEdit} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Completeness */}
          <div className="rounded-xl bg-muted p-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium">Profile completeness</span>
              <span className="text-muted-foreground">{completeness}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-background overflow-hidden">
              <div className="h-full bg-secondary transition-all duration-700" style={{ width: `${completeness}%` }} />
            </div>
          </div>

          {editing && !saveError && (
            <div className="pop flex items-center gap-2 rounded-lg bg-accent text-primary text-sm px-3 py-2">
              <Pencil className="w-4 h-4 shrink-0" />
              You are editing your profile. Changes are saved only when you press Save.
            </div>
          )}
          {saveError && (
            <div role="alert" className="pop flex items-center gap-2 rounded-lg border border-border text-destructive text-sm px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {saveError}
            </div>
          )}
        </div>
      </section>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="fade-up lift card-surface p-5" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">CGPA</span>
          </div>
          {editing ? (
            <input
              className={inputCls}
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              max={4}
              placeholder="3.49"
              value={draft.cgpa}
              onChange={(e) => setDraft({ ...draft, cgpa: e.target.value })}
            />
          ) : (
            <p className="text-3xl font-bold leading-none">{cgpa !== null ? cgpa.toFixed(2) : "—"}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2 mb-3">out of 4.0</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-1000"
              style={{ width: `${(Math.min(cgpa ?? 0, 4) / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="fade-up lift card-surface p-5" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Skills</span>
          </div>
          <p className="text-3xl font-bold leading-none"><CountUp to={view.skills.length} /></p>
          <p className="text-xs text-muted-foreground mt-2">skills listed (max 20)</p>
        </div>

        <div className="fade-up lift card-surface p-5" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Semester</span>
          </div>
          <p className="text-3xl font-bold leading-none">{view.semester ? <CountUp to={Number(view.semester)} /> : "—"}</p>
          <p className="text-xs text-muted-foreground mt-2">current semester</p>
        </div>
      </div>

      {/* Personal info */}
      <section className="fade-up card-surface p-5 md:p-6" style={{ animationDelay: "200ms" }}>
        <SectionHeader icon={UserRound} title="Personal Info" hint={editing ? "Email cannot be changed" : undefined} />
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email: read-only */}
          <InfoRow icon={Mail} label="Email">
            <p className="text-sm font-medium truncate">{view.email}</p>
          </InfoRow>

          <TextField icon={Phone} label="Phone" editing={editing} value={view.phone} placeholder="0300-1234567"
            onChange={(v) => setDraft({ ...draft, phone: v })} />

          <TextField icon={MapPin} label="City" editing={editing} value={view.city} placeholder="Karachi" maxLength={60}
            onChange={(v) => setDraft({ ...draft, city: v })} />

          <TextField icon={Flag} label="Country" editing={editing} value={view.country} placeholder="Pakistan" maxLength={60}
            onChange={(v) => setDraft({ ...draft, country: v })} />
        </div>
      </section>

      {/* University details */}
      <section className="fade-up card-surface p-5 md:p-6" style={{ animationDelay: "240ms" }}>
        <SectionHeader icon={School} title="University Details" />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField icon={Building2} label="University" editing={editing} value={view.university}
            placeholder="University of Karachi" maxLength={120}
            onChange={(v) => setDraft({ ...draft, university: v })} />

          <TextField icon={GraduationCap} label="Department" editing={editing} value={view.department}
            placeholder="Computer Science" maxLength={80}
            onChange={(v) => setDraft({ ...draft, department: v })} />

          <TextField icon={BookOpen} label="Program" editing={editing} value={view.program}
            placeholder="BS Computer Science" maxLength={100}
            onChange={(v) => setDraft({ ...draft, program: v })} />

          <TextField icon={CalendarDays} label="Batch" editing={editing} value={view.batch}
            placeholder="Fall 2022" maxLength={30}
            onChange={(v) => setDraft({ ...draft, batch: v })} />

          <TextField icon={Hash} label="Registration No." editing={editing} value={view.registrationNumber}
            placeholder="2022-CS-045" maxLength={30}
            onChange={(v) => setDraft({ ...draft, registrationNumber: v })} />

          <TextField icon={Ticket} label="Seat No." editing={editing} value={view.seatNumber}
            placeholder="B-1234567" maxLength={30}
            onChange={(v) => setDraft({ ...draft, seatNumber: v })} />

          {/* Semester */}
          <InfoRow icon={BookOpen} label="Semester">
            {editing ? (
              <select className={inputCls} value={draft.semester} onChange={(e) => setDraft({ ...draft, semester: e.target.value })}>
                <option value="">Not set</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{semesterLabel(String(n))}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium">{semesterLabel(view.semester) || <span className="text-muted-foreground font-normal">Not added</span>}</p>
            )}
          </InfoRow>
        </div>
      </section>

      {/* Skills */}
      <section className="fade-up card-surface p-5 md:p-6" style={{ animationDelay: "280ms" }}>
        <SectionHeader icon={Sparkles} title="Skills" hint={`${view.skills.length}/20`} />

        {view.skills.length === 0 && !editing && (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium mb-1">No skills added yet</p>
            <p className="text-sm text-muted-foreground">Click Edit Profile to add some. Teams find you by skill.</p>
          </div>
        )}

        {view.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {view.skills.map((skill) => (
              <span key={skill} className="pop badge-approved flex items-center gap-1.5 hover:scale-105 transition">
                {skill}
                {editing && (
                  <button
                    onClick={() => setDraft({ ...draft, skills: draft.skills.filter((s) => s !== skill) })}
                    aria-label={`Remove ${skill}`}
                    className="rounded-full hover:bg-black/10 p-0.5 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {editing && (
          <div className="flex gap-2 mt-4">
            <input className={inputCls} placeholder="Add a skill and press Enter" maxLength={30} value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={onKey} />
            <button onClick={addSkill} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        )}
      </section>

      {/* Links */}
      <section className="fade-up card-surface p-5 md:p-6" style={{ animationDelay: "340ms" }}>
        <SectionHeader icon={Link2} title="Links" />
        <div className="flex flex-col gap-3">
          {linkFields.map(({ key, label, placeholder, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:bg-accent/40">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">{label}</p>
                {editing ? (
                  <input
                    className={inputCls}
                    value={draft[key]}
                    placeholder={placeholder}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                ) : view[key] ? (
                  <a
                    href={`https://${view[key]}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex max-w-full items-center gap-1 text-sm font-medium text-secondary hover:underline"
                  >
                    <span className="truncate">{view[key]}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Not added</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}