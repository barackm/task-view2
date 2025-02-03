"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from "@/types/tasks";
import { format } from "date-fns";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { CalendarDays, Clock, UserCircle } from "lucide-react";
import { AssigneeCell } from "./assignee-cell";
import { Row } from "@tanstack/react-table";
import { EstimateCell } from "./estimate-cell";

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

export function TaskDetailsDialog({ isOpen, onOpenChange, task }: TaskDetailsDialogProps) {
  if (!task) return null;

  // Create a mock Row object for AssigneeCell
  const mockRow = {
    original: task,
  } as Row<Task>;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{task.title}</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
            </div>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <UserCircle className='h-4 w-4' />
                <AssigneeCell row={mockRow} />
              </div>
              <EstimateCell task={task} />
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>Description</h3>
              <p className='text-muted-foreground whitespace-pre-wrap'>
                {task.description || "No description provided."}
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <CalendarDays className='h-4 w-4' />
                <span>Created on {format(new Date(task.created_at), "PPP")}</span>
              </div>
              {task.due_date && (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Clock className='h-4 w-4' />
                  <span>Due by {format(new Date(task.due_date), "PPP")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
