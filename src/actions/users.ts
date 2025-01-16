"use server";
import { User } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";

export const fetchUsers = async (): Promise<User[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) throw error;

  return data;
};
