
import { SectionCard } from "./ui/SectionCard";
import { Avatar } from "./ui/Avatar";
import type { project as Project } from "../../app/(student)/project/dummy-data";

export default function ProjectContextPanel({ project }: { project: typeof Project }) {
     return (
          <div className="space-y-4 sticky top-24">
               {/* Members */}
               <SectionCard
                    title="Team Members"
                    action={<a
                         href="/teams"
                         className="text-xs text-muted-foreground hover:text-foreground">View all</a>}
               >
                    <ul className="space-y-3">
                         {project.members.map((m) => (
                              <li key={m.id} className="flex items-center gap-3">
                                   <Avatar initials={m.initials} online={m.online} />
                                   <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{m.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{m.role}</p>
                                   </div>
                                   <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.role === "Lead"
                                                  ? "bg-secondary text-secondary-foreground"
                                                  : "bg-muted text-muted-foreground"
                                             }`}
                                   >
                                        {m.role}
                                   </span>
                              </li>
                         ))}
                    </ul>
               </SectionCard>

               {/* Supervisor */}
               <SectionCard title="Supervisor">
                    <div className="flex items-center gap-3">
                         <Avatar initials="AK" online />
                         <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{project.supervisor}</p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                   {project.supervisorDept}
                              </p>
                         </div>
                    </div>
                    <button className="mt-4 w-full rounded-[var(--radius-custom)] border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent transition-colors">
                         Message
                    </button>
               </SectionCard>

               {/* Deadlines */}
               <SectionCard title="Upcoming Deadlines">
                    <ul className="space-y-3">
                         {project.upcoming.map((u) => (
                              <li key={u.id} className="flex items-start gap-3">
                                   <span className="mt-0.5 inline-flex items-center justify-center text-[11px] font-semibold h-6 min-w-[42px] rounded-full bg-muted text-muted-foreground px-2">
                                        {u.days}d
                                   </span>
                                   <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{u.label}</p>
                                        <p className="text-[11px] text-muted-foreground">{u.due}</p>
                                   </div>
                              </li>
                         ))}
                    </ul>
               </SectionCard>

               {/* Resources */}
               <SectionCard title="Files & Resources">
                    <ul className="space-y-2">
                         {project.resources.map((r) => (
                              <li
                                   key={r.id}
                                   className="flex items-center gap-3 rounded-[var(--radius-custom)] px-2 py-2 hover:bg-accent transition-colors"
                              >
                                   <span className="h-8 w-8 grid place-items-center rounded-[var(--radius-custom)] bg-muted text-[10px] font-semibold text-muted-foreground">
                                        {r.type}
                                   </span>
                                   <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{r.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{r.size}</p>
                                   </div>
                                   <button
                                        aria-label={`Download ${r.name}`}
                                        className="text-muted-foreground hover:text-foreground text-sm"
                                   >
                                        ↓
                                   </button>
                              </li>
                         ))}
                    </ul>
               </SectionCard>
          </div>
     );
}