import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound, redirect } from "next/navigation";
import PublicWishList from "@/components/PublicWishList";
import { Gift, ArrowLeft } from "lucide-react";

// Helper to validate UUIDs
const isValidUUID = (uuid: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function PublicListPage({ params }: PageProps) {
  const { userId } = await params;

  if (!isValidUUID(userId)) {
    notFound();
  }

  const supabase = await createClient();

  // 1. FORCE LOGIN: Redirect if not logged in
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    // Redirect to login, then return to this list
    redirect(`/login?next=/list/${userId}`);
  }

  // 2. Fetch List Owner Details (Admin Client needed for metadata)
  const adminSupabase = createAdminClient();
  const { data: userData } = await adminSupabase.auth.admin.getUserById(userId);
  
  if (!userData?.user) {
    notFound();
  }

  // 3. Fetch Wishes
  const { data: wishes, error } = await supabase
    .from("wishes")
    .select("id, name, link, notes, priority, reserved_by, reserved_by_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !wishes) {
    notFound();
  }

  // 4. Prepare Data
  const isOwnList = currentUser.id === userId;
  const ownerName = userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || "Friend";
  const currentUserName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "Friend";

  return (
    <div className="min-h-screen relative flex flex-col">
       {/* BACKGROUND IMAGE */}
       <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/christmas_background.png')" }} 
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[10px]" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="bg-red-600 p-2 rounded-full shadow-lg">
                  <Gift className="w-5 h-5 text-white" />
               </div>
               <span className="text-xl font-bold text-white tracking-tight">
                WishList
              </span>
            </div>
            
            <a 
              href="/dashboard"
              className="flex items-center text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <div className="mb-10 text-center text-white">
          <div className="inline-block bg-red-600/90 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase mb-4 shadow-lg border border-red-400">
             Official Wish List
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-xl">
            {isOwnList ? "Your Christmas List" : `${ownerName}'s List`}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {isOwnList 
              ? "This is how your friends see your list. Reserved items are hidden from you." 
              : `Pick a gift below to reserve it. Don't worry, ${ownerName} won't know it was you!`}
          </p>
        </div>

        {/* Client Component */}
        <PublicWishList 
          wishes={wishes} 
          isOwnList={isOwnList} 
          listOwnerId={userId} 
          currentUserId={currentUser.id}
          currentUserName={currentUserName}
        />
      </main>
    </div>
  );
}