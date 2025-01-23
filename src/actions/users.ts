"use server";

import { UpdateUserInput, User } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const fetchUsers = async (): Promise<User[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) throw error;

  return data;
};

export async function updateUserAsync(userId: string, userData: UpdateUserInput) {
  const supabase = await createClient();

  const updates = {
    full_name: userData.full_name,
    avatar: userData.avatar,
    skills: userData.skills,
  };

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();

  if (error) {
    console.error("Profile update error:", error);
    throw error;
  }

  revalidatePath("/", "layout");
}
