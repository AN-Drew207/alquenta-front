"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OPERATION_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants";
import type {
  OperationType,
  PropertyStatus,
  PropertyType,
} from "@/types/enums";
import type { Property } from "@/types/property";

const propertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  type: z.enum(["HOUSE", "APARTMENT", "COMMERCIAL_SPACE", "OFFICE", "LAND"]),
  operationType: z.enum(["RENT", "SALE"]),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => Number(v) > 0, "Price must be greater than zero"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareMeters: z.string().optional(),
  images: z.string().optional(),
  status: z.enum(["AVAILABLE", "RENTED_OR_SOLD", "CANCELLED"]).optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export interface PropertyFormSubmitValues {
  title: string;
  description: string;
  address: string;
  city: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  images?: string[];
  status?: PropertyStatus;
}

export function PropertyForm({
  defaultProperty,
  onSubmit,
  isSubmitting,
  showStatus = false,
  submitLabel = "Save",
}: {
  defaultProperty?: Property;
  onSubmit: (values: PropertyFormSubmitValues) => void;
  isSubmitting: boolean;
  showStatus?: boolean;
  submitLabel?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultProperty
      ? {
          title: defaultProperty.title,
          description: defaultProperty.description,
          address: defaultProperty.address,
          city: defaultProperty.city,
          type: defaultProperty.type,
          operationType: defaultProperty.operationType,
          price: String(defaultProperty.price),
          bedrooms:
            defaultProperty.bedrooms === null ? "" : String(defaultProperty.bedrooms),
          bathrooms:
            defaultProperty.bathrooms === null ? "" : String(defaultProperty.bathrooms),
          squareMeters:
            defaultProperty.squareMeters === null
              ? ""
              : String(defaultProperty.squareMeters),
          images: defaultProperty.images.join(", "),
          status: defaultProperty.status,
        }
      : {
          type: "APARTMENT",
          operationType: "RENT",
        },
  });

  function submit(values: PropertyFormValues) {
    onSubmit({
      title: values.title,
      description: values.description,
      address: values.address,
      city: values.city,
      type: values.type,
      operationType: values.operationType,
      price: Number(values.price),
      bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
      bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
      squareMeters: values.squareMeters ? Number(values.squareMeters) : undefined,
      images: values.images
        ? values.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      status: values.status,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: PropertyType) => PROPERTY_TYPE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {PROPERTY_TYPE_LABELS[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Operation</Label>
          <Controller
            control={control}
            name="operationType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: OperationType) => OPERATION_TYPE_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(OPERATION_TYPE_LABELS) as OperationType[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {OPERATION_TYPE_LABELS[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price">Price (USD)</Label>
        <Input id="price" type="number" min={0} {...register("price")} />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" min={0} {...register("bedrooms")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" min={0} {...register("bathrooms")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="squareMeters">Square meters</Label>
          <Input
            id="squareMeters"
            type="number"
            min={0}
            {...register("squareMeters")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="images">Image URLs (comma-separated)</Label>
        <Input id="images" {...register("images")} placeholder="https://..." />
      </div>

      {showStatus && (
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: PropertyStatus) => PROPERTY_STATUS_LABELS[value]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROPERTY_STATUS_LABELS) as PropertyStatus[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {PROPERTY_STATUS_LABELS[key]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
