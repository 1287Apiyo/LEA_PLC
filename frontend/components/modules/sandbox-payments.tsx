"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Smartphone, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearSimulatedPayments,
  formatPaymentAmount,
  formatPaymentDate,
  getSimulatedPayments,
  SANDBOX_PAYMENT_LABEL,
  updateSimulatedPayment,
  type SimulatedPayment,
} from "@/lib/payment-simulation";

function statusClass(status: SimulatedPayment["status"]) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700";
  if (status === "failed" || status === "cancelled") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export function SandboxPayments() {
  const [payments, setPayments] = useState<SimulatedPayment[]>([]);

  useEffect(() => {
    const sync = () => setPayments(getSimulatedPayments());
    sync();
    window.addEventListener("lea-sandbox-payments-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lea-sandbox-payments-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const summary = useMemo(() => ({
    paid: payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0),
    pending: payments.filter((payment) => payment.status === "pending").length,
    mpesa: payments.filter((payment) => payment.method === "mpesa").length,
    cash: payments.filter((payment) => payment.method === "cash").length,
  }), [payments]);

  const confirmCash = (payment: SimulatedPayment) => {
    updateSimulatedPayment(payment.id, {
      status: "paid",
      receipt: `CASH-${Date.now().toString(36).toUpperCase()}`,
      paidAt: new Date().toISOString(),
      note: "Sandbox cash payment confirmed by administrator",
    });
  };

  return (
    <Card className="border-[#4d176e]/15">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base"><WalletCards className="h-4 w-4 text-[#4d176e]" aria-hidden />Sandbox payment monitor</CardTitle>
          <p className="mt-1 text-xs text-[#6e6072]">{SANDBOX_PAYMENT_LABEL}</p>
        </div>
        <div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setPayments(getSimulatedPayments())}>Refresh</Button><Button type="button" variant="outline" size="sm" onClick={() => { clearSimulatedPayments(); setPayments([]); }} className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" aria-hidden />Reset</Button></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-[#fbf8fd] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e6072]">Paid value</p><p className="mt-1 text-lg font-bold text-[#4d176e]">{formatPaymentAmount(summary.paid)}</p></div>
          <div className="rounded-lg bg-[#fbf8fd] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e6072]">Pending</p><p className="mt-1 text-lg font-bold text-[#351039]">{summary.pending}</p></div>
          <div className="rounded-lg bg-[#fbf8fd] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e6072]">M-Pesa</p><p className="mt-1 text-lg font-bold text-[#351039]">{summary.mpesa}</p></div>
          <div className="rounded-lg bg-[#fbf8fd] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e6072]">Cash</p><p className="mt-1 text-lg font-bold text-[#351039]">{summary.cash}</p></div>
        </div>
        {payments.length === 0 ? <p className="rounded-lg border border-dashed border-[#d9cbdc] p-6 text-center text-sm text-[#6e6072]">No sandbox payments yet. Start a checkout from the learner portal to create one.</p> : <div className="overflow-x-auto rounded-lg border border-[#eadfe9]"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[#fbf8fd] text-[10px] uppercase tracking-[0.12em] text-[#6e6072]"><tr><th className="px-3 py-3 font-bold">Reference</th><th className="px-3 py-3 font-bold">Learner / course</th><th className="px-3 py-3 font-bold">Method</th><th className="px-3 py-3 font-bold">Amount</th><th className="px-3 py-3 font-bold">Status</th><th className="px-3 py-3 font-bold">Date</th><th className="px-3 py-3 font-bold">Action</th></tr></thead><tbody className="divide-y divide-[#eee5f1]">{payments.map((payment) => <tr key={payment.id}><td className="px-3 py-3 font-semibold text-[#351039]">{payment.id}<div className="mt-1 font-normal text-[#6e6072]">{payment.receipt ?? "No receipt yet"}</div></td><td className="px-3 py-3 text-[#17131a]"><div className="font-semibold">{payment.learner}</div><div className="mt-1 text-[#6e6072]">{payment.courseTitle}</div></td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 font-semibold text-[#351039]">{payment.method === "mpesa" ? <Smartphone className="h-3.5 w-3.5 text-[#4d176e]" aria-hidden /> : <WalletCards className="h-3.5 w-3.5 text-[#4d176e]" aria-hidden />}{payment.method === "mpesa" ? "M-Pesa" : "Cash"}</span>{payment.phone ? <div className="mt-1 text-[#6e6072]">{payment.phone}</div> : null}</td><td className="px-3 py-3 font-bold text-[#4d176e]">{formatPaymentAmount(payment.amount)}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 font-semibold capitalize ${statusClass(payment.status)}`}>{payment.status}</span></td><td className="px-3 py-3 text-[#6e6072]">{formatPaymentDate(payment.paidAt ?? payment.createdAt)}</td><td className="px-3 py-3">{payment.method === "cash" && payment.status === "pending" ? <Button type="button" size="sm" onClick={() => confirmCash(payment)} className="gap-1 bg-[#4d176e] text-white hover:bg-[#351039]"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden />Confirm cash</Button> : <span className="text-[#6e6072]">{payment.note ?? "—"}</span>}</td></tr>)}</tbody></table></div>}
      </CardContent>
    </Card>
  );
}

export default SandboxPayments;
