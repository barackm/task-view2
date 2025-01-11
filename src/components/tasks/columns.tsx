"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { format } from "date-fns";
import { Task } from "@/types/tasks";

const STATUS_VARIANTS = {
  DONE: "secondary",
  IN_PROGRESS: "destructive",
  TODO: "default",
} as const;

const PRIORITY_VARIANTS = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "default",
} as const;

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof STATUS_VARIANTS;
      return (
        <Badge variant={STATUS_VARIANTS[status]}>
          {status.toLowerCase().replace("_", " ")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue(
        "priority"
      ) as keyof typeof PRIORITY_VARIANTS;
      return (
        <Badge variant={PRIORITY_VARIANTS[priority]}>
          {priority.toLowerCase()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at;
      return format(new Date(date), "PPP");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Edit",
              onClick: () => {
                console.log("Edit task", task);
              },
            },
            {
              label: "Delete",
              onClick: () => {
                console.log("Delete task", task);
              },
              separator: true,
            },
          ]}
        />
      );
    },
  },
];
