"use server";

import { createClient } from "@/utils/supabase/server";

export async function uploadAvatarAsync(file: File) {
  if (!file) throw new Error("No file provided");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("File size too large. Maximum size is 2MB");
  if (!file.type.startsWith("image/"))
    throw new Error("Only image files are allowed");
  const supabase = await createClient();

  const { data: userData, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  const user = userData.user;
  const userId = user.id;
  const fileExt = file.name.split(".").pop();
  const fileName = `avatar-${userId}.${fileExt}`;

  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar: data.path })
    .eq("id", userId);

  if (updateError) {
    console.error("Profile update error:", updateError);
    throw updateError;
  }

  return data.path;
}
