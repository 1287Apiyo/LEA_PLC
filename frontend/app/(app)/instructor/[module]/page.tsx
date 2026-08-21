import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleListView } from "@/components/shared/module-list-view";
import { InstructorTeachingWorkspace } from "@/components/modules/instructor-teaching-workspace";
import { PageHeader } from "@/components/shared/page-header";
import { MODULE_REGISTRY, getModule } from "@/lib/module-registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODULE_REGISTRY.instructor.map((definition) => ({
    module: definition.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const definition = getModule("instructor", module);
  return { title: definition?.title ?? "Not found" };
}

/** Instructor module pages — data tables driven by the resource API. */
export default async function InstructorModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const definition = getModule("instructor", module);
  if (!definition) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={definition.title} description={definition.description} />
      {new Set(["classes", "attendance", "assignments", "grades", "analytics", "materials", "announcements", "tutor-sessions", "discussions"]).has(module) ? <InstructorTeachingWorkspace slug={module} /> : <ModuleListView role="instructor" slug={module} plural={definition.title} />}
    </div>
  );
}
