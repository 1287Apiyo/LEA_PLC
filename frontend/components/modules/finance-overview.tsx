"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, FileText, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CrudTable } from "@/components/shared/crud-table";
import { currency, date, statusCell, typeCell } from "@/lib/table-registry";
import { resourceService, type ResourceRow } from "@/services/resources";

function column(id: string, header: string, cell?: (v: unknown, row: ResourceRow) => React.ReactNode): ColumnDef<ResourceRow> {
  return {
    accessorKey: id,
    header,
    cell: ({ getValue, row }) =>
      cell ? cell(getValue(), row.original) : String(getValue() ?? "—"),
  };
}

const PAYMENT_COLUMNS = [
  column("id", "Reference", (v) => <span className="font-medium">{String(v)}</span>),
  column("learner", "Payer"),
  column("amount", "Amount", (v) => currency(v)),
  column("method", "Method", (v) => typeCell(v)),
  column("purpose", "Purpose", (v) => typeCell(v)),
  column("paid_at", "Date", (v) => date(v)),
  column("status", "Status", (v) => statusCell(v)),
];

const INVOICE_COLUMNS = [
  column("number", "Invoice", (v) => <span className="font-medium">{String(v)}</span>),
  column("client", "Client"),
  column("amount", "Amount", (v) => currency(v)),
  column("items", "Line items", (v) => String(v)),
  column("issued_at", "Issued", (v) => date(v)),
  column("due_at", "Due", (v) => date(v)),
  column("status", "Status", (v) => statusCell(v)),
];

const EXPENSE_COLUMNS = [
  column("category", "Category", (v) => typeCell(v)),
  column("description", "Description"),
  column("amount", "Amount", (v) => currency(v)),
  column("incurred_at", "Date", (v) => date(v)),
  column("paid_by", "Paid by"),
  column("status", "Status", (v) => statusCell(v)),
];

/** Finance overview — summary cards + payments, invoices and expenses tabs. */
export function FinanceOverview() {
  const payments = useQuery({
    queryKey: ["finance", "payments"],
    queryFn: () => resourceService.list("payments", { per_page: 100 }),
  });
  const invoices = useQuery({
    queryKey: ["finance", "invoices"],
    queryFn: () => resourceService.list("invoices", { per_page: 100 }),
  });
  const expenses = useQuery({
    queryKey: ["finance", "expenses"],
    queryFn: () => resourceService.list("expenses", { per_page: 100 }),
  });

  const revenueThisMonth = (payments.data?.data ?? [])
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const outstanding = (invoices.data?.data ?? [])
    .filter((row) => ["outstanding", "overdue"].includes(String(row.status)))
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const expensesTotal = (expenses.data?.data ?? [])
    .filter((row) => row.status === "approved")
    .reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description="Payments, invoices and expenses — M-Pesa, Stripe and bank."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label="Revenue (paid)"
          value={currency(revenueThisMonth)}
          hint="recorded payments"
        />
        <StatCard
          icon={FileText}
          label="Outstanding invoices"
          value={currency(outstanding)}
          hint="due or overdue"
        />
        <StatCard
          icon={Wallet}
          label="Approved expenses"
          value={currency(expensesTotal)}
          hint="this period"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="payments">
            <TabsList className="m-4">
              <TabsTrigger value="payments" className="gap-1.5">
                <CreditCard className="h-3.5 w-3.5" aria-hidden />
                Payments
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="expenses" className="gap-1.5">
                <ReceiptText className="h-3.5 w-3.5" aria-hidden />
                Expenses
              </TabsTrigger>
            </TabsList>
            <div className="border-t">
              <TabsContent value="payments" className="mt-0">
                <CrudTable
                  resource="payments"
                  columns={PAYMENT_COLUMNS}
                  searchPlaceholder="Search payments…"
                  title="Payment"
                  plural="Payments"
                />
              </TabsContent>
              <TabsContent value="invoices" className="mt-0">
                <CrudTable
                  resource="invoices"
                  columns={INVOICE_COLUMNS}
                  searchPlaceholder="Search invoices…"
                  title="Invoice"
                  plural="Invoices"
                />
              </TabsContent>
              <TabsContent value="expenses" className="mt-0">
                <CrudTable
                  resource="expenses"
                  columns={EXPENSE_COLUMNS}
                  searchPlaceholder="Search expenses…"
                  title="Expense"
                  plural="Expenses"
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
