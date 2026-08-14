"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Eye, Search, UserPlus } from "lucide-react";
import { useAdmins, useInviteAdminMutation } from "@/hooks/use-admins";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminStatusActions } from "@/components/superadmin/admin-status-actions";

export default function SuperAdminPage() {
  const t = useTranslations("superadmin");
  const format = useFormatter();
  const { data: admins, isLoading } = useAdmins();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const inviteMutation = useInviteAdminMutation();

  const inviteSchema = z.object({
    email: z.email(t("invalidEmail")),
  });
  type InviteFormValues = z.infer<typeof inviteSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
  });

  function onSubmit(values: InviteFormValues) {
    inviteMutation.mutate(values.email, {
      onSuccess: (data) => setInviteUrl(data.inviteUrl),
      onError: (error) =>
        toast.error(translateApiError(error, t("couldNotInviteAdmin"))),
    });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      reset();
      setInviteUrl(null);
    }
  }

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    toast.success(t("linkCopied"));
  }

  const filteredAdmins = useMemo(() => {
    if (!admins) return admins;
    const query = search.trim().toLowerCase();
    if (!query) return admins;
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query),
    );
  }, [admins, search]);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger render={<Button />}>
            <UserPlus />
            {t("inviteAdmin")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("inviteDialogTitle")}</DialogTitle>
            </DialogHeader>
            {inviteUrl ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("inviteLinkDescription")}
                </p>
                <div className="flex items-center gap-2">
                  <Input value={inviteUrl} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    aria-label={t("copyLink")}
                    title={t("copyLink")}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("emailLabel")}</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={inviteMutation.isPending}>
                    {inviteMutation.isPending ? t("sendingInvite") : t("sendInvite")}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {!isLoading && admins && admins.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !admins || admins.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("emptyState")}</p>
      ) : !filteredAdmins || filteredAdmins.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("noSearchResults")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnAdmin")}</TableHead>
              <TableHead>{t("columnPhone")}</TableHead>
              <TableHead>{t("columnCreatedAt")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead className="text-right">{t("columnActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <Link
                    href={`/superadmin/${admin.id}`}
                    className="flex flex-col hover:underline"
                  >
                    <span className="font-medium">{admin.name}</span>
                    <span className="text-xs text-muted-foreground">{admin.email}</span>
                  </Link>
                </TableCell>
                <TableCell>{admin.phone ?? t("phoneNotProvided")}</TableCell>
                <TableCell>
                  {format.dateTime(new Date(admin.createdAt), { dateStyle: "medium" })}
                </TableCell>
                <TableCell>
                  <Badge variant={admin.deactivatedAt ? "secondary" : "default"}>
                    {admin.deactivatedAt ? t("statusDisabled") : t("statusActive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      nativeButton={false}
                      render={<Link href={`/superadmin/${admin.id}`} />}
                      aria-label={t("viewAdmin")}
                      title={t("viewAdmin")}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                    <AdminStatusActions admin={admin} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
