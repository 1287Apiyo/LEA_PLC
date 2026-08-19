"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/types/api";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { resourceService, type ResourceRow } from "@/services/resources";

// ── Field inference ───────────────────────────────────────

export interface CrudField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "date" | "time" | "email";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
}

const SKIPPED_FIELDS = new Set([
  "id",
  "qr_verified",
  "unread",
  "pinned",
  "receipt",
  "verified",
  "created_at",
  "updated_at",
]);

const ENUM_KEYS = new Set([
  "status",
  "method",
  "type",
  "mode",
  "stage",
  "source",
  "audience",
  "contract_type",
  "delivered",
  "grading",
  "purpose",
  "package",
  "category",
  "folder",
  "mou_status",
  "icon",
]);

const RESOURCE_FIELD_SCHEMAS: Record<string, CrudField[]> = {
  learners: [
    { key: "name", label: "Full name", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "programme", label: "Programme", type: "select", options: ["Software Engineering", "Applied AI", "Basic Computer Knowledge"] },
    { key: "guardian", label: "Guardian or emergency contact", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["active", "pending", "suspended"], defaultValue: "active" },
  ],
  instructors: [
    { key: "name", label: "Full name", type: "text", required: true },
    { key: "email", label: "Email", type: "email" },
    { key: "specialisation", label: "Specialisation", type: "text", required: true },
    { key: "availability", label: "Availability", type: "text" },
    { key: "rating", label: "Rating", type: "number", defaultValue: 0 },
    { key: "status", label: "Status", type: "select", options: ["active", "pending", "on-leave"], defaultValue: "active" },
  ],
  staff: [
    { key: "name", label: "Full name", type: "text", required: true },
    { key: "role", label: "Role", type: "text", required: true },
    { key: "department", label: "Department", type: "text" },
    { key: "contract_type", label: "Contract type", type: "select", options: ["permanent", "contract", "part-time", "volunteer"] },
    { key: "salary", label: "Salary", type: "number" },
    { key: "joined_at", label: "Joined", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["active", "on-leave", "suspended"], defaultValue: "active" },
  ],
  programmes: [
    { key: "name", label: "Programme name", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", required: true },
    { key: "duration", label: "Duration", type: "text" },
    { key: "price", label: "Price (KES)", type: "number" },
    { key: "outcomes", label: "Learning outcomes", type: "textarea" },
    { key: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], defaultValue: "draft" },
  ],
  courses: [
    { key: "title", label: "Course title", type: "text", required: true },
    { key: "programme", label: "Programme", type: "text", required: true },
    { key: "description", label: "Description", type: "textarea" },
    { key: "price", label: "Price (KES)", type: "number" },
    { key: "lessons", label: "Lesson count", type: "number", defaultValue: 0 },
    { key: "status", label: "Status", type: "select", options: ["draft", "published", "archived"], defaultValue: "draft" },
  ],
  content: [
    { key: "title", label: "Asset title", type: "text", required: true },
    { key: "folder", label: "Folder", type: "select", options: ["Curriculum", "Marketing", "Operations", "Tutor materials", "Learner resources"] },
    { key: "type", label: "File type", type: "text" },
    { key: "size", label: "File size", type: "text" },
    { key: "version", label: "Version", type: "text", defaultValue: "1.0" },
    { key: "tags", label: "Tags", type: "text" },
  ],
  classes: [
    { key: "course", label: "Course", type: "text", required: true },
    { key: "trainer", label: "Trainer", type: "text" },
    { key: "date", label: "Class date", type: "date", required: true },
    { key: "start_time", label: "Start time", type: "time", required: true },
    { key: "venue", label: "Venue", type: "text" },
    { key: "mode", label: "Mode", type: "select", options: ["in_person", "online", "hybrid"], defaultValue: "in_person" },
    { key: "capacity", label: "Capacity", type: "number", defaultValue: 20 },
    { key: "status", label: "Status", type: "select", options: ["scheduled", "ongoing", "completed", "cancelled"], defaultValue: "scheduled" },
  ],
  attendance: [
    { key: "learner", label: "Learner", type: "text", required: true },
    { key: "course", label: "Course", type: "text", required: true },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "time_in", label: "Time in", type: "time" },
    { key: "method", label: "Method", type: "select", options: ["in_person", "online", "manual"], defaultValue: "manual" },
    { key: "status", label: "Status", type: "select", options: ["present", "absent", "late"], defaultValue: "present" },
  ],
  assessments: [
    { key: "title", label: "Assessment title", type: "text", required: true },
    { key: "course", label: "Course", type: "text", required: true },
    { key: "type", label: "Type", type: "select", options: ["assignment", "quiz", "project", "exam"] },
    { key: "due_at", label: "Due date", type: "date" },
    { key: "grading", label: "Grading", type: "select", options: ["pending", "grading", "graded"], defaultValue: "pending" },
    { key: "status", label: "Status", type: "select", options: ["draft", "published", "closed"], defaultValue: "draft" },
  ],
  certificates: [
    { key: "certificate_id", label: "Certificate ID", type: "text", required: true },
    { key: "learner", label: "Learner", type: "text", required: true },
    { key: "course", label: "Course", type: "text", required: true },
    { key: "issued_at", label: "Issue date", type: "date" },
    { key: "delivered", label: "Delivery", type: "select", options: ["pending", "email", "download", "in_person"], defaultValue: "pending" },
    { key: "status", label: "Status", type: "select", options: ["draft", "issued", "revoked"], defaultValue: "draft" },
  ],
  companies: [
    { key: "name", label: "Company name", type: "text", required: true },
    { key: "contact", label: "Primary contact", type: "text", required: true },
    { key: "email", label: "Contact email", type: "email" },
    { key: "employees_trained", label: "Employees to train", type: "number", defaultValue: 0 },
    { key: "training_hours", label: "Training hours", type: "number", defaultValue: 0 },
    { key: "contract_value", label: "Contract value (KES)", type: "number" },
    { key: "renewal_at", label: "Renewal date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["lead", "proposal", "active", "completed", "renewal"], defaultValue: "lead" },
  ],
  schools: [
    { key: "name", label: "School name", type: "text", required: true },
    { key: "location", label: "Location", type: "text", required: true },
    { key: "contact", label: "Primary contact", type: "text" },
    { key: "email", label: "Contact email", type: "email" },
    { key: "students", label: "Students", type: "number", defaultValue: 0 },
    { key: "labs", label: "Labs", type: "number", defaultValue: 0 },
    { key: "devices", label: "Devices", type: "number", defaultValue: 0 },
    { key: "package", label: "Package", type: "select", options: ["starter", "growth", "enterprise"] },
    { key: "status", label: "Status", type: "select", options: ["lead", "proposal", "active", "completed"], defaultValue: "lead" },
  ],
  partners: [
    { key: "name", label: "Partner name", type: "text", required: true },
    { key: "type", label: "Partner type", type: "select", options: ["employer", "education", "government", "nonprofit", "technology", "funding"] },
    { key: "contact", label: "Primary contact", type: "text" },
    { key: "email", label: "Contact email", type: "email" },
    { key: "mou_status", label: "MoU status", type: "select", options: ["draft", "negotiating", "active", "expired"], defaultValue: "draft" },
    { key: "funding", label: "Funding (KES)", type: "number" },
    { key: "renewal_at", label: "Renewal date", type: "date" },
  ],
  projects: [
    { key: "name", label: "Project name", type: "text", required: true },
    { key: "client", label: "Client", type: "text" },
    { key: "type", label: "Project type", type: "select", options: ["website", "application", "integration", "consulting", "other"] },
    { key: "budget", label: "Budget (KES)", type: "number" },
    { key: "tickets_open", label: "Open tickets", type: "number", defaultValue: 0 },
    { key: "due_at", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["new", "planning", "ongoing", "on-track", "completed", "cancelled"], defaultValue: "new" },
  ],
  events: [
    { key: "name", label: "Event name", type: "text", required: true },
    { key: "type", label: "Event type", type: "select", options: ["workshop", "webinar", "career", "community", "launch"] },
    { key: "venue", label: "Venue", type: "text" },
    { key: "date", label: "Event date", type: "date", required: true },
    { key: "capacity", label: "Capacity", type: "number", defaultValue: 50 },
    { key: "fee", label: "Fee (KES)", type: "number", defaultValue: 0 },
    { key: "status", label: "Status", type: "select", options: ["draft", "open", "upcoming", "completed", "cancelled"], defaultValue: "draft" },
  ],
  leads: [
    { key: "name", label: "Lead name", type: "text", required: true },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "source", label: "Source", type: "select", options: ["website", "referral", "event", "social", "outbound"] },
    { key: "stage", label: "Stage", type: "select", options: ["new", "contacted", "meeting", "proposal", "negotiating", "won", "lost"], defaultValue: "new" },
    { key: "value", label: "Estimated value (KES)", type: "number" },
    { key: "next_follow_up", label: "Next follow-up", type: "date" },
    { key: "owner", label: "Owner", type: "text" },
  ],
  messages: [
    { key: "recipientId", label: "Recipient user ID", type: "text", required: true },
    { key: "subject", label: "Subject", type: "text", required: true },
    { key: "body", label: "Message", type: "textarea", required: true },
  ],
  bookmarks: [
    { key: "title", label: "Bookmark title", type: "text", required: true },
    { key: "course", label: "Course", type: "text" },
    { key: "type", label: "Type", type: "select", options: ["lesson", "course", "resource", "video"], defaultValue: "lesson" },
    { key: "url", label: "Link", type: "text" },
  ],
  downloads: [
    { key: "title", label: "Download title", type: "text", required: true },
    { key: "type", label: "Type", type: "select", options: ["course-pack", "lesson-notes", "resource", "certificate"], defaultValue: "resource" },
    { key: "size", label: "File size", type: "text" },
    { key: "status", label: "Status", type: "select", options: ["requested", "ready", "downloaded", "failed"], defaultValue: "requested" },
  ],
  payments: [
    { key: "learner", label: "Learner", type: "text", required: true },
    { key: "amount", label: "Amount (KES)", type: "number", required: true },
    { key: "method", label: "Payment method", type: "select", options: ["mpesa", "bank", "cash", "card", "other"] },
    { key: "reference", label: "Reference", type: "text" },
    { key: "paid_at", label: "Paid date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["pending", "paid", "failed", "refunded"], defaultValue: "pending" },
  ],
  invoices: [
    { key: "number", label: "Invoice number", type: "text", required: true },
    { key: "customer", label: "Customer", type: "text", required: true },
    { key: "amount", label: "Amount (KES)", type: "number", required: true },
    { key: "due_at", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["draft", "outstanding", "paid", "overdue", "cancelled"], defaultValue: "draft" },
  ],
  expenses: [
    { key: "description", label: "Description", type: "text", required: true },
    { key: "amount", label: "Amount (KES)", type: "number", required: true },
    { key: "category", label: "Category", type: "select", options: ["operations", "staff", "equipment", "marketing", "travel", "other"] },
    { key: "incurred_at", label: "Incurred date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["outstanding", "approved", "paid", "rejected"], defaultValue: "outstanding" },
  ],
};

function humanize(key: string): string {

  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Derives editable fields from the resource's sample rows. */
export function inferFields(rows: ResourceRow[], resource?: string): CrudField[] {
  const schema = resource ? RESOURCE_FIELD_SCHEMAS[resource] : undefined;
  if (schema) return schema;

  const sample = rows[0] ?? {};
  return Object.entries(sample)
    .filter(([key]) => !SKIPPED_FIELDS.has(key))
    .map(([key, value]) => {
      const isEnum = ENUM_KEYS.has(key);
      const type: CrudField["type"] =
        typeof value === "number"
          ? "number"
          : isEnum
            ? "select"
            : "text";
      return {
        key,
        label: humanize(key),
        type,
        options: isEnum
          ? Array.from(
              new Set(rows.map((row) => String(row[key] ?? "")).filter(Boolean))
            )
          : undefined,
      };
    })
    .slice(0, 10);
}

// ── Entity dialog (create / edit) ─────────────────────────

interface EntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: string;
  title: string;
  fields: CrudField[];
  /** When set, the dialog edits this record; otherwise it creates. */
  record?: ResourceRow | null;
  onSaved: () => void;
}

function EntityDialog({
  open,
  onOpenChange,
  resource,
  title,
  fields,
  record,
  onSaved,
}: EntityDialogProps) {
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(record);

  // (Re)hydrate values when the dialog opens.
  useEffect(() => {
    if (!open) return;
    const initial: Record<string, string | number> = {};
    for (const field of fields) {
            const value = record?.[field.key];
      initial[field.key] =
        value === undefined || value === null
          ? field.defaultValue ?? ""
          : String(value);

    }
    setValues(initial);
  }, [open, record, fields]);

  const update = (key: string, value: string | number) =>
    setValues((current) => ({ ...current, [key]: value }));

    const submit = async () => {
    const missing = fields.find((field) => field.required && !String(values[field.key] ?? "").trim());
    if (missing) {
      toast.error(`${missing.label} is required.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload: ResourceRow = {};
      for (const field of fields) {
        const raw = values[field.key];
        if (raw === "" || raw === undefined) continue;
        payload[field.key] =
          field.type === "number" ? Number(raw) : String(raw);
      }

      if (isEdit && record?.id) {
        await resourceService.update(resource, String(record.id), payload);
        toast.success(`${title} updated.`);
      } else {
        await resourceService.create(resource, payload);
        toast.success(`${title} created.`);
      }
      onOpenChange(false);
      onSaved();
        } catch (error) {
      const message = error instanceof ApiError
        ? error.firstFieldError ?? error.message
        : error instanceof Error
          ? error.message
          : `Could not save ${title.toLowerCase()}. Please try again.`;
      toast.error(message);
    } finally {

      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the record details."
              : "Fill in the details to create a new record."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-1.5">
                            <Label htmlFor={`field-${field.key}`}>
                {field.label}{field.required ? " *" : ""}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={String(values[field.key] ?? "")}
                  onValueChange={(value) => update(field.key, value)}
                >
                  <SelectTrigger id={`field-${field.key}`}>
                    <SelectValue placeholder={field.placeholder ?? `Select ${field.label.toLowerCase()}…`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={`field-${field.key}`}
                  value={String(values[field.key] ?? "")}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}…`}
                  rows={4}
                />
              ) : (
                <Input
                  id={`field-${field.key}`}
                  type={field.type}
                  value={String(values[field.key] ?? "")}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}…`}
                />
              )}

            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── CrudTable ─────────────────────────────────────────────

interface CrudTableProps {
  resource: string;
  columns: ColumnDef<ResourceRow>[];
  searchPlaceholder?: string;
  /** Singular display label, e.g. "Learner". */
  title: string;
  /** Plural display label for the header, e.g. "Learners". */
  plural?: string;
  /** Whether this role may create records in the resource. */
  canCreate?: boolean;
}

/**
 * Data table with full CRUD: an "Add" button, create/edit dialog
 * (form inferred from the data) and per-row edit/delete actions.
 */
export function CrudTable({
  resource,
  columns,
  searchPlaceholder,
    title,
  plural,
  canCreate = true,
}: CrudTableProps) {

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ResourceRow | null>(null);
  const [deleting, setDeleting] = useState<ResourceRow | null>(null);

  // Fetch a sample of rows to infer editable fields.
  const { data } = useQuery({
    queryKey: ["fields", resource],
    queryFn: () => resourceService.list(resource, { per_page: 100 }),
    staleTime: 60 * 1000,
  });
  const fields = useMemo(() => inferFields(data?.data ?? [], resource), [data, resource]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["resource", resource] });
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await resourceService.remove(resource, String(deleting.id));
      toast.success(`${title} deleted.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error(`Could not delete ${title.toLowerCase()}.`);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <p className="text-sm font-medium">
            {plural ?? `${title}s`}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {data?.meta?.total ?? "…"} total
            </span>
          </p>
                    {canCreate ? (
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add {title}
            </Button>
          ) : null}

        </div>

        <DataTable
          resource={resource}
          columns={columns}
          searchPlaceholder={searchPlaceholder}
          pageSize={8}
          renderRowActions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Row actions">
                  <MoreHorizontal className="h-4 w-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    const id = String(row.id ?? "");
                    if (id) void router.push(`${pathname}/${encodeURIComponent(id)}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" aria-hidden />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(row);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setDeleting(row)}
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />

        <EntityDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          resource={resource}
          title={title}
          fields={fields}
          record={editing}
          onSaved={invalidate}
        />

        <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {title.toLowerCase()}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove{" "}
                <span className="font-medium">
                  {String(deleting?.name ?? deleting?.title ?? deleting?.id ?? "this record")}
                </span>{" "}
                and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
