import type { Metadata } from "next";
import { PublicPortfolioProject } from "@/components/modules/public-portfolio-project";

export const metadata: Metadata = {
  title: "LEA Labs portfolio project",
  description: "A learner project published through LEA Labs.",
};

export default async function PublicPortfolioProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicPortfolioProject id={decodeURIComponent(id)} />;
}
