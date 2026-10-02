
import { SectionCard } from "../ui/SectionCard";
import Badge from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import type { project as Project } from "../../../app/(student)/project/dummy-data";

export default function SubmissionsTab({ project }: { project: typeof Project }) {
     if (project.submissions.length === 0) {
          return (
               <SectionCard>
                    <EmptyState
                         title="No submissions yet"
                         description="Once your team uploads milestone deliverables, they will appear here."
                         action={
                              <button className="inline-flex items-center rounded-[var(--radius-custom)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                                   Upload submission
                              </button>
                         }
                    />
               </SectionCard>
          );
     }

     return (
          <SectionCard title="All Submissions">
               {/* Desktop table */}
               <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                         <thead>
                              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                                   <th className="py-2 pr-4 font-medium">Milestone</th>
                                   <th className="py-2 pr-4 font-medium">Submitted by</th>
                                   <th className="py-2 pr-4 font-medium">Date</th>
                                   <th className="py-2 pr-4 font-medium">Status</th>
                                   <th className="py-2 pr-4 font-medium text-right">Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {project.submissions.map((s) => (
                                   <tr
                                        key={s.id}
                                        className="border-b border-border last:border-0 hover:bg-accent transition-colors"
                                   >
                                        <td className="py-3 pr-4 font-medium">{s.milestone}</td>
                                        <td className="py-3 pr-4 text-muted-foreground">{s.submittedBy}</td>
                                        <td className="py-3 pr-4 text-muted-foreground">{s.date}</td>
                                        <td className="py-3 pr-4">
                                             <Badge variant={s.status}>
                                                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                             </Badge>
                                        </td>
                                        <td className="py-3 pr-4 text-right">
                                             <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                                                  View
                                             </button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>

               {/* Mobile cards */}
               <ul className="md:hidden space-y-3">
                    {project.submissions.map((s) => (
                         <li key={s.id} className="rounded-[var(--radius-custom)] border border-border p-4">
                              <div className="flex items-start justify-between gap-2">
                                   <h4 className="font-medium text-sm">{s.milestone}</h4>
                                   <Badge variant={s.status}>
                                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                   </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                   {s.submittedBy} · {s.date}
                              </p>
                         </li>
                    ))}
               </ul>
          </SectionCard>
     );
}