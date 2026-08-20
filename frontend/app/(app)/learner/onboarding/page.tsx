import type { Metadata } from "next";
import { LearnerOnboarding } from "@/components/modules/learner-onboarding";

export const metadata: Metadata = {
  title: "Learning setup | LEA Labs",
  description: "Set your goals and receive a practical LEA Labs learning recommendation.",
};

export default function LearnerOnboardingPage() {
  return <LearnerOnboarding />;
}
