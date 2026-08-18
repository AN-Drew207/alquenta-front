import { VENEZUELA_STATES } from "@/lib/data/venezuela-locations";
import type { OperationType } from "@/types/enums";

/**
 * URL slugs for the SEO landing pages (/[operacion]/[estado]) are
 * deliberately Spanish and independent from next-intl's locale switch —
 * these are indexed, permanent URLs, not display strings.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const STATE_SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  VENEZUELA_STATES.map((state) => [slugify(state.name), state.name]),
);

export function stateSlugToName(slug: string): string | undefined {
  return STATE_SLUG_TO_NAME[slug];
}

export function stateNameToSlug(name: string): string {
  return slugify(name);
}

const OPERATION_SLUG_TO_TYPE: Record<string, OperationType> = {
  alquiler: "RENT",
  venta: "SALE",
};

const OPERATION_TYPE_TO_SLUG: Record<OperationType, string> = {
  RENT: "alquiler",
  SALE: "venta",
};

export function operationSlugToType(slug: string): OperationType | undefined {
  return OPERATION_SLUG_TO_TYPE[slug];
}

export function operationTypeToSlug(type: OperationType): string {
  return OPERATION_TYPE_TO_SLUG[type];
}
