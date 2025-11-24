"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/app/actions/auth"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

// 1. ISOLATE LOGIC
function SignupForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  type MessageState = { type: 'success' | 'error'; text: string; };
  const [message, setMessage] = useState<MessageState | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const result = await signUp(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.message || "Success! Check your email." });
    }
    setLoading(false);
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create a free account in seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="next" value={next} />
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="Santa Claus" required className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className="h-11" />
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className={message.type === "success" ? "border-green-500 text-green-900 bg-green-50" : ""}>
              {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 bg-red-600 hover:bg-red-700 text-base">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-red-600 hover:text-red-700">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// 2. EXPORT PAGE WITH SUSPENSE
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Gift className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">WishList</span>
          </Link>
          <Button asChild variant="ghost" className="text-gray-700">
            <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" />Back to Home</Link>
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Start building your wishlist today</p>
          </div>

          <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />}>
            <SignupForm />
          </Suspense>

        </div>
      </div>
    </div>
  );
}