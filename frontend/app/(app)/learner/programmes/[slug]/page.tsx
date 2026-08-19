import { notFound } from "next/navigation";
import LearnerProgrammePage from "@/components/learner/programme-page";
import { getProgramme } from "@/lib/programmes";

export const dynamic = "force-dynamic";

export default async function LearnerProgrammeRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getProgramme(slug)) notFound();
  return <LearnerProgrammePage slug={slug} />;
}
