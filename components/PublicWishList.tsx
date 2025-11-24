"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Browser Client
import { User } from "@supabase/supabase-js";
import { reserveWish, unreserveWish } from "@/app/actions/reserve";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;     // Display Name
  reserved_by_id: string | null;  // User ID (for permission checks)
  priority: number | null;
  created_at: string;
};

type PublicWishListProps = {
  wishes: Wish[];
  isOwnList: boolean;
  listOwnerId: string;
};

const priorityColors = {
  1: "bg-gray-100 text-gray-600 border-gray-200",
  2: "bg-blue-50 text-blue-700 border-blue-200",
  3: "bg-green-50 text-green-700 border-green-200",
  4: "bg-purple-50 text-purple-700 border-purple-200",
  5: "bg-red-50 text-red-700 border-red-200",
};

const priorityLabels = {
  1: "Would be nice",
  2: "Like to have",
  3: "Want",
  4: "Really want",
  5: "Dream gift!",
};

export default function PublicWishList({ wishes, isOwnList, listOwnerId }: PublicWishListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Local state for Optimistic Updates
  const [localWishes, setLocalWishes] = useState<Wish[]>(wishes);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Check if the viewer is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setAuthLoading(false);
    };
    checkUser();
  }, [supabase]);

  // Sync props to local state if server data changes
  useEffect(() => {
    setLocalWishes(wishes);
  }, [wishes]);

  // 2. Handle Reservation (Logged In Users Only)
  async function handleReserve(wishId: string) {
    if (!currentUser) return; // Should not happen due to UI logic, but safety check

    setLoading(wishId);

    // Determine display name (Meta name -> Email -> "Friend")
    const displayName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || "A Friend";

    // OPTIMISTIC UPDATE: Update UI immediately
    setLocalWishes((prev) => 
      prev.map((w) => w.id === wishId ? { 
        ...w, 
        reserved_by: displayName,
        reserved_by_id: currentUser.id 
      } : w)
    );

    // Call Server Action
    const result = await reserveWish(wishId, listOwnerId);

    if (result.error) {
      alert(`Error: ${result.error}`);
      setLocalWishes(wishes); // Revert on error
    } else {
      router.refresh(); // Sync with server
    }
    
    setLoading(null);
  }

  // 3. Handle Unreserve (Only if they own the reservation)
  async function handleUnreserve(wishId: string) {
    if (!confirm("Did you reserve this by mistake? Click OK to release this gift.")) {
      return;
    }

    setLoading(wishId);

    // OPTIMISTIC UPDATE
    setLocalWishes((prev) => 
      prev.map((w) => w.id === wishId ? { ...w, reserved_by: null, reserved_by_id: null } : w)
    );

    const result = await unreserveWish(wishId, listOwnerId);

    if (result.error) {
      alert(`Error: ${result.error}`);
      setLocalWishes(wishes); // Revert on error
    } else {
      router.refresh();
    }
    
    setLoading(null);
  }

  // 4. Handle Login Redirect
  const handleLoginRedirect = () => {
    // Redirect to login, then come back to THIS page
    router.push(`/login?next=${pathname}`);
  };

  // Filter logic
  const displayWishes = isOwnList 
    ? localWishes.filter(wish => !wish.reserved_by) // Owner hides reserved items
    : localWishes;

  const availableWishes = displayWishes.filter(wish => !wish.reserved_by);
  const reservedWishes = localWishes.filter(wish => wish.reserved_by);

  return (
    <div className="space-y-12">
      {/* 🟢 AVAILABLE WISHES SECTION */}
      {availableWishes.length > 0 && (
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-transparent rounded-full opacity-50" />
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="bg-green-500 rounded-full p-2 text-sm">🎁</span> 
            Available Wishes 
            <span className="text-base font-normal text-blue-200 opacity-75">({availableWishes.length})</span>
          </h3>

          <div className="grid gap-6">
            {availableWishes.map((wish) => (
              <div
                key={wish.id}
                className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Priority Badge */}
                {wish.priority && (
                  <div className={`absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-xs font-bold border-b border-l ${priorityColors[wish.priority as keyof typeof priorityColors]}`}>
                    {priorityLabels[wish.priority as keyof typeof priorityLabels]}
                  </div>
                )}

                <h4 className="text-xl font-bold text-gray-800 pr-24">{wish.name}</h4>
                
                {wish.notes && (
                  <p className="mt-2 text-gray-600 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                    💡 {wish.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  {wish.link ? (
                    <a
                      href={wish.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                    >
                      View Link ↗
                    </a>
                  ) : <div />}

                  {/* RESERVE ACTION BUTTONS */}
                  {!isOwnList && (
                    <div className="w-full sm:w-auto">
                      {authLoading ? (
                         <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
                      ) : currentUser ? (
                        /* LOGGED IN USER */
                        <button
                          onClick={() => handleReserve(wish.id)}
                          disabled={loading === wish.id}
                          className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading === wish.id ? "Reserving..." : "🙋‍♂️ I'll get this!"}
                        </button>
                      ) : (
                        /* GUEST (NOT LOGGED IN) */
                        <button
                          onClick={handleLoginRedirect}
                          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          🔐 Log in to Reserve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔒 RESERVED WISHES SECTION */}
      {!isOwnList && reservedWishes.length > 0 && (
        <div className="relative pt-8 border-t border-blue-400/30">
           <h3 className="text-xl font-bold text-blue-200 mb-6 flex items-center gap-2 opacity-90">
            <span className="bg-slate-700 rounded-full p-2 text-xs">🔒</span> 
            Already Reserved 
            <span className="text-sm font-normal opacity-75">({reservedWishes.length})</span>
          </h3>

          <div className="grid gap-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            {reservedWishes.map((wish) => (
              <div
                key={wish.id}
                className="relative rounded-xl bg-slate-100 border-2 border-slate-300 p-5 shadow-inner select-none"
              >
                <div className="absolute right-4 top-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-500 line-through decoration-slate-400">
                        {wish.name}
                    </h4>
                    <div className="mt-2 inline-flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-full border border-slate-300">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reserved By</span>
                        <span className="text-sm font-bold text-slate-700">
                          {/* If current user is owner, show 'You', else show name */}
                          {wish.reserved_by_id === currentUser?.id ? "You" : wish.reserved_by}
                        </span>
                    </div>
                  </div>

                  {/* ONLY ALLOW UNRESERVE IF THEY ARE THE RESERVER */}
                  {wish.reserved_by_id === currentUser?.id && (
                    <button
                      onClick={() => handleUnreserve(wish.id)}
                      disabled={loading === wish.id}
                      className="self-start sm:self-center text-xs text-red-500 hover:text-red-700 hover:underline transition-colors disabled:opacity-50 font-semibold"
                    >
                      {loading === wish.id ? "updating..." : "undo my reservation"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {availableWishes.length === 0 && (!isOwnList ? reservedWishes.length === 0 : true) && (
        <div className="py-12 text-center">
            <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">❄️</span>
            </div>
            <h3 className="text-2xl font-bold text-white">The list is empty!</h3>
            <p className="text-blue-200 mt-2">Check back later for more wishes.</p>
        </div>
      )}
    </div>
  );
}