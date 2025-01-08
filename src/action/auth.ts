"use server";

import { RegisterData } from "@/types/auth";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAsync(data: { email: string; password: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  }

  redirect("/");
}

export async function logoutAsync() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/login", "layout");
  redirect("/login");
}

export async function registerAsync(data: RegisterData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        names: data.names,
      },
    },
  });

  if (error) {
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (profileError) {
    throw profileError;
  }

  return profileData;
};
