"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OverviewTab from "./tabs/OverviewTab";
import MilestonesTab from "./tabs/MilestonesTab";
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
     const parsed = parseProjectTab(searchParams.get("tab"));

     // Submissions now live inside each milestone, so an old link opens Milestones instead.
     const active = parsed === "submissions" ? "milestones" : parsed;
     const tabs = projectTabs.filter((t) => t.id !== "submissions");

     return (
          <div className="space-y-4">
               {/* Tab strip */}
               <div
                    role="tablist"
                    aria-label="Project sections"
                    className="scrollbar-sidebar flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 text-sm"
               >
                    {tabs.map((t) => {
                         const isActive = active === t.id;
                         return (
                              <Link
                                   key={t.id}
                                   href={projectTabHref(t.id)}
                                   scroll={false}
                                   role="tab"
                                   aria-selected={isActive}
                                   aria-current={isActive ? "page" : undefined}
                                   className={`whitespace-nowrap rounded-md px-4 py-1.5 font-medium transition ${
                                        isActive
                                             ? "bg-primary text-primary-foreground"
                                             : "text-muted-foreground hover:text-foreground"
                                   }`}
                              >
                                   {t.label}
                              </Link>
                         );
                    })}
               </div>

               {/* Tab content */}
               <div key={active} className="animate-[fadeSlide_180ms_ease-out]">
                    {active === "overview" && <OverviewTab project={project} />}
                    {active === "milestones" && <MilestonesTab project={project} />}
                    {active === "feedback" && <FeedbackTab project={project} />}
                    {active === "chat" && <ChatTab project={project} />}
               </div>
          </div>
     );
}