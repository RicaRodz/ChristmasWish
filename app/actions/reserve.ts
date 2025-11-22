"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function reserveWish(wishId: string, reservedBy: string, listOwnerId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!reservedBy || reservedBy.trim() === "") {
    return { error: "Please enter your name" };
  }

  // Update the wish to mark it as reserved
  const { error } = await supabase
    .from("wishes")
    .update({
      reserved_by: reservedBy.trim(),
    })
    .eq("id", wishId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/list/${listOwnerId}`);
  return { success: true };
}

export async function unreserveWish(wishId: string, listOwnerId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Remove the reservation
  const { error } = await supabase
    .from("wishes")
    .update({
      reserved_by: null,
    })
    .eq("id", wishId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/list/${listOwnerId}`);
  return { success: true };
}