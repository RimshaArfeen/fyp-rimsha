// lib/project-tabs.ts

export type ProjectTabId =
  | "overview"
  | "milestones"
  | "submissions"
  | "feedback"
  | "chat";

export type ProjectTab = {
  id: ProjectTabId;
  label: string;
};

export const projectTabs: readonly ProjectTab[] = [
  { id: "overview", label: "Overview" },
  { id: "milestones", label: "Milestones" },
  { id: "submissions", label: "Submissions" },
  { id: "feedback", label: "Feedback" },
  { id: "chat", label: "Chat" },
] as const;


/** Base path of the project dashboard. Change here if the route moves. */
export const PROJECT_BASE_PATH = "/project";
export const DEFAULT_PROJECT_TAB: ProjectTabId = "overview";
const VALID_IDS = new Set<ProjectTabId>(projectTabs.map((t) => t.id));

export function parseProjectTab(value: string | null | undefined): ProjectTabId {
  if (value && VALID_IDS.has(value as ProjectTabId)) {
    return value as ProjectTabId;
  }
  return DEFAULT_PROJECT_TAB;
}

export function projectTabHref(tab: ProjectTabId): string {
  return `${PROJECT_BASE_PATH}?tab=${tab}`;
}