"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function reserveWish(wishId: string, listOwnerId: string) {
  const supabase = await createClient();

  // 1. Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to reserve items." };
  }

  // 2. Get their name from metadata (Fall back to email if name is missing)
  const userName = user.user_metadata.full_name || user.email;

  // 3. Update the wish
  const { error } = await supabase
    .from("wishes")
    .update({
      reserved_by: userName,   // Stores "Santa Claus"
      reserved_by_id: user.id  // Stores "uuid-1234-5678" (Security)
    })
    .eq("id", wishId)
    .is("reserved_by_id", null); // Safety check

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/list/${listOwnerId}`);
  return { success: true };
}

export async function unreserveWish(wishId: string, listOwnerId: string) {
  const supabase = await createClient();

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