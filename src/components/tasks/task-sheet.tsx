"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CreateTaskInput, Task, TaskStatus } from "@/types/tasks";
import { TaskForm } from "./task-form";
import { createTaskAsync, updateTaskAsync } from "@/actions/tasks";
import { useState } from "react";
import { TaskFormValues } from "@/lib/schema";
import { toast } from "sonner";

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess?: () => void;
}

export function TaskSheet({
  open,
  onOpenChange,
  task,
  onSuccess,
}: TaskSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: TaskFormValues) {
    try {
      setIsSubmitting(true);
      if (task) {
        const updatedData = {
          ...data,
          due_date: data.due_date?.toISOString() || null,
        };
        await updateTaskAsync(task.id, updatedData);
        toast.success("Task updated successfully");
      } else {
        const taskData: CreateTaskInput = {
          title: data.title,
          description: data.description || null,
          priority: data.priority,
          status: data.status || TaskStatus.TODO,
          due_date: data.due_date?.toISOString() || null,
        };
        await createTaskAsync(taskData);
        toast.success("Task created successfully");
      }
      onOpenChange(false);
      onSuccess?.();
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
