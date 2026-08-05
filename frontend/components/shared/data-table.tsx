"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resourceService, type ResourceRow } from "@/services/resources";

export interface DataTableQuery {
  page: number;
  per_page: number;
  search: string;
  sort: string | null;
  order: "asc" | "desc";
}

interface DataTableProps {
  resource: string;
  columns: ColumnDef<ResourceRow>[];
  searchPlaceholder?: string;
  /** Initial page size. */
  pageSize?: number;
  /** Render a result-count chip above the table. */
  showCount?: boolean;
  /** Optional row action menu (e.g. edit/delete), appended as the last column. */
  renderRowActions?: (row: ResourceRow) => React.ReactNode;
}

/**
 * Server-style data table: search (debounced), sortable columns and
 * pagination, all driven through the resource API — the same contract
 * the Laravel backend will expose.
 */
export function DataTable({
  resource,
  columns,
  searchPlaceholder = "Search…",
  pageSize = 10,
  showCount = false,
  renderRowActions,
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const sort = sorting[0];
  const query: DataTableQuery = {
    page,
    per_page: pageSize,
    search,
    sort: sort ? sort.id : null,
    order: sort ? (sort.desc ? "desc" : "asc") : "asc",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["resource", resource, query],
    queryFn: () =>
      resourceService.list(resource, {
        page: query.page,
        per_page: query.per_page,
        search: query.search,
        sort: query.sort,
        order: query.order,
      }),
    placeholderData: (previous) => previous,
  });

  const meta = data?.meta;
  const effectiveColumns = useMemo(() => {
    if (!renderRowActions) return columns;
    return [
      ...columns,
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }: { row: { original: ResourceRow } }) => (
          <div className="flex justify-end">{renderRowActions(row.original)}</div>
        ),
      } as ColumnDef<ResourceRow>,
    ];
  }, [columns, renderRowActions]);

  const table = useReactTable({
    data: data?.data ?? [],
    columns: effectiveColumns,
    state: { sorting },
    onSortingChange: (updater) => {
      setPage(1);
      setSorting(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const total = meta?.total ?? 0;
  const from = meta?.from ?? 0;
  const to = meta?.to ?? 0;
  const lastPage = meta?.last_page ?? 1;

  const resultLabel = useMemo(
    () =>
      showCount
        ? `${total.toLocaleString()} ${total === 1 ? "record" : "records"}`
        : `${from.toLocaleString()}–${to.toLocaleString()} of ${total.toLocaleString()}`,
    [showCount, total, from, to]
  );

  return (
    <div>
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <span className="text-sm text-muted-foreground">{resultLabel}</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const alignEnd = header.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={alignEnd ? "text-right" : undefined}
                    >
                      {canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp className="h-3 w-3" aria-hidden />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="h-3 w-3" aria-hidden />
                          ) : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {effectiveColumns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={effectiveColumns.length} className="h-32 text-center">
                  <p className="text-sm text-muted-foreground">
                    {search ? `No records match "${search}".` : "No records yet."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === "actions" ? "text-right" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t p-4">
        <p className="text-sm text-muted-foreground">
          Page {meta?.current_page ?? 1} of {lastPage}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= lastPage || isLoading}
            onClick={() => setPage((value) => value + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
