"use client";

import { useState } from "react";
import { reserveWish, unreserveWish } from "@/app/actions/reserve";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;
  priority: number | null;
  created_at: string;
};

type PublicWishListProps = {
  wishes: Wish[];
  isOwnList: boolean;
  listOwnerId: string;
};

const priorityColors = {
  1: "bg-gray-200 text-gray-800",
  2: "bg-blue-200 text-blue-800",
  3: "bg-yellow-200 text-yellow-800",
  4: "bg-orange-200 text-orange-800",
  5: "bg-red-200 text-red-800",
};

const priorityLabels = {
  1: "Would be nice",
  2: "Like to have",
  3: "Want",
  4: "Really want",
  5: "Dream gift!",
};

export default function PublicWishList({ wishes, isOwnList, listOwnerId }: PublicWishListProps) {
  const [reservingWish, setReservingWish] = useState<string | null>(null);
  const [reserverName, setReserverName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleReserve(wishId: string, listOwnerId: string) {
    if (!reserverName.trim()) {
      alert("Please enter your name!");
      return;
    }

    setLoading(wishId);
    const result = await reserveWish(wishId, reserverName, listOwnerId);

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      setReserverName("");
      setReservingWish(null);
    }
    
    setLoading(null);
  }

  async function handleUnreserve(wishId: string, listOwnerId: string) {
    if (!confirm("Remove your reservation for this gift?")) {
      return;
    }

    setLoading(wishId);
    const result = await unreserveWish(wishId, listOwnerId);

    if (result.error) {
      alert(`Error: ${result.error}`);
    }
    
    setLoading(null);
  }

  // Filter wishes based on whether viewing own list
  const displayWishes = isOwnList 
    ? wishes.filter(wish => !wish.reserved_by) // Hide reserved items from owner
    : wishes;

  const availableWishes = displayWishes.filter(wish => !wish.reserved_by);
  const reservedWishes = wishes.filter(wish => wish.reserved_by);

  return (
    <div className="space-y-6">
      {/* Available Wishes */}
      {availableWishes.length > 0 && (
        <div className="rounded-2xl bg-white/95 backdrop-blur p-6 shadow-2xl border-4 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
            <span>🎁</span> Available Wishes ({availableWishes.length})
          </h3>

          <div className="space-y-4">
            {availableWishes.map((wish) => (
              <div
                key={wish.id}
                className="p-6 rounded-xl bg-gradient-to-br from-white to-green-50 border-2 border-green-100 hover:border-green-300 transition-all shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {wish.name}
                    </h4>
                    
                    {wish.priority && (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                          priorityColors[wish.priority as keyof typeof priorityColors]
                        }`}
                      >
                        ⭐ {priorityLabels[wish.priority as keyof typeof priorityLabels]}
                      </span>
                    )}

                    {wish.notes && (
                      <p className="text-gray-700 mb-3 bg-white/50 p-3 rounded-lg">
                        📌 {wish.notes}
                      </p>
                    )}

                    {wish.link && (
                      <a
                        href={wish.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
                      >
                        🔗 View Product
                      </a>
                    )}
                  </div>

                  {/* Reserve Section */}
                  {!isOwnList && (
                    <div className="border-t-2 border-green-200 pt-4">
                      {reservingWish === wish.id ? (
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Enter your name"
                            value={reserverName}
                            onChange={(e) => setReserverName(e.target.value)}
                            className="flex-1 rounded-lg border-2 border-green-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleReserve(wish.id, listOwnerId);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleReserve(wish.id, listOwnerId)}
                            disabled={loading === wish.id}
                            className="rounded-lg bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {loading === wish.id ? "..." : "✓"}
                          </button>
                          <button
                            onClick={() => {
                              setReservingWish(null);
                              setReserverName("");
                            }}
                            disabled={loading === wish.id}
                            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReservingWish(wish.id)}
                          className="w-full rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg"
                        >
                          🎁 I&apos;ll Get This!
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

      {/* Reserved Wishes (Only visible to viewers, not owner) */}
      {!isOwnList && reservedWishes.length > 0 && (
        <div className="rounded-2xl bg-white/95 backdrop-blur p-6 shadow-2xl border-4 border-gray-300">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <span>✓</span> Already Reserved ({reservedWishes.length})
          </h3>

          <div className="space-y-4">
            {reservedWishes.map((wish) => (
              <div
                key={wish.id}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 opacity-75"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-700 mb-2">
                      {wish.name}
                    </h4>
                    
                    <div className="p-3 bg-gray-200 border-2 border-gray-300 rounded-lg inline-block">
                      <p className="text-gray-700 font-semibold">
                        ✓ Reserved by: {wish.reserved_by}
                      </p>
                    </div>
                  </div>

                  {wish.reserved_by && (
                    <button
                      onClick={() => handleUnreserve(wish.id, listOwnerId)}
                      disabled={loading === wish.id}
                      className="rounded-lg bg-red-100 px-4 py-2 text-red-700 font-semibold hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                    >
                      {loading === wish.id ? "..." : "Remove"}
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
        <div className="rounded-2xl bg-white/95 backdrop-blur p-12 shadow-2xl border-4 border-red-200 text-center">
          <span className="text-6xl mb-4 block">🎄</span>
          <p className="text-gray-600 text-xl">
            {isOwnList 
              ? "All your wishes have been reserved! 🎉" 
              : "This wishlist is empty or all items have been reserved!"}
          </p>
        </div>
      )}
    </div>
  );
}