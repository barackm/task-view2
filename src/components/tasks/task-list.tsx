"use client";

import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import useSWR from "swr";
import { getTasksAsync } from "@/actions/tasks";

export function TaskList() {
  const { data: tasks, isLoading } = useSWR("tasks", getTasksAsync, {
    onError: (err) => {
      console.error("Failed to fetch tasks:", err);
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
            options: [
              { label: "Todo", value: "TODO" },
              { label: "In Progress", value: "IN_PROGRESS" },
              { label: "Done", value: "DONE" },
            ],
          },
          {
            column: "priority",
            title: "Priority",
            options: [
              { label: "Low", value: "LOW" },
              { label: "Medium", value: "MEDIUM" },
              { label: "High", value: "HIGH" },
            ],
          },
        ],
      }}
    />
  );
}
