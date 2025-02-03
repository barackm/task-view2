"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, RotateCwIcon } from "lucide-react";
import { TaskSheet } from "./task-sheet";
import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import useSWR from "swr";
import { getTasksAsync, deleteTaskAsync } from "@/actions/tasks";
import { fetchUsers } from "@/actions/users";
import { statusOptions, priorityOptions } from "./utils";
import { Task } from "@/types/tasks";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { toast } from "sonner";

export function TaskList() {
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshTasks();
      toast.success("Tasks refreshed");
    } catch {
      toast.error("Failed to refresh tasks");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setSheetOpen(true);
  };

  const handleDelete = async (task: Task) => {
    try {
      await deleteTaskAsync(task.id);
      refreshTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onDelete: (task) => setTaskToDelete(task),
  });

  // Sort tasks by updated_at in descending order
  const sortedTasks = tasks?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) || [];

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <Button
          onClick={() => {
            setSelectedTask(undefined);
            setSheetOpen(true);
          }}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          New Task
        </Button>
        <Button variant='outline' size='icon' onClick={handleRefresh} disabled={isRefreshing}>
          <RotateCwIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sortedTasks}
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
                ...(users
                  ?.filter((user) => user.full_name)
                  .map((user) => ({
                    label: user.full_name!,
                    value: user.id,
                  })) || []),
              ],
            },
          ],
        }}
      />

      <TaskSheet open={sheetOpen} onOpenChange={setSheetOpen} task={selectedTask} onSuccess={() => refreshTasks()} />
      <DeleteTaskDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        task={taskToDelete}
        onConfirm={handleDelete}
      />
    </>
  );
}
