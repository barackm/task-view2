import * as z from "zod";
import { TaskPriority, TaskStatus } from "@/types/tasks";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus).optional(),
  due_date: z.date().optional(),
  assignee_id: z.string().optional(),
  sprint_id: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
