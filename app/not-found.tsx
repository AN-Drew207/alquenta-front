import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button className="mt-6" nativeButton={false} render={<Link href="/" />}>
        Back to home
      </Button>
    </main>
  );
}
