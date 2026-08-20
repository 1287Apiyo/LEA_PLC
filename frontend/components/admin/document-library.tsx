"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  LoaderCircle,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Course {
  id: string;
  title: string;
  programme?: string;
  programme_id?: string;
  programme_title?: string;
  programmeTitle?: string;
  sequence?: number;
}

interface CourseResponse {
  data: Course[];
  meta?: { total?: number };
}

type DocumentKind = "course" | "official" | "other";
type Organization = "lea-labs" | "lea-afritech";

interface AdminDocument {
  id: string;
  title: string;
  category: string;
  documentKind?: DocumentKind;
  organization?: Organization | null;
  courseId?: string | null;
  courseTitle?: string | null;
  programmeId?: string | null;
  programmeTitle?: string | null;
  folderSegment?: string;
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

const FALLBACK_COURSES: Course[] = [
  { id: "crs-web", title: "Web Development", programme: "prg-coding", sequence: 1 },
  { id: "crs-api", title: "API Integration & Data Products", programme: "prg-coding", sequence: 2 },
  { id: "crs-app", title: "App Development", programme: "prg-coding", sequence: 3 },
  { id: "crs-ai-dev", title: "AI-Assisted Engineering", programme: "prg-coding", sequence: 4 },
  { id: "crs-capstone", title: "Software Product Studio", programme: "prg-coding", sequence: 5 },
  { id: "crs-ai-foundations", title: "AI Foundations & Literacy", programme: "prg-ai", sequence: 1 },
  { id: "crs-ai-workflows", title: "AI Workflows & Automation", programme: "prg-ai", sequence: 2 },
  { id: "crs-computer", title: "Basic Computer Skills", programme: "prg-dl", sequence: 1 },
  { id: "crs-scratch", title: "Scratch Programming", programme: "prg-dl", sequence: 2 },
];

const PROGRAMME_LABELS: Record<string, string> = {
  "prg-coding": "Software Engineering",
  "prg-ai": "Applied AI",
  "prg-dl": "Basic Computer Knowledge",
};

function fileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-KE", { dateStyle: "medium" });
}

function programmeLabel(course: Course): string {
  return course.programme_title || course.programmeTitle || PROGRAMME_LABELS[course.programme || course.programme_id || ""] || "Other programme";
}

function normalizedKind(document: AdminDocument): DocumentKind {
  if (document.documentKind) return document.documentKind;
  return document.courseId ? "course" : "other";
}

function SectionHeading({ icon, title, count, description }: { icon: React.ReactNode; title: string; count: number; description: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{count} file{count === 1 ? "" : "s"}</span>
    </div>
  );
}

