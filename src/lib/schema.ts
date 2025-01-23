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

export const userFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().optional(),
  skills: z.string().min(1, "At least one skill is required"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
