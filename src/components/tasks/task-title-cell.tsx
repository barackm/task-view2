"use client";

import { useState } from "react";
import { Task } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { TaskDetailsDialog } from "./task-details-dialog";

interface TaskTitleCellProps {
  task: Task;
}

export function TaskTitleCell({ task }: TaskTitleCellProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Button variant='link' className='p-0 h-auto font-normal' onClick={() => setIsDetailsOpen(true)}>
        {task.title}
      </Button>
      <TaskDetailsDialog isOpen={isDetailsOpen} onOpenChange={setIsDetailsOpen} task={task} />
    </>
  );
}
