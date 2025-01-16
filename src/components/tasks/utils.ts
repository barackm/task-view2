import { TaskStatus, TaskPriority } from "@/types/tasks";

export function enumToFilterOptions<T extends { [key: string]: string }>(
  enumObj: T
) {
  return Object.keys(enumObj).map((key) => ({
    label: enumObj[key],
    value: key,
  }));
}

export const statusOptions = enumToFilterOptions(TaskStatus);
export const priorityOptions = enumToFilterOptions(TaskPriority);
