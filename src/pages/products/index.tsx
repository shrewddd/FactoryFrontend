import { DataTable } from "@/components/data-table"
import { getProductColumns } from "./columns"
import { useProducts } from "@/hooks/useProducts"
import { CircleCheck, CircleX } from "lucide-react"
import { useBatches } from "@/hooks/useBatch"

export const ProductsPage = () => {
  const { data: products, isLoading } = useProducts.getAll() 
  const { mutate: updateProduct } = useProducts.update()
  const { data: packedStock } = useBatches.getPackedStock();

  const handleCellUpdate = (field: string, value: string | boolean, row: any) => {
    updateProduct({
      id: row.original.id,
      data: {
        ...row.original,
        [field]: value,
      }
    })
  }

  if (isLoading) {
    <div>Loading...</div>
  }

  const isActiveFilter = {
    column: "isActive", 
    title: "Is active", 
    options: [
      {
        label: "Active",
        value: "true",
        icon: CircleCheck,
      },
      {
        label: "Inactive",
        value: "false",
        icon: CircleX,
      }
    ],
  }

  const filters = [isActiveFilter]

  return (
    <DataTable 
      columns={getProductColumns({onCellUpdate: handleCellUpdate, packedStock})} 
      data={products ? products : []} 
      isAddSection={false}
      searchValues="name" 
      filters={filters}
      initialState={{
        columnFilters: [
          { id: "isActive", value: ["true"] }
        ],
        columnVisibility: { code: false, measureUnit: false, category: false } 
      }}
    />
  )
}
