"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import type { Product } from "@/types/products";
import { CheckBoxCell } from "@/components/data-table/checkbox-cell";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { SortableHeader } from "@/components/data-table/sortable-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { PackedStock } from "@/types/batches";

interface ProductColumnsProps {
  onCellUpdate: (field: string, value: string | boolean, row: any) => void;
  packedStock: PackedStock[] | undefined;
}

export const getProductColumns = ({ onCellUpdate, packedStock }: ProductColumnsProps) => {
  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    createIdColumn<Product>(),
    createColumn<Product>("code", "Code"),
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Name"} />;
      },
      cell: ({ row }) => {
        return <div className="text-left max-w-fit!">{row.original.name}</div>;
      },
    },
    {
      id: "Packed",
      header: ({ column }) => {
        return <SortableHeader column={column} field={"Packed"} />;
      },
      cell: ({ row }) => {
        const normalized = packedStock ?? []
        const stock = normalized.find((s) => s.product_id === row.original.id);
        return <div className="text-center">{stock?.quantity ?? 0}</div>;
      },
    },
    {
      id: "isActive",
      accessorFn: (row) => String(row.isActive),
      header: ({ column }) => <SortableHeader column={column} field="Is Active" />,
      cell: ({ row }) => (
        <div className="w-full flex justify-center">
          <CheckBoxCell row={row} field="isActive" defaultValue={row.original.isActive} onChange={onCellUpdate} />
        </div>
      ),
      filterFn: (row, columnId, selectedValues: string[]) =>
        selectedValues.includes(row.getValue(columnId)),
    },    
    createColumn<Product>("measureUnitId", "Unit"),
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">{row.original.id}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive" disabled={true}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return columns;
};
