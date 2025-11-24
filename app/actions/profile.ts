"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileName(userId: string, fullName: string) {
  const supabase = await createClient();

  console.log(`Attempting to update name for ${userId} to: ${fullName}`);

  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName } // Ensure this key matches what you read in your components
  });

  if (error) {
    console.error("Supabase Update Error:", error.message);
    return { error: error.message };
  }

  console.log("Update Success. New Metadata:", data.user.user_metadata);

  revalidatePath("/dashboard");
  return { success: true };
}