"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1 || isPending}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Atrás
      </Button>

      <span className="text-body-small font-medium text-gray-700">
        {currentPage}/{totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages || isPending}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Button>
    </div>
  );
}
