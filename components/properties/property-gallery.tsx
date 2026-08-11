"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function ImageLightbox({
  images,
  alt,
  index,
  onIndexChange,
  open,
  onOpenChange,
}: {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const hasMultiple = images.length > 1;

  function goPrev() {
    onIndexChange((index - 1 + images.length) % images.length);
  }

  function goNext() {
    onIndexChange((index + 1) % images.length);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 hover:text-white"
              />
            }
          >
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {hasMultiple && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
              onClick={goPrev}
            >
              <ChevronLeft className="size-6" />
            </Button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />

          {hasMultiple && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
              onClick={goNext}
            >
              <ChevronRight className="size-6" />
            </Button>
          )}

          {hasMultiple && (
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {index + 1} / {images.length}
              </div>
              <div className="flex max-w-[90vw] gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      i === index ? "border-white" : "border-transparent opacity-60"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${alt} thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function PropertyGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const t = useTranslations("propertyDetail");

  if (images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center">
        <span className="text-sm text-muted-foreground">{t("noImagesAvailable")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg bg-muted"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </button>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${
                index === active ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${alt} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        images={images}
        alt={alt}
        index={active}
        onIndexChange={setActive}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
}
