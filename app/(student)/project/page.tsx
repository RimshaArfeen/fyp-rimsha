

import ProjectHeader from "../../../components/project-dashboard/ProjectHeader";
import ProjectSidebar from "../../../components/project-dashboard/ProjectSidebar";
import ProjectContextPanel from "../../../components/project-dashboard/ProjectContextPanel";
import ProjectTabs from "../../../components/project-dashboard/ProjectTabs";
import { project } from "./dummy-data";

export default function ProjectDashboardPage() {
     return (
          <div className="min-h-screen bg-background text-foreground relative top-0">
               <ProjectHeader project={project} />

               <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
                         {/* Left sidebar */}
                         <aside className="lg:col-span-6 xl:col-span-7 min-w-0 mb-5">
                              <ProjectSidebar project={project} />
                         </aside>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                         {/* Main content */}
                         <main className="lg:col-span-2 min-w-0 ">
                              <ProjectTabs project={project} />
                         </main>

                         {/* Right context panel */}
                         <aside className="hidden lg:block lg:col-span-1">
                              <ProjectContextPanel project={project} />
                         </aside>
                    </div>
               </div>
          </div>
     );
}