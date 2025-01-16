"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskActions } from "./task-actions";
import { getTaskByIdAsync } from "@/actions/tasks";

interface TaskDetailsProps {
  taskId: string;
}

export function TaskDetails({ taskId }: TaskDetailsProps) {
  const router = useRouter();
  const { data: task, isLoading } = useSWR(`tasks/${taskId}`, () =>
    getTaskByIdAsync(taskId)
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-[200px] bg-muted rounded animate-pulse" />
        <div className="h-[400px] w-full bg-muted rounded-md animate-pulse" />
      </div>
    );
  }

  if (!task) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            Task not found or has been deleted.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <TaskActions task={task} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex items-center gap-2">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Created on {format(new Date(task.created_at), "PPP")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Due by {format(new Date(task.due_date!), "PPP")}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
