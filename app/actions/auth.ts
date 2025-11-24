"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string; // Capture the name
  
  // 1. Get the 'next' URL from the form
  const nextUrl = (formData.get("next") as string) || "/dashboard";

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 2. Add the name to metadata
      data: {
        full_name: name,
      },
      // 3. IMPORTANT: Tell Supabase to redirect to the 'next' URL after email confirmation
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${nextUrl}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Check your email to confirm your account!" };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // 1. Get the 'next' URL
  const nextUrl = (formData.get("next") as string) || "/dashboard";

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // 2. Redirect to the specific list instead of just /dashboard
  redirect(nextUrl);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}