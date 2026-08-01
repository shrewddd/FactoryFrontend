import { Mars, Venus, CircleSmall, type LucideIcon } from "lucide-react";
import type { SelectOption } from "./types";
import type { UserGender } from "@/api/generated/models";


const GENDER_ICONS = {
  Male: Mars,
  Female: Venus,
  Other: CircleSmall,
} satisfies Record<UserGender, LucideIcon>;

const GENDER_OPTIONS: SelectOption[] = (
  Object.keys(GENDER_ICONS) as UserGender[]
).map((g) => ({
  id: 0,
  label: g,
  value: g,
  icon: GENDER_ICONS[g],
}));

export function useGenderOptions() {
  return { data: GENDER_OPTIONS };
}
