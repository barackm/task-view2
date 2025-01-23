"use server";
import { createClient } from "@/utils/supabase/server";

export async function uploadAvatar(userId: string, base64Image: string) {
  const supabase = await createClient();

  const base64Data = base64Image.split(",")[1];
  const blob = await fetch(`data:image/png;base64,${base64Data}`).then((res) => res.blob());

  const { error } = await supabase.storage.from("avatars").upload(`${userId}`, blob, {
    upsert: true,
    contentType: "image/png",
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(`${userId}`);

  return publicUrl;
}

export async function deleteAvatar(userId: string) {
  const supabase = await createClient();
  await supabase.storage.from("avatars").remove([`${userId}`]);
}
