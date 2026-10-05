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
    default: `${APP_NAME} | Digital Products | Technology Consulting`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "LEA Labs is a technology company building digital products, providing technology consulting, and delivering practical coding and digital skills programs for young learners and organisations.",
  keywords: ["LEA Labs", "digital products", "technology consulting", "coding programs", "digital skills", "young learners", "organisations"],
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
    title: `${APP_NAME} | Digital Products | Technology Consulting`,
    description: "LEA Labs builds digital products, provides technology consulting, and delivers practical coding and digital skills programs for young learners and organisations.",
    images: [{ url: "/icon.png", width: 64, height: 64, alt: "LEA Labs" }],
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | Digital Products | Technology Consulting`,
    description: "LEA Labs builds digital products, provides technology consulting, and delivers practical coding and digital skills programs for young learners and organisations.",
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


