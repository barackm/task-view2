"use client";

import { Table } from "@tanstack/react-table";
import { SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FacetedFilter {
  column: string;
  title: string;
  options: FilterOption[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilter[];
  showViewOptions?: boolean;
  renderAdditionalActions?: (table: Table<TData>) => React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Search...",
  facetedFilters = [],
  showViewOptions = true,
  renderAdditionalActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchParam = searchParams.get("q");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-[150px] lg:w-[250px] pr-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-8 w-8 p-0"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchQuery.trim().length > 3 && (
              <Button
                type="submit"
                size="sm"
                className="h-8 w-8"
                variant="outline"
              >
                <SearchIcon />
              </Button>
            )}
          </form>
        )}

        {facetedFilters.map((filter) => {
          const column = table.getColumn(filter.column);
          return (
            column && (
              <DataTableFacetedFilter
                key={filter.column}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          );
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {renderAdditionalActions && renderAdditionalActions(table)}
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
