"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Flag, GraduationCap } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const row = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: LucideIcon; active: boolean }) {
  return (
    <Link
      href={href}
      className={`${row} ${active ? "bg-black/20 text-white" : "text-white/70 hover:bg-white/10"}`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

export default function SupervisorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="scrollbar-sidebar sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-primary text-primary-foreground">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-secondary-foreground">
          P
        </div>
        <div>
          <p className="text-lg font-semibold leading-none">pulse.</p>
          <p className="mt-1 text-xs text-white/60">Supervisor</p>
        </div>
        <ThemeToggle className="ml-auto" />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <NavLink href="/supervisor" label="Dashboard" icon={LayoutDashboard} active={pathname === "/supervisor"} />
        <NavLink
          href="/supervisor/milestones"
          label="Milestones"
          icon={Flag}
          active={pathname.startsWith("/supervisor/milestones")}
        />
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary-hover"
        >
          <GraduationCap size={16} /> Switch to student view
        </Link>
      </div>
    </aside>
  );
}