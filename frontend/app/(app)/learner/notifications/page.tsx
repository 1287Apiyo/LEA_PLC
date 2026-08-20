import type { Metadata } from "next";
import { LearnerNotifications } from "@/components/modules/learner-notifications";

export const metadata: Metadata = {
  title: "Notifications | LEA Labs",
  description: "Your LEA Labs learning reminders and updates.",
};

export default function LearnerNotificationsPage() {
  return <LearnerNotifications />;
}
