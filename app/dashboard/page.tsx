import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's wishes
  const { data: wishes } = await supabase
    .from("wishes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/list/${user.id}`;
  console.log(shareableLink)
  return (
    <DashboardClient 
      wishes={wishes || []} 
      userId={user.id} 
      shareableLink={shareableLink}
      userEmail={user.email || ""}
    />
  );
}