"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Loader2 } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/types/auth";

const SECTIONS = ["perfil", "contacto", "seguridad"] as const;
type ProfileSidebarSection = (typeof SECTIONS)[number];

const SECTION_LABEL_KEYS: Record<ProfileSidebarSection, string> = {
  perfil: "sectionPublicProfile",
  contacto: "sectionContact",
  seguridad: "sectionSecurity",
};

const RING_SIZE = 96;
const RING_STROKE = 7;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface ProfileSidebarProps {
  profile: Profile;
  activeSection: ProfileSidebarSection;
  onSectionChange: (section: ProfileSidebarSection) => void;
  /** Callback opcional para manejar la subida de imagen desde el sidebar */
  onAvatarUpload?: (file: File) => Promise<void> | void;
  /** Estado de subida si se controla externamente */
  isUploading?: boolean;
  className?: string;
}

function ProfileSidebar({
  profile,
  activeSection,
  onSectionChange,
  onAvatarUpload,
  isUploading = false,
  className,
}: ProfileSidebarProps) {
  const t = useTranslations("profile");
  const pct = profile.completion.pct;
  const ringIndicatorRef = useRef<SVGCircleElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalUploading, setInternalUploading] = useState(false);

  const uploading = isUploading || internalUploading;

  useEffect(() => {
    const circle = ringIndicatorRef.current;
    if (!circle) return;

    const finalOffset = RING_CIRCUMFERENCE * (1 - pct / 100);

    if (prefersReducedMotion()) {
      circle.style.strokeDashoffset = String(finalOffset);
      return;
    }

    circle.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
    const frame = requestAnimationFrame(() => {
      circle.style.strokeDashoffset = String(finalOffset);
    });
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onAvatarUpload) {
      try {
        setInternalUploading(true);
        await onAvatarUpload(file);
      } finally {
        setInternalUploading(false);
      }
    }
    // Limpia el input para permitir volver a seleccionar el mismo archivo si fuese necesario
    e.target.value = "";
  };

  const initials = getInitials(profile.displayName);
  const topMissing = profile.completion.missing.slice(0, 2);

  return (
    <aside
      data-slot="profile-sidebar"
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 min-[1081px]:sticky min-[1081px]:top-6",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Contenedor del Anillo + Avatar */}
        <div
          className="relative shrink-0"
          style={{ width: RING_SIZE, height: RING_SIZE }}
        >
          {/* Anillo SVG */}
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            className="pointer-events-none -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={RING_STROKE}
            />
            <circle
              ref={ringIndicatorRef}
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE}
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          </svg>

          {/* Botón trigger para subir avatar con overlay en hover */}
          <div className="absolute inset-2.25">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label={t("uploadAvatar")}
              className="group/avatar-upload relative size-full overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
            >
              <Avatar className="size-full">
                <AvatarImage
                  src={profile.avatarUrl ?? undefined}
                  alt={profile.displayName}
                />
                <AvatarFallback className="bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),var(--foreground)_18%)] text-base font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Overlay de Carga o Hover con Ícono de Cámara */}
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-[1px]">
                  <Loader2 className="size-5 animate-spin" />
                </div>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-transparent transition-colors duration-200 group-hover/avatar-upload:bg-black/45 group-hover/avatar-upload:text-white group-focus-visible/avatar-upload:bg-black/45 group-focus-visible/avatar-upload:text-white">
                  <Camera className="size-5" />
                </span>
              )}
            </button>

            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>

        <div>
          <p className="font-medium">{profile.displayName}</p>
          <p className="text-sm text-muted-foreground">
            {t("completion.pctLabel", { pct })}
          </p>
          {topMissing.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("completion.missingHint", {
                items: topMissing.map((key) => t(`missing.${key}`)).join(", "),
              })}
            </p>
          )}
        </div>
      </div>

      <div
        role="tablist"
        aria-label={t("title")}
        className="flex flex-col gap-1 max-[1080px]:flex-row max-[1080px]:overflow-x-auto max-[1080px]:pb-1"
      >
        {SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            role="tab"
            id={`profile-tab-${section}`}
            aria-selected={activeSection === section}
            aria-controls={`profile-panel-${section}`}
            onClick={() => onSectionChange(section)}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              "max-[1080px]:flex-none max-[1080px]:rounded-full max-[1080px]:px-4 max-[1080px]:text-center",
              activeSection === section
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {t(SECTION_LABEL_KEYS[section])}
          </button>
        ))}
      </div>
    </aside>
  );
}

export { ProfileSidebar, SECTIONS as PROFILE_SIDEBAR_SECTIONS };
export type { ProfileSidebarSection };
