"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { ProductQuantitiesByMilestone } from "@/api/generated/models";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { getBatchStatusIcon } from "@/hooks/useBatchStatusOptions";

type Milestone = ProductQuantitiesByMilestone["milestones"][number];

function formatQuantity(value: number): string {
  return value.toLocaleString("uk-UA");
}

function renderMilestoneSortableHeader(
  column: Column<ProductQuantitiesByMilestone>,
  milestone: Pick<Milestone, "id" | "label">,
) {
  const StatusIcon = getBatchStatusIcon(milestone.id);
  const sorting = column.getIsSorted();

  return (
    <Button
      className="w-full"
      variant="ghost"
      title={milestone.label}
      aria-label={milestone.label}
      onClick={() => column.toggleSorting(sorting === "asc")}
    >
      <StatusIcon />
      {sorting === false ? <ChevronsUpDown /> : sorting === "asc" ? <ArrowUp /> : <ArrowDown />}
    </Button>
  );
}

function createMilestoneColumn(milestone: Pick<Milestone, "id" | "label">): ColumnDef<ProductQuantitiesByMilestone> {
  return {
    id: `milestone-${milestone.id}`,
    accessorFn: (row) => row.milestones.find((m) => m.id === milestone.id)?.quantity ?? 0,
    header: ({ column }) => renderMilestoneSortableHeader(column, milestone),
    cell: ({ getValue }) => (
      <div className="text-center tabular-nums">{formatQuantity(getValue<number>())}</div>
    ),
  };
}

interface InventoryColumnsProps {
  milestones: Pick<Milestone, "id" | "label">[];
}

export const getInventoryColumns = ({ milestones }: InventoryColumnsProps) => {
  const columns: ColumnDef<ProductQuantitiesByMilestone>[] = [
    // createSelectColumn<ProductQuantitiesByMilestone>(),
    {
      accessorKey: "id",
      accessorFn: (row) => {
        return row.product.id
      },
      header: ({ column }) => {
        return <SortableHeader column={column} field={"ID"} />;
      },
      cell: ({ row }) => {
        return <div className="text-center">{`${row.original.product.id || 0}`.padStart(5, "0")}</div>;
      },
    },
    {
      accessorKey: "name",
      accessorFn: (row) => {
        return row.product.name
      },
      header: ({ column }) => <SortableHeader column={column} field={"Продукт"} />,
      cell: ({ row }) => <div className="font-medium">{row.original.product.name}</div>,
    },
    ...milestones.map((milestone) => createMilestoneColumn(milestone)),
    {
      accessorKey: "readyQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"Готово"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-medium">
          {formatQuantity(row.original.readyQuantity)}
        </div>
      ),
    },
    {
      accessorKey: "storageQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"На складі"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-medium">
          {formatQuantity(row.original.storageQuantity)}
        </div>
      ),
    },
    {
      accessorKey: "totalQuantity",
      header: ({ column }) => <SortableHeader column={column} field={"Всього"} />,
      cell: ({ row }) => (
        <div className="text-center tabular-nums font-semibold">
          {formatQuantity(row.original.totalQuantity)}
        </div>
      ),
    },
  ];
  return columns;
};
