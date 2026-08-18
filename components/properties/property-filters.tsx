"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowUpDown,
  Bath,
  Bed,
  Car,
  CircleCheck,
  Handshake,
  MapPin,
  Search,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useOperationTypeLabels,
  usePropertyStatusLabels,
  usePropertyTypeLabels,
} from "@/lib/i18n/labels";
import {
  VENEZUELA_STATES,
  getMunicipalities,
} from "@/lib/data/venezuela-locations";
import type {
  OperationType,
  PropertyStatus,
  PropertyType,
} from "@/types/enums";

const ALL_TYPES = "all";
const ANY = "any";
const DEFAULT_SORT = "newest";
const MIN_COUNT_OPTIONS = ["1", "2", "3", "4"];
const SORT_OPTIONS = ["newest", "price_asc", "price_desc", "area_desc"] as const;

type FilterKey =
  | "search"
  | "type"
  | "operationType"
  | "status"
  | "state"
  | "municipality"
  | "minPrice"
  | "maxPrice"
  | "bedrooms"
  | "bathrooms"
  | "parkingSpaces"
  | "sort";

export function PropertyFilters({
  basePath = "/",
  showStatusFilter = false,
}: {
  basePath?: string;
  showStatusFilter?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("home");
  const tMyProperties = useTranslations("myProperties");
  const propertyTypeLabels = usePropertyTypeLabels();
  const operationTypeLabels = useOperationTypeLabels();
  const propertyStatusLabels = usePropertyStatusLabels();

  const values: Record<FilterKey, string> = {
    search: searchParams.get("search") ?? "",
    type: searchParams.get("type") ?? ALL_TYPES,
    operationType: searchParams.get("operationType") ?? ALL_TYPES,
    status: searchParams.get("status") ?? ALL_TYPES,
    state: searchParams.get("state") ?? ANY,
    municipality: searchParams.get("municipality") ?? ANY,
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? ANY,
    bathrooms: searchParams.get("bathrooms") ?? ANY,
    parkingSpaces: searchParams.get("parkingSpaces") ?? ANY,
    sort: searchParams.get("sort") ?? DEFAULT_SORT,
  };

  const [search, setSearch] = useState(values.search);
  const [minPrice, setMinPrice] = useState(values.minPrice);
  const [maxPrice, setMaxPrice] = useState(values.maxPrice);

  const municipalities =
    values.state === ANY ? [] : getMunicipalities(values.state);

  function updateParams(next: Partial<Record<FilterKey, string>>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const key of Object.keys(values) as FilterKey[]) {
      const value = next[key] ?? values[key];
      const isEmpty =
        value === "" ||
        value === ALL_TYPES ||
        value === ANY ||
        value === DEFAULT_SORT;
      if (isEmpty) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-2">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-primary" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-48 rounded-full border-0 bg-muted pl-9"
          onBlur={() => updateParams({ search })}
          onKeyDown={(event) => {
            if (event.key === "Enter") updateParams({ search });
          }}
        />
      </div>

      <Select
        value={values.type}
        onValueChange={(value) => updateParams({ type: value ?? undefined })}
      >
        <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
          <Tag className="size-4 text-primary" />
          <SelectValue placeholder={t("propertyTypePlaceholder")}>
            {(value: string) =>
              value === ALL_TYPES
                ? t("allTypes")
                : propertyTypeLabels[value as PropertyType]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_TYPES}>{t("allTypes")}</SelectItem>
          {(Object.keys(propertyTypeLabels) as PropertyType[]).map((key) => (
            <SelectItem key={key} value={key}>
              {propertyTypeLabels[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.operationType}
        onValueChange={(value) =>
          updateParams({ operationType: value ?? undefined })
        }
      >
        <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
          <Handshake className="size-4 text-primary" />
          <SelectValue placeholder={t("operationTypePlaceholder")}>
            {(value: string) =>
              value === ALL_TYPES
                ? t("allOperations")
                : operationTypeLabels[value as OperationType]
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_TYPES}>{t("allOperations")}</SelectItem>
          {(Object.keys(operationTypeLabels) as OperationType[]).map((key) => (
            <SelectItem key={key} value={key}>
              {operationTypeLabels[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showStatusFilter && (
        <Select
          value={values.status}
          onValueChange={(value) =>
            updateParams({ status: value ?? undefined })
          }
        >
          <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
            <CircleCheck className="size-4 text-primary" />
            <SelectValue placeholder={tMyProperties("statusPlaceholder")}>
              {(value: string) =>
                value === ALL_TYPES
                  ? tMyProperties("allStatuses")
                  : propertyStatusLabels[value as PropertyStatus]
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_TYPES}>
              {tMyProperties("allStatuses")}
            </SelectItem>
            {(Object.keys(propertyStatusLabels) as PropertyStatus[]).map(
              (key) => (
                <SelectItem key={key} value={key}>
                  {propertyStatusLabels[key]}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      )}

      <Select
        value={values.state}
        onValueChange={(value) =>
          updateParams({ state: value ?? undefined, municipality: undefined })
        }
      >
        <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
          <MapPin className="size-4 text-primary" />
          <SelectValue placeholder={t("statePlaceholder")}>
            {(value: string) => (value === ANY ? t("anyState") : value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{t("anyState")}</SelectItem>
          {VENEZUELA_STATES.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.municipality}
        onValueChange={(value) =>
          updateParams({ municipality: value ?? undefined })
        }
        disabled={values.state === ANY}
      >
        <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
          <SelectValue placeholder={t("municipalityPlaceholder")}>
            {(value: string) => (value === ANY ? t("anyMunicipality") : value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{t("anyMunicipality")}</SelectItem>
          {municipalities.map((municipality) => (
            <SelectItem key={municipality} value={municipality}>
              {municipality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex h-11 items-center gap-1 rounded-full bg-muted">
        <PriceInput
          value={minPrice}
          onValueChange={setMinPrice}
          placeholder={t("minPrice")}
          className="h-11 w-28 border-0 !rounded-full bg-transparent shadow-none focus-visible:ring-0"
          onBlur={() => updateParams({ minPrice })}
          onKeyDown={(event) => {
            if (event.key === "Enter") updateParams({ minPrice });
          }}
        />
        <span className="text-muted-foreground">–</span>
        <PriceInput
          value={maxPrice}
          onValueChange={setMaxPrice}
          placeholder={t("maxPrice")}
          className="h-11 w-28 border-0 !rounded-full bg-transparent pr-4 shadow-none focus-visible:ring-0"
          onBlur={() => updateParams({ maxPrice })}
          onKeyDown={(event) => {
            if (event.key === "Enter") updateParams({ maxPrice });
          }}
        />
      </div>

      <Select
        value={values.bedrooms}
        onValueChange={(value) =>
          updateParams({ bedrooms: value ?? undefined })
        }
      >
        <SelectTrigger
          className="rounded-full border-0 bg-muted pl-4"
          aria-label={t("bedroomsPlaceholder")}
        >
          <Bed className="size-4 text-primary" />
          <SelectValue placeholder={t("bedroomsPlaceholder")}>
            {(value: string) =>
              value === ANY ? t("any") : t("countOrMore", { count: value })
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{t("any")}</SelectItem>
          {MIN_COUNT_OPTIONS.map((count) => (
            <SelectItem key={count} value={count}>
              {t("countOrMore", { count })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.bathrooms}
        onValueChange={(value) =>
          updateParams({ bathrooms: value ?? undefined })
        }
      >
        <SelectTrigger
          className="rounded-full border-0 bg-muted pl-4"
          aria-label={t("bathroomsPlaceholder")}
        >
          <Bath className="size-4 text-primary" />
          <SelectValue placeholder={t("bathroomsPlaceholder")}>
            {(value: string) =>
              value === ANY ? t("any") : t("countOrMore", { count: value })
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{t("any")}</SelectItem>
          {MIN_COUNT_OPTIONS.map((count) => (
            <SelectItem key={count} value={count}>
              {t("countOrMore", { count })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.parkingSpaces}
        onValueChange={(value) =>
          updateParams({ parkingSpaces: value ?? undefined })
        }
      >
        <SelectTrigger
          className="rounded-full border-0 bg-muted pl-4"
          aria-label={t("parkingPlaceholder")}
        >
          <Car className="size-4 text-primary" />
          <SelectValue placeholder={t("parkingPlaceholder")}>
            {(value: string) =>
              value === ANY ? t("any") : t("countOrMore", { count: value })
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{t("any")}</SelectItem>
          {MIN_COUNT_OPTIONS.map((count) => (
            <SelectItem key={count} value={count}>
              {t("countOrMore", { count })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={values.sort}
        onValueChange={(value) => updateParams({ sort: value ?? undefined })}
      >
        <SelectTrigger className="rounded-full border-0 bg-muted pl-4">
          <ArrowUpDown className="size-4 text-primary" />
          <SelectValue placeholder={t("sortPlaceholder")}>
            {(value: string) => t(sortLabelKey(value))}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {t(sortLabelKey(option))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function sortLabelKey(
  value: string,
): "sortNewest" | "sortPriceAsc" | "sortPriceDesc" | "sortAreaDesc" {
  switch (value) {
    case "price_asc":
      return "sortPriceAsc";
    case "price_desc":
      return "sortPriceDesc";
    case "area_desc":
      return "sortAreaDesc";
    default:
      return "sortNewest";
  }
}
