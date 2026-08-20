import type { Metadata } from "next";
import { LearnerAnalytics } from "@/components/modules/learner-analytics";

export const metadata: Metadata = {
  title: "My learning analytics | LEA Labs",
  description: "Review your learning pace and progress signals.",
};

export default function LearnerAnalyticsPage() {
  return <LearnerAnalytics />;
}
