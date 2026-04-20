"use client";

import { useState, useMemo } from "react";
import { useFindQuantities } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { TableContent } from "@/components/data-table/content";
import { TablePagination } from "@/components/data-table/pagination";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { ProductQuantity } from "@/types/products";

const TRACKED_STATUSES = [
  "Knitting Workshop (Confirmed)",
  "Sewing Workshop (Finished)",
  "Turning Workshop (Finished)",
  "Molding Workshop (Finished)",
  "Labeling Workshop (Finished)",
  "Packaging Workshop (In-Progress)",
];

type StatusRow = ProductQuantity & { stageQuantity: number };

const columns: ColumnDef<StatusRow>[] = [
  {
    accessorKey: "product_id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {`${row.original.product_id}`.padStart(4, "0")}
      </div>
    ),
  },
  {
    accessorKey: "product_name",
    header: () => <div className="text-left">Product</div>,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.product_name}</div>
    ),
  },
  {
    accessorKey: "stageQuantity",
    header: () => <div className="text-center">Quantity</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-sm font-semibold">
          {row.original.stageQuantity}
        </span>
      </div>
    ),
  },
];

function StatusTable({
  label,
  rows,
  globalFilter,
}: {
  label: string;
  rows: StatusRow[];
  globalFilter: string;
}) {
  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 50 } },
  });

  const visibleRows = table.getFilteredRowModel().rows;
  if (visibleRows.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {visibleRows.length}
        </span>
      </div>
      <TableContent table={table} columns={columns} />
      <TablePagination table={table} />
    </div>
  );
}

export const StoragePage = () => {
  const { data: quantities = [], isLoading } = useFindQuantities();
  const [globalFilter, setGlobalFilter] = useState("");

  const tablesByStatus = useMemo(() => {
    return TRACKED_STATUSES.map((statusLabel) => {
      const rows: StatusRow[] = quantities
        .map((product: any) => {
          const entry = product.quantity?.find(
            (q: any) => q.status.label === statusLabel
          );
          if (!entry || entry.quantity === 0) return null;
          return { ...product, stageQuantity: entry.quantity };
        })
        .filter(Boolean) as StatusRow[];

      return { label: statusLabel, rows };
    });
  }, [quantities]);

  if (isLoading) return <div>Loading...</div>;

  const hasAnyData = tablesByStatus.some(({ rows }) => rows.length > 0);

  return (
    <div className="flex flex-col gap-6 p-4">
      <Input
        placeholder="Search products..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm h-8"
      />
      {!hasAnyData && (
        <p className="text-sm text-muted-foreground">
          No products at any tracked stage.
        </p>
      )}
      {tablesByStatus.map(({ label, rows }) => (
        <StatusTable
          key={label}
          label={label}
          rows={rows}
          globalFilter={globalFilter}
        />
      ))}
    </div>
  );
};
