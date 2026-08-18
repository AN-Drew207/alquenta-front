"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCreateReportMutation } from "@/hooks/use-reports";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReportReason } from "@/types/reports";

const REASONS: ReportReason[] = [
  "SCAM",
  "MISLEADING_INFO",
  "INAPPROPRIATE_CONTENT",
  "OTHER",
];

function reasonLabelKey(reason: ReportReason): string {
  switch (reason) {
    case "SCAM":
      return "reportReasonScam";
    case "MISLEADING_INFO":
      return "reportReasonMisleadingInfo";
    case "INAPPROPRIATE_CONTENT":
      return "reportReasonInappropriateContent";
    default:
      return "reportReasonOther";
  }
}

/** Renders nothing for anonymous visitors — reporting requires a session,
 * same as favoriting, so there's accountability behind each report — nor
 * for the property's own owner, who can't report their own listing. */
export function ReportPropertyDialog({
  propertyId,
  adminId,
}: {
  propertyId: string;
  adminId: string;
}) {
  const t = useTranslations("propertyDetail");
  const { data: user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const createReportMutation = useCreateReportMutation();

  const schema = z.object({
    reason: z.enum(REASONS as [ReportReason, ...ReportReason[]], {
      error: t("reportReasonRequired"),
    }),
    details: z.string().max(1000).optional(),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { details: "" },
  });

  if (!user || user.id === adminId) return null;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function onSubmit(values: FormValues) {
    createReportMutation.mutate(
      { propertyId, reason: values.reason, details: values.details },
      {
        onSuccess: () => {
          toast.success(t("reportSent"));
          setOpen(false);
          reset();
        },
        onError: (error) =>
          toast.error(translateApiError(error, t("couldNotSendReport"))),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-muted-foreground" />
        }
      >
        <Flag className="size-3.5" />
        {t("reportListing")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reportDialogTitle")}</DialogTitle>
          <DialogDescription>{t("reportDialogDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("reportReasonLabel")}</Label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("reportReasonPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {t(reasonLabelKey(reason))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="details">{t("reportDetailsLabel")}</Label>
            <Textarea
              id="details"
              rows={3}
              placeholder={t("reportDetailsPlaceholder")}
              {...register("details")}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createReportMutation.isPending}>
              {createReportMutation.isPending ? t("sendingReport") : t("sendReport")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
