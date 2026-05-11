import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export interface DataGridProps<T extends object> {
  columns: ColumnDef<T, any>[];
  data: T[];
  globalFilter?: string;
  onRowClick?: (row: T) => void;
  isRowActive?: (row: T) => boolean;
  empty?: ReactNode;
  pageSize?: number;
  className?: string;
  rowKey?: (row: T) => string | number;
}

export function DataGrid<T extends object>({
  columns,
  data,
  globalFilter,
  onRowClick,
  isRowActive,
  empty,
  pageSize = 50,
  className,
  rowKey,
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onPaginationChange: (u) => {
      const next = typeof u === "function" ? u({ pageIndex, pageSize }) : u;
      setPageIndex(next.pageIndex);
    },
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const visibleStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const visibleEnd = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="thin-scrollbar relative flex-1 overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-10 bg-surface-2/95 backdrop-blur supports-[backdrop-filter]:bg-surface-2/85">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted();
                  const canSort = h.column.getCanSort();
                  return (
                    <th
                      key={h.id}
                      className="h-9 border-b border-border px-3 text-left align-middle text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground"
                      style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}
                    >
                      {h.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                          className={cn(
                            "inline-flex items-center gap-1.5",
                            canSort && "cursor-pointer hover:text-foreground",
                          )}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {canSort &&
                            (sorted === "asc" ? (
                              <ChevronUp className="size-3" />
                            ) : sorted === "desc" ? (
                              <ChevronDown className="size-3" />
                            ) : (
                              <ArrowUpDown className="size-3 opacity-40" />
                            ))}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[13px] text-muted-foreground">
                  {empty ?? "No matching records."}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const original = row.original;
                const active = isRowActive?.(original);
                return (
                  <tr
                    key={rowKey ? rowKey(original) : row.id}
                    onClick={() => onRowClick?.(original)}
                    className={cn(
                      "group border-b border-border/60 transition-colors",
                      onRowClick && "cursor-pointer",
                      active ? "bg-primary-soft" : "hover:bg-surface-hover",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border/60 px-3 py-1.5 align-middle text-[13px] text-foreground"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface-2 px-3 py-2 text-[12px] text-muted-foreground">
        <div className="num">
          {totalRows === 0 ? "No rows" : `${visibleStart.toLocaleString()}–${visibleEnd.toLocaleString()} of ${totalRows.toLocaleString()}`}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
            className="rounded px-2 py-1 hover:bg-surface-hover disabled:opacity-40"
          >
            Prev
          </button>
          <span className="num px-1">
            {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => setPageIndex((i) => Math.min(pageCount - 1, i + 1))}
            className="rounded px-2 py-1 hover:bg-surface-hover disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef };

export function useGridFilter() {
  const [value, setValue] = useState("");
  return useMemo(() => ({ value, setValue }), [value]);
}
