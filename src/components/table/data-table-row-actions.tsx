"use client";

import Link from "next/link";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Action<TData = unknown> {
  label: string;
  onClick?: (row: TData) => void;
  shortcut?: string;
  separator?: boolean;
  link?: string;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: Action<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions.map((action, index) => (
          <>
            {action.link ? (
              <Link href={action.link} key={`${action.label}-${index}`}>
                <DropdownMenuItem>
                  {action.label}
                  {action.shortcut && (
                    <span className="ml-auto text-xs tracking-widest opacity-60">
                      {action.shortcut}
                    </span>
                  )}
                </DropdownMenuItem>
              </Link>
            ) : (
              <DropdownMenuItem
                key={`${action.label}-${index}`}
                onClick={() => action.onClick?.(row.original as never)}
              >
                {action.label}
                {action.shortcut && (
                  <span className="ml-auto text-xs tracking-widest opacity-60">
                    {action.shortcut}
                  </span>
                )}
              </DropdownMenuItem>
            )}
            {action.separator && <DropdownMenuSeparator />}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
