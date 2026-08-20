import type { Metadata } from "next";
import { LearnerDiscussions } from "@/components/modules/learner-discussions";

export const metadata: Metadata = {
  title: "Course discussions | LEA Labs",
  description: "Ask questions and learn with your LEA Labs course community.",
};

export default function LearnerDiscussionsPage() {
  return <LearnerDiscussions />;
}
