"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users, X, Send, Check } from "lucide-react";

type Team = {
  id: number;
  name: string;
  project: string;
  description: string;
  lead: string;
  members: string[];
  maxMembers: number;
  skills: string[];
};

const teams: Team[] = [
  { id: 1, name: "Team Beta", project: "Campus Event Planner", description: "A web app where students discover, create and register for campus events.", lead: "Usman Tariq", members: ["Usman Tariq", "Zara Malik"], maxMembers: 4, skills: ["React", "Node.js", "MongoDB"] },
  { id: 2, name: "Team Gamma", project: "Smart Library System", description: "Book search, issue tracking and fine management for the university library.", lead: "Hina Raza", members: ["Hina Raza", "Bilal Ahmed", "Noor Fatima"], maxMembers: 4, skills: ["Next.js", "Tailwind CSS", "Prisma"] },
  { id: 3, name: "Team Delta", project: "Student Wellness Tracker", description: "Track study hours, sleep and mood with simple weekly insights.", lead: "Ali Hassan", members: ["Ali Hassan"], maxMembers: 5, skills: ["React", "UI Design", "Charts"] },
  { id: 4, name: "Team Epsilon", project: "Online Exam Portal", description: "Timed quizzes with auto grading and teacher dashboards.", lead: "Mahnoor Iqbal", members: ["Mahnoor Iqbal", "Saad Khan", "Iqra Javed", "Daniyal Sheikh"], maxMembers: 4, skills: ["Node.js", "MongoDB", "Security"] },
  { id: 5, name: "Team Zeta", project: "Karachi Bus Route Finder", description: "Community driven bus routes and timings for daily commuters.", lead: "Farhan Ali", members: ["Farhan Ali", "Sana Yousuf"], maxMembers: 4, skills: ["Next.js", "Maps", "MongoDB"] },
  { id: 6, name: "Team Eta", project: "Freelance Marketplace", description: "A small marketplace connecting student freelancers with local clients.", lead: "Areeba Shah", members: ["Areeba Shah", "Hamid Raza", "Laiba Noor"], maxMembers: 5, skills: ["React", "Prisma", "Stripe"] },
  { id: 7, name: "Team Theta", project: "Hospital Appointment App", description: "Patients book doctor slots and get reminders, with a simple admin view.", lead: "Rabia Khan", members: ["Rabia Khan", "Owais Ali"], maxMembers: 4, skills: ["React", "Node.js", "MongoDB"] },
  { id: 8, name: "Team Iota", project: "AI Study Assistant", description: "Upload notes and get summaries, flashcards and quick quizzes.", lead: "Taha Mirza", members: ["Taha Mirza"], maxMembers: 5, skills: ["Next.js", "Python", "OpenAI"] },
  { id: 9, name: "Team Kappa", project: "Inventory Manager", description: "Stock tracking, low stock alerts and monthly sales charts for small shops.", lead: "Eman Siddiqui", members: ["Eman Siddiqui", "Rayyan Khan", "Alishba Noor"], maxMembers: 4, skills: ["React", "Prisma", "Charts"] },
];

const skillCount: Record<string, number> = {};
teams.forEach((t) => t.skills.forEach((k) => (skillCount[k] = (skillCount[k] || 0) + 1)));
const popularSkills = Object.keys(skillCount).filter((k) => skillCount[k] >= 2).sort();

