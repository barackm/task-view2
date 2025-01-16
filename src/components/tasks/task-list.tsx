"use client";

import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import useSWR from "swr";
import { getTasksAsync } from "@/actions/tasks";
import { fetchUsers } from "@/actions/users";
import { statusOptions, priorityOptions } from "./utils";

export function TaskList() {
  const { data: tasks, isLoading } = useSWR("tasks", () => getTasksAsync(), {
    onError: (err) => {
      console.error("Failed to fetch tasks:", err);
    },
  });

  const { data: users } = useSWR("users", () => fetchUsers(), {
    onError: (err) => {
      console.error("Failed to fetch users:", err);
    },
  });

  return (
    <DataTable
      columns={columns}
      data={tasks || []}
      config={{
        enableRowSelection: true,
        enableSorting: true,
        enableFiltering: true,
        enablePagination: true,
        showToolbar: true,
        searchColumn: "title",
        searchPlaceholder: "Search tasks...",
        isLoading: isLoading,
        emptyState: "No tasks found. Create your first task to get started.",
        facetedFilters: [
          {
            column: "status",
            title: "Status",
            options: statusOptions,
          },
          {
            column: "priority",
            title: "Priority",
            options: priorityOptions,
          },
          {
            column: "assignee",
            title: "Assignee",
            options: [
              { label: "Unassigned", value: "unassigned" },
              ...(users?.map((user) => ({
                label: user.full_name,
                value: user.id,
              })) || []),
            ],
          },
        ],
      }}
    />
  );
}
