"use client"

import { getCoreRowModel, useReactTable, getSortedRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, getFilteredRowModel, type VisibilityState, getPaginationRowModel, type TableState, type PaginationState, getFacetedRowModel, getFacetedUniqueValues, type Table, type OnChangeFn, type RowSelectionState } from "@tanstack/react-table"
import { useState, useImperativeHandle, type ReactNode, type Ref } from "react"

import { TablePagination } from "./pagination"
import { TableToolbar } from "./toolbar"
import { TableContent } from "./content"
import { AddRecordDialog } from "./add-record-dialog"
import { type JSX } from "react"
import type { LucideIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
  contentForm?: JSX.Element,
  searchValues?: string,
  filters?: {
    column: string;
    title?: string;
    options: {
      label: string;
      value: string;
      icon?: LucideIcon | ReactNode;
    }[];
  }[];
  initialState?: Partial<TableState>; 
  toolbarExtras?: JSX.Element;
  isAddSection?: boolean;
  tableRef?: Ref<Table<TData>>;
  onRowSelectionChange?: (count: number) => void;
}

export function DataTable<TData, TValues>({ columns, searchValues, data, contentForm, filters, initialState, toolbarExtras, isAddSection = true, tableRef, onRowSelectionChange } : DataTableProps<TData, TValues>){
  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility || {})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: 50 })

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    setRowSelection((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      onRowSelectionChange?.(Object.keys(next).length);
      return next;
    });
  };

  const table = useReactTable({
    data, 
    columns, 
    getRowId: (row: any) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: setPagination,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: (table, columnId) => {
      const defaultFaceted = getFacetedUniqueValues()(table, columnId);

      return () => {
        const rows = table.getPreFilteredRowModel().rows;

        if (rows.length === 0) return defaultFaceted();

        const firstValue = rows[0]?.getValue(columnId);

        if (Array.isArray(firstValue)) {
          const map = new Map<string, number>();
          rows.forEach((row) => {
            const values = row.getValue<string[]>(columnId);
            values?.forEach((v) => { map.set(v, (map.get(v) ?? 0) + 1); });
          });
          return map;
        }

        return defaultFaceted();
      };
    },
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  useImperativeHandle(tableRef, () => table);

  return (
    <div className="flex flex-col w-full">
      <TableToolbar table={table} searchBarValue={searchValues} onAddRecord={() => setIsAddFormOpen(true)} filters={filters} toolbarExtras={toolbarExtras} isAddSection={isAddSection}/>
      <TableContent table={table} columns={columns}/>
      <TablePagination table={table}/>
      <AddRecordDialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen} contentForm={contentForm}/>
    </div>
  )
}
