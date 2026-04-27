import { getBatchColumns } from "./columns";
import { DataTable } from "@/components/data-table";
// import { BatchForm } from "../forms/batch";
import { CircleX, CircleCheck, Spool, Scissors, Layers, Tag, Cone, Archive } from "lucide-react";
import { useBatches, useCreateBatch, useUpdateBatch } from "@/hooks/useBatch";
import { useGetAllProducts } from "@/hooks/useProducts";
import { useGetAllUsers } from "@/hooks/useUsers";
import type { Batch, InsertBatch } from "@/types/batches";
import type { Row } from "@tanstack/react-table";
import { useGetAllWorkstations } from "@/hooks/useWorkstations";
import { Button } from "@/components/ui/button";
import type { Department } from "@/types/departments";
import { useState } from "react";

export const BatchPage = () => {
  const { data: batches } = useBatches.getAll();
  const { data: products } = useGetAllProducts()
  const { data: users } = useGetAllUsers()
  const { data: workstations } = useGetAllWorkstations()
  const { mutate: updateBatch } = useUpdateBatch();

  const status = [
    { label: "Inactive", value: "Inactive", icon: CircleX },
    { label: "Activated", value: "Activated", icon: Scissors },
    { label: "Knitting Workshop (Waiting for confirmation)", value: "Knitting Workshop (Waiting for confirmation)", icon: Scissors },
    { label: "Knitting Workshop (Confirmed)", value: "Knitting Workshop (Confirmed)", icon: Scissors },
    { label: "Sewing Workshop (In-Progress)", value: "Sewing Workshop (In-Progress)", icon: Spool },
    { label: "Sewing Workshop (Finished)", value: "Sewing Workshop (Finished)", icon: Spool },
    { label: "Turning Workshop (In-Progress)", value: "Turning Workshop (In-Progress)", icon: Cone },
    { label: "Turning Workshop (Finished)", value: "Turning Workshop (Finished)", icon: Cone },
    { label: "Molding Workshop (In-Progress)", value: "Molding Workshop (In-Progress)", icon: Layers },
    { label: "Molding Workshop (Finished)", value: "Molding Workshop (Finished)", icon: Layers },
    { label: "Labeling Workshop (In-Progress)", value: "Labeling Workshop (In-Progress)", icon: Tag },
    { label: "Labeling Workshop (Finished)", value: "Labeling Workshop (Finished)", icon: Tag },
    { label: "Packaging Workshop (In-Progress)", value: "Packaging Workshop (In-Progress)", icon: Archive },
    { label: "Completed", value: "Completed", icon: CircleCheck },
  const { mutateAsync: createBatch } = useCreateBatch();
  ];


  const filters = [{ column: "status", title: "Status", options: status }];


const toInsertBatch = (batch: Batch): InsertBatch => ({
    name:          batch.name,
    size:          batch.size,
    actualSize:    batch.actualSize,
    productId:     batch.product.id,
    workstationId: batch.workstation.id,
    statusId:      batch.status.id,
    plannedFor:    batch.plannedFor,
    isActive:      batch.isActive,
    workers:       batch.workers,
  });

  type UpdateFunction = (field: keyof InsertBatch, value: any, row: Row<Batch>) => void;


  const handleCellUpdate: UpdateFunction = (field, value, row) => {
    const current = toInsertBatch(row.original);

    if (field === "workers") {
      const { departmentId, workerId } = value as { departmentId: number; workerId: number };
      const existing = current.workers ?? [];
      const updated = existing.some((w) => w.department.id === departmentId)
        ? existing.map((w) =>
            w.department.id === departmentId ? { ...w, worker: { id: workerId } } : w,
          )
        : [...existing, { department: { id: departmentId }, worker: { id: workerId } }];

      updateBatch({ id: row.original.id, data: { ...current, workers: updated } });
      return;
    }

    updateBatch({ id: row.original.id, data: { ...current, [field]: value } });
  };

  const handleRowClick = () => {
    createBatch({
      name: null,
      size: 200,
      actualSize: 200,
      productId: undefined,
      workstationId:undefined,
      statusId: null,
      plannedFor: new Date(),
      workers: [],
      isActive: true,
    });
  };

  const [isAdding, setIsAdding] = useState(false);

  const handleAdd36 = async () => {
    setIsAdding(true);
    for (let i = 0; i < 36; i++) {
      await createBatch({
        name: null,
        size: 200,
        actualSize: 200,
        productId: undefined,
        workstationId: i + 1,
        statusId: null,
        plannedFor: new Date(),
        workers: [],
        isActive: true,
      });
    }
    setIsAdding(false);
  };

  const departments: Department[] = [
    { id: 1, label: "Knitting", isActive: true },
    { id: 2, label: "Sewing", isActive: true },
    { id: 3, label: "Turning", isActive: true },
    { id: 4, label: "Molding", isActive: true },
    { id: 5, label: "Labeling", isActive: true },
    { id: 6, label: "Packaging", isActive: true },
  ]

  const columns = getBatchColumns(handleCellUpdate, products ?? [], users ?? [], workstations ?? [], departments ?? [], status);

  const [showArchive, setShowArchive] = useState(false)

  const normalised = batches ?? []
  const resultBatches = !showArchive ? normalised.filter(b => b.status.label !== "Completed") : normalised.filter(b => b.status.label === "Completed")

  return (
    <DataTable
      columns={columns}
      data={resultBatches ?? []}
      // contentForm={<BatchForm onSuccess={refetch} />}
      isAddSection={false}
      toolbarExtras={
        <div className="flex justify-between w-full">
          <Button className="h-8" variant="outline" onClick={() => setShowArchive(!showArchive)}>{!showArchive ? "Показать архив" : "Скрыть архив"}</Button>
          <div className="flex flex-row gap-2">
            <Button className="h-8" variant="outline" onClick={handleRowClick}>Add row</Button>
            <Button className="h-8" variant="outline" onClick={handleAdd36} disabled={isAdding}>{isAdding ? "Adding..." : "Add 36"}</Button>
          </div>
        </div>
      }
      filters={filters}
      searchValues={"name"}
      initialState={{ 
        columnVisibility: { plannedFor: false, updatedAt: false } 
      }}
    />
  );
};
