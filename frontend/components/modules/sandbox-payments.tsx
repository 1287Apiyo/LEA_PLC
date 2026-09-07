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

  // Single sync function — used on mount, on storage events, and directly after mutations
  const sync = () => setPayments(getSimulatedPayments());

  useEffect(() => {
    sync();
    window.addEventListener("lea-sandbox-payments-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lea-sandbox-payments-updated", sync);
      window.removeEventListener("storage", sync);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => ({
    paid:    payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").length,
    mpesa:   payments.filter((p) => p.method === "mpesa").length,
    cash:    payments.filter((p) => p.method === "cash").length,
  }), [payments]);

  const confirmCash = (payment: SimulatedPayment) => {
    updateSimulatedPayment(payment.id, {
      status: "paid",
      receipt: `CASH-${Date.now().toString(36).toUpperCase()}`,
      paidAt: new Date().toISOString(),
      note: "Cash confirmed by administrator",
    });
    // Re-read immediately — don't wait for the event to propagate
    sync();
  };

  return (
    <Card className="border-[#4d176e]/15">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <WalletCards className="h-4 w-4 text-[#4d176e]" aria-hidden />
            Sandbox payment monitor
          </CardTitle>
          <p className="mt-1 text-xs text-[#6e6072]">{SANDBOX_PAYMENT_LABEL}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={sync}>
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => { clearSimulatedPayments(); sync(); }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary chips */}
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Paid value",  value: formatPaymentAmount(summary.paid) },
            { label: "Pending",     value: String(summary.pending) },
            { label: "M-Pesa",      value: String(summary.mpesa) },
            { label: "Cash",        value: String(summary.cash) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-[#fbf8fd] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e6072]">{label}</p>
              <p className="mt-1 text-lg font-bold text-[#351039]">{value}</p>
            </div>
          ))}
        </div>

        {payments.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#d9cbdc] p-6 text-center text-sm text-[#6e6072]">
            No sandbox payments yet. Start a checkout from the learner portal to create one.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#eadfe9]">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="bg-[#fbf8fd] text-[10px] uppercase tracking-[0.12em] text-[#6e6072]">
                <tr>
                  <th className="px-3 py-3 font-bold">Reference</th>
                  <th className="px-3 py-3 font-bold">Learner</th>
                  <th className="px-3 py-3 font-bold">Programme / course</th>
                  <th className="px-3 py-3 font-bold">Method</th>
                  <th className="px-3 py-3 font-bold">Amount</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-3 py-3 font-bold">Date</th>
                  <th className="px-3 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eee5f1]">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    {/* Reference + receipt */}
                    <td className="px-3 py-3">
                      <div className="font-semibold text-[#351039]">{payment.id}</div>
                      <div className="mt-0.5 text-[#6e6072]">{payment.receipt ?? "No receipt yet"}</div>
                    </td>

                    {/* Learner — name with phone fallback */}
                    <td className="px-3 py-3">
                      <div className="font-semibold text-[#17131a]">
                        {payment.learner && payment.learner !== "Unnamed learner"
                          ? payment.learner
                          : <span className="italic text-[#6e6072]">Unknown learner</span>}
                      </div>
                      {payment.phone ? (
                        <div className="mt-0.5 text-[#6e6072]">{payment.phone}</div>
                      ) : null}
                    </td>

                    {/* Programme + course — this is what was missing */}
                    <td className="px-3 py-3">
                      <div className="font-semibold text-[#17131a]">{payment.programme || "—"}</div>
                      <div className="mt-0.5 text-[#6e6072]">{payment.courseTitle}</div>
                    </td>

                    {/* Method */}
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#351039]">
                        {payment.method === "mpesa"
                          ? <Smartphone className="h-3.5 w-3.5 text-[#4d176e]" aria-hidden />
                          : <WalletCards className="h-3.5 w-3.5 text-[#4d176e]" aria-hidden />}
                        {payment.method === "mpesa" ? "M-Pesa" : "Cash"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-3 py-3 font-bold text-[#4d176e]">
                      {formatPaymentAmount(payment.amount)}
                    </td>

                    {/* Status badge */}
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 font-semibold capitalize ${statusClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>

                    {/* Date — show paidAt for confirmed, createdAt for pending */}
                    <td className="px-3 py-3 text-[#6e6072]">
                      {formatPaymentDate(payment.paidAt ?? payment.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-3 py-3">
                      {payment.method === "cash" && payment.status === "pending" ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => confirmCash(payment)}
                          className="gap-1 bg-[#4d176e] text-white hover:bg-[#351039]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          Confirm cash
                        </Button>
                      ) : (
                        <span className="text-[#6e6072]">{payment.note ?? "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SandboxPayments;
