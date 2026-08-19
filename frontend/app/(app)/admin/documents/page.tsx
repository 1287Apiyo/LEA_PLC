import type { Metadata } from "next";
import { DocumentLibrary } from "@/components/admin/document-library";

export const metadata: Metadata = {
  title: "Document Library",
  description: "Private administrator document storage for LEA Labs.",
};

export default function AdminDocumentsPage() {
  return <DocumentLibrary />;
}
