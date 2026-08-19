"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, FolderOpen, LoaderCircle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdminDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  created_at: string;
  download_url: string;
}

interface DocumentResponse {
  data: AdminDocument[];
  meta: { total: number };
}

function fileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-KE", { dateStyle: "medium" });
}

export function DocumentLibrary() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Curriculum");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const token = useAuthStore((state) => state.token);

  const documentsQuery = useQuery({
    queryKey: ["admin-documents"],
    queryFn: () => api.get<DocumentResponse>("/admin/documents"),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a document first.");
      const form = new FormData();
      form.set("file", file);
      form.set("title", title);
      form.set("category", category);
      form.set("description", description);
      return api.post<{ data: AdminDocument }>("/admin/documents", form);
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setFile(null);
      const input = document.getElementById("admin-document-file") as HTMLInputElement | null;
      if (input) input.value = "";
      void queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      toast.success("Document stored in the administrator library.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/documents/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      toast.success("Document deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function download(storedDocument: AdminDocument) {
    if (!token) {
      window.location.assign("/login");
      return;
    }
    try {
      const response = await fetch(storedDocument.download_url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "The document could not be downloaded.");
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = storedDocument.originalName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The document could not be downloaded.");
    }
  }

  const documents = documentsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Admin workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight">Document library</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Keep curriculum packs, policies, contracts, programme notes, and official LEA documents in one private, administrator-only workspace.
          </p>
        </div>
        <Button variant="outline" onClick={() => void documentsQuery.refetch()} disabled={documentsQuery.isFetching}>
          {documentsQuery.isFetching ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <FolderOpen className="mr-2 h-4 w-4" aria-hidden />}
          Refresh library
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Store a document</CardTitle>
            <p className="text-sm text-muted-foreground">Files are stored privately on the application server and tracked with searchable metadata. This does not require a paid Firebase Storage plan.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); uploadMutation.mutate(); }}>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Document title</span>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. 2026 Software Engineering Curriculum" maxLength={140} />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option>Curriculum</option>
                  <option>Official document</option>
                  <option>Policy</option>
                  <option>Finance</option>
                  <option>People and HR</option>
                  <option>Partnership</option>
                  <option>Marketing</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Description <span className="font-normal text-muted-foreground">(optional)</span></span>
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this document used for?" maxLength={500} />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">File</span>
                <Input id="admin-document-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.zip,.png,.jpg,.jpeg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                <span className="text-xs text-muted-foreground">PDF, Office, text, CSV, Markdown, image, or ZIP files up to 25 MB.</span>
              </label>
              {file ? <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{file.name}</span> · {fileSize(file.size)}</p> : null}
              <Button type="submit" className="w-full" disabled={!file || uploadMutation.isPending}>
                {uploadMutation.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <Upload className="mr-2 h-4 w-4" aria-hidden />}
                {uploadMutation.isPending ? "Storing document…" : "Store document"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Stored documents</CardTitle>
              <p className="text-sm text-muted-foreground">{documents.length} document{documents.length === 1 ? "" : "s"} available to administrators.</p>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            {documentsQuery.isLoading ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Loading document library…</div> : documentsQuery.isError ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Unable to load documents. Use Refresh library to retry.</div> : documents.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No documents have been stored yet.</div> : <div className="space-y-3">{documents.map((document) => <div key={document.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden /><p className="truncate text-sm font-medium">{document.title}</p></div><p className="mt-1 text-xs text-muted-foreground">{document.category} · {fileSize(document.sizeBytes)} · {formatDate(document.created_at)}</p><p className="mt-1 truncate text-xs text-muted-foreground">{document.originalName}{document.description ? ` · ${document.description}` : ""}</p></div><div className="flex shrink-0 items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void download(document)}><Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />Download</Button><Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (window.confirm(`Delete ${document.title}?`)) deleteMutation.mutate(document.id); }} disabled={deleteMutation.isPending}><Trash2 className="h-3.5 w-3.5" aria-hidden /><span className="sr-only">Delete {document.title}</span></Button></div></div>)}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
