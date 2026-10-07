"use client";

import { useState, KeyboardEvent } from "react";
import { Mail, Phone, GraduationCap, Link2, Pencil, Check, X, Plus, Award, BookOpen, Sparkles } from "lucide-react";
import CountUp from "../../../components/student/CountUp";
import { student } from "../../../lib/dummyData";

const initial = {
  name: student.name,
  email: "ayesha.khan@example.com",
  phone: "0300-1234567",
  department: "Computer Science",
  semester: "7th Semester",
  github: "github.com/ayeshakhan",
  linkedin: "linkedin.com/in/ayeshakhan",
  skills: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Git"],
};
type Profile = typeof initial;

const fields: { key: keyof Omit<Profile, "skills">; label: string; icon: typeof Mail }[] = [
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "department", label: "Department", icon: GraduationCap },
  { key: "semester", label: "Semester", icon: BookOpen },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initial);
  const [draft, setDraft] = useState<Profile>(initial);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const cgpa = 3.49;

  const view = editing ? draft : profile;
  const inputCls =
    "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  const startEdit = () => { setDraft(profile); setEditing(true); setSaved(false); };
  const cancel = () => { setEditing(false); setNewSkill(""); };
  const save = () => {
    setProfile(draft);
    setEditing(false);
    setNewSkill("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || draft.skills.includes(s)) return;
    setDraft({ ...draft, skills: [...draft.skills, s] });
    setNewSkill("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Cover + header */}
      <section className="fade-up card-surface">
        <div
          className="relative h-36 rounded-t-xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
        >
          <div className="float-slow absolute -top-8 right-10 w-32 h-32 rounded-full bg-secondary/25" />
          <div className="float-slow absolute bottom-0 left-1/4 w-20 h-20 rounded-full bg-white/10" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative z-10 px-6 pb-5 -mt-12 flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-secondary text-secondary-foreground text-4xl font-bold flex items-center justify-center border-4 border-card hover:scale-105 transition">
              {view.name.charAt(0)}
            </div>
            <div className="pb-1">
              {editing ? (
                <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              ) : (
                <p className="text-xl font-semibold">{view.name}</p>
              )}
              <p className="text-sm text-muted-foreground">{student.role} • {student.rollNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="pop badge-approved">Saved ✓</span>}
            {editing ? (
              <>
                <button onClick={cancel} className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={save} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition">
                  <Check className="w-4 h-4" /> Save
                </button>
              </>
            ) : (
              <button onClick={startEdit} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="fade-up lift card-surface p-4" style={{ animationDelay: "80ms" }}>
          <Award className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold">{cgpa}</p>
          <p className="text-xs text-muted-foreground mb-2">CGPA</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${(cgpa / 4) * 100}%` }} />
          </div>
        </div>
        <div className="fade-up lift card-surface p-4" style={{ animationDelay: "160ms" }}>
          <Sparkles className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold"><CountUp to={view.skills.length} /></p>
          <p className="text-xs text-muted-foreground">Skills</p>
        </div>
        <div className="fade-up lift card-surface p-4" style={{ animationDelay: "240ms" }}>
          <BookOpen className="w-5 h-5 text-secondary mb-2" />
          <p className="text-2xl font-bold"><CountUp to={7} /></p>
          <p className="text-xs text-muted-foreground">Semesters</p>
        </div>
      </div>

      {/* Info */}
      <section className="fade-up card-surface p-5" style={{ animationDelay: "200ms" }}>
        <h2 className="font-semibold mb-4">Personal and Academic Info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                {editing ? (
                  <input className={inputCls} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                ) : (
                  <p className="text-sm font-medium">{view[key]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="fade-up card-surface p-5" style={{ animationDelay: "280ms" }}>
        <h2 className="font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {view.skills.map((skill) => (
            <span key={skill} className="pop badge-approved flex items-center gap-1 hover:scale-105 transition">
              {skill}
              {editing && (
                <button
                  onClick={() => setDraft({ ...draft, skills: draft.skills.filter((s) => s !== skill) })}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        {editing && (
          <div className="flex gap-2 mt-4">
            <input className={inputCls} placeholder="Add a skill and press Enter" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={onKey} />
            <button onClick={addSkill} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        )}
      </section>

      {/* Links */}
      <section className="fade-up card-surface p-5" style={{ animationDelay: "340ms" }}>
        <h2 className="font-semibold mb-3">Links</h2>
        <div className="flex flex-col gap-3">
          {(["github", "linkedin"] as const).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <Link2 className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm w-20 capitalize text-muted-foreground">{key}</span>
              {editing ? (
                <input className={inputCls} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
              ) : (
                <a href={`https://${view[key]}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-secondary hover:underline">
                  {view[key]}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
