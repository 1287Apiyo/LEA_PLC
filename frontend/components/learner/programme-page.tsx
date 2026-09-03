"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Download,
  PlayCircle,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { courseService, type CourseCatalogItem } from "@/services/courses";
import { getProgramme } from "@/lib/programmes";
import {
  createSimulatedPayment,
  updateSimulatedPayment,
  type SimulatedPayment,
  type SimulatedPaymentMethod,
} from "@/lib/payment-simulation";

const MODULE_ACCENTS = ["#f47945", "#6f3b8d", "#248c7b", "#d97706"];

const formatMinutes = (total: number) => {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

function matchesProgramme(course: CourseCatalogItem, programme: NonNullable<ReturnType<typeof getProgramme>>) {
  return programme.catalogueKeys?.includes(course.programme_id) || course.programme.toLowerCase() === programme.title.toLowerCase();
}

export function LearnerProgrammePage({ slug }: { slug: string }) {
  const programme = getProgramme(slug);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [simulatedEnrollmentIds, setSimulatedEnrollmentIds] = useState<string[]>([]);
  const [checkoutCourse, setCheckoutCourse] = useState<CourseCatalogItem | null>(null);
  const [learnerName, setLearnerName] = useState("Demo learner");
  const [paymentMethod, setPaymentMethod] = useState<SimulatedPaymentMethod>("mpesa");
  const [phone, setPhone] = useState("2547");
  const [activePayment, setActivePayment] = useState<SimulatedPayment | null>(null);

  const coursesQuery = useQuery({
    queryKey: ["learner-programme", slug],
    queryFn: () => courseService.catalog(),
    enabled: Boolean(programme),
  });

  const courses = useMemo(
    () => (coursesQuery.data?.data ?? []).filter((course) => programme && matchesProgramme(course, programme)).sort((a, b) => a.sequence - b.sequence),
    [coursesQuery.data?.data, programme]
  );

  const startCheckout = (course: CourseCatalogItem) => {
    setCheckoutCourse(course);
    setPaymentMethod("mpesa");
    setLearnerName("Demo learner");
    setPhone("2547");
    setActivePayment(null);
  };

  const startPaymentSimulation = () => {
    if (!checkoutCourse) return;
    const amount = Number(programme?.price.replace(/[^0-9]/g, "")) || 0;
    const payment = createSimulatedPayment({
      learner: learnerName.trim() || "Unnamed learner",
      courseId: checkoutCourse.id,
      courseTitle: checkoutCourse.title,
      programme: programme?.title ?? "Programme",
      amount,
      method: paymentMethod,
      status: "pending",
      phone: paymentMethod === "mpesa" ? phone : undefined,
      note: paymentMethod === "cash" ? "Awaiting administrator confirmation" : "Awaiting simulated STK response",
    });
    setActivePayment(payment);
  };

  const finishPaymentSimulation = (status: "paid" | "failed" | "cancelled") => {
    if (!activePayment || !checkoutCourse) return;
    const updated = updateSimulatedPayment(activePayment.id, {
      status,
      receipt: status === "paid" ? `SIM-${Date.now().toString(36).toUpperCase()}` : undefined,
      paidAt: status === "paid" ? new Date().toISOString() : undefined,
      note: status === "paid" ? "Sandbox payment confirmed" : `Sandbox payment ${status}`,
    });
    setActivePayment(updated);
    if (status === "paid") {
      setSimulatedEnrollmentIds((current) => current.includes(checkoutCourse.id) ? current : [...current, checkoutCourse.id]);
      toast.success("Sandbox payment confirmed — demo access activated.");
      setCheckoutCourse(null);
    } else {
      toast.error(`Sandbox payment ${status}. No money was moved.`);
    }
  };


  if (!programme) return null;

  const totalLessons = courses.reduce((sum, course) => sum + course.lessons_count, 0);
  const enrolledCount = courses.filter((course) => course.enrolled || simulatedEnrollmentIds.includes(course.id)).length;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title={programme.title}
        description={programme.short}
        actions={
          <Button asChild variant="outline" className="rounded-md border-[#4d176e]/25 bg-white hover:border-[#f47945] hover:bg-[#fff7f2]">
            <Link href="/learner/courses"><ArrowLeft className="mr-1.5 h-4 w-4" /> All programmes</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#eadfe9] py-3 text-xs font-medium text-[#6e6072]">
        <span><strong className="text-[#4d176e]">{courses.length}</strong> courses</span>
        <span><strong className="text-[#4d176e]">{totalLessons}</strong> lessons</span>
        <span><strong className="text-[#4d176e]">{programme.duration}</strong></span>
        <span><strong className="text-[#4d176e]">{enrolledCount}</strong> active</span>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b94920]">Course sequence</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#151116]">All courses in this programme</h2></div><span className="hidden text-xs font-medium text-[#6e6072] sm:block">{courses.length} courses</span></div>

        {coursesQuery.isLoading ? <div className="border border-dashed border-[#d9cbdc] bg-white p-8 text-center text-sm text-[#6e6072]">Loading your live course sequence…</div> : null}
        {coursesQuery.isError ? <div className="border border-[#f47945]/30 bg-[#fff7f2] p-8 text-center text-sm text-[#6e6072]">We could not load this programme. Please refresh and try again.</div> : null}
        {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 ? <div className="border border-dashed border-[#d9cbdc] bg-white p-8 text-center text-sm text-[#6e6072]">No live courses are available for this programme yet.</div> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const accent = MODULE_ACCENTS[(course.sequence - 1) % MODULE_ACCENTS.length];
            const progress = course.progress ?? 0;
            const isDemoEnrolled = course.enrolled || simulatedEnrollmentIds.includes(course.id);
            return (
              <Card key={course.id} className="group flex h-full flex-col overflow-hidden rounded-xl border-[#f47945]/25 bg-white shadow-[0_10px_25px_rgba(77,23,110,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#f47945] hover:shadow-[0_16px_36px_rgba(77,23,110,0.1)]">
                <div className="h-1.5" style={{ backgroundColor: accent }} aria-hidden />
                <CardContent className="flex h-full flex-col gap-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-md text-xs font-black" style={{ backgroundColor: `${accent}18`, color: accent }}>{String(course.sequence).padStart(2, "0")}</span>{isDemoEnrolled ? <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">In progress</span> : null}</div>
                  <div><h3 className="text-lg font-semibold leading-tight tracking-[-0.03em] text-[#151116]">{course.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6e6072]">{course.summary}</p></div>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[#6e6072]"><span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden />{course.lessons_count} lessons</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden />{formatMinutes(course.total_minutes)}</span>{course.video_count ? <span className="inline-flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" aria-hidden />{course.video_count} videos</span> : null}{course.resource_count ? <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" aria-hidden />{course.resource_count} resources</span> : null}</div>
                  <div className="rounded-lg bg-[#fbf8fd] p-3.5"><div className="flex items-center gap-2 text-xs font-semibold text-[#4d176e]"><Target className="h-3.5 w-3.5" aria-hidden />Build outcome</div><p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[#3f3445]">{course.project || course.deliverable || course.outcomes[0]}</p></div>
                  <button type="button" onClick={() => setExpandedCourseId((current) => current === course.id ? null : course.id)} className="flex items-center justify-between border-t border-[#eee5f1] pt-3 text-left text-xs font-semibold text-[#4d176e] transition hover:text-[#b94920]" aria-expanded={expandedCourseId === course.id}><span>{expandedCourseId === course.id ? "Hide course details" : "Preview course details"}</span><ChevronDown className={`h-4 w-4 transition-transform ${expandedCourseId === course.id ? "rotate-180" : ""}`} aria-hidden /></button>
                  {expandedCourseId === course.id ? <div className="rounded-lg border border-[#eadcf0] bg-white p-3 text-xs leading-5 text-[#6e6072]"><p className="font-semibold text-[#151116]">What you will practise</p><ul className="mt-1.5 list-disc space-y-1 pl-4">{course.outcomes.slice(0, 3).map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div> : null}
                  {isDemoEnrolled ? <div><div className="mb-1.5 flex items-center justify-between text-[11px] text-[#6e6072]"><span>{progress}% complete</span><span>{progress >= 100 ? "Complete" : "Keep going"}</span></div><div className="h-2 overflow-hidden rounded-sm bg-[#f2eaf4]"><div className="h-full rounded-sm transition-all" style={{ width: `${progress}%`, backgroundColor: accent }} /></div></div> : null}
                  <div className="mt-auto flex flex-col gap-2 pt-1"><Button asChild className="w-full rounded-md bg-[#4d176e] hover:bg-[#351039]"><Link href={`/learner/courses/${course.id}`}>{isDemoEnrolled ? (progress > 0 ? "Continue course" : "Start course") : "View course"}<ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link></Button>{!isDemoEnrolled ? <Button className="w-full rounded-md bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]" onClick={() => startCheckout(course)}>Enrol now</Button> : null}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      {checkoutCourse ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1f0d2e]/70 p-4 sm:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="sandbox-checkout-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6e6072]">Sandbox checkout</p>
                <h2 id="sandbox-checkout-title" className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#17131a]">{checkoutCourse.title}</h2>
                <p className="mt-1 text-sm text-[#6e6072]">{programme.title} · simulated payment only</p>
              </div>
              <button type="button" onClick={() => setCheckoutCourse(null)} className="text-sm font-semibold text-[#6e6072] hover:text-[#17131a]" aria-label="Close checkout">Close</button>
            </div>
            <div className="mt-5 rounded-xl border border-[#eadfe9] bg-[#fbf8fd] p-4 text-sm">
              <div className="flex items-center justify-between"><span className="text-[#6e6072]">Amount</span><span className="font-bold text-[#4d176e]">{programme.price}</span></div>
              <p className="mt-2 text-xs leading-5 text-[#6e6072]">This is a fake M-Pesa flow for testing. No phone will be charged and no real money will move.</p>
            </div>
            {!activePayment ? (
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium text-[#351039]">Learner name<input value={learnerName} onChange={(event) => setLearnerName(event.target.value)} className="mt-1.5 h-11 w-full rounded-md border border-[#d9cbdc] px-3 text-sm outline-none focus:border-[#4d176e] focus:ring-2 focus:ring-[#4d176e]/15" placeholder="Enter learner name" /></label>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#f7f3f9] p-1">
                  {(["mpesa", "cash"] as SimulatedPaymentMethod[]).map((method) => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${paymentMethod === method ? "bg-white text-[#4d176e] shadow-sm" : "text-[#6e6072]"}`}>{method === "mpesa" ? "M-Pesa STK Push" : "Cash"}</button>
                  ))}
                </div>
                {paymentMethod === "mpesa" ? <label className="block text-sm font-medium text-[#351039]">Simulated M-Pesa number<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="numeric" className="mt-1.5 h-11 w-full rounded-md border border-[#d9cbdc] px-3 text-sm outline-none focus:border-[#4d176e] focus:ring-2 focus:ring-[#4d176e]/15" placeholder="2547XXXXXXXX" /></label> : <p className="rounded-lg border border-dashed border-[#d9cbdc] p-3 text-sm leading-6 text-[#6e6072]">Cash will be recorded as pending until an administrator confirms it in the Finance portal.</p>}
                <Button type="button" onClick={startPaymentSimulation} className="w-full rounded-md bg-[#f47945] text-[#351039] hover:bg-[#ff8f57]">{paymentMethod === "mpesa" ? "Send simulated STK Push" : "Record cash payment"}</Button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-[#eadfe9] p-4">
                  <p className="text-sm font-semibold text-[#17131a]">{activePayment.method === "mpesa" ? "STK Push sent" : "Cash payment recorded"}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6e6072]">{activePayment.method === "mpesa" ? `A simulated prompt was sent to ${activePayment.phone}. Choose an outcome below.` : "The payment is waiting for administrator confirmation."}</p>
                </div>
                {activePayment.method === "mpesa" ? <div className="grid gap-2 sm:grid-cols-3"><Button type="button" onClick={() => finishPaymentSimulation("paid")} className="rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Simulate success</Button><Button type="button" onClick={() => finishPaymentSimulation("cancelled")} variant="outline" className="rounded-md">Cancel</Button><Button type="button" onClick={() => finishPaymentSimulation("failed")} variant="outline" className="rounded-md text-red-700">Fail</Button></div> : <Button type="button" onClick={() => setCheckoutCourse(null)} variant="outline" className="w-full rounded-md">Close checkout</Button>}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LearnerProgrammePage;
