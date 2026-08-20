import { LearnerCalendar } from "@/components/modules/learner-calendar";

export const metadata = { title: "Tutor Sessions" };

/** Direct learner entry point for requesting and tracking one-to-one tutor support. */
export default function TutorSessionsPage() {
  return <LearnerCalendar focus="tutor" />;
}
