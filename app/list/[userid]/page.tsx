import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin"; // Import the new admin client
import { notFound } from "next/navigation";
import PublicWishList from "@/components/PublicWishList";

// Helper to check if a string is a valid UUID
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

  // 1. Use Admin Client to fetch the USER (Metadata)
  // We need this because the Anon key can't see other users' emails
  const adminSupabase = createAdminClient();
  const { data: userData } = await adminSupabase.auth.admin.getUserById(userId);
  
  if (!userData?.user) {
    console.error("User not found or Admin Key missing");
    notFound();
  }

  // 2. Use Standard Server Client to fetch WISHES (Data)
  // We stick to the standard client here to ensure we aren't bypassing 
  // any Row Level Security policies you might have on the wishes table.
  const supabase = await createClient();
  const { data: wishes, error } = await supabase
    .from("wishes")
    .select("id, name, link, notes, priority, reserved_by, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !wishes) {
    notFound();
  }

  // Get current user to check if they're viewing their own list
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwnList = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        {/* ... (Rest of your JSX stays exactly the same) ... */}
        {/* Just make sure you copy the JSX from your previous file */}
        {/* Navigation */}
      <nav className="bg-red-700 shadow-lg border-b-4 border-red-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎄</span>
              <h1 className="text-2xl font-bold text-white">Christmas Wishlist</h1>
            </div>
            {!isOwnList && (
              <a
                href="/signup"
                className="rounded-lg bg-white px-4 py-2 text-red-700 font-semibold hover:bg-red-50 transition-colors"
              >
                Create Your Own List
              </a>
            )}
            {isOwnList && (
              <a
                href="/dashboard"
                className="rounded-lg bg-white px-4 py-2 text-red-700 font-semibold hover:bg-red-50 transition-colors"
              >
                Back to Dashboard
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur p-8 shadow-2xl border-4 border-red-200 text-center">
          <h2 className="text-4xl font-bold text-red-800 mb-2 flex items-center justify-center gap-3">
            <span>🎅</span> 
            {isOwnList ? "Your" : `${userData.user.email?.split('@')[0] || "Friend"}'s`} Christmas Wishlist
            <span>🎁</span>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            {isOwnList 
              ? "This is how others see your list (reserved items are hidden from you!)" 
              : "Pick a gift and reserve it so others know you've got it covered!"}
          </p>
        </div>

        {/* Public Wishlist Component */}
        <PublicWishList wishes={wishes} isOwnList={isOwnList} listOwnerId={userId} />
      </main>
    </div>
  );
}