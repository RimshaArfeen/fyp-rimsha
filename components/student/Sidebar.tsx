"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Search,
  Users,
  FolderKanban,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/teams", label: "Find Teams", icon: Search },
  { href: "/my-team", label: "My Team", icon: Users },
  { href: "/project", label: "Project", icon: FolderKanban },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-primary text-primary-foreground flex md:flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-2 md:mb-6">
        <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center font-bold">
          P
        </div>
        <span className="font-semibold text-lg">pulse.</span>
      </div>

      <nav className="flex md:flex-col gap-1 flex-1 overflow-x-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all hover:translate-x-1 ${
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-hover"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/login"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-foreground/80 hover:bg-primary-hover transition whitespace-nowrap"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Link>
    </aside>
  );
}
