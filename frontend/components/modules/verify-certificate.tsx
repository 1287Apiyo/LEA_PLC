"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";

interface CertificateVerification {
  certificate_id: string;
  learner_name: string;
  course_title: string;
  programme_title: string;
  issued_at: string | null;
  status: string;
  verification_code: string;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en", { dateStyle: "long" });
}

export function VerifyCertificate({ code }: { code: string }) {
  const query = useQuery({ queryKey: ["certificate-verification", code], queryFn: () => api.get<{ data: CertificateVerification }>(`/verify/${encodeURIComponent(code)}`) });
  if (query.isLoading) return <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16"><Card className="w-full"><CardContent className="p-10 text-center text-sm text-muted-foreground">Checking certificate…</CardContent></Card></main>;
  if (query.isError || !query.data?.data) return <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16"><Card className="w-full border-red-200"><CardContent className="p-10 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-red-500" aria-hidden /><h1 className="mt-4 text-xl font-semibold">Certificate not found</h1><p className="mt-2 text-sm text-muted-foreground">The verification code does not match an issued LEA Labs certificate.</p></CardContent></Card></main>;
  const certificate = query.data.data;
  return <main className="min-h-screen bg-[#fffaf7] px-6 py-16"><div className="mx-auto max-w-3xl"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f47945]">LEA LABS</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1f0d2e]">Certificate verification</h1><p className="mt-2 text-muted-foreground">A public record for confirming an LEA Labs learning achievement.</p></div><Card className="overflow-hidden border-[#f47945]/30"><div className="h-2 bg-[#f47945]" /><CardHeader><div className="flex flex-wrap items-start justify-between gap-4"><div><CardTitle className="text-2xl">{certificate.course_title}</CardTitle><p className="mt-2 text-sm text-muted-foreground">{certificate.programme_title}</p></div><Badge className="bg-emerald-600 text-white"><CheckCircle2 className="mr-1 h-3.5 w-3.5" />{certificate.status}</Badge></div></CardHeader><CardContent className="grid gap-5 border-t pt-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Learner</p><p className="mt-1 font-medium">{certificate.learner_name}</p></div><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Issued</p><p className="mt-1 font-medium">{formatDate(certificate.issued_at)}</p></div><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Certificate ID</p><p className="mt-1 font-mono text-sm">{certificate.certificate_id}</p></div><div><p className="text-xs uppercase tracking-wide text-muted-foreground">Verification code</p><p className="mt-1 font-mono text-sm">{certificate.verification_code}</p></div></CardContent></Card></div></main>;
}
