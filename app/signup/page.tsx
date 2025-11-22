"use client";

import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const result = await signUp(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.message || "Success!" });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Snowflake decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-white text-2xl opacity-20">❅</div>
        <div className="absolute top-20 right-20 text-white text-3xl opacity-30">❆</div>
        <div className="absolute top-40 left-1/4 text-white text-xl opacity-20">❅</div>
        <div className="absolute bottom-20 right-1/4 text-white text-2xl opacity-25">❆</div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4 text-5xl">
              <span>🎄</span>
              <span>🎅</span>
              <span>🎁</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Create Your Account
            </h1>
            <p className="text-red-100 text-lg">
              Start building your Christmas wishlist today!
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl border-4 border-red-200">
            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border-2 border-red-200 px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border-2 border-red-200 px-4 py-3 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="At least 6 characters"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {message && (
                <div
                  className={`rounded-lg border-2 p-4 ${
                    message.type === "error" 
                      ? "bg-red-100 border-red-300 text-red-800" 
                      : "bg-green-100 border-green-300 text-green-800"
                  }`}
                >
                  <p className="font-semibold">
                    {message.type === "error" ? "⚠️" : "✓"} {message.text}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red-600 px-6 py-4 text-white text-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "🎅 Sign Up Free"}
              </button>

              <div className="text-center pt-4 border-t-2 border-gray-200">
                <p className="text-gray-700">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="font-bold text-green-600 hover:text-green-700 underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-white hover:text-red-200 font-semibold underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}