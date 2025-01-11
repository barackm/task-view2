"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import useSWR from "swr";
import { getTasksAsync } from "@/actions/tasks";

export function TaskList() {
  const {
    data: tasks,
    error,
    isLoading,
  } = useSWR("tasks", getTasksAsync, {
    onError: (err) => {
      console.error("Failed to fetch tasks:", err);
    },
  });

  if (isLoading) {
    return (
      <div className='animate-pulse space-y-4'>
        <div className='h-8 w-[200px] bg-muted rounded' />
        <div className='h-[400px] w-full bg-muted rounded-md' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-destructive p-4 text-destructive'>
        <p>Failed to load tasks. Please try again later.</p>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className='rounded-lg border border-muted p-4 text-muted-foreground'>
        <p>No tasks found. Create your first task to get started.</p>
      </div>
    );
  }

  return <DataTable columns={columns} data={tasks} searchKey='title' />;
}
