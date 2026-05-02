"use client";

import { SortableHeader } from "@/components/data-table/sortable-header";
import { type ColumnDef, type Row } from "@tanstack/react-table";
import type { Batch, InsertBatch } from "@/types/batches";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createColumn, createIdColumn, createSelectColumn } from "@/components/data-table/common-columns";
import { formatDate } from "date-fns";
import { useGetProduct } from "@/hooks/useProducts";
import { InputCell } from "@/components/data-table/input-cell";
import { SelectCell } from "@/components/data-table/select-cell";
import type { Product } from "@/types/products";
import type { User } from "@/types/users";
import type { Workstation } from "@/types/workstation";
import { useDeleteBatch } from "@/hooks/useBatch";
import type { Department } from "@/types/departments";
import type { BatchStatus } from ".";

export const columns: ColumnDef<Batch>[] = [
  createSelectColumn<Batch>(),
  createIdColumn<Batch>(),
  createColumn<Batch>("name", "Name"),
  createColumn<Batch>("status", "Status"),
  createColumn<Batch>("size", "Batch size"),
  {
    accessorKey: "productId",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Product"} />;
    },
    cell: ({ row }) => {
      const { data: product, isLoading } = useGetProduct(row.original.product.id || 0);

      return <div>{isLoading ? "Loading" : product ? product.name : "Not found"}</div>;
    },
  },
  // {
  //   accessorKey: "masters.knitting",
  //   header: ({ column }) => {
  //     return <SortableHeader column={column} field={"Knitting"} />;
  //   },
  //   cell: ({ row }) => {
  //     const { data: user, isLoading } = useGetUser(row.original.masters.knitting ?? 0);
  //
  //     return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "masters.sewing",
  //   header: ({ column }) => {
  //     return <SortableHeader column={column} field={"Sewing"} />;
  //   },
  //   cell: ({ row }) => {
  //     const { data: user, isLoading } = useGetUser(row.original.masters.sewing ?? 0);
  //     return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "masters.molding",
  //   header: ({ column }) => {
  //     return <SortableHeader column={column} field={"Molding"} />;
  //   },
  //   cell: ({ row }) => {
  //     const { data: user, isLoading } = useGetUser(row.original.masters.molding ?? 0);
  //     return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "masters.labeling",
  //   header: ({ column }) => {
  //     return <SortableHeader column={column} field={"Labeling"} />;
  //   },
  //   cell: ({ row }) => {
  //     const { data: user, isLoading } = useGetUser(row.original.masters.labeling ?? 0);
  //     return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
  //   },
  // },
  // {
  //   accessorKey: "masters.packaging",
  //   header: ({ column }) => {
  //     return <SortableHeader column={column} field={"Packaging"} />;
  //   },
  //   cell: ({ row }) => {
  //     const { data: user, isLoading } = useGetUser(row.original.masters.packaging ?? 0);
  //     return <div>{isLoading ? "Loading" : user ? user.fullName : "Not found"}</div>;
  //   },
  // },
  {
    accessorKey: "plannedFor",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Planned for"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <SortableHeader column={column} field={"Last updated"} />;
    },
    cell: ({ row }) => {
      return <div className="text-center">{formatDate(row.original.plannedFor || 0, "dd/MM/yyyy")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu {row.original.name}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled={true}>Link to QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>See QR</DropdownMenuItem>
              <DropdownMenuItem disabled={true}>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={true}>Edit</DropdownMenuItem>
              <DropdownMenuItem disabled={true} variant="destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export type UpdateFunction = (field: keyof InsertBatch, value: any, row: Row<Batch>) => void;

function createSizeColumn(handleCellUpdate: UpdateFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "size",
    header: ({ column }) => <SortableHeader column={column} field={"Batch size"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.size}
          onBlur={(e) => {
            e.preventDefault();
            handleCellUpdate("size", Number(e.target.value), row);
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.size}`}</div>
      );
    },
  };
}

function createNameColumn(handleCellUpdate: UpdateFunction, isChangable: boolean): ColumnDef<Batch> {
  return {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} field={"Name"} />,
    cell: ({ row }) => {
      return isChangable ? (
        <InputCell
          defaultValue={row.original.name || undefined}
          onBlur={(e) => {
            e.preventDefault();
            handleCellUpdate("name", e.target.value, row);
          }}
        />
      ) : (
        <div className="text-center">{`${row.original.name}`}</div>
      );
    },
  };
}

function createWorkstationColumn(handleCellUpdate: UpdateFunction, isChangable: boolean, workstations: Workstation[]): ColumnDef<Batch> {
  return {
    accessorKey: "workstationId",
    header: ({ column }) => <SortableHeader column={column} field={"workstations"} />,
    cell: ({ row }) => {
      const selectedWorkstation = workstations?.find((w) => w.id === row.original.workstation.id);
      const workstationData = workstations.map((workstation) => {
        return {
          label: workstation.name,
          value: String(workstation.id),
        };
      });

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={selectedWorkstation !== undefined ? String(selectedWorkstation.id) : "Select product"}
          data={workstationData ? workstationData : []}
          placeholder="Select workstation"
          onChange={(value) => {
            handleCellUpdate("workstationId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${row.original.workstation.name}`}</div>
      );
    },
  };
}

