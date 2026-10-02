"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Search,
  Users,
  FolderKanban,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const primaryLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/teams", label: "Find Teams", icon: Search },
  { href: "/my-team", label: "My Team", icon: Users },
  { href: "/project", label: "Project", icon: FolderKanban },
];

const secondaryLinks = [
  { href: "/login", label: "Logout", icon: LogOut },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const renderLink = (link, { isSecondary = false } = {}) => {
    const active = pathname === link.href;
    const Icon = link.icon;

    return (
      <li key={link.href}>
        <Link
          href={link.href}
          aria-current={active ? "page" : undefined}
          title={collapsed ? link.label : undefined}
          className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
            transition-colors duration-150
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
            ${active
              ? "bg-primary-hover text-primary-foreground"
              : "text-primary-foreground/75 hover:bg-primary-hover hover:text-primary-foreground"
            }
            ${isSecondary ? "text-primary-foreground/70" : ""}
            ${collapsed ? "md:justify-center md:px-2" : ""}
          `}
        >
          {/* Active rail indicator */}
          <span
            aria-hidden="true"
            className={`absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-secondary
              transition-opacity duration-150
              ${active ? "opacity-100" : "opacity-0 group-hover:opacity-40"}
            `}
          />

          <Icon
            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-150
              ${active ? "" : "group-hover:scale-110"}
            `}
            aria-hidden="true"
          />

          <span
            className={`truncate transition-opacity duration-150
              ${collapsed ? "md:hidden" : "md:inline"}
            `}
          >
            {link.label}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      aria-label="Primary"
      className={`w-full md:h-screen md:shrink-0
    flex md:flex-col gap-4 p-4 md:p-5
    bg-primary text-primary-foreground
    md:overflow-y-auto md:overscroll-contain
    transition-[width] duration-200
    ${collapsed ? "md:w-20" : "md:w-64"}
  `}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 md:mb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary font-bold text-secondary-foreground">
            P
          </span>
          <span
            className={`font-semibold text-lg tracking-tight
              ${collapsed ? "md:hidden" : "md:inline"}
            `}
          >
            pulse.
          </span>
        </Link>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="ml-auto hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md
            text-primary-foreground/70 hover:bg-primary-hover hover:text-primary-foreground
            transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-px w-full bg-primary-foreground/10" />

      {/* Primary nav */}
      <nav aria-label="Workspace" className="flex md:flex-col gap-1 flex-1 overflow-x-auto md:overflow-visible">
        {/* Section label — desktop only */}
        <p
          className={`hidden md:block px-3 pt-1 pb-2 text-[11px] uppercase tracking-wider text-primary-foreground/50
            ${collapsed ? "md:hidden" : ""}
          `}
        >
          Workspace
        </p>
        <ul className="flex md:flex-col gap-1 min-w-max md:min-w-0">
          {primaryLinks.map((l) => renderLink(l))}
        </ul>
      </nav>

      {/* Footer — secondary nav */}
      <div className="hidden md:block h-px w-full bg-primary-foreground/10" />
      <nav aria-label="Account" className="md:mt-0">
        <p
          className={`hidden md:block px-3 pb-2 text-[11px] uppercase tracking-wider text-primary-foreground/50
            ${collapsed ? "md:hidden" : ""}
          `}
        >
          Account
        </p>
        <ul className="flex md:flex-col gap-1">
          {secondaryLinks.map((l) => renderLink(l, { isSecondary: true }))}
        </ul>
      </nav>
    </aside>
  );
}