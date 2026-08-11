"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { WizardStepsIndicator } from "./wizard-steps-indicator";
import { BasicsStep } from "./steps/basics-step";
import { LocationPriceStep } from "./steps/location-price-step";
import { MediaStep } from "./steps/media-step";
import { ReviewStep } from "./steps/review-step";
import type {
  OperationType,
  PropertyStatus,
  PropertyType,
} from "@/types/enums";
import type { Property } from "@/types/property";

export interface PropertyWizardValues {
  title: string;
  description: string;
  type: PropertyType;
  operationType: OperationType;
  address: string;
  state: string;
  municipality: string;
  price: string;
  bedrooms?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  squareMeters?: string;
  images?: string[];
  videos?: string[];
  status?: PropertyStatus;
}

export interface PropertyFormSubmitValues {
  title: string;
  description: string;
  address: string;
  state: string;
  municipality: string;
  type: PropertyType;
  operationType: OperationType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  squareMeters?: number;
  images?: string[];
  videos?: string[];
  status?: PropertyStatus;
}

const STEP_FIELDS: (keyof PropertyWizardValues)[][] = [
  ["title", "description", "type", "operationType"],
  [
    "address",
    "state",
    "municipality",
    "price",
    "bedrooms",
    "bathrooms",
    "parkingSpaces",
    "squareMeters",
  ],
  [],
  [],
];

export function PropertyWizard({
  defaultProperty,
  onSubmit,
  isSubmitting,
  showStatus = false,
  submitLabel,
}: {
  defaultProperty?: Property;
  onSubmit: (values: PropertyFormSubmitValues) => void;
  isSubmitting: boolean;
  showStatus?: boolean;
  submitLabel?: string;
}) {
  const t = useTranslations("myProperties");
  const tCommon = useTranslations("common");
  const STEPS = [
    t("wizardStepBasics"),
    t("wizardStepLocationPrice"),
    t("wizardStepMedia"),
    t("wizardStepReview"),
  ];
  const [step, setStep] = useState(0);

  const propertyWizardSchema = z.object({
    title: z.string().min(1, t("titleRequired")),
    description: z.string().min(1, t("descriptionRequired")),
    type: z.enum(["HOUSE", "APARTMENT", "COMMERCIAL_SPACE", "OFFICE", "LAND"]),
    operationType: z.enum(["RENT", "SALE"]),
    address: z.string().min(1, t("addressRequired")),
    state: z.string().min(1, t("stateRequired")),
    municipality: z.string().min(1, t("municipalityRequired")),
    price: z
      .string()
      .min(1, t("priceRequired"))
      .refine((v) => Number(v) > 0, t("priceMustBePositive")),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    parkingSpaces: z.string().optional(),
    squareMeters: z.string().optional(),
    images: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([]),
    status: z.enum(["AVAILABLE", "RENTED_OR_SOLD", "CANCELLED"]).optional(),
  });

  const methods = useForm<PropertyWizardValues>({
    resolver: zodResolver(propertyWizardSchema),
    defaultValues: defaultProperty
      ? {
          title: defaultProperty.title,
          description: defaultProperty.description,
          address: defaultProperty.address,
          state: defaultProperty.state,
          municipality: defaultProperty.municipality,
          type: defaultProperty.type,
          operationType: defaultProperty.operationType,
          price: String(defaultProperty.price),
          bedrooms:
            defaultProperty.bedrooms === null
              ? ""
              : String(defaultProperty.bedrooms),
          bathrooms:
            defaultProperty.bathrooms === null
              ? ""
              : String(defaultProperty.bathrooms),
          parkingSpaces:
            defaultProperty.parkingSpaces === null
              ? ""
              : String(defaultProperty.parkingSpaces),
          squareMeters:
            defaultProperty.squareMeters === null
              ? ""
              : String(defaultProperty.squareMeters),
          images: defaultProperty.images,
          videos: defaultProperty.videos,
          status: defaultProperty.status,
        }
      : {
          type: "APARTMENT",
          operationType: "RENT",
          images: [],
          videos: [],
        },
  });

  const { handleSubmit, trigger } = methods;

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit(values: PropertyWizardValues) {
    onSubmit({
      title: values.title,
      description: values.description,
      address: values.address,
      state: values.state,
      municipality: values.municipality,
      type: values.type,
      operationType: values.operationType,
      price: Number(values.price),
      bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
      bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
      parkingSpaces: values.parkingSpaces
        ? Number(values.parkingSpaces)
        : undefined,
      squareMeters: values.squareMeters
        ? Number(values.squareMeters)
        : undefined,
      images: values.images,
      videos: values.videos,
      status: values.status,
    });
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6 w-full">
        <WizardStepsIndicator steps={STEPS} currentStep={step} />

        <form onSubmit={handleSubmit(submit)}>
          {step === 0 && <BasicsStep />}
          {step === 1 && <LocationPriceStep />}
          {step === 2 && <MediaStep />}
          {step === 3 && <ReviewStep showStatus={showStatus} />}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 0}
            >
              {tCommon("back")}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext}>
                {tCommon("next")}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : (submitLabel ?? t("publish"))}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
