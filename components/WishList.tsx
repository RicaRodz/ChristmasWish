"use client";

import { useState } from "react";
import AddWishForm from "./AddWishForm";
import EditWishForm from "./EditWishForm";
import { deleteWish } from "@/app/actions/wishes";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  reserved_by: string | null;
  priority: number | null;
  created_at: string;
};

type WishListProps = {
  wishes: Wish[];
  userId: string;
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

export default function WishList({ wishes: initialWishes, userId }: WishListProps) {
  const [wishes, setWishes] = useState(initialWishes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWish, setEditingWish] = useState<string | null>(null);
  const [deletingWish, setDeletingWish] = useState<string | null>(null);

  async function handleDelete(wishId: string) {
    if (!confirm("Are you sure you want to delete this wish? 🎁")) {
      return;
    }

    setDeletingWish(wishId);
    const result = await deleteWish(wishId);
    
    if (result.error) {
      alert(`Error: ${result.error}`);
    }
    
    setDeletingWish(null);
  }

  return (
    <div className="rounded-2xl bg-white/95 backdrop-blur p-6 shadow-2xl border-4 border-red-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-red-800 flex items-center gap-2">
          <span>📝</span> Your Wishes
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-lg bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg"
        >
          {showAddForm ? "✕ Cancel" : "+ Add Wish"}
        </button>
      </div>

      {showAddForm && (
        <AddWishForm 
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => setShowAddForm(false)}
        />
      )}

      {wishes.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🎁</span>
          <p className="text-gray-600 text-lg">
            Your wishlist is empty. Start adding gifts you&apos;d love to receive!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishes.map((wish) => (
            <div key={wish.id}>
              {editingWish === wish.id ? (
                <EditWishForm
                  wish={wish}
                  onCancel={() => setEditingWish(null)}
                  onSuccess={() => setEditingWish(null)}
                />
              ) : (
                <div className="p-6 rounded-xl bg-gradient-to-br from-white to-red-50 border-2 border-red-100 hover:border-red-300 transition-all shadow-md hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
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
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          🔗 View Product
                        </a>
                      )}

                      {wish.reserved_by && (
                        <div className="mt-3 p-3 bg-green-100 border-2 border-green-300 rounded-lg">
                          <p className="text-green-800 font-semibold">
                            🎉 Reserved by: {wish.reserved_by}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingWish(wish.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(wish.id)}
                        disabled={deletingWish === wish.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingWish === wish.id ? "⏳" : "🗑️"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}