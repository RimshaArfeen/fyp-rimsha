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
];

const allSkills = Array.from(new Set(teams.flatMap((t) => t.skills))).sort();

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
      return <button disabled className={`px-4 py-2 rounded-lg text-sm bg-muted text-muted-foreground cursor-not-allowed ${full ? "w-full" : ""}`}>Team Full</button>;
    return (
      <button
        onClick={() => toggleRequest(team.id)}
        className={`flex items-center justify-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition hover:scale-105 ${full ? "w-full" : ""} ${
          sent ? "border border-border text-foreground" : "bg-primary text-primary-foreground"
        }`}
      >
        {sent ? <><Check className="w-4 h-4" /> Cancel</> : <><Send className="w-4 h-4" /> Join Team</>}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <section
        className="fade-up relative overflow-hidden rounded-2xl p-6 md:p-8 text-primary-foreground flex items-center justify-between gap-4 flex-wrap"
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

      {/* Filters */}
      <section className="fade-up card-surface p-4 flex flex-wrap items-center gap-3" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2 flex-1 min-w-56 px-3 border border-border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by team, project or skill"
            className="w-full py-2 bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All skills</option>
          {allSkills.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
        <button
          onClick={() => setOnlyOpen(!onlyOpen)}
          className={`px-4 py-2 rounded-lg text-sm transition ${onlyOpen ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}
        >
          Open spots only
        </button>
      </section>

      {/* Results */}
      {filtered.length === 0 ? (
        <section className="card-surface p-10 text-center pop">
          <p className="font-medium mb-1">No teams match your search</p>
          <p className="text-sm text-muted-foreground mb-4">Try a different word or clear the filters.</p>
          <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Clear filters</button>
        </section>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((team, i) => {
            const spots = team.maxMembers - team.members.length;
            return (
              <article key={team.id} className="fade-up lift card-surface p-5 flex flex-col gap-4" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{team.name}</h2>
                    <p className="text-sm text-muted-foreground">{team.project}</p>
                  </div>
                  <span className={`whitespace-nowrap ${spots > 0 ? "badge-approved" : "badge-revision"}`}>{spots > 0 ? `${spots} spot${spots > 1 ? "s" : ""} left` : "Full"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {team.members.map((m) => (
                      <div key={m} title={m} className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center border-2 border-card hover:-translate-y-1 transition">
                        {m.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{team.members.length}/{team.maxMembers}</span>
                </div>

                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-secondary transition-all duration-700" style={{ width: `${(team.members.length / team.maxMembers) * 100}%` }} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {team.skills.map((s) => (<span key={s} className="text-xs px-2 py-1 rounded-full bg-accent text-primary">{s}</span>))}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => setSelected(team)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent transition">View Details</button>
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
