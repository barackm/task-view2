"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { format } from "date-fns";
import { Task, TaskStatus, TaskPriority } from "@/types/tasks";
import { AssigneeCell } from "./assignee-cell";

const STATUS_VARIANTS = {
  [TaskStatus.DONE]: "secondary",
  [TaskStatus.IN_PROGRESS]: "warning",
  [TaskStatus.IN_REVIEW]: "primary",
  [TaskStatus.TODO]: "default",
  [TaskStatus.BLOCKED]: "destructive",
} as const;

const PRIORITY_VARIANTS = {
  [TaskPriority.URGENT]: "destructive",
  [TaskPriority.HIGH]: "warning",
  [TaskPriority.MEDIUM]: "secondary",
  [TaskPriority.LOW]: "default",
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
      const status = row.getValue("status") as TaskStatus;
      return (
        <Badge variant={STATUS_VARIANTS[status]} className="capitalize">
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
      const priority = row.getValue("priority") as TaskPriority;
      return (
        <Badge variant={PRIORITY_VARIANTS[priority]} className="capitalize">
          {priority.toLowerCase()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => <AssigneeCell row={row} />,
    filterFn: (row, id, value) => {
      const assignee = row.original.assignee;
      if (value.includes("unassigned")) {
        return !assignee;
      }
      return assignee ? value.includes(assignee.id) : false;
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
