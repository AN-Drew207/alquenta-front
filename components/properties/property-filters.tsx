"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Tag } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-3 rounded-full border border-border bg-card p-2">
      <Select
        value={type}
        onValueChange={(value) => updateParams({ type: value ?? undefined })}
      >
        <SelectTrigger className="w-48 rounded-full border-0 bg-muted pl-4">
          <Tag className="size-4 text-primary" />
          <SelectValue placeholder="Property type">
            {(value: string) =>
              value === ALL_TYPES
                ? "All types"
                : PROPERTY_TYPE_LABELS[value as PropertyType]
            }
          </SelectValue>
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

      <div className="flex h-8 w-48 items-center gap-2 rounded-full bg-muted pl-4">
        <MapPin className="size-4 shrink-0 text-primary" />
        <Input
          placeholder="City"
          defaultValue={city}
          className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          onBlur={(event) => updateParams({ city: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              updateParams({ city: event.currentTarget.value });
            }
          }}
        />
      </div>
    </div>
  );
}
