import type { Metadata } from "next";
import { LearnerCareer } from "@/components/modules/learner-career";

export const metadata: Metadata = {
  title: "Career centre | LEA Labs",
  description: "Build your professional profile and track career opportunities.",
};

export default function LearnerCareerPage() {
  return <LearnerCareer />;
}
