"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { format } from "date-fns";
import { Task, TaskStatus, TaskPriority } from "@/types/tasks";
import { AssigneeCell } from "./assignee-cell";
import { PRIORITY_VARIANTS, STATUS_VARIANTS } from "@/lib/utils";

interface ColumnsProps {
  onEdit: (task: Task) => void;
}

export function getColumns({ onEdit }: ColumnsProps): ColumnDef<Task>[] {
  return [
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

        return <Badge variant={STATUS_VARIANTS[status]}>{status}</Badge>;
      },
      filterFn: (row, id, value) => {
        const status = row.getValue(id) as TaskStatus;
        const statusKey = Object.keys(TaskStatus).find(
          (key) => TaskStatus[key as keyof typeof TaskStatus] === status
        );
        return value.includes(statusKey);
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as TaskPriority;
        return <Badge variant={PRIORITY_VARIANTS[priority]}>{priority}</Badge>;
      },
      filterFn: (row, id, value) => {
        const priority = row.getValue(id) as TaskPriority;
        const priorityKey = Object.keys(TaskPriority).find(
          (key) => TaskPriority[key as keyof typeof TaskPriority] === priority
        );
        return value.includes(priorityKey);
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
                onClick: () => onEdit(task),
              },
              {
                label: "View Details",
                link: `/tasks/${task.id}`,
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
}
