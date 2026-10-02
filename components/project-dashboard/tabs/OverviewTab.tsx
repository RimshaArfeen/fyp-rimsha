
import { SectionCard } from "../ui/SectionCard";
import { StatCard } from "../ui/StatCard";
import Badge from "../ui/Badge";
import { Avatar } from "../ui/Avatar";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

export default function OverviewTab({ project }: { project: typeof Project }) {
     const next = project.milestones.find((m) => m.status !== "approved");

     return (
          <div className="space-y-4 mt-5 ">
               {/* KPIs */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard label="Progress" value={`${project.progress}%`} hint="Overall completion" />
                    <StatCard label="Next deadline" value={next?.due ?? "—"} hint={next?.title} />
                    <StatCard label="Supervisor" value="Active" hint={project.supervisor} />
               </div>

               {/* Description */}
               <SectionCard title="Project Description">
                    <p className="text-sm leading-relaxed text-foreground/90">
                         A computer-vision powered attendance system that recognizes students in real
                         time and syncs records with a secure admin dashboard. Built for a mid-sized
                         university department with offline-first fallbacks.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                         {["Next.js", "TypeScript", "Tailwind", "Prisma", "OpenCV"].map((t) => (
                              <span
                                   key={t}
                                   className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                   {t}
                              </span>
                         ))}
                    </div>
               </SectionCard>

               {/* Timeline preview */}
               <SectionCard title="Milestone Timeline">
                    <ol className="relative space-y-5 border-l border-border pl-7">
                         {project.milestones.map((m, i) => {
                              const dot =
                                   m.status === "approved"
                                        ? "bg-success"
                                        : m.status === "pending"
                                             ? "bg-secondary"
                                             : "bg-destructive";

                              const isLast = i === project.milestones.length - 1;

                              return (
                                   <li key={m.id} className="relative">
                                        {/* Node */}
                                        <span
                                             className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full ring-4 ring-card ${dot}`}
                                             aria-hidden="true"
                                        />

                                        {/* Last item connector fade (optional, avoids line running past node) */}
                                        {isLast && (
                                             <span
                                                  className="absolute -left-px top-4 bottom-0 w-px bg-card"
                                                  aria-hidden="true"
                                             />
                                        )}

                                        {/* Content */}
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                             <div className="min-w-0">
                                                  <p className="truncate text-sm font-medium">{m.title}</p>
                                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                                       Due {m.due}
                                                  </p>
                                             </div>

                                             {/* Status badge (optional — only if you already have Badge component) */}
                                             <Badge variant={m.status}>{m.status}</Badge>
                                        </div>
                                   </li>
                              );
                         })}
                    </ol>
               </SectionCard>

               {/* Activity */}
               <SectionCard title="Recent Activity">
                    <ul className="divide-y divide-border">
                         {project.activity.map((a) => (
                              <li key={a.id} className="flex items-center gap-3 py-3">
                                   <Avatar initials={a.who.split(" ").map((n) => n[0]).join("")} />
                                   <p className="text-sm">
                                        <span className="font-medium">{a.who}</span>{" "}
                                        <span className="text-muted-foreground">{a.what}</span>
                                   </p>
                                   <span className="ml-auto text-xs text-muted-foreground">{a.when}</span>
                              </li>
                         ))}
                    </ul>
               </SectionCard>
          </div>
     );
}