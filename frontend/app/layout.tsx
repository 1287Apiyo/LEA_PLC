import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { MockProvider } from "@/components/mock-provider";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Integrated Learning & Operations Platform`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "The digital operating system for LEA Labs: learning, corporate training, technology services, partnerships, finance and reporting.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <MockProvider>
            <QueryProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
              <Toaster richColors position="top-right" closeButton />
            </QueryProvider>
          </MockProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
