import { LearnerCalendar } from "@/components/modules/learner-calendar";

export const metadata = { title: "Calendar" };

/** Learner calendar — month view plus upcoming classes. */
export default function CalendarPage() {
  return <LearnerCalendar />;
}
