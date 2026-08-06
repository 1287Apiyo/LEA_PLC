import { notFound } from "next/navigation";
import { ModuleDetailView } from "@/components/shared/module-detail-view";
import { getModule } from "@/lib/module-registry";

export const dynamic = "force-dynamic";

/** Learner record detail page — /learner/{module}/{id}. */
export default async function LearnerDetailPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module, id } = await params;
  const definition = getModule("learner", module);
  if (!definition) notFound();

  return (
    <ModuleDetailView role="learner" module={module} id={id} plural={definition.title} />
  );
}
