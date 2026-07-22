import { useGetAllBatchStatuses } from "@/api/generated/batch-status/batch-status";
import { CircleX, Scissors, Spool, Cone, Layers, Tag, Archive, CircleCheck, BookCheck, type LucideIcon } from "lucide-react";

const ICONS: Record<number, typeof CircleX> = {
  1: CircleX,
  2: BookCheck,
  3: Scissors,
  4: Scissors,
  5: Spool,
  6: Spool,
  7: Cone,
  8: Cone,
  9: Layers,
  10: Layers,
  11: Tag,
  12: Tag,
  13: Archive,
  14: CircleCheck,
};

export function getBatchStatusIcon(statusId: number): LucideIcon {
  return ICONS[statusId] ?? Layers;
}

export function useBatchStatusFilters() {
  const { data, isLoading } = useGetAllBatchStatuses();

  const options = (data ?? []).map((s) => ({
    label: s.label,
    value: String(s.id),
    icon: getBatchStatusIcon(s.id),
  }));

  return { data, options, isLoading };
}
