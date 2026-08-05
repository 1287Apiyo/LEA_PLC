import { FinanceOverview } from "@/components/modules/finance-overview";

export const metadata = { title: "Finance" };

/** Finance — payments, invoices and expenses with live summary. */
export default function FinancePage() {
  return <FinanceOverview />;
}
