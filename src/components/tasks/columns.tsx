"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CalendarDays, Circle, Timer, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const priorityConfig = {
  [TaskPriority.LOW]: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: Circle,
  },
  [TaskPriority.MEDIUM]: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: Timer,
  },
  [TaskPriority.HIGH]: {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: AlertCircle,
  },
  [TaskPriority.URGENT]: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: AlertCircle,
  },
};

const statusConfig = {
  [TaskStatus.TODO]: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: Circle,
  },
  [TaskStatus.IN_PROGRESS]: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: Timer,
  },
  [TaskStatus.IN_REVIEW]: {
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: AlertCircle,
  },
  [TaskStatus.DONE]: {
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle2,
  },
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='hover:bg-transparent'
        >
          Task
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className='min-w-[300px]'>
          <div className='font-medium group-hover:text-primary transition-colors'>{task.title}</div>
          {task.description && <div className='text-sm text-muted-foreground line-clamp-1'>{task.description}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='hover:bg-transparent'
        >
          Status
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus;
      const { color, icon: Icon } = statusConfig[status];
      return (
        <div className='flex items-center gap-2'>
          <Badge variant='secondary' className={`${color} border-0`}>
            <Icon className='mr-1 h-3 w-3' />
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='hover:bg-transparent'
        >
          Priority
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority;
      const { color, icon: Icon } = priorityConfig[priority];
      return (
        <div className='flex items-center gap-2'>
          <Icon className='h-4 w-4' />
          <span className={`text-sm ${color}`}>{priority}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => {
      const task = row.original;
      if (!task.assignee) return null;

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-6 w-6'>
            <AvatarImage src={task.assignee.avatar || ""} />
            <AvatarFallback>{task.assignee.full_name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <span className='text-sm truncate max-w-[120px]'>{task.assignee.full_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className='hover:bg-transparent'
        >
          Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className='flex items-center justify-end gap-2 text-muted-foreground min-w-[150px]'>
          <CalendarDays className='h-4 w-4' />
          <span className='text-sm'>
            {formatDistanceToNow(new Date(row.getValue("created_at")), {
              addSuffix: true,
            })}
          </span>
        </div>
      );
    },
  },
];
