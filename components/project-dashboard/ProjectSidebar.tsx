import { StatCard } from "./ui/StatCard";
import type { project as Project } from "../../app/(student)/project/dummy-data";

const nav = [
     { id: "overview", label: "Overview", icon: "◧" },
     { id: "milestones", label: "Milestones", icon: "◈" },
     { id: "submissions", label: "Submissions", icon: "▤" },
     { id: "feedback", label: "Feedback", icon: "◐" },
     { id: "chat", label: "Chat", icon: "◍" },
];

export default function ProjectSidebar({ project }: { project: typeof Project }) {
     const done = project.milestones.filter((m) => m.status === "approved").length;
     const pending = project.milestones.filter((m) => m.status === "pending").length;

     return (
          <div className="space-y-4 grid grid-cols-2 gap-4 justify-between">
               {/* Project meta */}
               <div className=" card-surface p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Team</p>
                    <p className="mt-1 font-semibold">{project.team}</p>

                    <div className="mt-4 space-y-2 text-sm">
                         <Row label="Supervisor" value={project.supervisor} />
                         <Row label="Type" value={project.type} />
                         <Row label="Started" value={project.startDate} />
                         <Row label="Ends" value={project.endDate} />
                    </div>

                    <div className="mt-5">
                         <div className="flex justify-between text-xs text-muted-foreground mb-2">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                         </div>
                         <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                   className="h-full bg-primary rounded-full"
                                   style={{ width: `${project.progress}%` }}
                              />
                         </div>
                    </div>
               </div>

               {/* Quick stats */}
               <div className="grid grid-cols-2 gap-3 mb-4">
                    <StatCard label="Done" value={`${done}/${project.milestones.length}`} />
                    <StatCard label="Pending" value={String(pending)} />
                    <StatCard label="Days left" value={String(project.daysLeft)} />
                    <StatCard label="Team size" value={String(project.members.length)} />
               </div>
          </div>
     );
}

function Row({ label, value }: { label: string; value: string }) {
     return (
          <div className="flex items-center justify-between gap-3">
               <span className="text-muted-foreground">{label}</span>
               <span className="font-medium text-right truncate">{value}</span>
          </div>
     );
}