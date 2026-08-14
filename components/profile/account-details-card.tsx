"use client";

import { useTranslations, useFormatter } from "next-intl";
import {
  Building2,
  CalendarDays,
  CircleCheck,
  DollarSign,
  Home,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Profile } from "@/types/auth";
import type { AccountType } from "@/types/enums";

const ACCOUNT_TYPE_ICONS: Record<
  AccountType,
  React.ComponentType<{ className?: string }>
> = {
  OWNER: Home,
  AGENCY: Building2,
  CLIENT: User,
};

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex min-w-0 items-center gap-2.5">
      <span className="flex size-8.5 shrink-0 items-center justify-center rounded-[11px] bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-108">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11.5px] font-semibold text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-[14.5px] font-semibold tracking-tight">
          {value}
        </span>
      </span>
    </div>
  );
}

export function AccountDetailsCard({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const format = useFormatter();

  const AccountTypeIcon = ACCOUNT_TYPE_ICONS[profile.accountType];
  const accountTypeValue = t(`accountType${profile.accountType}`);
  const memberSinceValue = format.dateTime(new Date(profile.createdAt), {
    year: "numeric",
    month: "long",
  });
  const statusValue = profile.deactivatedAt
    ? t("accountDetailsStatusInactive")
    : t("accountDetailsStatusActive");

  return (
    <Card>
      <CardContent>
        <div className="mb-4 text-[11.5px] font-bold tracking-[.14em] text-muted-foreground uppercase">
          {t("accountDetailsTitle")}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
          <MetaItem
            icon={AccountTypeIcon}
            label={t("accountTypeLabel")}
            value={accountTypeValue}
          />
          <MetaItem
            icon={CalendarDays}
            label={t("accountDetailsMemberSince")}
            value={memberSinceValue}
          />
          {/* <MetaItem
            icon={DollarSign}
            label={t("accountDetailsCurrency")}
            value={t("accountDetailsCurrencyValue")}
          /> */}
          <MetaItem
            icon={CircleCheck}
            label={t("accountDetailsStatus")}
            value={statusValue}
          />
        </div>
      </CardContent>
    </Card>
  );
}
