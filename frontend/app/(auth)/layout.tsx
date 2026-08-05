import { Sparkles } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

/** Centered auth layout — brand header + card content. */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-foreground no-underline"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
