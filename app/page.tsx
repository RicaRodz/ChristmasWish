import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Snowflake decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-white text-2xl opacity-20 animate-pulse">❅</div>
        <div className="absolute top-20 right-20 text-white text-3xl opacity-30 animate-pulse">❆</div>
        <div className="absolute top-40 left-1/4 text-white text-xl opacity-20 animate-pulse">❅</div>
        <div className="absolute top-60 right-1/3 text-white text-2xl opacity-25 animate-pulse">❆</div>
        <div className="absolute bottom-20 left-1/3 text-white text-3xl opacity-20 animate-pulse">❅</div>
        <div className="absolute bottom-40 right-1/4 text-white text-2xl opacity-30 animate-pulse">❆</div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <main className="max-w-4xl w-full text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex justify-center gap-4 mb-6 text-6xl">
              <span className="animate-bounce">🎄</span>
              <span className="animate-bounce delay-100">🎅</span>
              <span className="animate-bounce delay-200">🎁</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Christmas Wishlist
            </h1>
            
            <p className="text-2xl text-red-100 mb-8">
              Share your holiday wishes with family & friends!
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border-4 border-red-200">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Create Your List</h3>
              <p className="text-gray-700">
                Add all the gifts you&apos;d love to receive this Christmas
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border-4 border-green-200">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Share Easily</h3>
              <p className="text-gray-700">
                Get a unique link to share with family and friends
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border-4 border-blue-200">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Track Reservations</h3>
              <p className="text-gray-700">
                Others can claim gifts so there are no duplicates!
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl border-4 border-red-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ready to create your wishlist?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="rounded-xl bg-red-600 px-8 py-4 text-white text-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🎅 Sign Up Free
              </Link>
              
              <Link
                href="/login"
                className="rounded-xl bg-green-600 px-8 py-4 text-white text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🎄 Log In
              </Link>
            </div>

            <p className="text-gray-600 mt-6 text-sm">
              No credit card required • Free forever • Takes 30 seconds
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-green-600 to-red-600 rounded-2xl p-8 shadow-2xl border-4 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-5xl font-bold mb-2">1</div>
                <h3 className="text-xl font-bold mb-2">Create Account</h3>
                <p className="text-green-50">Sign up with your email in seconds</p>
              </div>
              
              <div>
                <div className="text-5xl font-bold mb-2">2</div>
                <h3 className="text-xl font-bold mb-2">Add Wishes</h3>
                <p className="text-green-50">Build your perfect Christmas list</p>
              </div>
              
              <div>
                <div className="text-5xl font-bold mb-2">3</div>
                <h3 className="text-xl font-bold mb-2">Share & Enjoy</h3>
                <p className="text-green-50">Send your link and let the magic happen!</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}