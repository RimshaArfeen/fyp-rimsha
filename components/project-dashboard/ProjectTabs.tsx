
"use client";

import { useState } from "react";
import OverviewTab from "./tabs/OverviewTab";
import MilestonesTab from "./tabs/MilestonesTab";
import SubmissionsTab from "./tabs/SubmissionsTab";
import FeedbackTab from "./tabs/FeedbackTab";
import ChatTab from "./tabs/ChatTab";
import type { project as Project } from "../../app/(student)/project/dummy-data";

const tabs = [
     { id: "overview", label: "Overview" },
     { id: "milestones", label: "Milestones" },
     { id: "submissions", label: "Submissions" },
     { id: "feedback", label: "Feedback" },
     { id: "chat", label: "Chat" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ProjectTabs({ project }: { project: typeof Project }) {
     const [active, setActive] = useState<TabId>("overview");

     return (
          <div className="space-y-4">
               {/* Tab strip */}
               <div
                    role="tablist"
                    aria-label="Project sections"
                    className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-border -mb-px"
               >
                    {tabs.map((t) => {
                         const isActive = active === t.id;
                         return (
                              <button
                                   key={t.id}
                                   role="tab"
                                   aria-selected={isActive}
                                   onClick={() => setActive(t.id)}
                                   className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                                             ? "text-foreground"
                                             : "text-muted-foreground hover:text-foreground"
                                        }`}
                              >
                                   {t.label}
                                   {isActive && (
                                        <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary rounded-full" />
                                   )}
                              </button>
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