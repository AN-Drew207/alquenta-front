"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMyFullProfile, usePatchProfileMutation } from "@/hooks/use-profile";
import { getUploadSignature, uploadToCloudinary } from "@/lib/api/media";
import { translateApiError } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ProfileSidebar,
  PROFILE_SIDEBAR_SECTIONS,
  type ProfileSidebarSection,
} from "@/components/profile/profile-sidebar";
import { PublicProfileSection } from "@/components/profile/public-profile-section";
import { ContactSection } from "@/components/profile/contact-section";
import { SecuritySection } from "@/components/profile/security-section";

const DEFAULT_SECTION: ProfileSidebarSection = "perfil";

function isProfileSection(value: string | null): value is ProfileSidebarSection {
  return (PROFILE_SIDEBAR_SECTIONS as readonly string[]).includes(value ?? "");
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile, isLoading } = useMyFullProfile();
  const patchProfileMutation = usePatchProfileMutation();

  async function handleAvatarUpload(file: File) {
    try {
      const signature = await getUploadSignature("image", "avatar");
      const url = await uploadToCloudinary(file, signature);
      await patchProfileMutation.mutateAsync({ avatarUrl: url });
    } catch (error) {
      toast.error(translateApiError(error, t("couldNotUploadAvatar")));
    }
  }

  const activeSection = isProfileSection(searchParams.get("s"))
    ? (searchParams.get("s") as ProfileSidebarSection)
    : DEFAULT_SECTION;

  const [isDirty, setIsDirty] = useState(false);
  const [pendingSection, setPendingSection] = useState<ProfileSidebarSection | null>(null);

  const navigateToSection = useCallback(
    (section: ProfileSidebarSection) => {
      const params = new URLSearchParams(searchParams);
      params.set("s", section);
      router.replace(`/profile?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // The section that mounts after navigating reports its own `isDirty` via
  // `onDirtyChange` on mount (starting false), which naturally resets this
  // state — no extra effect needed to clear it on section change.
  function handleSectionChange(section: ProfileSidebarSection) {
    if (section === activeSection) return;
    if (isDirty) {
      setPendingSection(section);
      return;
    }
    navigateToSection(section);
  }

  function handleConfirmDiscard() {
    if (pendingSection) {
      setIsDirty(false);
      navigateToSection(pendingSection);
    }
    setPendingSection(null);
  }

  if (isLoading || !profile) {
    return (
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 min-[1081px]:grid-cols-[264px_1fr]">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 min-[1081px]:grid-cols-[264px_1fr] *:min-w-0">
      <ProfileSidebar
        profile={profile}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onAvatarUpload={handleAvatarUpload}
      />

      <main id={`profile-panel-${activeSection}`} role="tabpanel" aria-labelledby={`profile-tab-${activeSection}`}>
        {activeSection === "perfil" && (
          <PublicProfileSection
            profile={profile}
            onDirtyChange={setIsDirty}
            onAvatarUpload={handleAvatarUpload}
          />
        )}
        {activeSection === "contacto" && (
          <ContactSection profile={profile} onDirtyChange={setIsDirty} />
        )}
        {activeSection === "seguridad" && <SecuritySection profile={profile} />}
      </main>

      <AlertDialog
        open={pendingSection !== null}
        onOpenChange={(open) => {
          if (!open) setPendingSection(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("unsavedChangesDialogTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("unsavedChangesDialogDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              {t("saveBar.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
