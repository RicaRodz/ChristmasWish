"use client";

import { updateWish } from "@/app/actions/wishes";
import { useState } from "react";

type Wish = {
  id: string;
  name: string;
  link: string | null;
  notes: string | null;
  priority: number | null;
};

type EditWishFormProps = {
  wish: Wish;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function EditWishForm({ wish, onCancel, onSuccess }: EditWishFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateWish(wish.id, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  }

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
      <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span>✏️</span> Edit Wish
      </h4>

      <form action={handleSubmit} className="space-y-4">
        {/* Gift Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Gift Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={wish.name}
            placeholder="e.g., Nintendo Switch OLED"
            className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
            How much do you want this? ⭐
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={wish.priority?.toString() || ""}
            className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select priority (optional)</option>
            <option value="1">1 - Would be nice</option>
            <option value="2">2 - Like to have</option>
            <option value="3">3 - Want</option>
            <option value="4">4 - Really want</option>
            <option value="5">5 - Dream gift! 🌟</option>
          </select>
        </div>

        {/* Product Link */}
        <div>
          <label htmlFor="link" className="block text-sm font-semibold text-gray-700 mb-2">
            Product Link 🔗
          </label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={wish.link || ""}
            placeholder="https://example.com/product"
            className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
            Notes 📝
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={wish.notes || ""}
            placeholder="Size, color, specific details, etc."
            className="w-full rounded-lg border-2 border-blue-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 border-2 border-red-300 p-3 text-red-800">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg bg-gray-200 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}