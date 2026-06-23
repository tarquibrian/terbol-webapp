"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  alwaysShow?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  alwaysShow = false,
}: PaginationProps) {
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

  if (totalPages <= 1 && !alwaysShow) return null;

  return (
    <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:flex sm:justify-between sm:gap-4">
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
        className="justify-self-end"
      >
        Siguiente
      </Button>
    </div>
  );
}
