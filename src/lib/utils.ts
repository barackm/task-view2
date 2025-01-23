import { TaskPriority, TaskStatus } from "@/types/tasks";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getImageUrl(path: string | null) {
  if (!path) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
}

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

export function getAvatarUrl(path: string | null) {
  if (!path) return null;
  return `${STORAGE_URL}/avatars/${path}`;
}

export const PRIORITY_VARIANTS = {
  [TaskPriority.URGENT]: "destructive",
  [TaskPriority.HIGH]: "destructive",
  [TaskPriority.MEDIUM]: "secondary",
  [TaskPriority.LOW]: "default",
} as const;

export const STATUS_VARIANTS = {
  [TaskStatus.DONE]: "secondary",
  [TaskStatus.IN_PROGRESS]: "outline",
  [TaskStatus.IN_REVIEW]: "secondary",
  [TaskStatus.TODO]: "default",
  [TaskStatus.BLOCKED]: "destructive",
} as const;
