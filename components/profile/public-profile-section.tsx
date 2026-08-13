"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Check, Loader2, Upload, X } from "lucide-react";
import { usePatchProfileMutation, useUsernameAvailability } from "@/hooks/use-profile";
import { getUploadSignature, uploadToCloudinary } from "@/lib/api/media";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENEZUELA_STATES } from "@/lib/data/venezuela-locations";
import type { Profile } from "@/types/auth";
import type { AccountType } from "@/types/enums";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const BIO_MAX_LENGTH = 280;

const ANY_STATE = "any";

const publicProfileSchema = z.object({
  avatarUrl: z.string().optional(),
  name: z.string().min(1),
  username: z
    .string()
    .optional()
    .refine((value) => !value || USERNAME_PATTERN.test(value), {
      message: "usernameInvalid",
    }),
  accountType: z.enum(["OWNER", "AGENCY", "CLIENT"]),
  bio: z.string().max(BIO_MAX_LENGTH).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  website: z.string().optional(),
});
type PublicProfileFormValues = z.infer<typeof publicProfileSchema>;

export function PublicProfileSection({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PublicProfileFormValues>({
    resolver: zodResolver(publicProfileSchema),
    defaultValues: {
      avatarUrl: "",
      name: "",
      username: "",
      accountType: "CLIENT",
      bio: "",
      city: "",
      state: ANY_STATE,
      website: "",
    },
  });

  useEffect(() => {
    reset({
      avatarUrl: profile.avatarUrl ?? "",
      name: profile.name,
      username: profile.username ?? "",
      accountType: profile.accountType,
      bio: profile.bio ?? "",
      city: profile.city ?? "",
      state: profile.state ?? ANY_STATE,
      website: profile.website ?? "",
    });
  }, [profile, reset]);

  const avatarUrl = watch("avatarUrl");
  const name = watch("name");
  const bio = watch("bio") ?? "";
  const username = watch("username") ?? "";

  const [debouncedUsername, setDebouncedUsername] = useState(username);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedUsername(username), 400);
    return () => clearTimeout(timeout);
  }, [username]);

  const usernameChanged = debouncedUsername !== (profile.username ?? "");
  const usernameValid = USERNAME_PATTERN.test(debouncedUsername);
  const shouldCheckAvailability = usernameChanged && usernameValid;
  const { data: availability, isFetching: isCheckingUsername } = useUsernameAvailability(
    debouncedUsername,
    shouldCheckAvailability,
  );

  async function handleAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const signature = await getUploadSignature("image");
      const url = await uploadToCloudinary(file, signature);
      setValue("avatarUrl", url, { shouldValidate: true });
    } catch (error) {
      toast.error(isApiError(error) ? error.message : t("couldNotUploadAvatar"));
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(values: PublicProfileFormValues) {
    patchProfileMutation.mutate(
      {
        avatarUrl: values.avatarUrl || null,
        name: values.name,
        username: values.username || null,
        accountType: values.accountType,
        bio: values.bio || null,
        city: values.city || null,
        state: values.state === ANY_STATE ? null : values.state || null,
        website: values.website || null,
      },
      {
        onSuccess: () => toast.success(t("publicProfileUpdated")),
        onError: (error) => {
          toast.error(
            isApiError(error) ? error.message : t("couldNotUpdatePublicProfile"),
          );
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("publicProfileTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-1.5">
          <Label>{t("completenessLabel")}</Label>
          <Progress value={profile.completeness}>
            <span className="text-sm text-muted-foreground">
              {profile.completeness}%
            </span>
          </Progress>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("avatarLabel")}</Label>
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Upload className="size-3.5" />
                )}
                {uploading ? t("uploadingAvatar") : t("uploadAvatar")}
              </Button>
            </div>
            <Input
              id="avatarUrl"
              placeholder={t("avatarUrlPlaceholder")}
              {...register("avatarUrl")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">{t("nameLabel")}</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{t("nameRequired")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username">{t("usernameLabel")}</Label>
            <Input
              id="username"
              placeholder={t("usernamePlaceholder")}
              {...register("username")}
            />
            <p className="text-sm text-muted-foreground">{t("usernameHint")}</p>
            {errors.username && (
              <p className="text-sm text-destructive">{t("usernameInvalid")}</p>
            )}
            {!errors.username && shouldCheckAvailability && (
              <p
                className={
                  isCheckingUsername
                    ? "flex items-center gap-1 text-sm text-muted-foreground"
                    : availability?.available
                      ? "flex items-center gap-1 text-sm text-primary"
                      : "flex items-center gap-1 text-sm text-destructive"
                }
              >
                {isCheckingUsername ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {t("usernameChecking")}
                  </>
                ) : availability?.available ? (
                  <>
                    <Check className="size-3.5" />
                    {t("usernameAvailable")}
                  </>
                ) : (
                  <>
                    <X className="size-3.5" />
                    {t("usernameTaken")}
                  </>
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>{t("accountTypeLabel")}</Label>
            <Controller
              control={control}
              name="accountType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: AccountType) => t(`accountType${value}`)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">{t("accountTypeOWNER")}</SelectItem>
                    <SelectItem value="AGENCY">{t("accountTypeAGENCY")}</SelectItem>
                    <SelectItem value="CLIENT">{t("accountTypeCLIENT")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">{t("bioLabel")}</Label>
            <Textarea
              id="bio"
              rows={4}
              maxLength={BIO_MAX_LENGTH}
              placeholder={t("bioPlaceholder")}
              {...register("bio")}
            />
            <p className="text-right text-xs text-muted-foreground">
              {bio.length}/{BIO_MAX_LENGTH}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="city">{t("cityLabel")}</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div className="space-y-1.5">
              <Label>{t("stateLabel")}</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("statePlaceholder")}>
                        {(value: string) =>
                          value === ANY_STATE ? t("statePlaceholder") : value
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ANY_STATE}>{t("statePlaceholder")}</SelectItem>
                      {VENEZUELA_STATES.map((state) => (
                        <SelectItem key={state.name} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website">{t("websiteLabel")}</Label>
            <Input id="website" type="url" {...register("website")} />
          </div>

          <Button type="submit" disabled={patchProfileMutation.isPending}>
            {patchProfileMutation.isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