export default function FindTeamsPage() {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("all");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [requested, setRequested] = useState<number[]>([]);
  const [selected, setSelected] = useState<Team | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleRequest = (id: number) =>
    setRequested((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const q = query.trim().toLowerCase();
  const filtered = teams.filter((t) => {
    const text = `${t.name} ${t.project} ${t.skills.join(" ")}`.toLowerCase();
    return (
      (!q || text.includes(q)) &&
      (skill === "all" || t.skills.includes(skill)) &&
      (!onlyOpen || t.members.length < t.maxMembers)
    );
  });

  const clearFilters = () => { setQuery(""); setSkill("all"); setOnlyOpen(false); };

  const RequestButton = ({ team, full }: { team: Team; full?: boolean }) => {
    const isFull = team.members.length >= team.maxMembers;
    const sent = requested.includes(team.id);
    if (isFull)
      return <button disabled className={`px-4 py-2.5 rounded-lg text-sm bg-muted text-muted-foreground cursor-not-allowed ${full ? "w-full" : ""}`}>Team Full</button>;
    return (
      <button
        onClick={() => toggleRequest(team.id)}
        className={`flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition hover:scale-105 ${full ? "w-full" : ""} ${
          sent ? "border border-border text-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {sent ? <><Check className="w-4 h-4" /> Cancel</> : <><Send className="w-4 h-4" /> Join Team</>}
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <section
        className="fade-up relative overflow-hidden rounded-2xl p-8 md:p-10 text-primary-foreground flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))" }}
      >
        <div className="float-slow absolute -top-10 -right-8 w-40 h-40 rounded-full bg-secondary/20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-1">Find Teams</h1>
          <p className="text-sm opacity-80">Search teams, view their project and send a join request.</p>
        </div>
        <div className="relative z-10 text-right">
          <p className="text-sm opacity-80 mb-2">
            <span className="text-2xl font-bold text-secondary">{requested.length}</span> request{requested.length === 1 ? "" : "s"} sent
          </p>
          <Link href="/my-team" className="inline-block px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:scale-105 transition">
            Go to My Team
          </Link>
        </div>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total teams", value: teams.length, icon: Users },
          { label: "Open spots", value: teams.reduce((n, t) => n + (t.maxMembers - t.members.length), 0), icon: Check },
          { label: "Requests sent", value: requested.length, icon: Send },
        ].map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="fade-up lift card-surface p-6 flex items-center gap-4" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="w-12 h-12 rounded-xl bg-accent text-primary flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-3xl font-bold leading-none">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <section className="fade-up card-surface p-6 flex flex-col gap-5" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-3 px-4 border border-border rounded-xl bg-background focus-within:ring-2 focus-within:ring-ring">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by team, project or skill"
            className="w-full py-3 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {["all", ...popularSkills].map((s) => (
              <button
                key={s}
                onClick={() => setSkill(s)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${skill === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <button role="switch" aria-checked={onlyOpen} onClick={() => setOnlyOpen(!onlyOpen)} className="flex items-center gap-3 text-sm">
            <span className={`w-11 h-6 rounded-full p-0.5 transition ${onlyOpen ? "bg-primary" : "bg-muted"}`}>
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${onlyOpen ? "translate-x-5" : ""}`} />
            </span>
            Open spots only
          </button>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">Showing {filtered.length} of {teams.length} teams</p>

      {/* Results */}
      {filtered.length === 0 ? (
        <section className="card-surface p-12 text-center pop">
          <p className="font-medium mb-1">No teams match your search</p>
          <p className="text-sm text-muted-foreground mb-5">Try a different word or clear the filters.</p>
          <button onClick={clearFilters} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm">Clear filters</button>
        </section>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filtered.map((team, i) => {
            const spots = team.maxMembers - team.members.length;
            return (
              <article key={team.id} className="fade-up lift card-surface p-6 flex flex-col gap-5" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary text-secondary-foreground font-bold text-lg flex items-center justify-center">
                    {team.name.split(" ")[1].charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-lg leading-tight">{team.name}</h2>
                    <p className="text-sm text-secondary font-medium">{team.project}</p>
                  </div>
                  <span className={`whitespace-nowrap ${spots > 0 ? "badge-approved" : "badge-revision"}`}>
                    {spots > 0 ? `${spots} spot${spots > 1 ? "s" : ""} left` : "Full"}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {team.members.map((m) => (
                      <div key={m} title={m} className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center border-2 border-card hover:-translate-y-1 transition">
                        {m.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {team.members.length} of {team.maxMembers} members
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {team.skills.slice(0, 3).map((k) => (
                    <span key={k} className="text-xs px-3 py-1 rounded-full bg-accent text-primary">{k}</span>
                  ))}
                </div>

                <div className="flex gap-3 mt-auto pt-1">
                  <button onClick={() => setSelected(team)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-accent transition">View Details</button>
                  <div className="flex-1"><RequestButton team={team} full /></div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Details popup */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="pop card-surface w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} aria-label="Close" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-secondary font-medium mb-3">{selected.project}</p>
            <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>

            <p className="text-xs text-muted-foreground mb-2">Members ({selected.members.length}/{selected.maxMembers})</p>
            <ul className="flex flex-col gap-2 mb-4">
              {selected.members.map((m) => (
                <li key={m} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center ${m === selected.lead ? "ring-2 ring-secondary" : ""}`}>{m.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-medium">{m}</p>
                    <p className="text-xs text-muted-foreground">{m === selected.lead ? "Team Lead" : "Member"}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground mb-2">Skills they use</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {selected.skills.map((s) => (<span key={s} className="text-xs px-2 py-1 rounded-full bg-accent text-primary">{s}</span>))}
            </div>
            <RequestButton team={selected} full />
          </div>
        </div>
      )}
    </div>
  );
}
