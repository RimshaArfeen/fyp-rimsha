"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Search, Users, FolderKanban, ClipboardList,
  Flag, MessageSquare, MessagesSquare, FileUp, User, Lock,
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

const row = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

function NavLink({ href, label, icon: Icon, active, small }: {
  href: string; label: string; icon: LucideIcon; active: boolean; small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${row} ${active ? "bg-black/20 text-white" : "text-white/70 hover:bg-white/10"}`}
    >
      <Icon size={small ? 16 : 18} />
      {label}
    </Link>
  );
}

function LockedRow({ label, icon: Icon, hint }: { label: string; icon: LucideIcon; hint: string }) {
  return (
    <div title={hint} className={`${row} cursor-not-allowed opacity-50`}>
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      <Lock size={14} />
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { stage, setStage } = useStage();

  const onProject = pathname.startsWith("/project");
  const activeTab = parseProjectTab(searchParams.get("tab"));

  return (
    <aside className="scrollbar-sidebar sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-primary text-primary-foreground">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-secondary-foreground">
          P
        </div>
        <span className="text-lg font-semibold">pulse.</span>
        <ThemeToggle className="ml-auto" />
      </div>

      <nav className="flex-1 space-y-1 p-3">
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
          <div>
            <div className={`${row} text-white`}>
              <FolderKanban size={18} />
              <span>Project</span>
            </div>
            <div className="ml-5 space-y-1 border-l border-white/10 pl-3">
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
            </div>
          </div>
        ) : (
          <LockedRow
            label="Project"
            icon={FolderKanban}
            hint={stage === 1 ? "Join a team first" : "Create your project first"}
          />
        )}

        <NavLink href="/profile" label="Profile" icon={User} active={pathname.startsWith("/profile")} />
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/supervisor"
          className="mb-2 block w-full rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
        >
          Switch to supervisor view
        </Link>
        <button
          onClick={() => {
            setStage(1);
            router.push("/dashboard");
          }}
          className="w-full rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary-hover"
        >
          Reset demo
        </button>
      </div>
    </aside>
  );
}