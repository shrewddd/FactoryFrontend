import type { Batch, InsertBatch, InsertBatchBulk } from "@/types/batches";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { batchService as service, type PackBatchPayload } from "@/services/batches";
import type { AdvanceBatchPayload } from "@/types/batches";

export const batchKeys = {
  all: () => ["batches"] as const,
  lists: () => [...batchKeys.all(), "list"] as const,
  detail: (id: number) => [...batchKeys.all(), "detail", id] as const,
};

const STALE_TIME = 1000 * 60 * 5;

export const useGetAllBatches = () => {
  return useQuery({
    queryKey: batchKeys.lists(),
    queryFn: service.getAll,
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
};

export const useGetBatch = (id: number) => {
  return useQuery({
    queryKey: batchKeys.detail(id),
    queryFn: () => service.get(id),
    staleTime: STALE_TIME,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, InsertBatch>({
    mutationFn: (data) => service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useCreateBatches = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch[], Error, InsertBatchBulk>({
    mutationFn: (data) => service.createMultiple(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, { id: number; data: InsertBatch }, { previousBatches: Batch[] | undefined }>({
    mutationFn: (data) => service.update(data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: batchKeys.lists() });
      const previousBatches = queryClient.getQueryData<Batch[]>(batchKeys.lists());

      queryClient.setQueryData<Batch[]>(
        batchKeys.lists(),
        (old) =>
          old?.map((batch) => {
            if (batch.id !== id) return batch;
            return {
              ...batch,
              name: data.name ?? batch.name,
              size: data.size ?? batch.size,
              actualSize: data.actualSize ?? batch.actualSize,
              plannedFor: data.plannedFor,
              isActive: data.isActive,
              workers:
                data.workers?.map((w) => ({
                  department: w.department,
                  worker: { id: w.worker.id, fullName: w.worker.fullName ?? null },
                })) ?? batch.workers,
              product: { ...batch.product, id: data.productId ?? batch.product.id },
              workstation: { ...batch.workstation, id: data.workstationId ?? batch.workstation.id },
              status: { ...batch.status, id: data.statusId ?? batch.status.id },
            } satisfies Batch;
          }) ?? [],
      );
      return { previousBatches };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBatches) {
        queryClient.setQueryData(batchKeys.lists(), context.previousBatches);
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, number>({
    mutationFn: (id) => service.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useAdvanceBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, AdvanceBatchPayload>({
    mutationFn: (payload) => service.advance(payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useInitializePlannedBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, void>({
    mutationFn: service.planned.initialize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useExecutePlannedBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, void>({
    mutationFn: service.planned.execute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const usePackBatch = () => {
  const queryClient = useQueryClient();
  return useMutation<Batch, Error, PackBatchPayload>({
    mutationFn: (payload) => service.pack(payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: batchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: batchKeys.lists() });
    },
  });
};

export const useGetPackedStock = () => {
  return useQuery({
    queryKey: ["batches", "packed-stock"],
    queryFn: service.getPackedStock,
    staleTime: STALE_TIME,
  });
};

export const useBatches = {
  getAll: useGetAllBatches,
  get: useGetBatch,
  create: useCreateBatch,
  createMultiple: useCreateBatches,
  update: useUpdateBatch,
  delete: useDeleteBatch,
  advance: useAdvanceBatch,
  pack: usePackBatch,
  getPackedStock: useGetPackedStock,
};

export const usePlannedBatches = {
  initialize: useInitializePlannedBatch,
  execute: useExecutePlannedBatch,
};
