"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { notificationService } from "@/services/notifications";

/** Notifications bell — unread badge + scrollable list with mark-read actions. */
export function NotificationsPopover() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.list(),
    staleTime: 30 * 1000,
  });

  const notifications = data?.data ?? [];
  const unread = data?.unread_count ?? 0;

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          {unread > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden />
              Mark all read
            </Button>
          ) : null}
        </div>
        <Separator />
        <ScrollArea className="h-72">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading…</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={
                    notification.read_at
                      ? "flex gap-3 px-4 py-3"
                      : "flex gap-3 bg-primary/5 px-4 py-3"
                  }
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate text-sm font-medium">
                      {notification.title}
                    </p>
                    {notification.body ? (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {notification.body}
                      </p>
                    ) : null}
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read_at ? (
                    <Badge variant="secondary" className="h-5 shrink-0 text-[10px]">
                      New
                    </Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
