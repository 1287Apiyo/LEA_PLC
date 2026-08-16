import { notFound } from "next/navigation";
import { ModuleDetailView } from "@/components/shared/module-detail-view";
import { getModule } from "@/lib/module-registry";

export const dynamic = "force-dynamic";

/** Instructor record detail page — /instructor/{module}/{id}. */
export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module, id } = await params;
  const definition = getModule("instructor", module);
  if (!definition) notFound();

  return (
    <ModuleDetailView role="instructor" module={module} id={id} plural={definition.title} />
  );
}
