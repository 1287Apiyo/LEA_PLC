"use client";

import { useState, type ReactNode } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CommandPalette } from "@/components/shared/command-palette";
import { NotificationsPopover } from "@/components/shared/notifications-popover";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { APP_NAME } from "@/lib/constants";
import type { Role } from "@/types/auth";

interface AppShellProps {
  role: Role;
  children: ReactNode;
}

function Brand() {
  return (
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
    </div>
  );
}

/**
 * Protected app shell — sidebar (desktop + mobile sheet), topbar with
 * breadcrumbs, command palette, notifications, theme toggle and user menu.
 */
export function AppShell({ role, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background lg:flex">
        <Brand />
        <SidebarNav role={role} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <Brand />
            <SidebarNav role={role} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </Button>
          <div className="hidden sm:block">
            <Breadcrumbs role={role} />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <CommandPalette role={role} />
            <NotificationsPopover />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="w-full flex-1 px-4 py-6 sm:px-5">
          {children}
        </main>
      </div>
    </div>
  );
}
