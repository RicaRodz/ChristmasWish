"use client";

import { signOut } from "@/app/actions/auth";
import WishList from "@/components/WishList";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;
  priority: number | null;
  created_at: string;
};

type DashboardClientProps = {
  wishes: Wish[];
  userId: string;
  shareableLink: string;
  userEmail: string;
};

export default function DashboardClient({ wishes, userId, shareableLink, userEmail }: DashboardClientProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Snowflake decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-white text-2xl opacity-20">❅</div>
        <div className="absolute top-20 right-20 text-white text-3xl opacity-30">❆</div>
        <div className="absolute top-40 left-1/4 text-white text-xl opacity-20">❅</div>
        <div className="absolute top-60 right-1/3 text-white text-2xl opacity-25">❆</div>
        <div className="absolute bottom-20 left-1/3 text-white text-3xl opacity-20">❅</div>
      </div>

      {/* Navigation */}
      <nav className="bg-red-700 shadow-lg border-b-4 border-red-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎄</span>
              <h1 className="text-2xl font-bold text-white">My Christmas Wishlist</h1>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2 text-red-700 font-semibold hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="mb-8 rounded-2xl bg-white/95 backdrop-blur p-6 shadow-2xl border-4 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-red-800 flex items-center gap-2">
                <span>🎅</span> Welcome back!
              </h2>
              <p className="mt-2 text-gray-700 text-lg">
                {wishes.length} {wishes.length === 1 ? 'wish' : 'wishes'} on your list
              </p>
            </div>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-2xl border-4 border-green-800">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <span>🎁</span> Share Your List
          </h3>
          <p className="text-green-50 mb-4">
            Share this link with family and friends so they can see your wishlist!
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              readOnly
              value={shareableLink}
              className="flex-1 rounded-lg bg-white px-4 py-3 text-gray-800 font-mono text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="rounded-lg bg-white px-6 py-3 text-green-700 font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
            >
              📋 Copy Link
            </button>
          </div>
        </div>

        {/* Wishlist Component */}
        <WishList wishes={wishes} userId={userId} />
      </main>
    </div>
  );
}