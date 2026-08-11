import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SIBLING_COUNT = 3;

type PageToken = number | "ellipsis";

function getPageTokens(currentPage: number, totalPages: number): PageToken[] {
  const tokens: PageToken[] = [];
  let lastPage: number | undefined;

  for (let page = 1; page <= totalPages; page++) {
    const isEdge = page === 1 || page === totalPages;
    const isNearCurrent = Math.abs(page - currentPage) <= SIBLING_COUNT;
    if (!isEdge && !isNearCurrent) continue;

    if (lastPage !== undefined && page - lastPage > 1) {
      tokens.push("ellipsis");
    }
    tokens.push(page);
    lastPage = page;
  }

  return tokens;
}

export function PaginationControls({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const tokens = getPageTokens(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {currentPage > 1 ? (
        <Button
          variant="outline"
          size="icon"
          nativeButton={false}
          render={<Link href={buildHref(currentPage - 1)} scroll={false} />}
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {tokens.map((token, index) =>
        token === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-8 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={token}
            variant={token === currentPage ? "default" : "outline"}
            size="icon"
            nativeButton={false}
            aria-current={token === currentPage ? "page" : undefined}
            render={<Link href={buildHref(token)} scroll={false} />}
            className={cn(token === currentPage && "pointer-events-none")}
          >
            {token}
          </Button>
        ),
      )}

      {currentPage < totalPages ? (
        <Button
          variant="outline"
          size="icon"
          nativeButton={false}
          render={<Link href={buildHref(currentPage + 1)} scroll={false} />}
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
