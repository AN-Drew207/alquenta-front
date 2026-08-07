"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType } from "@/types/enums";

const ALL_TYPES = "all";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") ?? ALL_TYPES;
  const city = searchParams.get("city") ?? "";

  function updateParams(next: { type?: string; city?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    const nextType = next.type ?? type;
    if (nextType && nextType !== ALL_TYPES) {
      params.set("type", nextType);
    } else {
      params.delete("type");
    }

    const nextCity = next.city ?? city;
    if (nextCity) {
      params.set("city", nextCity);
    } else {
      params.delete("city");
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={type}
        onValueChange={(value) => updateParams({ type: value ?? undefined })}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Property type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_TYPES}>All types</SelectItem>
          {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((key) => (
            <SelectItem key={key} value={key}>
              {PROPERTY_TYPE_LABELS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="City"
        defaultValue={city}
        className="w-48"
        onBlur={(event) => updateParams({ city: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            updateParams({ city: event.currentTarget.value });
          }
        }}
      />
    </div>
  );
}
