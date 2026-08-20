import type { Metadata } from "next";
import { VerifyCertificate } from "@/components/modules/verify-certificate";

export const metadata: Metadata = {
  title: "Verify certificate | LEA Labs",
  description: "Verify an LEA Labs learning certificate.",
};

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <VerifyCertificate code={decodeURIComponent(code)} />;
}
