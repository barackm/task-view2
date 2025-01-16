import { TaskStatus, TaskPriority } from "@/types/tasks";

export function enumToFilterOptions<T extends { [key: string]: string }>(
  enumObj: T
) {
  return Object.entries(enumObj).map(([value, label]) => ({
    label,
    value,
  }));
}

export const statusOptions = enumToFilterOptions(TaskStatus);
export const priorityOptions = enumToFilterOptions(TaskPriority);
