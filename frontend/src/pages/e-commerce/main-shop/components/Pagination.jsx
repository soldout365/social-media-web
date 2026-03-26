import React from "react";
import { useSearchParams, createSearchParams } from "react-router-dom";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({ totalPages = 1, currentPage = 1 }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page) => {
    const params = Object.fromEntries(searchParams);
    params._page = page;
    setSearchParams(createSearchParams(params), { replace: true });
  };

  const renderPageItems = () => {
    const items = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            className="cursor-pointer bg-container-dark border-border-dark hover:bg-black/40 hover:text-pink-400"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
            className={`cursor-pointer transition-all duration-300 ${
              i === currentPage
                ? "bg-gradient-to-tr from-yellow-400 to-pink-600 text-white border-none shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:opacity-90"
                : "bg-container-dark border-border-dark text-slate-300 hover:bg-black/40 hover:text-pink-400 hover:border-pink-500"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis className="text-slate-500" />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            className="cursor-pointer bg-container-dark border-border-dark hover:bg-black/40 hover:text-pink-400"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-14 flex justify-center">
      <ShadcnPagination>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={`cursor-pointer bg-container-dark border-border-dark transition-all ${
                currentPage <= 1
                  ? "opacity-50 pointer-events-none text-slate-600"
                  : "text-slate-300 hover:bg-black/40 hover:text-pink-400 hover:border-pink-500"
              }`}
            />
          </PaginationItem>

          {renderPageItems()}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={`cursor-pointer bg-container-dark border-border-dark transition-all ${
                currentPage >= totalPages
                  ? "opacity-50 pointer-events-none text-slate-600"
                  : "text-slate-300 hover:bg-black/40 hover:text-pink-400 hover:border-pink-500"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}
