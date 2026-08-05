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
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV[role].map((section, index) => (
        <div key={index}>
          {section.title ? (
            <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
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
