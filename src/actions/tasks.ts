"use server";

import { createClient } from "@/utils/supabase/server";
import { Task, CreateTaskInput } from "@/types/tasks";
import { revalidatePath } from "next/cache";

export async function getTasksAsync(): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      assignee:assignee_id(id, full_name, avatar_url),
      creator:created_by(id, full_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTaskAsync(task: CreateTaskInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert(task);

  if (error) throw error;
  revalidatePath("/tasks");
}
