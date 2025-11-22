"use client";
import { addWish } from "@/app/actions/wishes";
import { useState } from "react";

type AddWishFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

export default function AddWishForm({ onCancel, onSuccess }: AddWishFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await addWish(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
      // Reset form
      const form = document.getElementById("add-wish-form") as HTMLFormElement;
      form?.reset();
    }
  }

  // --- UPDATED CLASS NAMES HERE ---

  const inputClasses = "w-full rounded-lg border-2 border-red-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 text-gray-700";

  return (
    <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200 shadow-lg">
      <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
        <span>🎁</span> Add a New Wish
      </h4>

      <form id="add-wish-form" action={handleSubmit} className="space-y-4">
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
            placeholder="e.g., Nintendo Switch OLED"
            className={inputClasses}
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
            className={inputClasses}
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
            placeholder="https://example.com/product"
            className={inputClasses}
          />
          <p className="text-xs text-gray-600 mt-1">
            Add a link so others know exactly what to get!
          </p>
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
            placeholder="Size, color, specific details, etc."
            className={`resize-none ${inputClasses}`}
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
            className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "🎄 Add to List"}
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