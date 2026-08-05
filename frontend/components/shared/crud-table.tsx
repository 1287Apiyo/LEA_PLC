"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
  type: "text" | "number" | "select";
  options?: string[];
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

function humanize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Derives editable fields from the resource's sample rows. */
export function inferFields(rows: ResourceRow[]): CrudField[] {
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
        value === undefined || value === null ? "" : String(value);
    }
    setValues(initial);
  }, [open, record, fields]);

  const update = (key: string, value: string | number) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = async () => {
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
    } catch {
      toast.error(`Could not save ${title.toLowerCase()}. Please try again.`);
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
              <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
              {field.type === "select" ? (
                <Select
                  value={String(values[field.key] ?? "")}
                  onValueChange={(value) => update(field.key, value)}
                >
                  <SelectTrigger id={`field-${field.key}`}>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}…`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`field-${field.key}`}
                  type={field.type === "number" ? "number" : "text"}
                  value={String(values[field.key] ?? "")}
                  onChange={(event) =>
                    update(field.key, event.target.value)
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}…`}
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
}: CrudTableProps) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ResourceRow | null>(null);
  const [deleting, setDeleting] = useState<ResourceRow | null>(null);

  // Fetch a sample of rows to infer editable fields.
  const { data } = useQuery({
    queryKey: ["fields", resource],
    queryFn: () => resourceService.list(resource, { per_page: 100 }),
    staleTime: 60 * 1000,
  });
  const fields = useMemo(() => inferFields(data?.data ?? []), [data]);

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
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">
            {plural ?? `${title}s`}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {data?.meta?.total ?? "…"} total
            </span>
          </p>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add {title}
          </Button>
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
                  onSelect={() =>
                    toast.info(
                      `Viewing ${title.toLowerCase()} — ${String(
                        row.name ?? row.title ?? row.id ?? ""
                      )}`
                    )
                  }
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
