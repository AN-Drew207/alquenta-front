"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Camera, Check, Loader2, Upload, X } from "lucide-react";
import {
  usePatchProfileMutation,
  useUsernameAvailability,
  useDeleteAvatarMutation,
} from "@/hooks/use-profile";
import { getUploadSignature, uploadToCloudinary } from "@/lib/api/media";
import { translateApiError } from "@/lib/api/client";
import { cn, getInitials } from "@/lib/utils";
import {
  publicProfileSchema,
  type PublicProfileFormValues,
} from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SaveBar } from "@/components/ui/save-bar";
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
import { useDirtyState } from "@/hooks/use-dirty-state";
import { AccountDetailsCard } from "@/components/profile/account-details-card";
import type { Profile } from "@/types/auth";

const BIO_MAX_LENGTH = 280;
const BIO_AMBER_THRESHOLD = 250;
const USERNAME_DEBOUNCE_MS = 400;
const ANY_STATE = "any";

/**
 * `publicProfileSchema` has transforms (e.g. empty string -> null), so its
 * input type (raw, pre-validation field values held by the form) differs
 * from its output type (`PublicProfileFormValues`, post-validation, passed
 * to `onSubmit`). `useForm`'s 3rd generic carries that split.
 */
type PublicProfileFormInput = z.input<typeof publicProfileSchema>;

function buildDefaultValues(profile: Profile): PublicProfileFormInput {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    displayName: profile.displayName,
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    city: profile.city ?? "",
    state: profile.state ?? ANY_STATE,
    website: profile.website ?? "",
    avatarUrl: profile.avatarUrl,
  };
}

interface PublicProfileSectionProps {
  profile: Profile;
  onDirtyChange?: (dirty: boolean) => void;
}

