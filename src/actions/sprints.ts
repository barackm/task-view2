"use server";

import { createClient } from "@/utils/supabase/server";
import { Sprint, CreateSprintData, UpdateSprintData } from "@/types/sprints";
import { revalidatePath } from "next/cache";

export async function getSprintsAsync(): Promise<Sprint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("sprints").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSprintAsync(id: string): Promise<Sprint> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("sprints").select("*").eq("id", id).single();

  if (error) throw error;
  return data;
}

export async function createSprintAsync(sprint: CreateSprintData) {
  const supabase = await createClient();

  const { error } = await supabase.from("sprints").insert(sprint);

  if (error) throw error;
  revalidatePath("/sprints");
}

export async function updateSprintAsync(id: string, sprint: UpdateSprintData) {
  const supabase = await createClient();

  const { error } = await supabase.from("sprints").update(sprint).eq("id", id);

  if (error) throw error;
  revalidatePath("/sprints");
}
