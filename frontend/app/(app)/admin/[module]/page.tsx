import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleListView } from "@/components/shared/module-list-view";
import { PageHeader } from "@/components/shared/page-header";
import { MODULE_REGISTRY, getModule } from "@/lib/module-registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODULE_REGISTRY.administrator.map((definition) => ({
    module: definition.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const definition = getModule("administrator", module);
  return { title: definition?.title ?? "Not found" };
}

/** Administrator module pages — data tables driven by the resource API. */
export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const definition = getModule("administrator", module);
  if (!definition) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={definition.title} description={definition.description} />
      <ModuleListView role="administrator" slug={module} />
    </div>
  );
}
