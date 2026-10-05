import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { WhatsAppFloat } from "@/components/shared/whatsapp-float";

import { APP_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: `${APP_NAME} — Integrated Learning & Operations Platform`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "The digital operating system for LEA Labs: learning, corporate training, technology services, partnerships, finance and reporting.",
  keywords: ["LEA Labs", "online learning", "professional training", "digital skills", "education platform", "corporate learning"],
  applicationName: APP_NAME,
  authors: [{ name: "LEA Labs" }],
  creator: "LEA Labs",
  publisher: "LEA Labs",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — Learn, explore and achieve`,
    description: "A digital learning and operations platform for practical skills, professional growth and meaningful work.",
    images: [{ url: "/icon.png", width: 64, height: 64, alt: "LEA Labs" }],
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} — Learn, explore and achieve`,
    description: "A digital learning and operations platform for practical skills and professional growth.",
    images: ["/icon.png"],
  },
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
          <QueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <Toaster richColors position="top-right" closeButton />
            <WhatsAppFloat />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


