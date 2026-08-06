import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NAV } from "@/components/shared/nav-config";
import { APP_NAME } from "@/lib/constants";
import type { Role } from "@/types/auth";

/** Maps a pathname to human-readable breadcrumb segments. */
function buildCrumbs(pathname: string, role: Role): { label: string; href: string }[] {
  // Flat map of every known href → title.
  const titleByHref = new Map<string, string>();
  for (const section of NAV[role]) {
    for (const item of section.items) {
      titleByHref.set(item.href, item.title);
    }
  }

  const segments = pathname.split("/").filter(Boolean); // e.g. ["admin","learners"]
  if (segments.length === 0) return [{ label: APP_NAME, href: "/" }];

  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const [index, segment] of segments.entries()) {
    acc += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label =
      titleByHref.get(acc) ??
      (segment === "admin" || segment === "instructor" || segment === "learner"
        ? "Home"
        : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));
    crumbs.push({ label, href: isLast ? acc : acc });
  }
  return crumbs;
}

/** Auto-generated breadcrumbs from the current route. */
export function Breadcrumbs({ role }: { role: Role }) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname, role);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-sm font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href} className="text-sm">
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
