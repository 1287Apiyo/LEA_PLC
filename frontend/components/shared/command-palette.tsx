"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { NAV } from "@/components/shared/nav-config";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types/auth";

interface CommandPaletteProps {
  role: Role;
}

/** ⌘K command palette — navigation grouped by section + quick actions. */
export function CommandPalette({ role }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // All nav sections for the current role — memoised to avoid re-building on renders
  const sections = useMemo(() => NAV[role], [role]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Desktop search bar */}
      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground sm:flex"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
        <span className="text-xs">Search…</span>
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>

      {/* Mobile icon button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" aria-hidden />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`Search ${ROLE_LABELS[role]} workspace…`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* One CommandGroup per nav section so results are properly labelled */}
          {sections.map((section, sectionIndex) => (
            <div key={section.title ?? sectionIndex}>
              <CommandGroup heading={section.title ?? "Navigate"}>
                {section.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    // value drives the search filter — include href keywords for better matching
                    value={`${item.title} ${item.href.replace(/\//g, " ")}`}
                    onSelect={() => go(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" aria-hidden />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {sectionIndex < sections.length - 1 && <CommandSeparator />}
            </div>
          ))}

          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="profile settings" onSelect={() => go("/settings/profile")}>
              <span>Profile settings</span>
            </CommandItem>
            <CommandItem value="sign out logout" onSelect={() => go("/logout")}>
              <span>Sign out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
