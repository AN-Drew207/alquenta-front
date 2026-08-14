"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function BackButton({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" />
      {label ?? t("back")}
    </Button>
  );
}
