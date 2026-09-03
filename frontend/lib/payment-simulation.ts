export type SimulatedPaymentMethod = "mpesa" | "cash";
export type SimulatedPaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type SimulatedPayment = {
  id: string;
  learner: string;
  courseId: string;
  courseTitle: string;
  programme: string;
  amount: number;
  method: SimulatedPaymentMethod;
  status: SimulatedPaymentStatus;
  phone?: string;
  receipt?: string;
  createdAt: string;
  paidAt?: string;
  source: "sandbox";
  note?: string;
};

const STORAGE_KEY = "lea-sandbox-payments";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getSimulatedPayments(): SimulatedPayment[] {
  if (!canUseStorage()) return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SimulatedPayment[]) : [];
  } catch {
    return [];
  }
}

export function saveSimulatedPayments(payments: SimulatedPayment[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  window.dispatchEvent(new CustomEvent("lea-sandbox-payments-updated"));
}

export function createSimulatedPayment(input: Omit<SimulatedPayment, "id" | "createdAt" | "source">) {
  const payment: SimulatedPayment = {
    ...input,
    id: `SANDBOX-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    source: "sandbox",
  };
  saveSimulatedPayments([payment, ...getSimulatedPayments()]);
  return payment;
}

export function updateSimulatedPayment(id: string, patch: Partial<SimulatedPayment>) {
  const payments = getSimulatedPayments().map((payment) =>
    payment.id === id ? { ...payment, ...patch } : payment,
  );
  saveSimulatedPayments(payments);
  return payments.find((payment) => payment.id === id) ?? null;
}

export function clearSimulatedPayments() {
  saveSimulatedPayments([]);
}

export const SANDBOX_PAYMENT_LABEL = "Sandbox simulation — no real money is moved";

export function formatPaymentDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function formatPaymentAmount(value: number) {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);
}
