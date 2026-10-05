"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OverviewTab from "./tabs/OverviewTab";
import MilestonesTab from "./tabs/MilestonesTab";
import SubmissionsTab from "./tabs/SubmissionsTab";
import FeedbackTab from "./tabs/FeedbackTab";
import ChatTab from "./tabs/ChatTab";
import type { project as Project } from "../../app/(student)/project/dummy-data";
import {
     projectTabs,
     parseProjectTab,
     projectTabHref,
} from "../../lib/project-tabs";

export default function ProjectTabs({ project }: { project: typeof Project }) {
     // The URL is the source of truth, so the sidebar and the tab strip always agree.
     const searchParams = useSearchParams();
     const active = parseProjectTab(searchParams.get("tab"));

     return (
          <div className="space-y-4">
               {/* Tab strip */}
               <div
                    role="tablist"
                    aria-label="Project sections"
                    className="scrollbar-sidebar -mb-px flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border"
               >
                    {projectTabs.map((t) => {
                         const isActive = active === t.id;
                         return (
                              <Link
                                   key={t.id}
                                   href={projectTabHref(t.id)}
                                   scroll={false}
                                   role="tab"
                                   aria-selected={isActive}
                                   aria-current={isActive ? "page" : undefined}
                                   className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                                             ? "text-foreground"
                                             : "text-muted-foreground hover:text-foreground"
                                        }`}
                              >
                                   {t.label}
                                   {isActive && (
                                        <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
                                   )}
                              </Link>
                         );
                    })}
               </div>

               {/* Tab content */}
               <div key={active} className="animate-[fadeSlide_180ms_ease-out]">
                    {active === "overview" && <OverviewTab project={project} />}
                    {active === "milestones" && <MilestonesTab project={project} />}
                    {active === "submissions" && <SubmissionsTab project={project} />}
                    {active === "feedback" && <FeedbackTab project={project} />}
                    {active === "chat" && <ChatTab project={project} />}
               </div>
          </div>
     );
}