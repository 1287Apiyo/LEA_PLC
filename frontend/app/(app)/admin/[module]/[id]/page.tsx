import { notFound } from "next/navigation";
import { ModuleDetailView } from "@/components/shared/module-detail-view";
import { getModule } from "@/lib/module-registry";

export const dynamic = "force-dynamic";

/** Administrator record detail page — /admin/{module}/{id}. */
export default async function AdminDetailPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module, id } = await params;
  const definition = getModule("administrator", module);
  if (!definition) notFound();

  return (
    <ModuleDetailView role="administrator" module={module} id={id} plural={definition.title} />
  );
}
