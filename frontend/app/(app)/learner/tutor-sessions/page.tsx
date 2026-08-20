import { LearnerTutorSessions } from "@/components/modules/learner-tutor-sessions";

export const metadata = { title: "Tutor Sessions" };

/** Direct learner entry point for requesting and tracking one-to-one tutor support. */
export default function TutorSessionsPage() {
  return <LearnerTutorSessions />;
}
