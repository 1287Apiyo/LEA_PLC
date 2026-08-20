"use client";

import { Bell, Check, ExternalLink } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

interface NotificationRow {
  id: string;
  title: string;
  description: string;
  kind: "reminder" | "feedback" | "tutor" | "message";
  href: string;
  created_at: string;
  read: boolean;
}

interface NotificationResponse {
  data: NotificationRow[];
  unread: number;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString("en", { dateStyle: "medium" });
}

export function LearnerNotifications() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["learner-notifications"], queryFn: () => api.get<NotificationResponse>("/learner/notifications") });
  const markRead = useMutation({
    mutationFn: (notificationId: string) => api.post("/learner/notifications", { notificationId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["learner-notifications"] }),
  });
  const rows = query.data?.data ?? [];

  return <div className="space-y-6"><PageHeader title="Notifications" description="Keep up with assignments, feedback, tutor updates, and the next useful action in your learning path." /><Card><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-base"><span className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#f47945]" aria-hidden /> Learning updates</span><Badge variant={query.data?.unread ? "default" : "outline"}>{query.data?.unread ?? 0} unread</Badge></CardTitle></CardHeader><CardContent className="divide-y p-0">{query.isLoading ? <p className="p-8 text-sm text-muted-foreground">Loading notifications…</p> : rows.length ? rows.map((row) => <article key={row.id} className={`flex flex-wrap items-start justify-between gap-4 p-5 ${row.read ? "opacity-70" : "bg-[#fffaf7]"}`}><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-medium">{row.title}</h2>{!row.read ? <Badge className="bg-[#f47945] text-white">New</Badge> : null}<Badge variant="outline" className="capitalize">{row.kind}</Badge></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{row.description}</p><p className="mt-2 text-xs text-muted-foreground">{formatDate(row.created_at)}</p></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" asChild><a href={row.href}><ExternalLink className="mr-1 h-3.5 w-3.5" />Open</a></Button>{!row.read ? <Button variant="ghost" size="sm" onClick={() => markRead.mutate(row.id)} disabled={markRead.isPending}><Check className="mr-1 h-3.5 w-3.5" />Mark read</Button> : null}</div></article>) : <div className="p-10 text-center"><Bell className="mx-auto h-8 w-8 text-[#f47945]" aria-hidden /><p className="mt-3 font-medium">You are all caught up</p><p className="mt-1 text-sm text-muted-foreground">New reminders, feedback, and tutor updates will appear here.</p></div>}</CardContent></Card></div>;
}
