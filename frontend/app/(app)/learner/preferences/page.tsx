import type { Metadata } from "next";
import { LearnerPreferences } from "@/components/modules/learner-preferences";

export const metadata: Metadata = {
  title: "Accessibility preferences | LEA Labs",
  description: "Personalise your LEA Labs learning experience.",
};

export default function LearnerPreferencesPage() {
  return <LearnerPreferences />;
}
