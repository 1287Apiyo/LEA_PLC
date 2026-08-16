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
import { flattenNav } from "@/components/shared/nav-config";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types/auth";

interface CommandPaletteProps {
  role: Role;
}

/** ⌘K command palette — navigation + quick actions. */
export function CommandPalette({ role }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const items = useMemo(() => flattenNav(role), [role]);

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
          <CommandGroup heading="Navigate">
            {items.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="mr-2 h-4 w-4" aria-hidden />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => go(`/settings/profile`)}>
              <span>Profile settings</span>
            </CommandItem>
            <CommandItem onSelect={() => go("/logout")}>
              <span>Sign out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
