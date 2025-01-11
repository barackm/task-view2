"use client";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  updateUrl?: boolean;
  totalRows?: number;
  defaultPageSize?: number;
}

export function DataTablePagination<TData>({
  table,
  updateUrl = true,
  totalRows = 0,
  defaultPageSize = 10,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  useEffect(() => {
    if (updateUrl) {
      if (!getParam("page")) {
        const search = new URLSearchParams(searchParams);
        search.set("page", "1");
        router.replace(`${pathname}?${search.toString()}`);
      }
      if (!getParam("limit")) {
        const search = new URLSearchParams(searchParams);
        search.set("limit", String(defaultPageSize));
        router.replace(`${pathname}?${search.toString()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUrl, defaultPageSize, getParam]);

  if (!updateUrl && !table) {
    throw new Error("table is required when not using URL pagination");
  }

  const currentPage = updateUrl
    ? Number(getParam("page") || "1")
    : (table?.getState().pagination.pageIndex || 0) + 1;

  const pageSize = updateUrl
    ? Number(getParam("limit") || defaultPageSize)
    : table?.getState().pagination.pageSize || defaultPageSize;

  const totalPages = updateUrl
    ? Math.ceil(totalRows / pageSize)
    : table?.getPageCount() || 1;

  const handlePageChange = (page: number) => {
    if (updateUrl) {
      const search = new URLSearchParams(searchParams);
      search.set("page", String(page + 1));
      router.replace(`${pathname}?${search.toString()}`);
    } else {
      table?.setPageIndex(page);
    }
  };

  const handlePageSizeChange = (size: string) => {
    if (updateUrl) {
      const search = new URLSearchParams(searchParams);
      search.set("limit", size);
      search.set("page", "1");
      router.replace(`${pathname}?${search.toString()}`);
    } else {
      table?.setPageSize(Number(size));
    }
  };

  const canPreviousPage = updateUrl
    ? currentPage > 1
    : table?.getCanPreviousPage() || false;

  const canNextPage = updateUrl
    ? currentPage < totalPages
    : table?.getCanNextPage() || false;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table?.getFilteredSelectedRowModel().rows.length} of{" "}
        {table?.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 2)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
