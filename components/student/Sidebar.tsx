"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  projectTabs,
  parseProjectTab,
  projectTabHref,
  PROJECT_BASE_PATH,
  DEFAULT_PROJECT_TAB,
  type ProjectTabId,
} from "../../lib/project-tabs";
import { signOut, useSession } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  Search,
  Users,
  FolderKanban,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ClipboardList,
  Flag,
  FileUp,
  MessageSquare,
  MessagesSquare,
} from "lucide-react";

type NavLink = { href: string; label: string; icon: LucideIcon };

const primaryLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teams", label: "Find Teams", icon: Search },
  { href: "/my-team", label: "My Team", icon: Users },
];

const projectIcons: Record<ProjectTabId, LucideIcon> = {
  overview: ClipboardList,
  milestones: Flag,
  submissions: FileUp,
  feedback: MessageSquare,
  chat: MessagesSquare,
};

const projectLinks = projectTabs.map((t) => ({
  id: t.id,
  href: projectTabHref(t.id),
  label: t.label,
  icon: projectIcons[t.id],
}));

const profileLink: NavLink = { href: "/profile", label: "Profile", icon: User };

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const iconBtn = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
  text-primary-foreground/70 transition-colors duration-150
  hover:bg-primary-hover hover:text-primary-foreground ${focusRing}`;

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeProjectTab = parseProjectTab(searchParams.get("tab"));
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter(); // ✅ add

  // Works for /project, /project/anything, /project?tab=...
  const isProjectRoute =
    pathname === PROJECT_BASE_PATH ||
    pathname.startsWith(`${PROJECT_BASE_PATH}/`);

  const [projectOpen, setProjectOpen] = useState(isProjectRoute);

  // Keep the submenu open whenever the user navigates into a project route.
  useEffect(() => {
    if (isProjectRoute) setProjectOpen(true);
  }, [isProjectRoute]);

  const submenuVisible = projectOpen && !collapsed;

  const name = session?.user?.name ?? "Loading...";
  const email = session?.user?.email ?? "";
  const initial = (session?.user?.name ?? session?.user?.email ?? "?")
    .charAt(0)
    .toUpperCase();



  const handleProjectClick = () => {
    if (collapsed) {
      setCollapsed(false);
      setProjectOpen(true);
      return;
    }

    const willOpen = !projectOpen;
    setProjectOpen(willOpen);

    if (willOpen && !isProjectRoute) {
      router.push(`${PROJECT_BASE_PATH}?tab=${DEFAULT_PROJECT_TAB}`);
    }
  };


  const itemClass = (active: boolean) =>
    `group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium
     transition-colors duration-150 motion-reduce:transition-none ${focusRing}
     ${active
      ? "bg-primary-hover text-primary-foreground"
      : "text-primary-foreground/75 hover:bg-primary-hover hover:text-primary-foreground"
    }
     ${collapsed ? "md:justify-center md:px-0" : ""}`;

  const railIndicator = (active: boolean) => (
    <span
      aria-hidden="true"
      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-secondary
        transition-opacity duration-150
        ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
    />
  );

  const iconClass = (active: boolean) =>
    `h-[18px] w-[18px] shrink-0 transition-transform duration-150 motion-reduce:transition-none ${active ? "" : "group-hover:scale-110"
    }`;

  const labelClass = `truncate ${collapsed ? "md:hidden" : ""}`;

  const renderLink = ({ href, label, icon: Icon }: NavLink) => {
    const active =
      pathname === href || pathname.startsWith(`${href}/`);
    return (
      <li key={href}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          title={collapsed ? label : undefined}
          className={itemClass(active)}
        >
          {railIndicator(active)}
          <Icon className={iconClass(active)} aria-hidden="true" />
          <span className={labelClass}>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      aria-label="Primary"
      className={`flex w-full items-center gap-3 bg-primary p-3 text-primary-foreground
        transition-[width] duration-200 motion-reduce:transition-none
        md:h-screen md:shrink-0 md:flex-col md:items-stretch md:gap-3 md:overflow-hidden
        ${collapsed ? "md:w-20" : "md:w-64"}`}
    >
      {/* Brand */}
      <div
        className={`flex shrink-0 items-center gap-2 md:px-1
          ${collapsed ? "md:flex-col md:px-0" : "md:h-10"}`}
      >
        <Link
          href="/dashboard"
          className={`flex items-center gap-2.5 rounded-lg ${focusRing}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-base font-bold text-secondary-foreground">
            P
          </span>
          <span
            className={`text-lg font-semibold tracking-tight ${collapsed ? "md:hidden" : ""
              }`}
          >
            pulse.
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={`${iconBtn} hidden md:inline-flex ${collapsed ? "" : "ml-auto"}`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="hidden h-px w-full shrink-0 bg-primary-foreground/10 md:block" />

      {/* Workspace nav: the only part of the sidebar that scrolls */}
      <nav
        aria-label="Workspace"
        className="scrollbar-sidebar flex min-w-0 flex-1 gap-1 overflow-x-auto
          md:min-h-0 md:flex-col md:overflow-y-auto md:overflow-x-hidden"
      >
        <p
          className={`hidden px-3 pb-1.5 pt-1 text-xs font-medium text-primary-foreground/50 md:block ${collapsed ? "md:hidden" : ""
            }`}
        >
          Workspace
        </p>

        <ul className="flex min-w-max gap-1 md:min-w-0 md:flex-col">
          {primaryLinks.map(renderLink)}

          {/* Project group */}
          <li>
            {/* Mobile: plain link (a dropdown would be clipped in the horizontal bar) */}
            <Link
              href={PROJECT_BASE_PATH}
              className={`${itemClass(isProjectRoute)} md:hidden`}
            >
              <FolderKanban className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span>Project</span>
            </Link>

            {/* Desktop: dropdown trigger */}
            <button
              type="button"
              onClick={handleProjectClick}
              aria-expanded={submenuVisible}
              aria-controls="project-submenu"
              title={collapsed ? "Project" : undefined}
              className={`${itemClass(isProjectRoute)} hidden md:flex`}
            >
              {railIndicator(isProjectRoute)}
              <FolderKanban className={iconClass(isProjectRoute)} aria-hidden="true" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">Project</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${submenuVisible ? "rotate-180" : ""
                      }`}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>

            {/* Animated submenu (desktop only) */}
            <div
              id="project-submenu"
              inert={!submenuVisible}
              className={`hidden transition-[grid-template-rows] duration-200 motion-reduce:transition-none md:grid ${submenuVisible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="my-1 ml-[21px] flex flex-col gap-0.5 border-l border-primary-foreground/15 pl-3">
                  {projectLinks.map(({ id, href, label, icon: Icon }) => {
                    const active = isProjectRoute && activeProjectTab === id;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={`flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium
                            transition-colors duration-150 motion-reduce:transition-none ${focusRing}
                            ${active
                              ? "bg-primary-hover text-primary-foreground"
                              : "text-primary-foreground/70 hover:bg-primary-hover hover:text-primary-foreground"
                            }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${active ? "text-secondary" : ""}`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </li>

          {renderLink(profileLink)}
        </ul>
      </nav>

      {/* Profile card: pinned to the bottom, never scrolls */}
      <div className="hidden h-px w-full shrink-0 bg-primary-foreground/10 md:block" />
      <div
        className={`flex shrink-0 items-center gap-1 rounded-xl bg-primary-hover/60 p-1.5
          ${collapsed ? "md:flex-col md:gap-1" : ""}`}
      >
        <Link
          href="/profile"
          title={collapsed ? name : undefined}
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 ${collapsed ? "md:flex-none md:justify-center" : ""
            } ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
          >
            {initial}
          </span>
          <span
            className={`hidden min-w-0 flex-col gap-0.5 leading-none ${collapsed ? "" : "md:flex"
              }`}
          >
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="truncate text-xs text-primary-foreground/60">{email}</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          aria-label="Log out"
          title="Log out"
          className={iconBtn}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}