function createProductColumn(handleCellUpdate: UpdateFunction, isChangable: boolean, products: Product[]): ColumnDef<Batch> {
  return {
    accessorKey: "productId",
    header: ({ column }) => <SortableHeader column={column} field={"Product"} />,
    cell: ({ row }) => {
      const selectedProduct = products?.find((p) => p.id === row.original.product.id);
      const productsData = products
        ?.filter((product) => product.isActive)
        .map((product) => {
          return {
            label: product.name,
            value: String(product.id),
          };
        });

      return isChangable ? (
        <SelectCell
          row={row}
          defaultValue={selectedProduct !== undefined ? String(selectedProduct.id) : "Select product"}
          data={productsData ? productsData : []}
          placeholder="Select product"
          onChange={(value) => {
            handleCellUpdate("productId", Number(value), row);
          }}
        />
      ) : (
        <div>{`${selectedProduct?.name}`}</div>
      );
    },
  };
}

// function createMasterColumn(
//   handleCellUpdate: UpdateFunction,
//   isChangable: boolean,
//   users: User[],
//   department: UserDepartment,
// ): ColumnDef<Batch> {
//   return {
//     accessorKey: `masters.${department}`,
//     header: ({ column }) => <SortableHeader column={column} field={department} />,
//     cell: ({ row }) => {
//       const usersData =
//         users
//           ?.filter((user) => user.departments?.includes(department))
//           .map((user) => ({
//             label: user.fullName,
//             value: String(user.id),
//           })) ?? [];
//
//       const departmentKey = department.toLowerCase() as keyof Batch["masters"];
//
//       const selectedMasterId = row.original.masters?.[departmentKey];
//
//       return isChangable ? (
//         <SelectCell
//           row={row}
//           defaultValue={String(selectedMasterId)}
//           data={usersData}
//           placeholder="Select master"
//           onChange={(value) => handleCellUpdate(departmentKey, Number(value), row)}
//         />
//       ) : (
//         <div className="text-center">{`${row.original.name}`}</div>
//       );
//     },
//   };
// }

function createWorkerColumn(handleCellUpdate: UpdateFunction, users: User[], department: Department): ColumnDef<Batch> {
  return {
    accessorKey: `workers_${department.label}`,
    header: ({ column }) => <SortableHeader column={column} field={department.label} />,
    cell: ({ row }) => {
      // console.log(row.original)
      const entry = row.original.workers?.find((w) => w.department.id === department.id);

      const usersData = users
      .filter((u) =>
        u.role?.label === "Admin" ||
          u.departments?.some((d) => d.id === department.id)
      )
      .map((u) => ({ label: u.fullName ?? "", value: String(u.id) }));


      return (
        <SelectCell
          row={row}
          defaultValue={entry ? String(entry.worker.id) : ""}
          data={usersData}
          placeholder="Select worker"
          onChange={(value) => handleCellUpdate("workers", { departmentId: department.id, workerId: Number(value) }, row)}
        />
      );
    },
  };
}

function createActualSizeColumn(handleCellUpdate: UpdateFunction): ColumnDef<Batch> {
  return {
    accessorKey: "actualSize",
    header: ({ column }) => <SortableHeader column={column} field={"Actual size"} />,
    cell: ({ row }) => (
      <InputCell
        defaultValue={String(row.original.actualSize)}
        onBlur={(e) => {
          e.preventDefault();
          handleCellUpdate("actualSize", Number(e.target.value), row);
        }}
      />
    ),
  };
}

function createStatusColumn(
  handleCellUpdate: UpdateFunction,
  statuses: BatchStatus[],
): ColumnDef<Batch> {
  return {
    id: "status",
    accessorFn: (row) => row.status?.label ?? "",
    header: ({ column }) => <SortableHeader column={column} field="Status" />,
    cell: ({ row }) => {
      const statusData = statuses.map((s) => ({
        label: s.label,
        value: String(s.id),
      }));

      return (
        <SelectCell
          row={row}
          defaultValue={String(row.original.status?.id ?? "")}
          data={statusData}
          placeholder="Select status"
          onChange={(value) => {
            handleCellUpdate("statusId", Number(value), row);
          }}
        />
      );
    },
  };
}

export const getBatchColumns = (
  onChange: UpdateFunction,
  products: Product[],
  users: User[],
  workstations: Workstation[],
  departments: Department[],
  statuses: BatchStatus[],
): ColumnDef<Batch>[] => {
  const { mutate: deleteBatch } = useDeleteBatch();

  const columns: ColumnDef<Batch>[] = [
    createSelectColumn<Batch>(),
    createIdColumn<Batch>(),
    // {
    //   id: "status",
    //   accessorFn: (row) => row.status?.label ?? "",
    //   header: ({ column }) => <SortableHeader column={column} field="Status" />,
    //   cell: ({ row }) => <div className="text-center">{row.original.status.label}</div>,
    // },
    createStatusColumn(onChange, statuses),
    createSizeColumn(onChange, true),
    createActualSizeColumn(onChange),
    // createColumn<Batch>("actualSize", "Actual size"),
    createNameColumn(onChange, true),
    createWorkstationColumn(onChange, true, workstations),
    createProductColumn(onChange, true, products),
    ...departments.map((dept) => createWorkerColumn(onChange, users, dept)),
    {
      accessorKey: "plannedFor",
      header: ({ column }) => <SortableHeader column={column} field="Planned for" />,
      cell: ({ row }) => <div className="text-center">{formatDate(row.original.plannedFor, "dd/MM/yyyy")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>Link to QR</DropdownMenuItem>
              <DropdownMenuItem disabled>See QR</DropdownMenuItem>
              <DropdownMenuItem disabled>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => deleteBatch(row.original.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return columns;
};