export function PublicProfileSection({
  profile,
  onDirtyChange,
}: PublicProfileSectionProps) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();
  const deleteAvatarMutation = useDeleteAvatarMutation();
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<
    PublicProfileFormInput,
    unknown,
    PublicProfileFormValues
  >({
    resolver: zodResolver(publicProfileSchema),
    defaultValues: buildDefaultValues(profile),
  });
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    resetField,
    reset,
    formState: { errors, dirtyFields },
  } = form;

  const { isDirty, dirtyCount, discard } = useDirtyState(form);

  const avatarUrl = watch("avatarUrl");
  const displayName = watch("displayName");
  const bio = watch("bio") ?? "";
  const city = watch("city");
  const username = watch("username") ?? "";

  const [debouncedUsername, setDebouncedUsername] = useState(username);
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedUsername(username),
      USERNAME_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [username]);

  const usernameChanged = debouncedUsername !== (profile.username ?? "");
  const usernameValid = !errors.username && debouncedUsername.length > 0;
  const shouldCheckAvailability = usernameChanged && usernameValid;
  const { data: availability, isFetching: isCheckingUsername } =
    useUsernameAvailability(debouncedUsername, shouldCheckAvailability);

  async function handleAvatarFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setUploading(true);
    try {
      const signature = await getUploadSignature("image");
      const url = await uploadToCloudinary(file, signature);
      setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      toast.error(translateApiError(error, t("couldNotUploadAvatar")));
    } finally {
      setUploading(false);
      setAvatarPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  }

  function handleRemoveAvatar() {
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: (data) => {
        resetField("avatarUrl", { defaultValue: data.avatarUrl });
        toast.success(t("avatarRemoved"));
      },
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotRemoveAvatar")));
      },
    });
  }

  function onSubmit(values: PublicProfileFormValues) {
    const payload: Partial<Profile> = {};
    if (dirtyFields.firstName) payload.firstName = values.firstName;
    if (dirtyFields.lastName) payload.lastName = values.lastName;
    if (dirtyFields.displayName) payload.displayName = values.displayName;
    if (dirtyFields.username) payload.username = values.username || null;
    if (dirtyFields.bio) payload.bio = values.bio || null;
    if (dirtyFields.city) payload.city = values.city || null;
    if (dirtyFields.state) {
      payload.state = values.state === ANY_STATE ? null : values.state || null;
    }
    if (dirtyFields.website) payload.website = values.website || null;
    if (dirtyFields.avatarUrl) payload.avatarUrl = values.avatarUrl || null;

    if (Object.keys(payload).length === 0) return;

    patchProfileMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success(t("publicProfileUpdated"));
        reset(buildDefaultValues(data));
      },
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotUpdatePublicProfile")));
      },
    });
  }

  const onSave = handleSubmit(onSubmit);

  const nameInitials = getInitials(displayName || profile.displayName);
  const bioLength = bio.length;
  const bioNearLimit = bioLength > BIO_AMBER_THRESHOLD;

  const accountTypeLabel = t(`accountType${profile.accountType}`);
  const previewLine = [accountTypeLabel, city, t("previewResponseTime")]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return (
    <div className={cn("space-y-6", isDirty && "pb-24")}>
      <AccountDetailsCard profile={profile} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("personalInfoTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label={t("firstNameLabel")}
                htmlFor="firstName"
                required
                error={errors.firstName?.message}
              >
                <Input id="firstName" {...register("firstName")} />
              </Field>
              <Field
                label={t("lastNameLabel")}
                htmlFor="lastName"
                required
                error={errors.lastName?.message}
              >
                <Input id="lastName" {...register("lastName")} />
              </Field>
            </div>

            <Field
              label={t("displayNameLabel")}
              htmlFor="displayName"
              required
              hint={t("displayNameHint")}
              error={errors.displayName?.message}
            >
              <Input id="displayName" {...register("displayName")} />
            </Field>

            <Field
              label={t("usernameLabel")}
              htmlFor="username"
              hint={!errors.username ? t("usernameHint") : undefined}
              error={errors.username?.message}
            >
              <Input
                id="username"
                placeholder={t("usernamePlaceholder")}
                {...register("username")}
              />
              {!errors.username && shouldCheckAvailability && (
                <p
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    isCheckingUsername
                      ? "text-muted-foreground"
                      : availability?.available
                        ? "text-primary"
                        : "text-destructive",
                  )}
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
            </Field>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("currentEmailLabel")}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("bioLabel")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Field htmlFor="bio">
              <Textarea
                id="bio"
                rows={4}
                maxLength={BIO_MAX_LENGTH}
                placeholder={t("bioPlaceholder")}
                {...register("bio")}
              />
              <p
                className={cn(
                  "text-right text-xs",
                  bioNearLimit
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-muted-foreground",
                )}
              >
                {bioLength}/{BIO_MAX_LENGTH}
              </p>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("locationTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("cityLabel")} htmlFor="city">
                <Input id="city" {...register("city")} />
              </Field>
              <Field label={t("stateLabel")} htmlFor="state">
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ANY_STATE}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="state" className="w-full">
                        <SelectValue placeholder={t("statePlaceholder")}>
                          {(value: string) =>
                            value === ANY_STATE ? t("statePlaceholder") : value
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ANY_STATE}>
                          {t("statePlaceholder")}
                        </SelectItem>
                        {VENEZUELA_STATES.map((state) => (
                          <SelectItem key={state.name} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field
              label={t("websiteLabel")}
              htmlFor="website"
              error={errors.website?.message}
            >
              <Input
                id="website"
                type="text"
                placeholder="https://..."
                {...register("website")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{t("previewTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                <AvatarFallback className="bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),var(--foreground)_18%)] text-primary-foreground">
                  {nameInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium">
                    {displayName || t("displayNameLabel")}
                  </p>
                  {profile.emailVerified && (
                    <Badge variant="success">{t("verifiedBadge")}</Badge>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {previewLine}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <SaveBar
        visible={isDirty}
        fieldCount={dirtyCount}
        onDiscard={discard}
        onSave={onSave}
        saving={patchProfileMutation.isPending}
      />
    </div>
  );
}
