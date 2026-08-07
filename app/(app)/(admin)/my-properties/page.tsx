"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useMyProperties, useDeletePropertyMutation } from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/constants";

export default function MyPropertiesPage() {
  const { data: properties, isLoading } = useMyProperties();
  const deleteMutation = useDeletePropertyMutation();

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Property deleted"),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : "Could not delete property"),
    });
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My properties</h1>
          <p className="text-muted-foreground">
            Manage the properties you&apos;ve published.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/my-properties/new" />}>
          Publish a property
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !properties || properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          You haven&apos;t published any properties yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{PROPERTY_TYPE_LABELS[property.type]}</TableCell>
                <TableCell>{property.city}</TableCell>
                <TableCell>${property.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      property.status === "AVAILABLE" ? "default" : "secondary"
                    }
                  >
                    {PROPERTY_STATUS_LABELS[property.status]}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/my-properties/${property.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this property?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. &quot;{property.title}&quot;
                          will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(property.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
