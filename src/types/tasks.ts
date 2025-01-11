import { User } from "./auth";

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  IN_REVIEW = "In Review",
  DONE = "Done",
  BLOCKED = "Blocked",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export interface Task {
  id: string;
  sprint_id: string | null;
  title: string;
  description: string | null;
  created_by: string | null;
  assignee_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  assignee?: User;
  creator?: User;
}

export type CreateTaskInput = Pick<Task, "title" | "description" | "sprint_id" | "assignee_id" | "priority">;
