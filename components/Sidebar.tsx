"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Contact,
  Briefcase,
  Kanban,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Лиды", icon: UserPlus },
  { href: "/contacts", label: "Контакты", icon: Contact },
  { href: "/accounts", label: "Компании", icon: Building2 },
  { href: "/opportunities", label: "Сделки", icon: Briefcase },
  { href: "/opportunities/pipeline", label: "Воронка", icon: Kanban },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/opportunities/pipeline") {
    return pathname === "/opportunities/pipeline";
  }
  if (href === "/opportunities") {
    if (pathname === "/opportunities") return true;
    if (pathname.startsWith("/opportunities/pipeline")) return false;
    return pathname.startsWith("/opportunities/");
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-[var(--color-border)] flex flex-col min-h-screen shrink-0">
      <div className="h-14 px-5 border-b border-[var(--color-border)] flex items-center shrink-0">
        <Link href="/leads" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-zinc-900">CRM-lite</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
