"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { UploadCloud, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getUploadSignature, uploadToCloudinary } from "@/lib/api/media";
import { translateApiError } from "@/lib/api/client";
import type { PropertyWizardValues } from "../property-wizard";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_IMAGES = 8;
export const MAX_VIDEOS = 2;

interface UploadingFile {
  id: string;
  progress: number;
}

function MediaDropzone({
  resourceType,
  accept,
  urls,
  maxCount,
  label,
  onAdd,
  onRemove,
}: {
  resourceType: "image" | "video";
  accept: string;
  urls: string[];
  maxCount: number;
  label: string;
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
}) {
  const t = useTranslations("myProperties");
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const maxBytes = resourceType === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  const maxLabel = resourceType === "image" ? "5MB" : "50MB";
  const remainingSlots = maxCount - urls.length - uploading.length;
  const limitReached = remainingSlots <= 0;

  async function uploadFile(file: File) {
    const uploadId = `${file.name}-${Date.now()}-${Math.random()}`;
    setUploading((prev) => [...prev, { id: uploadId, progress: 0 }]);

    try {
      const signature = await getUploadSignature(resourceType);
      const url = await uploadToCloudinary(file, signature, (progress) => {
        setUploading((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, progress } : u)),
        );
      });
      onAdd(url);
    } catch (error) {
      toast.error(
        translateApiError(error, t("couldNotUploadFile", { name: file.name })),
      );
    } finally {
      setUploading((prev) => prev.filter((u) => u.id !== uploadId));
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    const slotsAvailable = maxCount - urls.length - uploading.length;
    const accepted: File[] = [];

    for (const file of Array.from(files)) {
      if (accepted.length >= slotsAvailable) {
        toast.error(t("maxFilesReached", { max: maxCount }));
        break;
      }

      if (file.size > maxBytes) {
        toast.error(
          resourceType === "image"
            ? t("fileTooLargeImage", { name: file.name })
            : t("fileTooLargeVideo", { name: file.name }),
        );
        continue;
      }

      accepted.push(file);
    }

    await Promise.all(accepted.map((file) => uploadFile(file)));
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} ({urls.length + uploading.length}/{maxCount})
      </Label>
      {limitReached ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {t("maxFilesReached", { max: maxCount })}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-center hover:bg-accent/50">
          <UploadCloud className="size-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {t("dropzoneHint", { max: maxLabel })}
          </span>
          <input
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {uploading.map((u) => (
        <div key={u.id} className="flex items-center gap-2">
          <Progress value={u.progress} className="h-2 flex-1" />
          <span className="w-10 text-right text-xs text-muted-foreground">{u.progress}%</span>
        </div>
      ))}

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              {resourceType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={url} className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaStep() {
  const t = useTranslations("myProperties");
  const {
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<PropertyWizardValues>();
  const images = watch("images") ?? [];
  const videos = watch("videos") ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <MediaDropzone
          resourceType="image"
          accept="image/*"
          urls={images}
          maxCount={MAX_IMAGES}
          label={t("photos")}
          onAdd={(url) =>
            setValue("images", [...(getValues("images") ?? []), url], { shouldValidate: true })
          }
          onRemove={(url) =>
            setValue(
              "images",
              (getValues("images") ?? []).filter((u) => u !== url),
              { shouldValidate: true },
            )
          }
        />
        {errors.images && (
          <p className="text-sm text-destructive">{errors.images.message}</p>
        )}
      </div>
      <MediaDropzone
        resourceType="video"
        accept="video/*"
        urls={videos}
        maxCount={MAX_VIDEOS}
        label={t("videos")}
        onAdd={(url) =>
          setValue("videos", [...(getValues("videos") ?? []), url], { shouldValidate: true })
        }
        onRemove={(url) =>
          setValue(
            "videos",
            (getValues("videos") ?? []).filter((u) => u !== url),
            { shouldValidate: true },
          )
        }
      />
    </div>
  );
}
