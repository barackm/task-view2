"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Task } from "@/types/tasks";
import { TaskForm } from "./task-form";
import { createTaskAsync, updateTaskAsync } from "@/actions/tasks";
import { useState } from "react";
import { TaskFormValues } from "@/lib/schema";
import { toast } from "sonner";

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskSheet({ open, onOpenChange, task }: TaskSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: TaskFormValues) {
    try {
      setIsSubmitting(true);
      if (task) {
        const updatedData = {
          ...data,
          due_date: data.due_date?.toISOString(),
        };
        await updateTaskAsync(task.id, updatedData);
        toast.success("Task updated successfully");
      } else {
        const taskData = {
          ...data,
          description: data.description || null,
          status: data.status || null,
          due_date: data.due_date?.toISOString() || null,
          assignee_id: data.assignee_id || null,
          sprint_id: data.sprint_id || null,
        };
        await createTaskAsync(taskData);
        toast.success("Task created successfully");
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>{task ? "Edit Task" : "Create New Task"}</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <TaskForm
            task={task}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
