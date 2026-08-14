"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { usePatchProfileMutation } from "@/hooks/use-profile";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/auth";

const notificationsSchema = z.object({
  newMessage: z.boolean(),
  threadReply: z.boolean(),
  unanswered: z.boolean(),
  weeklyDigest: z.boolean(),
  listingExpiring: z.boolean(),
  product: z.boolean(),
  channelEmail: z.boolean(),
  channelInApp: z.boolean(),
  channelWhatsapp: z.boolean(),
  quietFrom: z.string(),
  quietTo: z.string(),
});
type NotificationsFormValues = z.infer<typeof notificationsSchema>;

function CheckboxRow({
  id,
  label,
  register,
}: {
  id: keyof NotificationsFormValues;
  label: string;
  register: ReturnType<typeof useForm<NotificationsFormValues>>["register"];
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2 rounded-md border border-border p-3"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0"
        {...register(id)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function NotificationsSection({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();

  const { register, handleSubmit, reset } = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      newMessage: false,
      threadReply: false,
      unanswered: false,
      weeklyDigest: false,
      listingExpiring: false,
      product: false,
      channelEmail: false,
      channelInApp: false,
      channelWhatsapp: false,
      quietFrom: "22:00",
      quietTo: "08:00",
    },
  });

  useEffect(() => {
    const prefs = profile.notificationPrefs;
    reset({
      newMessage: prefs.newMessage,
      threadReply: prefs.threadReply,
      unanswered: prefs.unanswered,
      weeklyDigest: prefs.weeklyDigest,
      listingExpiring: prefs.listingExpiring,
      product: prefs.product,
      channelEmail: prefs.channels.email,
      channelInApp: prefs.channels.inApp,
      channelWhatsapp: prefs.channels.whatsapp,
      quietFrom: prefs.quietFrom,
      quietTo: prefs.quietTo,
    });
  }, [profile, reset]);

  function onSubmit(values: NotificationsFormValues) {
    patchProfileMutation.mutate(
      {
        notificationPrefs: {
          newMessage: values.newMessage,
          threadReply: values.threadReply,
          unanswered: values.unanswered,
          weeklyDigest: values.weeklyDigest,
          listingExpiring: values.listingExpiring,
          product: values.product,
          channels: {
            email: values.channelEmail,
            inApp: values.channelInApp,
            whatsapp: values.channelWhatsapp,
          },
          quietFrom: values.quietFrom,
          quietTo: values.quietTo,
        },
      },
      {
        onSuccess: () => toast.success(t("notificationsUpdated")),
        onError: (error) => {
          toast.error(translateApiError(error, t("couldNotUpdateNotifications")));
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("notificationsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <CheckboxRow id="newMessage" label={t("newMessageLabel")} register={register} />
            <CheckboxRow id="threadReply" label={t("threadReplyLabel")} register={register} />
            <CheckboxRow id="unanswered" label={t("unansweredLabel")} register={register} />
            <CheckboxRow id="weeklyDigest" label={t("weeklyDigestLabel")} register={register} />
            <CheckboxRow
              id="listingExpiring"
              label={t("listingExpiringLabel")}
              register={register}
            />
            <CheckboxRow id="product" label={t("productLabel")} register={register} />
          </div>

          <div className="space-y-2">
            <Label>{t("channelsLabel")}</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <CheckboxRow
                id="channelEmail"
                label={t("channelEmailLabel")}
                register={register}
              />
              <CheckboxRow
                id="channelInApp"
                label={t("channelInAppLabel")}
                register={register}
              />
              <CheckboxRow
                id="channelWhatsapp"
                label={t("channelWhatsappLabel")}
                register={register}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("quietHoursLabel")}</Label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="quietFrom">{t("quietFromLabel")}</Label>
                <Input id="quietFrom" type="time" {...register("quietFrom")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quietTo">{t("quietToLabel")}</Label>
                <Input id="quietTo" type="time" {...register("quietTo")} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={patchProfileMutation.isPending}>
            {patchProfileMutation.isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
