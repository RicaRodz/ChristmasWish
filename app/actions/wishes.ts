"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addWish(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;
  const priority = formData.get("priority") as string;

  if (!name || name.trim() === "") {
    return { error: "Gift name is required" };
  }

  const { error } = await supabase.from("wishes").insert({
    user_id: user.id,
    name: name.trim(),
    link: link.trim() || null,
    notes: notes.trim() || null,
    priority: priority ? parseInt(priority) : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateWish(wishId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const notes = formData.get("notes") as string;
  const priority = formData.get("priority") as string;

  if (!name || name.trim() === "") {
    return { error: "Gift name is required" };
  }

  const { error } = await (await supabase)
    .from("wishes")
    .update({
      name: name.trim(),
      link: link.trim() || null,
      notes: notes.trim() || null,
      priority: priority ? parseInt(priority) : null,
    })
    .eq("id", wishId)
    .eq("user_id", user.id); // Ensure user owns this wish

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteWish(wishId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("wishes")
    .delete()
    .eq("id", wishId)
    .eq("user_id", user.id); // Ensure user owns this wish

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}