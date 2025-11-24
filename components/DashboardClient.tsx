"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/app/actions/auth";
import { updateProfileName } from "@/app/actions/profile"; // Import the action we created
import WishList from "@/components/WishList";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Icons
import { Gift, LogOut, Copy, CheckCircle, Share2, User, Save, Loader2 } from "lucide-react";

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
  userName?: string; // Added this prop
  shareableLink: string;
  userEmail: string;
};

export default function DashboardClient({
  wishes,
  userId,
  userName = "",
  shareableLink,
  userEmail,
}: DashboardClientProps) {
  const [copied, setCopied] = useState(false);
  
  // Profile State
  const [name, setName] = useState(userName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    const result = await updateProfileName(userId, name);
    setIsSavingProfile(false);
    
    if (result.error) {
      alert("Error updating profile");
    } else {
    }
  };

  useEffect(() => {
    setName(userName);
  }, [userName]);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 1. FIXED BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/christmas_background.png')",
          }}
        />
        {/* BLUR APPLIED HERE */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[10px]" />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-full">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                WishList
              </span>
            </div>

            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                 className="bg-white text-red-600 hover:text-green-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back, {name || 'Friend'}! 👋
          </h1>
          <p className="mt-2 text-white/80 text-lg">
            Manage your wishes and profile settings.
          </p>
        </div>

        {/* TABS SYSTEM */}
        <Tabs defaultValue="list" className="w-full space-y-6">
          
          <TabsList className="bg-white/10 border border-white/10 backdrop-blur-md p-1">
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white"
            >
              <Gift className="w-4 h-4 mr-2" />
              My Wish List
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: WISH LIST & SHARE */}
          <TabsContent value="list" className="space-y-6 focus-visible:ring-0">
             {/* Share Card */}
            <Card className="bg-white/90 backdrop-blur shadow-xl border-0">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold">
                  <Share2 className="w-4 h-4" />
                  <span>Share your list</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={shareableLink}
                    className="bg-slate-50 border-slate-200 font-mono text-xs sm:text-sm text-slate-600 focus-visible:ring-0"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className={
                      copied
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-slate-900 hover:bg-slate-800"
                    }
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* The Wishlist Component */}
            <WishList wishes={wishes} userId={userId} />
          </TabsContent>

          {/* TAB 2: PROFILE SETTINGS */}
          <TabsContent value="profile" className="focus-visible:ring-0">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl max-w-2xl">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update how your name appears when you share your list.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={userEmail} 
                    disabled 
                    className="bg-slate-100 text-slate-500 cursor-not-allowed" 
                  />
                  <p className="text-xs text-muted-foreground">Your email cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Santa Claus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSavingProfile}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      <div className="relative z-10 h-12" />
    </div>
  );
}