export function DocumentLibrary() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Course material");
  const [description, setDescription] = useState("");
  const [documentKind, setDocumentKind] = useState<DocumentKind>("course");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [organization, setOrganization] = useState<Organization>("lea-labs");
  const [file, setFile] = useState<File | null>(null);

  const documentsQuery = useQuery({
    queryKey: ["admin-documents"],
    queryFn: () => api.get<DocumentResponse>("/admin/documents"),
  });

  const coursesQuery = useQuery({
    queryKey: ["admin-document-courses"],
    queryFn: () => api.get<CourseResponse>("/courses"),
  });

  const courses = useMemo(() => {
    const liveCourses = coursesQuery.data?.data ?? [];
    const source = liveCourses.length > 0 ? liveCourses : FALLBACK_COURSES;
    return [...source].sort((left, right) => {
      const programmeOrder = programmeLabel(left).localeCompare(programmeLabel(right));
      return programmeOrder || (left.sequence ?? 0) - (right.sequence ?? 0) || left.title.localeCompare(right.title);
    });
  }, [coursesQuery.data?.data]);

  const documents = documentsQuery.data?.data ?? [];
  const courseDocuments = documents.filter((document) => normalizedKind(document) === "course");
  const officialDocuments = documents.filter((document) => normalizedKind(document) === "official");
  const otherDocuments = documents.filter((document) => normalizedKind(document) === "other");
  const leaLabsDocuments = officialDocuments.filter((document) => document.organization === "lea-labs");
  const leaAfritechDocuments = officialDocuments.filter((document) => document.organization === "lea-afritech");

  const documentsByCourse = useMemo(() => {
    const grouped = new Map<string, AdminDocument[]>();
    courseDocuments.forEach((document) => {
      const key = document.courseId || "unassigned";
      grouped.set(key, [...(grouped.get(key) ?? []), document]);
    });
    return grouped;
  }, [courseDocuments]);

  const groupedCourses = useMemo(() => {
    const grouped = new Map<string, Course[]>();
    courses.forEach((course) => {
      const key = programmeLabel(course);
      grouped.set(key, [...(grouped.get(key) ?? []), course]);
    });
    return [...grouped.entries()];
  }, [courses]);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a document first.");
      if (documentKind === "course" && !selectedCourseId) throw new Error("Select a course before uploading.");
      const selectedCourse = courses.find((course) => course.id === selectedCourseId);
      const form = new FormData();
      form.set("file", file);
      form.set("title", title);
      form.set("category", category);
      form.set("description", description);
      form.set("documentKind", documentKind);
      if (documentKind === "course" && selectedCourse) {
        form.set("courseId", selectedCourse.id);
        form.set("courseTitle", selectedCourse.title);
        form.set("programmeId", selectedCourse.programme || selectedCourse.programme_id || "");
        form.set("programmeTitle", programmeLabel(selectedCourse));
      }
      if (documentKind === "official") form.set("organization", organization);
      return api.post<{ data: AdminDocument }>("/admin/documents", form);
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setFile(null);
      const input = document.getElementById("admin-document-file") as HTMLInputElement | null;
      if (input) input.value = "";
      void queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      toast.success("Document stored in its organized library folder.");
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

  function chooseDestination(kind: DocumentKind, courseId?: string, nextOrganization?: Organization) {
    setDocumentKind(kind);
    if (courseId) setSelectedCourseId(courseId);
    if (nextOrganization) setOrganization(nextOrganization);
    setCategory(kind === "course" ? "Course material" : kind === "official" ? "Official document" : "Other");
    document.getElementById("document-upload-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  function renderDocumentRow(document: AdminDocument) {
    return (
      <div key={document.id} className="flex flex-col gap-3 border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <p className="truncate text-sm font-medium">{document.title}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{document.category} · {fileSize(document.sizeBytes)} · {formatDate(document.created_at)}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{document.originalName}{document.description ? ` · ${document.description}` : ""}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => void download(document)}>
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />Download
          </Button>
          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (window.confirm(`Delete ${document.title}?`)) deleteMutation.mutate(document.id); }} disabled={deleteMutation.isPending}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Delete {document.title}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">Admin workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight">Organized document library</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Upload course materials into the correct course folder, or store official documents under LEA Labs and LEA Afritech. Files remain private on the local application server; Firestore stores the searchable metadata.
          </p>
        </div>
        <Button variant="outline" onClick={() => { void documentsQuery.refetch(); void coursesQuery.refetch(); }} disabled={documentsQuery.isFetching || coursesQuery.isFetching}>
          {documentsQuery.isFetching || coursesQuery.isFetching ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <FolderOpen className="mr-2 h-4 w-4" aria-hidden />}
          Refresh library
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><GraduationCap className="h-5 w-5 text-primary" aria-hidden /><div><p className="text-xs text-muted-foreground">Course materials</p><p className="text-xl font-semibold">{courseDocuments.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Shield className="h-5 w-5 text-primary" aria-hidden /><div><p className="text-xs text-muted-foreground">LEA Labs official</p><p className="text-xl font-semibold">{leaLabsDocuments.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Building2 className="h-5 w-5 text-primary" aria-hidden /><div><p className="text-xs text-muted-foreground">LEA Afritech official</p><p className="text-xl font-semibold">{leaAfritechDocuments.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Archive className="h-5 w-5 text-primary" aria-hidden /><div><p className="text-xs text-muted-foreground">Other / legacy</p><p className="text-xl font-semibold">{otherDocuments.length}</p></div></CardContent></Card>
      </div>

      <Card id="document-upload-form" className="scroll-mt-6">
        <CardHeader>
          <CardTitle className="text-base">Upload to a specific destination</CardTitle>
          <p className="text-sm text-muted-foreground">Choose a course or organization first. The server creates the matching folder automatically.</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={(event) => { event.preventDefault(); uploadMutation.mutate(); }}>
            <div className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Upload destination</span>
                <select value={documentKind} onChange={(event) => { const kind = event.target.value as DocumentKind; setDocumentKind(kind); setCategory(kind === "course" ? "Course material" : kind === "official" ? "Official document" : "Other"); }} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                  <option value="course">Course material</option>
                  <option value="official">Official organization document</option>
                  <option value="other">Other / legacy document</option>
                </select>
              </label>

              {documentKind === "course" ? (
                <label className="block space-y-1.5 text-sm">
                  <span className="font-medium">Course</span>
                  <select value={selectedCourseId} onChange={(event) => setSelectedCourseId(event.target.value)} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                    <option value="">Select the course folder</option>
                    {groupedCourses.map(([programme, programmeCourses]) => (
                      <optgroup key={programme} label={programme}>
                        {programmeCourses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </label>
              ) : null}

              {documentKind === "official" ? (
                <label className="block space-y-1.5 text-sm">
                  <span className="font-medium">Official organization</span>
                  <select value={organization} onChange={(event) => setOrganization(event.target.value as Organization)} className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                    <option value="lea-labs">LEA Labs official documents</option>
                    <option value="lea-afritech">LEA Afritech official documents</option>
                  </select>
                </label>
              ) : null}

              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Document title</span>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Web Development Course Pack" maxLength={140} />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Document category</span>
                <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Course material, policy, handbook…" maxLength={80} />
              </label>
            </div>

            <div className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Description <span className="font-normal text-muted-foreground">(optional)</span></span>
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Explain what this document is used for." maxLength={500} />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">File</span>
                <Input id="admin-document-file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.zip,.png,.jpg,.jpeg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                <span className="text-xs text-muted-foreground">PDF, Office, text, CSV, Markdown, image, or ZIP files up to 25 MB.</span>
              </label>
              {file ? <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{file.name}</span> · {fileSize(file.size)}</p> : null}
              <Button type="submit" className="w-full" disabled={!file || uploadMutation.isPending || (documentKind === "course" && !selectedCourseId)}>
                {uploadMutation.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : <Upload className="mr-2 h-4 w-4" aria-hidden />}
                {uploadMutation.isPending ? "Storing document…" : "Store document in selected folder"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <SectionHeading icon={<GraduationCap className="h-5 w-5" aria-hidden />} title="Course materials" count={courseDocuments.length} description="Every live Firestore course has its own upload target and document list." />
        {coursesQuery.isLoading ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Loading courses from Firestore…</div> : coursesQuery.isError && courses.length === 0 ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Unable to load the course catalogue. Refresh the library to try again.</div> : (
          <div className="space-y-5">
            {groupedCourses.map(([programme, programmeCourses]) => (
              <div key={programme} className="space-y-3">
                <div className="flex items-center gap-2"><span className="h-px flex-1 bg-border" /><h3 className="text-sm font-semibold text-muted-foreground">{programme}</h3><span className="h-px flex-1 bg-border" /></div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {programmeCourses.map((course) => {
                    const courseFiles = documentsByCourse.get(course.id) ?? [];
                    return (
                      <Card key={course.id}>
                        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                          <div><CardTitle className="text-base">{course.title}</CardTitle><p className="mt-1 text-xs text-muted-foreground">Folder: course-{course.id}</p></div>
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{courseFiles.length} file{courseFiles.length === 1 ? "" : "s"}</span>
                        </CardHeader>
                        <CardContent>
                          <Button type="button" variant="outline" size="sm" className="mb-3" onClick={() => chooseDestination("course", course.id)}><Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />Upload to {course.title}</Button>
                          {courseFiles.length > 0 ? <div>{courseFiles.map(renderDocumentRow)}</div> : <p className="text-sm text-muted-foreground">No materials uploaded for this course yet.</p>}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading icon={<Shield className="h-5 w-5" aria-hidden />} title="LEA Labs official documents" count={leaLabsDocuments.length} description="Policies, curriculum standards, internal forms, and official LEA Labs records." />
        <Card><CardContent className="pt-5"><Button type="button" variant="outline" size="sm" className="mb-3" onClick={() => chooseDestination("official", undefined, "lea-labs")}><Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />Upload LEA Labs official document</Button>{leaLabsDocuments.length > 0 ? <div>{leaLabsDocuments.map(renderDocumentRow)}</div> : <p className="text-sm text-muted-foreground">No LEA Labs official documents uploaded yet.</p>}</CardContent></Card>
      </section>

      <section className="space-y-4">
        <SectionHeading icon={<Building2 className="h-5 w-5" aria-hidden />} title="LEA Afritech official documents" count={leaAfritechDocuments.length} description="Official documents belonging to the LEA Afritech organization." />
        <Card><CardContent className="pt-5"><Button type="button" variant="outline" size="sm" className="mb-3" onClick={() => chooseDestination("official", undefined, "lea-afritech")}><Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />Upload LEA Afritech official document</Button>{leaAfritechDocuments.length > 0 ? <div>{leaAfritechDocuments.map(renderDocumentRow)}</div> : <p className="text-sm text-muted-foreground">No LEA Afritech official documents uploaded yet.</p>}</CardContent></Card>
      </section>

      {otherDocuments.length > 0 ? <section className="space-y-4"><SectionHeading icon={<Archive className="h-5 w-5" aria-hidden />} title="Other / legacy documents" count={otherDocuments.length} description="Older flat records remain visible here until they are re-uploaded into a destination folder." /><Card><CardContent className="pt-5">{otherDocuments.map(renderDocumentRow)}</CardContent></Card></section> : null}

      {documentsQuery.isLoading ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Loading document library…</div> : documentsQuery.isError ? <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Unable to load documents. Use Refresh library to retry.</div> : null}
      {documents.length > 0 ? <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden />{documents.length} total document{documents.length === 1 ? "" : "s"} stored in the administrator library.</p> : null}
    </div>
  );
}
