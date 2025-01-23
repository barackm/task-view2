"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { TaskSheet } from "./task-sheet";
import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import useSWR from "swr";
import { getTasksAsync } from "@/actions/tasks";
import { fetchUsers } from "@/actions/users";
import { statusOptions, priorityOptions } from "./utils";
import { Task } from "@/types/tasks";

export function TaskList() {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    data: tasks,
    isLoading,
    mutate: refreshTasks,
  } = useSWR("tasks", () => getTasksAsync(), {
    onError: (err) => {
      console.error("Failed to fetch tasks:", err);
    },
  });

  const { data: users } = useSWR("users", () => fetchUsers(), {
    onError: (err) => {
      console.error("Failed to fetch users:", err);
    },
  });

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  const columns = getColumns({ onEdit: handleEdit });

  return (
    <>
      <div className="mb-4">
        <Button
          onClick={() => {
            setSelectedTask(undefined);
            setSheetOpen(true);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

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

      <TaskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={selectedTask}
        onSuccess={() => refreshTasks()}
      />
    </>
  );
}
