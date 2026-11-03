"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Search, Users, FolderKanban, ClipboardList,
  Flag, MessageSquare, MessagesSquare, FileUp, User, Lock, ArrowRightLeft, LogOut,
} from "lucide-react";
import { useStage } from "../lib/stage";
import { projectTabs, parseProjectTab, projectTabHref } from "../lib/project-tabs";
import ThemeToggle from "./ThemeToggle";

const tabIcons: Record<string, LucideIcon> = {
  overview: ClipboardList,
  milestones: Flag,
  submissions: FileUp,
  feedback: MessageSquare,
  chat: MessagesSquare,
};

const row = "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200";

function NavLink({ href, label, icon: Icon, active, small }: {
  href: string; label: string; icon: LucideIcon; active: boolean; small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${row} ${active
        ? "bg-white/15 text-white shadow-sm font-semibold"
        : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
    >
      <Icon size={small ? 16 : 18} className={`transition-transform duration-200 ${active ? "scale-110 text-white" : "text-white/70 group-hover:scale-110 group-hover:text-white"}`} />
      <span className="truncate">{label}</span>
      {active && (
        <span className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-secondary" />
      )}
    </Link>
  );
}

function LockedRow({ label, icon: Icon, hint }: { label: string; icon: LucideIcon; hint: string }) {
  return (
    <div title={hint} className={`${row} cursor-not-allowed opacity-40 hover:opacity-60`}>
      <Icon size={18} className="text-white/50" />
      <span className="flex-1 truncate">{label}</span>
      <Lock size={14} className="text-white/40" />
    </div>
  );
}

/** The only part that reads the query string, so it is the only part that needs Suspense. */
function ProjectLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onProject = pathname.startsWith("/project");
  const activeTab = parseProjectTab(searchParams.get("tab"));

  return (
    <>
      {projectTabs.filter((t) => t.id !== "submissions").map((t) => (
        <NavLink
          key={t.id}
          href={projectTabHref(t.id)}
          label={t.label}
          icon={tabIcons[t.id] ?? ClipboardList}
          active={onProject && activeTab === t.id}
          small
        />
      ))}
    </>
  );
}

/** Same links with nothing highlighted; shown for a split second while the real ones load. */
function ProjectLinksFallback() {
  return (
    <>
      {projectTabs.filter((t) => t.id !== "submissions").map((t) => (
        <NavLink
          key={t.id}
          href={projectTabHref(t.id)}
          label={t.label}
          icon={tabIcons[t.id] ?? ClipboardList}
          active={false}
          small
        />
      ))}
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { stage } = useStage();

  return (
    <aside className="scrollbar-sidebar sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-primary text-primary-foreground border-r border-white/10 shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg font-bold text-secondary-foreground shadow-md">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">pulse.</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">Workspace</span>
        </div>
        <ThemeToggle className="ml-auto" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3.5">
        <div className="px-3 pb-1 pt-1 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
          Menu
        </div>

        <NavLink href="/dashboard" label="Dashboard" icon={LayoutDashboard} active={pathname === "/dashboard"} />

        {stage === 1 && (
          <NavLink href="/teams" label="Find Teams" icon={Search} active={pathname.startsWith("/teams")} />
        )}

        {stage >= 2 ? (
          <NavLink href="/my-team" label="My Team" icon={Users} active={pathname.startsWith("/my-team")} />
        ) : (
          <LockedRow label="My Team" icon={Users} hint="Join a team first" />
        )}

        {stage >= 3 ? (
          <div className="pt-1">
            <div className={`${row} text-white bg-white/5 border border-white/5`}>
              <FolderKanban size={18} className="text-secondary" />
              <span className="font-semibold">Project</span>
            </div>
            <div className="ml-3 mt-1.5 space-y-1 border-l-2 border-white/15 pl-2.5 py-1">
              <Suspense fallback={<ProjectLinksFallback />}>
                <ProjectLinks />
              </Suspense>
            </div>
          </div>
        ) : (
          <LockedRow
            label="Project"
            icon={FolderKanban}
            hint={stage === 1 ? "Join a team first" : "Create your project first"}
          />
        )}

        <div className="pt-2">
          <NavLink href="/profile" label="Profile" icon={User} active={pathname.startsWith("/profile")} />
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-white/15 bg-black/10 p-3.5 space-y-2">
        <Link
          href="/supervisor"
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/20 px-3 py-2.5 text-center text-xs font-semibold text-white/90 transition-all duration-200 hover:bg-white/15 hover:border-white/30"
        >
          <ArrowRightLeft size={14} className="text-secondary" />
          Switch to supervisor view
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-secondary-foreground transition-all duration-200 hover:opacity-90 shadow-sm"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}