export type Batch = {
  id: number;
  name?: string | null | undefined;
  size: number;
  actualSize?: number | null | undefined;
  product: {
    id: number;
    name?: string | null | undefined;
    measureUnitId?: number | null | undefined;
  };
  workstation: {
    id: number;
    name?: string | null | undefined;
  };
  status: {
    id: number;
    label?: string | null | undefined;
    sortOrder?: number | null | undefined;
    isTerminal?: boolean | null | undefined;
    allowsDefectReporting?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
  };
  workers?: {
    department: {
      id: number;
      label?: string | null | undefined;
    };
    worker: {
      id: number,
      fullName: string | null | undefined;
    };
  }[] | null | undefined;
  plannedFor: Date;
  isActive: boolean;
}


export type InsertBatch = {
  name?: string | null | undefined;
  size?: number | undefined;
  actualSize?: number | null | undefined;
  productId?: number | null | undefined;
  workstationId?: number | null | undefined;
  statusId: number | null;
  plannedFor: Date;
  isActive: boolean;
  workers?: {
    department: {
      id: number;
      label?: string | null | undefined;
    };
    worker: {
      id: number;
      fullName?: string | null | undefined;
    };
  }[] | null | undefined;
}

export type InsertBatchBulk = InsertBatch & { amount: number };

export type AdvanceBatchPayload = {
  id: number;
  defects: { defect_type_id: number; quantity: number }[];
  sizeOverride?: number;
};

export type PackedStock = {
  product_id: number;
  product_name: string;
  quantity: number;
};

