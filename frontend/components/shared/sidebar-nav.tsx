"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/components/shared/nav-config";
import type { Role } from "@/types/auth";
import { cn } from "@/lib/utils";

/** Role-aware sidebar navigation. Used by both the desktop sidebar and mobile sheet. */
export function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-scroll flex-1 space-y-5 overflow-y-auto px-3 py-3">
      {NAV[role].map((section, index) => (
        <div key={index}>
          {section.title ? (
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-white/80">
              {section.title}
            </p>
          ) : null}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                      />
                    ) : null}
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
