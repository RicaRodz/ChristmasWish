import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Share2,
  CheckCircle,
  Sparkles,
  Users,
  Heart,
} from "lucide-react";
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              WishList©
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="ghost"
              className="text-gray-700 bg-white"
            >
              <Link href="/login">Log In</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="bg-red-600 hover:bg-red-700 text-white hover:text-white"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Design */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              <Sparkles className="w-3 h-3 mr-1" />
              Holiday Special 2024
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Modern Way to
              <span className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                Share Holiday Wishes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create beautiful wishlists, share them instantly, and never worry
              about duplicate gifts again. Perfect for families, friends, and
              Secret Santa exchanges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-lg px-8"
              >
                <Gift className="w-5 h-5 mr-2" />
                Create Free Wishlist
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                See How It Works
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Free forever</span>
              </div>
            </div>
          </div>

          {/* Mock Screenshot */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-green-400 rounded-3xl blur-3xl opacity-20"></div>
            <Card className="relative shadow-2xl border-0 overflow-hidden">
              <div className="bg-gradient-to-br from-red-50 to-green-50 p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                      🎅
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        Sarah&apos;s Christmas List
                      </div>
                      <div className="text-sm text-gray-500">
                        8 items • 3 claimed
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-red-200 to-green-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                        </div>
                        {i === 1 && (
                          <Badge className="bg-green-100 text-green-700">
                            Claimed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-red-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-red-100">Wishlists Created</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-red-100">Gifts Shared</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-red-100">Free & Ad-Free</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Horizontal Cards */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for the Perfect Holiday
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features that make gift-giving magical
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-2 hover:border-red-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 bg-red-100 rounded-2xl">
                  <Gift className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    Smart Gift Management
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Add items with photos, links, price ranges, and notes.
                    Organize by priority and category. Update anytime, anywhere.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 bg-green-100 rounded-2xl">
                  <Share2 className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    Instant Sharing
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Generate a beautiful shareable link in seconds. Share via
                    text, email, or social media. No account needed for viewers.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    Anonymous Claims
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Friends can claim items without spoiling the surprise. See
                    what&apos;s available in real-time. Avoid duplicate gifts
                    effortlessly.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Loved by Families Everywhere
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-pink-400"></div>
                  <div>
                    <div className="font-bold">Emily Johnson</div>
                    <div className="text-sm text-gray-500">Mom of 3</div>
                  </div>
                </div>
                <p className="text-gray-700">
                  &quot;This made Christmas shopping SO much easier! No more
                  guessing what the kids want, and no duplicate gifts from
                  grandparents.&quot;
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-green-400"></div>
                  <div>
                    <div className="font-bold">Michael Chen</div>
                    <div className="text-sm text-gray-500">
                      Secret Santa Organizer
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  &quot;Perfect for our office Secret Santa! Everyone created a
                  list and we avoided all those awkward duplicate gifts. Highly
                  recommend!&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <Card className="border-4 border-red-200 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-red-50 to-green-50 p-12 text-center">
            <div className="text-6xl mb-6">🎁</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Wishlist Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands making their holidays stress-free
            </p>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-xl px-12 py-6"
            >
              Create Free Account
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Takes less than 30 seconds • No payment required
            </p>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-red-500" />
            <span className="text-xl font-bold text-white">WishList</span>
          </div>
          <p className="text-sm">
            Making holidays magical since 2024 • Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
