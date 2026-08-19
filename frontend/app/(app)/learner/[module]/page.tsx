import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearnerLifecycleHub } from "@/components/modules/learner-lifecycle-hub";
import { ModuleListView } from "@/components/shared/module-list-view";
import { PageHeader } from "@/components/shared/page-header";
import { MODULE_REGISTRY, getModule } from "@/lib/module-registry";

export const dynamicParams = false;

const LIFECYCLE_SLUGS = new Set([
  "assignments",
  "certificates",
  "attendance",
  "messages",
  "achievements",
  "progress",
  "bookmarks",
  "downloads",
]);

export function generateStaticParams() {
  return MODULE_REGISTRY.learner.map((definition) => ({
    module: definition.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const definition = getModule("learner", module);
  return { title: definition?.title ?? "Not found" };
}

/** Learner module pages — dedicated lifecycle views plus a safe generic fallback. */
export default async function LearnerModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const definition = getModule("learner", module);
  if (!definition) notFound();

  if (LIFECYCLE_SLUGS.has(module)) {
    return <LearnerLifecycleHub slug={module} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={definition.title} description={definition.description} />
      <ModuleListView role="learner" slug={module} plural={definition.title} />
    </div>
  );
}
